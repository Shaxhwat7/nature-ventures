import { Router } from 'express';
import { Types } from 'mongoose';
import { Experience, TimeSlot, Booking } from './schema';
import multer from 'multer';
import path from 'path';
const router = Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
function isValidObjectId(id: string) {
  return Types.ObjectId.isValid(id);
}

router.post('/experiences', upload.single('image'),async (req, res) => {
  try {
    const { title, location, price, image, description, About } = req.body || {};
    const p = typeof price === 'number' ? price : Number(price);
    const imagepath = req.file
    ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    : null;
    if (!title || !location || !imagepath || !description || !About || !Number.isFinite(p) || p < 0) {
      return res.status(400).json({ message: 'Missing/invalid fields' });
    }
    const exp = await Experience.create({
      title: String(title).trim(),
      location: String(location).trim(),
      price: p,
      image: imagepath,
      description: String(description).trim(),
      About: String(About).trim(),
    });
    res.status(201).json({ id: exp._id.toString(), message: 'Experience created' });
  } catch {
    res.status(500).json({ message: 'Failed to create experience' });
  }
});

router.patch('/experiences/:id', async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
  try {
    const updates: any = {};
    const fields = ['title', 'location', 'image', 'description', 'About', 'price'];
    for (const f of fields) {
      if (req.body?.[f] !== undefined) updates[f] = f === 'price' ? Number(req.body[f]) : String(req.body[f]).trim();
    }
    if (updates.price !== undefined && (!Number.isFinite(updates.price) || updates.price < 0)) {
      return res.status(400).json({ message: 'Invalid price' });
    }
    const exp = await Experience.findByIdAndUpdate(id, updates, { new: true });
    if (!exp) return res.status(404).json({ message: 'Experience not found' });
    res.json({ id: exp._id.toString(), message: 'Experience updated' });
  } catch {
    res.status(500).json({ message: 'Failed to update experience' });
  }
});

router.delete('/experiences/:id', async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
  try {
    const exp = await Experience.findByIdAndDelete(id);
    if (!exp) return res.status(404).json({ message: 'Experience not found' });
    await Promise.all([
      TimeSlot.deleteMany({ experienceId: id }),
      Booking.deleteMany({ experienceId: id }),
    ]);
    res.json({ message: 'Experience and related data deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete experience' });
  }
});

router.post('/experiences/:id/slots', async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
  const { slots } = req.body || {};
  if (!Array.isArray(slots) || slots.length === 0) {
    return res.status(400).json({ message: 'Body must include slots as a non-empty array' });
  }
  try {
    const ops = [];
    for (const s of slots) {
      const date = s?.date;
      const time = s?.time;
      const spotsLeft = Number.isFinite(Number(s?.spotsLeft)) ? Number(s.spotsLeft) : 0;
      if (!date || !time) continue;
      ops.push({
        updateOne: {
          filter: { experienceId: id, date, time },
          update: { $setOnInsert: { experienceId: id, date, time, spotsLeft, available: spotsLeft > 0 } },
          upsert: true,
        },
      });
    }
    if (ops.length === 0) return res.status(400).json({ message: 'No valid slots provided' });
    const result = await TimeSlot.bulkWrite(ops, { ordered: false });
    res.status(201).json({
      message: 'Slots processed',
      upserted: result.upsertedCount ?? 0,
      modified: result.modifiedCount ?? 0,
    });
  } catch {
    res.status(500).json({ message: 'Failed to add slots' });
  }
});

router.patch('/slots/:slotId', async (req, res) => {
  const { slotId } = req.params;
  if (!isValidObjectId(slotId)) return res.status(400).json({ message: 'Invalid id' });
  try {
    const updates: any = {};
    if (req.body.date !== undefined) updates.date = String(req.body.date);
    if (req.body.time !== undefined) updates.time = String(req.body.time);
    if (req.body.spotsLeft !== undefined) {
      const s = Number(req.body.spotsLeft);
      if (!Number.isFinite(s) || s < 0) return res.status(400).json({ message: 'Invalid spotsLeft' });
      updates.spotsLeft = s;
      if (req.body.available === undefined) updates.available = s > 0;
    }
    if (req.body.available !== undefined) updates.available = Boolean(req.body.available);
    const slot = await TimeSlot.findByIdAndUpdate(slotId, updates, { new: true });
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    res.json({ id: slot._id.toString(), message: 'Slot updated' });
  } catch {
    res.status(500).json({ message: 'Failed to update slot' });
  }
});

router.delete('/slots/:slotId', async (req, res) => {
  const { slotId } = req.params;
  if (!isValidObjectId(slotId)) return res.status(400).json({ message: 'Invalid id' });
  try {
    const slot = await TimeSlot.findByIdAndDelete(slotId);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    await Booking.deleteMany({ slotId });
    res.json({ message: 'Slot and related bookings deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete slot' });
  }
});
router.delete('/all', async (req, res) => {
  try {
    await Experience.deleteMany({});
    res.json({ message: 'All experiences deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete experiences', error: err });
  }
});
router.put("slots/:id/decrement", async (req, res) => {
  try {
    const slot = await TimeSlot.findById(req.params.id);
    if (!slot) return res.status(404).json({ message: "Slot not found" });
    if (slot.spotsLeft <= 0)
      return res.status(400).json({ message: "No spots left" });

    slot.spotsLeft -= 1;
    if (slot.spotsLeft === 0) slot.available = false;
    await slot.save();

    res.json({ success: true, updatedSlot: slot });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating slot" });
  }
});
export default router;