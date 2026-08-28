import { getAll, getOne, runQuery } from '../config/db.js';

export const getReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const reminders = await getAll('SELECT * FROM reminders WHERE userId = ? ORDER BY createdAt DESC', [userId]);
    return res.json(reminders);
  } catch (error) {
    console.error('Get reminders error:', error);
    return res.status(500).json({ message: 'Server error fetching reminders' });
  }
};

export const addReminder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { petId, title, type, dueDate, time, notes } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ message: 'Title and due date are required' });
    }

    let petName = 'All Pets';
    if (petId) {
      const pet = await getOne('SELECT name FROM pets WHERE id = ? AND userId = ?', [petId, userId]);
      if (pet) petName = pet.name;
    }

    const reminderId = `rem_${Date.now()}`;
    const createdAt = new Date().toISOString();
    const status = 'Active';

    await runQuery(
      `INSERT INTO reminders (id, userId, petId, petName, title, type, dueDate, time, status, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [reminderId, userId, petId || '', petName, title, type || 'General', dueDate, time || '09:00 AM', status, notes || '', createdAt]
    );

    const newReminder = await getOne('SELECT * FROM reminders WHERE id = ?', [reminderId]);
    return res.status(201).json(newReminder);
  } catch (error) {
    console.error('Add reminder error:', error);
    return res.status(500).json({ message: 'Server error adding reminder' });
  }
};

export const toggleReminderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const reminder = await getOne('SELECT * FROM reminders WHERE id = ? AND userId = ?', [id, userId]);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    const newStatus = reminder.status === 'Completed' ? 'Active' : 'Completed';
    await runQuery('UPDATE reminders SET status = ? WHERE id = ? AND userId = ?', [newStatus, id, userId]);

    const updated = await getOne('SELECT * FROM reminders WHERE id = ?', [id]);
    return res.json(updated);
  } catch (error) {
    console.error('Toggle reminder status error:', error);
    return res.status(500).json({ message: 'Server error updating reminder status' });
  }
};

export const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const reminder = await getOne('SELECT * FROM reminders WHERE id = ? AND userId = ?', [id, userId]);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    await runQuery('DELETE FROM reminders WHERE id = ? AND userId = ?', [id, userId]);
    return res.json({ message: 'Reminder deleted successfully', reminderId: id });
  } catch (error) {
    console.error('Delete reminder error:', error);
    return res.status(500).json({ message: 'Server error deleting reminder' });
  }
};
