import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/rbac.js';

const router = express.Router();

function formatBooking(row) {
  if (!row) return null;
  return {
    ...row,
    preInspectionDone: Boolean(row.preInspectionDone),
    postInspectionDone: Boolean(row.postInspectionDone),
    bikeSaathiIncluded: Boolean(row.bikeSaathiIncluded)
  };
}

// GET /api/bookings - List all bookings
router.get('/', (req, res) => {
  try {
    const { status, customerPhone, search } = req.query;

    let query = 'SELECT * FROM bookings WHERE 1=1';
    const params = {};

    if (status && status !== 'all') {
      query += ' AND status = @status';
      params.status = status;
    }

    if (customerPhone) {
      query += ' AND customerPhone = @customerPhone';
      params.customerPhone = customerPhone;
    }

    if (search) {
      query += ' AND (id LIKE @search OR customerName LIKE @search OR vehicleName LIKE @search OR ownerName LIKE @search)';
      params.search = `%${search}%`;
    }

    query += ' ORDER BY createdAt DESC';

    const rows = db.prepare(query).all(params);
    res.json(rows.map(formatBooking));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// GET /api/bookings/:id - Single booking
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(formatBooking(row));
  } catch (error) {
    console.error('Error fetching booking by id:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// POST /api/bookings - Create new rental booking
router.post('/', requireAuth, (req, res) => {
  try {
    const b = req.body;
    const refNum = b.id || `VRB-${Math.floor(1000 + Math.random() * 9000)}`;

    const vehicle = b.vehicle || {};
    const vehicleId = b.vehicleId || vehicle.id || 'veh-1';
    const vehicleName = b.vehicleName || vehicle.name || 'Honda Activa 6G';
    const dailyPrice = Number(b.dailyPrice || vehicle.dailyRate || 400);

    // Calculate dates
    const start = new Date(b.startDate);
    const end = new Date(b.endDate);
    const diffTime = Math.abs(end - start);
    const totalDays = Number(b.totalDays) || Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const bikeSaathiIncluded = b.bikeSaathiIncluded ? 1 : 0;
    const saathiDailyRate = 500;
    const saathiFee = bikeSaathiIncluded ? saathiDailyRate * totalDays : 0;
    const totalAmount = Number(b.totalAmount) || (dailyPrice * totalDays + saathiFee);

    const stmt = db.prepare(`
      INSERT INTO bookings (
        id, vehicleId, vehicleName, customerName, customerPhone, customerEmail,
        ownerName, ownerPhone, startDate, endDate, totalDays, dailyPrice, totalAmount,
        pickupLocation, status, paymentStatus, refundStatus, paymentId, kycStatus,
        preInspectionDone, postInspectionDone, bikeSaathiIncluded, saathiFee, createdAt
      ) VALUES (
        @id, @vehicleId, @vehicleName, @customerName, @customerPhone, @customerEmail,
        @ownerName, @ownerPhone, @startDate, @endDate, @totalDays, @dailyPrice, @totalAmount,
        @pickupLocation, @status, @paymentStatus, @refundStatus, @paymentId, @kycStatus,
        @preInspectionDone, @postInspectionDone, @bikeSaathiIncluded, @saathiFee, @createdAt
      )
    `);

    const bookingData = {
      id: refNum,
      vehicleId,
      vehicleName,
      customerName: req.user.role === 'customer' ? (req.user.name || b.customerName || 'Customer') : (b.customerName || 'Customer'),
      customerPhone: req.user.role === 'customer' ? (req.user.phone || b.customerPhone || '') : (b.customerPhone || ''),
      customerEmail: req.user.role === 'customer' ? (req.user.email || b.customerEmail || '') : (b.customerEmail || ''),
      ownerName: b.ownerName || vehicle.ownerName || 'Radhe Shyam Sharma',
      ownerPhone: b.ownerPhone || vehicle.ownerPhone || '+91 98371 44520',
      startDate: b.startDate,
      endDate: b.endDate,
      totalDays,
      dailyPrice,
      totalAmount,
      pickupLocation: b.pickupLocation || vehicle.pickupAddress || 'Prem Mandir Road, Vrindavan',
      status: b.status || 'Inquiry',
      paymentStatus: b.paymentStatus || 'Pending',
      refundStatus: b.refundStatus || 'None',
      paymentId: b.paymentId || null,
      kycStatus: b.kycStatus || 'Pending',
      preInspectionDone: b.preInspectionDone ? 1 : 0,
      postInspectionDone: b.postInspectionDone ? 1 : 0,
      bikeSaathiIncluded,
      saathiFee,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    stmt.run(bookingData);

    // Increment customer booking count if customer exists, or register
    const existingCust = db.prepare('SELECT * FROM customers WHERE phone = ?').get(bookingData.customerPhone);
    if (existingCust) {
      db.prepare('UPDATE customers SET bookingsCount = bookingsCount + 1 WHERE id = ?').run(existingCust.id);
    } else {
      db.prepare(`
        INSERT INTO customers (id, name, phone, email, kycStatus, bookingsCount, status)
        VALUES (?, ?, ?, ?, 'Pending', 1, 'active')
      `).run(`cust-${Date.now()}`, bookingData.customerName, bookingData.customerPhone, bookingData.customerEmail);
    }

    const created = db.prepare('SELECT * FROM bookings WHERE id = ?').get(refNum);
    res.status(201).json(formatBooking(created));
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// PATCH /api/bookings/:id/status - Update booking lifecycle state
router.patch('/:id/status', requireAuth, (req, res) => {
  try {
    const { status, extra } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, req.params.id);

    const updated = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!updated) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(formatBooking(updated));
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// PATCH /api/bookings/:id/payment - Update payment status
router.patch('/:id/payment', requireAuth, (req, res) => {
  try {
    const { paymentStatus, paymentId, refundStatus } = req.body;
    const current = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);

    if (!current) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    let nextStatus = current.status;
    if (paymentStatus === 'Paid' && current.status === 'Payment Pending') {
      nextStatus = 'Confirmed';
    }

    const finalPaymentId = paymentId || current.paymentId || `pay_${req.params.id}_${Math.floor(100 + Math.random() * 899)}`;
    const finalRefundStatus = refundStatus !== undefined ? refundStatus : current.refundStatus;

    db.prepare(`
      UPDATE bookings
      SET paymentStatus = ?, paymentId = ?, refundStatus = ?, status = ?
      WHERE id = ?
    `).run(paymentStatus, finalPaymentId, finalRefundStatus, nextStatus, req.params.id);

    const updated = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    res.json(formatBooking(updated));
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// PATCH /api/bookings/:id/kyc - Verify KYC
router.patch('/:id/kyc', requireAuth, (req, res) => {
  try {
    const { kycStatus = 'Verified' } = req.body;
    const current = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);

    if (!current) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const nextStatus = current.status === 'KYC Pending' ? 'Payment Pending' : current.status;

    db.prepare(`
      UPDATE bookings
      SET kycStatus = ?, status = ?
      WHERE id = ?
    `).run(kycStatus, nextStatus, req.params.id);

    // Also update customer table
    if (current.customerPhone) {
      db.prepare('UPDATE customers SET kycStatus = ? WHERE phone = ?').run(kycStatus, current.customerPhone);
    }

    const updated = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    res.json(formatBooking(updated));
  } catch (error) {
    console.error('Error updating KYC status:', error);
    res.status(500).json({ error: 'Failed to update KYC status' });
  }
});

export default router;
