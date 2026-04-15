import express from 'express';
import { auth } from '../middleware/auth.js';
import { register, login, getMe, updateProfile, logout, forgotPassword, verifyOtp, resetPassword } from '../controllers/auth.Controller.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/profile', auth, upload.single('profileImage'), updateProfile);
router.post('/logout', logout);

// Forgot password flow
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

export default router;
