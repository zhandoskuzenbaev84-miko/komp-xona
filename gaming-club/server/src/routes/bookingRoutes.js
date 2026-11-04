import { Router } from 'express';
import {
  calculatePricing,
  checkAvailability,
  createBooking,
  cancelBooking,
  getBookingByCode,
  getAllBookings,
} from '../controllers/bookingController.js';
import { validateBookingInput } from '../middlewares/ageValidator.js';
import { verifyAdminToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Public calculation & availability endpoints
router.post('/pricing-summary', calculatePricing);
router.post('/check-availability', checkAvailability);

// Public booking creation with strict age & phone validation
router.post('/create', validateBookingInput, createBooking);

// Look up booking by CC-XXXXX code
router.get('/code/:code', getBookingByCode);

// Cancel booking (Customer or Admin)
router.patch('/:id/cancel', cancelBooking);

// Admin view all bookings with search and filters
router.get('/', verifyAdminToken, getAllBookings);

export default router;
