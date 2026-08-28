import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb, getOne } from './config/db.js';
import { registerSwagger } from './swagger.js';

import authRoutes from './routes/authRoutes.js';
import petRoutes from './routes/petRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
import seedRoutes from './routes/seedRoutes.js';
import { seedDatabase } from './controllers/seedController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize DB and Auto-Seed if empty
initDb().then(async () => {
  try {
    const userCount = await getOne('SELECT COUNT(*) as count FROM users');
    if (!userCount || userCount.count === 0) {
      console.log('Database empty, performing initial seed...');
      const req = {};
      const res = { json: () => {}, status: () => ({ json: () => {} }) };
      await seedDatabase(req, res);
      console.log('Initial seed complete.');
    }
  } catch (err) {
    console.error('Auto-seed check error:', err.message);
  }
});

// API Status & Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Pet Care REST API Backend Server is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      pets: '/api/pets',
      services: '/api/services',
      bookings: '/api/bookings',
      marketplace: '/api/marketplace',
      reminders: '/api/reminders',
      emergency: '/api/emergency',
      seed: '/api/seed (POST to reset database)'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

registerSwagger(app, PORT);

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/seed', seedRoutes);

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🐾 Pet Care Backend Server running on http://localhost:${PORT}`);
  console.log(`====================================================`);
});

