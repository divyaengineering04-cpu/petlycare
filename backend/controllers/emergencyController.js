import { getAll } from '../config/db.js';

export const getEmergencyContacts = async (req, res) => {
  try {
    const contacts = await getAll('SELECT * FROM emergency_contacts');
    return res.json(contacts);
  } catch (error) {
    console.error('Get emergency contacts error:', error);
    return res.status(500).json({ message: 'Server error fetching emergency contacts' });
  }
};
