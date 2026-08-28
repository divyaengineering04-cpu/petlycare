import express from 'express';
import { getReminders, addReminder, toggleReminderStatus, deleteReminder } from '../controllers/reminderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getReminders);
router.post('/', addReminder);
router.patch('/:id/toggle', toggleReminderStatus);
router.delete('/:id', deleteReminder);

export default router;
