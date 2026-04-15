import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import Booking from '../models/Booking.model.js';
import Service from '../models/Service.model.js';

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashed,
      role: 'admin'
    });
    const adminResponse = await User.findById(admin._id).select('-password');

    res.json({ message: "Admin created", admin: adminResponse });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalTechnicians = await User.countDocuments({ role: 'technician' });
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.find({ status: 'completed' });
    const totalRevenue = completedBookings.reduce((sum, b) => sum + b.total, 0);

    res.json({ totalUsers, totalTechnicians, totalBookings, totalRevenue });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password -__v').sort({ created_at: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const getAdminBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('serviceId')
      .populate('userId', 'name email')
      .populate('technicianId', 'name email')
      .sort({ created_at: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};
