import express from 'express';

import {
  register,
  login,
  getMe,
  updateProfile
} from '../controllers/authController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Get current user
router.get('/me', protect, getMe);

// Update profile
router.put('/profile', protect, updateProfile);

export default router;