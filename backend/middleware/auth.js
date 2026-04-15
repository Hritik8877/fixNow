import 'dotenv/config';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const auth = async (req, res, next) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    let token = req.cookies?.access_token;
    if (!token) {
      const header = req.headers.authorization;
      if (header && header.startsWith('Bearer ')) {
        token = header.slice(7);
      }
    }
    if (!token) return res.status(401).json({ detail: 'Not authenticated' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.sub).select('-password');
    if (!user) return res.status(401).json({ detail: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return res.status(401).json({ detail: 'Token expired' });
    return res.status(401).json({ detail: 'Invalid token' });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ detail: 'Access denied' });
    }
    next();
  };
};

// Only this specific email is allowed to create new admins
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;

const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.email.toLowerCase() !== SUPER_ADMIN_EMAIL) {
    return res.status(403).json({ detail: 'Only the super admin can perform this action' });
  }
  next();
};

export { auth, requireRole, requireSuperAdmin };
