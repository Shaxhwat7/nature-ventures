import { Schema, model } from 'mongoose';

const ExperienceSchema = new Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    about:{type:String, required:true}
  },
  { timestamps: true }
);


const TimeSlotSchema = new Schema(
  {
    experienceId: { type: Schema.Types.ObjectId, ref: 'Experience', required: true, index: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    available: { type: Boolean, required: true, default: true },
    spotsLeft: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

TimeSlotSchema.index({ experienceId: 1, date: 1, time: 1 }, { unique: true });


const BookingSchema = new Schema(
  {
    experienceId: { type: Schema.Types.ObjectId, ref: 'Experience', required: true },
    slotId: { type: Schema.Types.ObjectId, ref: 'TimeSlot', required: true },
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    promoCode: { type: String },
  },
  { timestamps: true }
);



export const Experience = model('Experience', ExperienceSchema);
export const TimeSlot = model('TimeSlot', TimeSlotSchema);
export const Booking = model('Booking', BookingSchema);


