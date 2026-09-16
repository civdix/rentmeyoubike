import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
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
import uploadRouter from './routes/upload.js';
import { authenticateUser } from './middleware/rbac.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Initialize SQLite database and tables
initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(authenticateUser);

// Enforce authentication on ALL database-mutating requests (POST, PUT, PATCH, DELETE)
// except public authentication endpoints, health check, and photo upload
app.use((req, res, next) => {
  const publicPaths = [
    '/api/auth/customer-login',
    '/api/auth/owner-login',
    '/api/auth/admin-login',
    '/api/auth/logout',
    '/api/auth/send-email-otp',
    '/api/auth/verify-email-otp',
    '/api/auth/check-email',
    '/api/upload',
    '/api/health'
  ];

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const isPublic = publicPaths.some((p) => req.path.startsWith(p));
    if (!isPublic && (!req.user || !req.user.isAuthenticated)) {
      return res.status(401).json({
        error: 'Unauthorized: You must be logged in before submitting data or modifying records.'
      });
    }
  }

  next();
});

// Root Welcome & Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: '🌸 Vrindavan Rides (Meri Dhanno) Backend API',
    apiBase: '/api',
    healthCheck: '/api/health',
    endpoints: {
      health: '/api/health',
      vehicles: '/api/vehicles',
      bookings: '/api/bookings',
      inspections: '/api/inspections',
      auth: '/api/auth',
      upload: '/api/upload'
    },
    timestamp: new Date().toISOString()
  });
});

// API Health Check
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
app.use('/api/upload', uploadRouter);
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
