import express from 'express';
import { db } from '../db.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/stats/overview - 10 Core Metrics & Operations Dashboard Analytics
router.get('/overview', requireRole('admin'), (req, res) => {
  try {
    const totalVehicles = db.prepare('SELECT COUNT(*) as c FROM vehicles').get().c;
    const verifiedVehicles = db.prepare("SELECT COUNT(*) as c FROM vehicles WHERE vehicleVerified = 1 OR verificationStatus = 'Verified'").get().c;
    const pendingVehicles = db.prepare("SELECT COUNT(*) as c FROM vehicles WHERE status = 'pending_approval' OR verificationStatus = 'Pending'").get().c;

    const totalOwners = db.prepare('SELECT COUNT(*) as c FROM owners').get().c;
    const totalCustomers = db.prepare('SELECT COUNT(*) as c FROM customers').get().c;

    const activeRentals = db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'Active Rental'").get().c;
    const upcomingBookings = db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status IN ('Confirmed', 'Payment Pending', 'Pickup Pending')").get().c;
    const completedRentals = db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'Completed'").get().c;

    const bookingsPaid = db.prepare(`
      SELECT SUM(totalAmount) as sum FROM bookings
      WHERE paymentStatus = 'Paid' OR status IN ('Paid', 'Confirmed', 'Active Rental', 'Completed')
    `).get().sum || 0;

    const adminSettings = db.prepare('SELECT platformCommission FROM admin_settings WHERE id = 1').get() || { platformCommission: 15 };
    const commissionPercent = adminSettings.platformCommission || 15;
    const platformCommissionAmount = Math.round(bookingsPaid * (commissionPercent / 100));
    const ownerPayoutAmount = bookingsPaid - platformCommissionAmount;

    // Fleet breakdown
    const scooters = db.prepare("SELECT COUNT(*) as c FROM vehicles WHERE type = 'scooter'").get().c;
    const bicycles = db.prepare("SELECT COUNT(*) as c FROM vehicles WHERE type = 'bicycle'").get().c;
    const motorcycles = db.prepare("SELECT COUNT(*) as c FROM vehicles WHERE type IN ('motorcycle', 'cruiser')").get().c;
    const electric = db.prepare("SELECT COUNT(*) as c FROM vehicles WHERE isEV = 1 OR type = 'electric' OR fuelType LIKE '%Electric%'").get().c;

    res.json({
      metrics: {
        totalVehicles,
        verifiedVehicles,
        pendingVehicles,
        totalOwners,
        totalCustomers,
        activeRentals,
        upcomingBookings,
        completedRentals,
        grossBookingValue: bookingsPaid,
        platformCommissionAmount,
        ownerPayoutAmount,
        commissionPercent
      },
      fleetBreakdown: {
        scooters,
        bicycles,
        motorcycles,
        electric
      }
    });
  } catch (error) {
    console.error('Error fetching overview stats:', error);
    res.status(500).json({ error: 'Failed to fetch overview stats' });
  }
});

export default router;
