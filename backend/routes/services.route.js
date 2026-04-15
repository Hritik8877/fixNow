import express from 'express';
import { auth, requireRole } from '../middleware/auth.js';
import { getServices, getService, createService, updateService, deleteService } from '../controllers/services.Controller.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getServices);
router.get('/:id', getService);
router.post('/', auth, requireRole('technician', 'admin'), upload.single('image'), createService);
router.put('/:id', auth, requireRole('technician', 'admin'), upload.single('image'), updateService);
router.delete('/:id', auth, requireRole('technician', 'admin'), deleteService);

export default router;
