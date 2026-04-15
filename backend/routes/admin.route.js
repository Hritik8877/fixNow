import express from 'express';
import { auth, requireRole } from '../middleware/auth.js';
import { createAdmin, getStats, getUsers, getAdminBookings } from '../controllers/admin.Controller.js';

const router = express.Router();

router.post('/create-admin', auth, requireRole('admin'), createAdmin);
router.get('/stats', auth, requireRole('admin'), getStats);
router.get('/users', auth, requireRole('admin'), getUsers);
router.get('/bookings', auth, requireRole('admin'), getAdminBookings);

export default router;
