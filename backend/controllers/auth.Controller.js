import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import createTransporter from '../config/emailTransporter.js';

const JWT_SECRET = process.env.JWT_SECRET;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
};

function createAccessToken(userId, email) {
  return jwt.sign({ sub: userId, email, type: 'access' }, JWT_SECRET || 'secret', { expiresIn: '7d' });
}

export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) return res.status(400).json({ detail: 'Name, email, and password required' });
    if (password.length < 6) return res.status(400).json({ detail: 'Password must be at least 6 characters' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ detail: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, email: email.toLowerCase(), password: password_hash,
      role: role === 'technician' ? 'technician' : 'user',
      phone: phone || '',
    });

    const token = createAccessToken(user._id.toString(), user.email);
    res.cookie('access_token', token, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });
    const userResponse = await User.findById(user._id).select('-password');
    res.json({ ...userResponse.toJSON(), token });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ detail: 'Email and password required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ detail: 'Invalid credentials' });

    const hashedPassword = user.password || user.password_hash;
    if (!hashedPassword) return res.status(500).json({ detail: 'Password not set properly' });

    const valid = await bcrypt.compare(password, hashedPassword);
    if (!valid) return res.status(401).json({ detail: 'Invalid credentials' });

    if (role && user.role !== role) {
      return res.status(401).json({ detail: `This account is not a ${role} account` });
    }

    const token = createAccessToken(user._id.toString(), user.email);

    res.cookie('access_token', token, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userResponse = await User.findById(user._id).select('-password');
    res.json({ ...userResponse.toJSON(), token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ detail: err.message });
  }
};

export const getMe = (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ detail: "Unauthorized" });
    }

    const { name, phone, addresses, specialization, bio, experience } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (addresses !== undefined) updates.addresses = addresses;
    if (specialization !== undefined) updates.specialization = specialization;
    if (bio !== undefined) updates.bio = bio;
    if (experience !== undefined) updates.experience = experience;

    if (req.file) {
      updates.profileImage = req.file.path;
    }

    await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    res.status(500).json({ detail: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('access_token', COOKIE_OPTIONS);
  res.json({ message: 'Logged out' });
};

// ─── Forgot Password Flow ────────────────────────────────────────────────────

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const verificationToken = jwt.sign(
      { userId: user._id.toString(), otp },
      JWT_SECRET || 'secret',
      { expiresIn: '10m' }
    );

    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP - FixNow',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:32px;border-radius:12px;">
            <h2 style="color:#1a1a1a;margin-bottom:8px;">Password Reset Request</h2>
            <p style="color:#555;font-size:15px;">Use the OTP below to reset your FixNow password. It expires in <strong>10 minutes</strong>.</p>
            <div style="font-size:36px;font-weight:800;letter-spacing:8px;color:#6d28d9;background:#ede9fe;display:inline-block;padding:16px 32px;border-radius:10px;margin:20px 0;">
              ${otp}
            </div>
            <p style="color:#888;font-size:13px;margin-top:20px;">If you didn't request this, you can ignore this email.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.cookie('verificationToken', verificationToken, {
      ...COOKIE_OPTIONS,
      maxAge: 10 * 60 * 1000,
    });

    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const verificationToken = req.cookies.verificationToken;

    console.log('--- OTP VERIFICATION DEBUG ---');
    console.log('OTP received:', otp);
    console.log('Cookies found:', Object.keys(req.cookies || {}));
    console.log('Verification Token present:', !!verificationToken);

    if (!verificationToken) {
      return res.status(400).json({ message: 'No verification token found. Please try sending a new OTP.' });
    }

    const decoded = jwt.verify(verificationToken, JWT_SECRET || 'secret');

    if (decoded.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const resetToken = jwt.sign(
      { userId: decoded.userId, purpose: 'password_reset' },
      JWT_SECRET || 'secret',
      { expiresIn: '15m' }
    );

    res.cookie('resetToken', resetToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    });

    res.clearCookie('verificationToken', COOKIE_OPTIONS);
    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (err) {
    console.error('Error in verifyOtp:', err.name, err.message);
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const resetToken = req.cookies.resetToken;

    if (!resetToken) {
      console.log('Reset token missing in resetPassword');
      return res.status(400).json({ message: 'No reset token found' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const decoded = jwt.verify(resetToken, JWT_SECRET || 'secret');
    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({ message: 'Invalid reset token' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.clearCookie('resetToken', COOKIE_OPTIONS);
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Error in resetPassword:', err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};
