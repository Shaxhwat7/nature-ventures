import express from 'express';
import mongoose, { Types } from 'mongoose';
import cors from 'cors';
import { Experience, TimeSlot, Booking } from './schema';
import adminRouter from "./admin"
import multer from 'multer'
import path from 'path'
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/', adminRouter)

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin123@cluster0.2e2op.mongodb.net/'; 

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

 

function isValidObjectId(id: string) {
  return Types.ObjectId.isValid(id);
}

function validateEmail(email: string) {
  return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
}

function validatePhone(phone: string) {
  return /^\+?[\d\s\-()]{10,}$/.test(phone);
}

type PromoValidation = {
  valid: boolean;
  discount: number; 
  message: string;
};

function validatePromo(codeRaw: string | undefined): PromoValidation {
  const code = (codeRaw || '').toUpperCase().trim();
  if (code === 'SAVE10') return { valid: true, discount: 10, message: '10% discount applied!' };
  if (code === 'WELCOME20') return { valid: true, discount: 20, message: '20% discount applied!' };
  if (code === 'FLAT100') return { valid: true, discount: 20, message: 'Special discount applied (20%)' };
  return { valid: false, discount: 0, message: 'Invalid promo code' };
}

app.get('/experiences', async (_req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 }).lean();
    res.json(
      experiences.map((e) => ({
        id: e._id.toString(),
        title: e.title,
        location: e.location,
        price: e.price,
        image: e.image,
        description: e.description,
        about:e.about
      }))
    );
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch experiences' });
  }
});

app.get('/experiences/:id', async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
  try {
    const experience = await Experience.findById(id).lean();
    if (!experience) return res.status(404).json({ message: 'Not found' });

    const slots = await TimeSlot.find({ experienceId: id }).sort({ date: 1, time: 1 }).lean();
    res.json({
      experience: {
        id: experience._id.toString(),
        title: experience.title,
        location: experience.location,
        price: experience.price,
        image: experience.image,
        description: experience.description,
        about:experience.about
      },
      slots: slots.map((s) => ({
        id: s._id.toString(),
        date: s.date,
        time: s.time,
        available: s.available,
        spotsLeft: s.spotsLeft,
      })),
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch experience' });
  }
});

app.get('/experiences/:id/slots', async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
  try {
    const slots = await TimeSlot.find({ experienceId: id }).sort({ date: 1, time: 1 }).lean();
    res.json(
      slots.map((s) => ({
        id: s._id.toString(),
        date: s.date,
        time: s.time,
        available: s.available,
        spotsLeft: s.spotsLeft,
      }))
    );
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch slots' });
  }
});

app.post('/promo/validate', (req, res) => {
  const { code } = req.body || {};
  const result = validatePromo(code);
  res.json(result);
});

app.post('/bookings', async (req, res) => {
  const { experienceId, slotId, name, email, phone, promoCode } = req.body || {};

  if (!experienceId || !slotId || !name || !email || !phone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (!isValidObjectId(experienceId) || !isValidObjectId(slotId)) {
    return res.status(400).json({ message: 'Invalid ids' });
  }
  if (name.length > 100) return res.status(400).json({ message: 'Name too long' });
  if (!validateEmail(email)) return res.status(400).json({ message: 'Invalid email' });
  if (!validatePhone(phone)) return res.status(400).json({ message: 'Invalid phone' });

  try {
    const slot = await TimeSlot.findOneAndUpdate(
      { _id: slotId, experienceId, spotsLeft: { $gt: 0 }, available: true },
      { $inc: { spotsLeft: -1 } },
      { new: true }
    );

    if (!slot) {
      return res.status(409).json({ message: 'Selected slot is no longer available' });
    }

    if (slot.spotsLeft <= 0 && slot.available) {
      slot.available = false;
      await slot.save();
    }

    const booking = await Booking.create({
      experienceId,
      slotId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      promoCode,
    });

    res.json({ success: true, bookingId: booking._id.toString(), message: 'Booking confirmed successfully!' });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


