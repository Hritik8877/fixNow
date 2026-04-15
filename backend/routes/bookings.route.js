import express from 'express';
import { auth, requireRole } from '../middleware/auth.js';
import { getBookings, createBooking, updateBookingStatus, getBookingTimeline } from '../controllers/bookings.Controller.js';

const router = express.Router();

router.get('/', auth, getBookings);
router.post('/', auth, requireRole('user'), createBooking);
router.put('/:id/status', auth, updateBookingStatus);
router.get('/:id/timeline', auth, getBookingTimeline);

export default router;
