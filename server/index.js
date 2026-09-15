import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db.js';

import vehiclesRouter from './routes/vehicles.js';
import bookingsRouter from './routes/bookings.js';
import inspectionsRouter from './routes/inspections.js';
import customersRouter from './routes/customers.js';
import ownersRouter from './routes/owners.js';
import disputesRouter from './routes/disputes.js';
import settingsRouter from './routes/settings.js';
import statsRouter from './routes/stats.js';
import authRouter from './routes/auth.js';
import { authenticateUser } from './middleware/rbac.js';

dotenv.config();

// Initialize SQLite database and tables
initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(authenticateUser);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Vrindavan Rides P2P Backend API',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/inspections', inspectionsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/owners', ownersRouter);
app.use('/api/disputes', disputesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/stats', statsRouter);

// 404 Handler for API
app.use((req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🌸 Vrindavan Rides Backend running at http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
