import Booking from '../models/Booking.model.js';
import Service from '../models/Service.model.js';
import User from '../models/User.model.js';



export const getBookings = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'user') filter.userId = req.user.id;
    else if (req.user.role === 'technician') filter.technicianId = req.user.id;
    // admin sees all

    const bookings = await Booking.find(filter)
      .populate('serviceId')
      .populate('technicianId', 'name email phone rating specialization')
      .sort({ created_at: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { serviceId, date, time, address, paymentMethod } = req.body;
    
    if (!serviceId || !date || !time || !address) {
      return res.status(400).json({ detail: 'serviceId, date, time, and address are required' });
    }
    if (typeof address !== 'string') {
      return res.status(400).json({ detail: 'Address must be a string' });
    }
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({ detail: 'Invalid date format' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ detail: 'Service not found' });
    }
    if (!service.price) {
      return res.status(400).json({ detail: 'Service price missing' });
    }

    const booking = await Booking.create({
      userId: req.user.id || req.user._id,
      serviceId: service._id,
      technicianId: service.technicianId,
      date,
      time,
      address,
      paymentMethod: paymentMethod || 'cash',
      total: service.price,
      status: 'pending',
      timeline: [
        {
          status: 'pending',
          timestamp: new Date(),
          note: 'Booking created'
        }
      ]
    });

    const populated = await Booking.findById(booking._id)
      .populate('serviceId')
      .populate('technicianId', 'name email phone rating specialization');

    res.status(201).json(populated);
  } catch (err) {
    console.error("BOOKING ERROR:", err);
    res.status(500).json({ detail: err.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['accepted', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ detail: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ detail: 'Booking not found' });

    // Permission check
    const isOwner = booking.userId.toString() === req.user.id;
    const isTech = booking.technicianId?.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isTech && !isAdmin) {
      return res.status(403).json({ detail: 'Not authorized' });
    }

    const noteMap = {
      'accepted': 'Technician accepted the booking',
      'in-progress': 'Service is in progress',
      'completed': 'Service completed successfully',
      'cancelled': 'Booking was cancelled'
    };

    booking.status = status;
    booking.timeline.push({ status, timestamp: new Date(), note: noteMap[status] || `Status changed to ${status}` });
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate('serviceId')
      .populate('technicianId', 'name email phone rating specialization');

    res.json(populated);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const getBookingTimeline = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ detail: 'Booking not found' });
    res.json(booking.timeline || []);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};
