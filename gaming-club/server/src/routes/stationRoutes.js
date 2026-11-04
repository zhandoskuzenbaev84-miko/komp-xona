import { Router } from 'express';
import {
  getAllStations,
  getStationsByType,
  getStationById,
  updateStationStatus,
} from '../controllers/stationController.js';
import { verifyAdminToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Public routes
router.get('/', getAllStations);
router.get('/type/:type', getStationsByType);
router.get('/:id', getStationById);

// Admin protected route
router.patch('/:id/status', verifyAdminToken, updateStationStatus);

export default router;
