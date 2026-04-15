import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  shortDesc: { type: String, default: '' },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  image: { type: String, default: '' },
  duration: { type: String, default: '' },
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  features: [{ type: String }],
  popular: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});


const Service = mongoose.model('Service', serviceSchema);

export default Service;
