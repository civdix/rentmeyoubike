import express from 'express';
import { db } from '../db.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/stats/overview - 10 Core Metrics & Operations Dashboard Analytics
router.get('/overview', requireRole('admin'), async (req, res) => {
  try {
    const totalVehicles = Number((await db.prepare('SELECT COUNT(*) as c FROM vehicles').get())?.c || 0);
    const verifiedVehicles = Number((await db.prepare("SELECT COUNT(*) as c FROM vehicles WHERE vehicleVerified = 1 OR verificationStatus = 'Verified'").get())?.c || 0);
    const pendingVehicles = Number((await db.prepare("SELECT COUNT(*) as c FROM vehicles WHERE status = 'pending_approval' OR verificationStatus = 'Pending'").get())?.c || 0);

    const totalOwners = Number((await db.prepare('SELECT COUNT(*) as c FROM owners').get())?.c || 0);
    const totalCustomers = Number((await db.prepare('SELECT COUNT(*) as c FROM customers').get())?.c || 0);

    const activeRentals = Number((await db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'Active Rental'").get())?.c || 0);
    const upcomingBookings = Number((await db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status IN ('Confirmed', 'Payment Pending', 'Pickup Pending')").get())?.c || 0);
    const completedRentals = Number((await db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'Completed'").get())?.c || 0);

    const bookingsPaidRow = await db.prepare(`
      SELECT SUM(totalAmount) as sum FROM bookings
      WHERE paymentStatus = 'Paid' OR status IN ('Paid', 'Confirmed', 'Active Rental', 'Completed')
    `).get();
    const bookingsPaid = Number(bookingsPaidRow?.sum || 0);

    const adminSettings = (await db.prepare('SELECT platformCommission FROM admin_settings WHERE id = 1').get()) || { platformCommission: 15 };
    const commissionPercent = adminSettings.platformCommission || 15;
    const platformCommissionAmount = Math.round(bookingsPaid * (commissionPercent / 100));
    const ownerPayoutAmount = bookingsPaid - platformCommissionAmount;

    // Fleet breakdown
    const scooters = Number((await db.prepare("SELECT COUNT(*) as c FROM vehicles WHERE type = 'scooter'").get())?.c || 0);
    const bicycles = Number((await db.prepare("SELECT COUNT(*) as c FROM vehicles WHERE type = 'bicycle'").get())?.c || 0);
    const motorcycles = Number((await db.prepare("SELECT COUNT(*) as c FROM vehicles WHERE type IN ('motorcycle', 'cruiser')").get())?.c || 0);
    const electric = Number((await db.prepare("SELECT COUNT(*) as c FROM vehicles WHERE isEV = 1 OR type = 'electric' OR fuelType LIKE '%Electric%'").get())?.c || 0);

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
