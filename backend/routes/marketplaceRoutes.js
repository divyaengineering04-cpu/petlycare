import express from 'express';
import { getListings, createListing, buyPet } from '../controllers/marketplaceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getListings);
router.post('/', protect, createListing);
router.post('/:id/buy', protect, buyPet);

export default router;
