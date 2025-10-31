"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importStar(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const schema_1 = require("./schema");
const admin_1 = __importDefault(require("./admin"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
app.use('/', admin_1.default);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin123@cluster0.2e2op.mongodb.net/';
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err.message));
function isValidObjectId(id) {
    return mongoose_1.Types.ObjectId.isValid(id);
}
function validateEmail(email) {
    return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
}
function validatePhone(phone) {
    return /^\+?[\d\s\-()]{10,}$/.test(phone);
}
function validatePromo(codeRaw) {
    const code = (codeRaw || '').toUpperCase().trim();
    if (code === 'SAVE10')
        return { valid: true, discount: 10, message: '10% discount applied!' };
    if (code === 'WELCOME20')
        return { valid: true, discount: 20, message: '20% discount applied!' };
    if (code === 'FLAT100')
        return { valid: true, discount: 20, message: 'Special discount applied (20%)' };
    return { valid: false, discount: 0, message: 'Invalid promo code' };
}
app.get('/experiences', async (_req, res) => {
    try {
        const experiences = await schema_1.Experience.find().sort({ createdAt: -1 }).lean();
        res.json(experiences.map((e) => ({
            id: e._id.toString(),
            title: e.title,
            location: e.location,
            price: e.price,
            image: e.image,
            description: e.description,
            about: e.about
        })));
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch experiences' });
    }
});
app.get('/experiences/:id', async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id))
        return res.status(400).json({ message: 'Invalid id' });
    try {
        const experience = await schema_1.Experience.findById(id).lean();
        if (!experience)
            return res.status(404).json({ message: 'Not found' });
        const slots = await schema_1.TimeSlot.find({ experienceId: id }).sort({ date: 1, time: 1 }).lean();
        res.json({
            experience: {
                id: experience._id.toString(),
                title: experience.title,
                location: experience.location,
                price: experience.price,
                image: experience.image,
                description: experience.description,
                about: experience.about
            },
            slots: slots.map((s) => ({
                id: s._id.toString(),
                date: s.date,
                time: s.time,
                available: s.available,
                spotsLeft: s.spotsLeft,
            })),
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch experience' });
    }
});
app.get('/experiences/:id/slots', async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id))
        return res.status(400).json({ message: 'Invalid id' });
    try {
        const slots = await schema_1.TimeSlot.find({ experienceId: id }).sort({ date: 1, time: 1 }).lean();
        res.json(slots.map((s) => ({
            id: s._id.toString(),
            date: s.date,
            time: s.time,
            available: s.available,
            spotsLeft: s.spotsLeft,
        })));
    }
    catch (err) {
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
    if (name.length > 100)
        return res.status(400).json({ message: 'Name too long' });
    if (!validateEmail(email))
        return res.status(400).json({ message: 'Invalid email' });
    if (!validatePhone(phone))
        return res.status(400).json({ message: 'Invalid phone' });
    try {
        const slot = await schema_1.TimeSlot.findOneAndUpdate({ _id: slotId, experienceId, spotsLeft: { $gt: 0 }, available: true }, { $inc: { spotsLeft: -1 } }, { new: true });
        if (!slot) {
            return res.status(409).json({ message: 'Selected slot is no longer available' });
        }
        if (slot.spotsLeft <= 0 && slot.available) {
            slot.available = false;
            await slot.save();
        }
        const booking = await schema_1.Booking.create({
            experienceId,
            slotId,
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            promoCode,
        });
        res.json({ success: true, bookingId: booking._id.toString(), message: 'Booking confirmed successfully!' });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to create booking' });
    }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map