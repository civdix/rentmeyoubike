import express from 'express';
import { db } from '../db.js';

const router = express.Router();

function formatInspectionRow(row) {
  if (!row) return null;
  return {
    ...row,
    walkaroundVideoRecorded: Boolean(row.walkaroundVideoRecorded),
    customerConfirmed: Boolean(row.customerConfirmed),
    ownerConfirmed: Boolean(row.ownerConfirmed)
  };
}

// GET /api/inspections - List all inspections grouped by bookingId
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM inspections ORDER BY createdAt ASC').all();
    const result = {};

    for (const row of rows) {
      if (!result[row.bookingId]) {
        result[row.bookingId] = {
          bookingId: row.bookingId,
          vehicleId: row.vehicleId,
          vehicleName: row.vehicleName,
          preRental: null,
          postRental: null
        };
      }
      const formatted = formatInspectionRow(row);
      if (row.type === 'pre') {
        result[row.bookingId].preRental = formatted;
      } else if (row.type === 'post') {
        result[row.bookingId].postRental = formatted;
      }
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching all inspections:', error);
    res.status(500).json({ error: 'Failed to fetch inspections' });
  }
});

// GET /api/inspections/:bookingId - Pre & post inspections for a booking
router.get('/:bookingId', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM inspections WHERE bookingId = ?').all(req.params.bookingId);
    const booking = db.prepare('SELECT vehicleId, vehicleName FROM bookings WHERE id = ?').get(req.params.bookingId);

    const result = {
      bookingId: req.params.bookingId,
      vehicleId: booking?.vehicleId || null,
      vehicleName: booking?.vehicleName || null,
      preRental: null,
      postRental: null
    };

    for (const row of rows) {
      const formatted = formatInspectionRow(row);
      if (row.type === 'pre') {
        result.preRental = formatted;
      } else if (row.type === 'post') {
        result.postRental = formatted;
      }
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching inspection:', error);
    res.status(500).json({ error: 'Failed to fetch inspection' });
  }
});

// POST /api/inspections/:bookingId - Save pre or post inspection
router.post('/:bookingId', (req, res) => {
  try {
    const { type, inspectionData } = req.body; // type: 'pre' | 'post'
    const bookingId = req.params.bookingId;

    if (!type || !inspectionData) {
      return res.status(400).json({ error: 'type and inspectionData are required' });
    }

    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
    const id = `insp-${bookingId}-${type}`;

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO inspections (
        id, bookingId, type, vehicleId, vehicleName, odometer, fuelLevel,
        frontPhoto, rearPhoto, leftPhoto, rightPhoto, dashboardPhoto,
        frontTyrePhoto, rearTyrePhoto, existingDamage, walkaroundVideoRecorded,
        customerConfirmed, ownerConfirmed, inspectedAt, createdAt
      ) VALUES (
        @id, @bookingId, @type, @vehicleId, @vehicleName, @odometer, @fuelLevel,
        @frontPhoto, @rearPhoto, @leftPhoto, @rightPhoto, @dashboardPhoto,
        @frontTyrePhoto, @rearTyrePhoto, @existingDamage, @walkaroundVideoRecorded,
        @customerConfirmed, @ownerConfirmed, @inspectedAt, @createdAt
      )
    `);

    stmt.run({
      id,
      bookingId,
      type,
      vehicleId: booking?.vehicleId || null,
      vehicleName: booking?.vehicleName || null,
      odometer: Number(inspectionData.odometer) || 0,
      fuelLevel: Number(inspectionData.fuelLevel) || 100,
      frontPhoto: inspectionData.frontPhoto || null,
      rearPhoto: inspectionData.rearPhoto || null,
      leftPhoto: inspectionData.leftPhoto || null,
      rightPhoto: inspectionData.rightPhoto || null,
      dashboardPhoto: inspectionData.dashboardPhoto || null,
      frontTyrePhoto: inspectionData.frontTyrePhoto || inspectionData.tyresPhoto || null,
      rearTyrePhoto: inspectionData.rearTyrePhoto || inspectionData.tyresPhoto || null,
      existingDamage: inspectionData.existingDamage || '',
      walkaroundVideoRecorded: inspectionData.walkaroundVideoRecorded ? 1 : 0,
      customerConfirmed: inspectionData.customerConfirmed ? 1 : 0,
      ownerConfirmed: inspectionData.ownerConfirmed ? 1 : 0,
      inspectedAt: inspectionData.inspectedAt || new Date().toLocaleString(),
      createdAt: new Date().toISOString()
    });

    // Update booking flags and lifecycle status
    if (type === 'pre') {
      db.prepare('UPDATE bookings SET preInspectionDone = 1, status = "Active Rental" WHERE id = ?').run(bookingId);
    } else {
      db.prepare('UPDATE bookings SET postInspectionDone = 1, status = "Completed" WHERE id = ?').run(bookingId);
    }

    // Return updated booking inspections
    const updatedRows = db.prepare('SELECT * FROM inspections WHERE bookingId = ?').all(bookingId);
    const result = {
      bookingId,
      preRental: null,
      postRental: null
    };
    for (const r of updatedRows) {
      if (r.type === 'pre') result.preRental = formatInspectionRow(r);
      if (r.type === 'post') result.postRental = formatInspectionRow(r);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Error saving inspection:', error);
    res.status(500).json({ error: 'Failed to save inspection' });
  }
});

export default router;
