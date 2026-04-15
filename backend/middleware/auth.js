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

export { auth, requireRole };
