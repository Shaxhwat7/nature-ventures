"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = exports.TimeSlot = exports.Experience = void 0;
const mongoose_1 = require("mongoose");
const ExperienceSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    about: { type: String, required: true }
}, { timestamps: true });
const TimeSlotSchema = new mongoose_1.Schema({
    experienceId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Experience', required: true, index: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    available: { type: Boolean, required: true, default: true },
    spotsLeft: { type: Number, required: true, default: 0 },
}, { timestamps: true });
TimeSlotSchema.index({ experienceId: 1, date: 1, time: 1 }, { unique: true });
const BookingSchema = new mongoose_1.Schema({
    experienceId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Experience', required: true },
    slotId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'TimeSlot', required: true },
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    promoCode: { type: String },
}, { timestamps: true });
exports.Experience = (0, mongoose_1.model)('Experience', ExperienceSchema);
exports.TimeSlot = (0, mongoose_1.model)('TimeSlot', TimeSlotSchema);
exports.Booking = (0, mongoose_1.model)('Booking', BookingSchema);
//# sourceMappingURL=schema.js.map