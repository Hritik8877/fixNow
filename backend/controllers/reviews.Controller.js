import Review from '../models/Review.model.js';
import Service from '../models/Service.model.js';
import Booking from '../models/Booking.model.js';

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ serviceId: req.params.serviceId }).sort({ date: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { serviceId, bookingId, rating, comment } = req.body;
    if (!serviceId || !bookingId || !rating) return res.status(400).json({ detail: 'serviceId, bookingId and rating required' });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ detail: 'Booking not found' });
    if (booking.userId.toString() !== req.user.id) return res.status(403).json({ detail: 'Not authorized to review this booking' });
    if (booking.status !== 'completed') return res.status(400).json({ detail: 'Can only review completed bookings' });
    if (booking.isReviewed) return res.status(400).json({ detail: 'Booking already reviewed' });

    const review = await Review.create({
      userId: req.user.id,
      userName: req.user.name,
      serviceId, bookingId, rating, comment: comment || ''
    });

    booking.isReviewed = true;
    await booking.save();

    // Update service review count and rating
    const allReviews = await Review.find({ serviceId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Service.findByIdAndUpdate(serviceId, {
      reviewCount: allReviews.length,
      rating: Math.round(avgRating * 10) / 10
    });

    res.status(201).json({ review, booking: booking.toJSON() });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};
