import { getAll, getOne } from '../config/db.js';

export const getServices = async (req, res) => {
  try {
    const services = await getAll('SELECT * FROM services');
    // Map popular from integer to boolean
    const formattedServices = services.map(s => ({
      ...s,
      popular: Boolean(s.popular)
    }));
    return res.json(formattedServices);
  } catch (error) {
    console.error('Get services error:', error);
    return res.status(500).json({ message: 'Server error fetching services' });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await getOne('SELECT * FROM services WHERE id = ?', [id]);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    return res.json({
      ...service,
      popular: Boolean(service.popular)
    });
  } catch (error) {
    console.error('Get service by id error:', error);
    return res.status(500).json({ message: 'Server error fetching service details' });
  }
};
