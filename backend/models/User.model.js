import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'technician', 'admin'], default: 'user' },
  phone: { type: String, default: '' },
  specialization: { type: String, default: '' },
  experience: { type: String, default: '' },
  bio: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
  profileImage: { type: String, default: '' },
  addresses: [{
    label: { type: String, required: true },
    address: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  }],
  created_at: { type: Date, default: Date.now }
});


const User = mongoose.model('User', userSchema);

export default User;
