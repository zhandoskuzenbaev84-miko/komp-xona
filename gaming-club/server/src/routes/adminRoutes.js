import { Router } from 'express';
import {
  adminLogin,
  getDashboardStats,
  toggleStationMaintenance,
} from '../controllers/adminController.js';
import { verifyAdminToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Public admin login
router.post('/login', adminLogin);

// Protected routes
router.get('/stats', verifyAdminToken, getDashboardStats);
router.patch('/stations/:id/maintenance', verifyAdminToken, toggleStationMaintenance);

export default router;
