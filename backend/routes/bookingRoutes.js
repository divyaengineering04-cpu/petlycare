import express from 'express';
import { getBookings, createBooking, payBooking, cancelBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getBookings);
router.post('/', createBooking);
router.post('/:id/pay', payBooking);
router.put('/:id/cancel', cancelBooking);

export default router;
