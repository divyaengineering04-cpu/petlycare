import express from 'express';
import { seedDatabase } from '../controllers/seedController.js';

const router = express.Router();

router.post('/', seedDatabase);

export default router;
