import { getAll, getOne, runQuery } from '../config/db.js';

export const getBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await getAll('SELECT * FROM bookings WHERE userId = ? ORDER BY createdAt DESC', [userId]);
    return res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    return res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { serviceId, petId, date, time, ownerName, phone, notes, payNow, paymentMethod } = req.body;

    if (!serviceId || !petId || !date || !time) {
      return res.status(400).json({ message: 'Service, pet, date, and time are required' });
    }

    const service = await getOne('SELECT * FROM services WHERE id = ?', [serviceId]);
    const pet = await getOne('SELECT * FROM pets WHERE id = ? AND userId = ?', [petId, userId]);

    const serviceName = service ? service.name : 'Pet Care Service';
    const petName = pet ? pet.name : 'Pet';
    const price = service ? service.price : 999;

    const isPaid = payNow || false;
    const bookingId = `bk_${Date.now()}`;
    const status = 'Confirmed';
    const paymentStatus = isPaid ? 'Paid' : 'Unpaid';
    const method = paymentMethod || (isPaid ? 'Credit Card' : 'Pay on Arrival');
    const transactionId = isPaid ? `TXN-${Math.floor(100000 + Math.random() * 900000)}` : null;
    const paidAt = isPaid ? new Date().toISOString() : null;
    const createdAt = new Date().toISOString();

    const user = await getOne('SELECT * FROM users WHERE id = ?', [userId]);
    const nameOfOwner = ownerName || (user ? user.name : 'Pet Owner');
    const phoneOfOwner = phone || (user ? user.phone : '');

    await runQuery(
      `INSERT INTO bookings (id, userId, serviceId, serviceName, petId, petName, date, time, ownerName, phone, notes, price, status, paymentStatus, paymentMethod, transactionId, paidAt, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [bookingId, userId, serviceId, serviceName, petId, petName, date, time, nameOfOwner, phoneOfOwner, notes || '', price, status, paymentStatus, method, transactionId, paidAt, createdAt]
    );

    const newBooking = await getOne('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    return res.status(201).json(newBooking);
  } catch (error) {
    console.error('Create booking error:', error);
    return res.status(500).json({ message: 'Server error creating booking' });
  }
};

export const payBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { paymentMethod, amount } = req.body;

    const booking = await getOne('SELECT * FROM bookings WHERE id = ? AND userId = ?', [id, userId]);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const transactionId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const paidAt = new Date().toISOString();
    const method = paymentMethod || 'UPI / Card';

    await runQuery(
      `UPDATE bookings SET paymentStatus = 'Paid', paymentMethod = ?, transactionId = ?, paidAt = ?, status = 'Confirmed' WHERE id = ? AND userId = ?`,
      [method, transactionId, paidAt, id, userId]
    );

    const updatedBooking = await getOne('SELECT * FROM bookings WHERE id = ?', [id]);
    return res.json({ message: 'Payment successful', transactionId, booking: updatedBooking });
  } catch (error) {
    console.error('Pay booking error:', error);
    return res.status(500).json({ message: 'Server error processing payment' });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await getOne('SELECT * FROM bookings WHERE id = ? AND userId = ?', [id, userId]);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isPaid = booking.paymentStatus === 'Paid';
    const newPaymentStatus = isPaid ? 'Refunded' : 'Cancelled';

    await runQuery(
      `UPDATE bookings SET status = 'Cancelled', paymentStatus = ? WHERE id = ? AND userId = ?`,
      [newPaymentStatus, id, userId]
    );

    const updatedBooking = await getOne('SELECT * FROM bookings WHERE id = ?', [id]);
    return res.json(updatedBooking);
  } catch (error) {
    console.error('Cancel booking error:', error);
    return res.status(500).json({ message: 'Server error cancelling booking' });
  }
};
