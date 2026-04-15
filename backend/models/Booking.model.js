import mongoose from 'mongoose';

const timelineEntrySchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  address: { type: String, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cash', 'card'], default: 'cash' },
  timeline: [timelineEntrySchema],
  isReviewed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});




const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
