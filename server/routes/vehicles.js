import express from 'express';
import { db } from '../db.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

function formatVehicle(row) {
  if (!row) return null;
  return {
    ...row,
    ownerVerified: Boolean(row.ownerVerified),
    vehicleVerified: Boolean(row.vehicleVerified),
    documentsVerified: Boolean(row.documentsVerified),
    inspectionCompleted: Boolean(row.inspectionCompleted),
    isEV: Boolean(row.isEV),
    chargingCostIncluded: Boolean(row.chargingCostIncluded),
    spareBatteryAvailable: Boolean(row.spareBatteryAvailable),
    helmetIncluded: Boolean(row.helmetIncluded),
    images: typeof row.images === 'string' ? JSON.parse(row.images || '[]') : row.images || [],
    features: typeof row.features === 'string' ? JSON.parse(row.features || '[]') : row.features || [],
    rentalRules: typeof row.rentalRules === 'string' ? JSON.parse(row.rentalRules || '[]') : row.rentalRules || [],
    availability: typeof row.availability === 'string' ? JSON.parse(row.availability || 'null') : row.availability || null
  };
}

// GET /api/vehicles - List all vehicles with optional filters
router.get('/', (req, res) => {
  try {
    const { type, category, transmission, area, maxPrice, status, search } = req.query;

    let query = 'SELECT * FROM vehicles WHERE 1=1';
    const params = {};

    const targetType = category || type;
    if (targetType && targetType !== 'all') {
      query += ' AND type = @targetType';
      params.targetType = targetType;
    }

    if (transmission && transmission !== 'all') {
      query += ' AND transmission = @transmission';
      params.transmission = transmission;
    }

    if (area && area !== 'all') {
      query += ' AND locationArea = @area';
      params.area = area;
    }

    if (maxPrice) {
      query += ' AND dailyRate <= @maxPrice';
      params.maxPrice = Number(maxPrice);
    }

    if (status && status !== 'all') {
      query += ' AND status = @status';
      params.status = status;
    }

    if (search) {
      query += ' AND (name LIKE @search OR make LIKE @search OR model LIKE @search OR locationArea LIKE @search OR registrationNumber LIKE @search)';
      params.search = `%${search}%`;
    }

    query += ' ORDER BY rating DESC, id DESC';

    const rows = db.prepare(query).all(params);
    const vehicles = rows.map(formatVehicle);
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// GET /api/vehicles/:id - Get vehicle details
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(formatVehicle(row));
  } catch (error) {
    console.error('Error fetching vehicle by id:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

// POST /api/vehicles - Add new vehicle (Host Onboarding - Owner & Admin only)
router.post('/', requireRole('owner', 'admin'), (req, res) => {
  try {
    const v = req.body;
    const newId = v.id || `veh-${Date.now()}`;

    const stmt = db.prepare(`
      INSERT INTO vehicles (
        id, name, type, transmission, make, model, variant, year, registrationNumber,
        dailyRate, hourlyRate, depositAmount, locationArea, pickupAddress,
        ownerId, ownerName, ownerPhone, ownerEmail, ownerCity, ownerAddress,
        ownerVerified, vehicleVerified, documentsVerified, inspectionCompleted,
        rating, reviewsCount, fuelType, isEV, evRangeKm, chargingCostIncluded,
        nearbyChargingStations, spareBatteryAvailable, odometer, helmetIncluded,
        helmetsProvided, images, features, rentalRules, availability,
        verificationStatus, status, city
      ) VALUES (
        @id, @name, @type, @transmission, @make, @model, @variant, @year, @registrationNumber,
        @dailyRate, @hourlyRate, @depositAmount, @locationArea, @pickupAddress,
        @ownerId, @ownerName, @ownerPhone, @ownerEmail, @ownerCity, @ownerAddress,
        @ownerVerified, @vehicleVerified, @documentsVerified, @inspectionCompleted,
        @rating, @reviewsCount, @fuelType, @isEV, @evRangeKm, @chargingCostIncluded,
        @nearbyChargingStations, @spareBatteryAvailable, @odometer, @helmetIncluded,
        @helmetsProvided, @images, @features, @rentalRules, @availability,
        @verificationStatus, @status, @city
      )
    `);

    const newVehicleData = {
      id: newId,
      name: v.name || `${v.make || ''} ${v.model || ''}`,
      type: v.type || 'scooter',
      transmission: v.transmission || 'automatic',
      make: v.make || '',
      model: v.model || '',
      variant: v.variant || '',
      year: Number(v.year) || 2024,
      registrationNumber: (v.registrationNumber || '').toUpperCase(),
      dailyRate: Number(v.dailyRate) || 400,
      hourlyRate: Number(v.hourlyRate) || Math.round((Number(v.dailyRate) || 400) / 7),
      depositAmount: Number(v.depositAmount) || 0,
      locationArea: v.locationArea || 'Prem Mandir Road',
      pickupAddress: v.pickupAddress || '',
      ownerId: v.ownerId || `owner-${Date.now()}`,
      ownerName: v.ownerName || 'Host Owner',
      ownerPhone: v.ownerPhone || '',
      ownerEmail: v.ownerEmail || '',
      ownerCity: v.ownerCity || 'Vrindavan',
      ownerAddress: v.ownerAddress || '',
      ownerVerified: 1,
      vehicleVerified: 0,
      documentsVerified: 0,
      inspectionCompleted: 0,
      rating: 5.0,
      reviewsCount: 1,
      fuelType: v.fuelType || 'Petrol',
      isEV: v.isEV || v.type === 'electric' || v.fuelType === 'Electric' ? 1 : 0,
      evRangeKm: Number(v.evRangeKm) || 0,
      chargingCostIncluded: v.chargingCostIncluded !== false ? 1 : 0,
      nearbyChargingStations: v.nearbyChargingStations || '',
      spareBatteryAvailable: v.spareBatteryAvailable !== false ? 1 : 0,
      odometer: Number(v.odometer) || 10000,
      helmetIncluded: v.helmetIncluded !== false ? 1 : 0,
      helmetsProvided: Number(v.helmetsProvided) || 2,
      images: JSON.stringify(Array.isArray(v.images) ? v.images : []),
      features: JSON.stringify(Array.isArray(v.features) ? v.features : ['USB Charging Port', 'Helmet Included']),
      rentalRules: JSON.stringify(Array.isArray(v.rentalRules) ? v.rentalRules : ['Valid Driving Licence required']),
      availability: JSON.stringify(v.availability || { from: '2026-09-12', to: '2026-12-31', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }),
      verificationStatus: 'Pending',
      status: 'pending_approval',
      city: v.city || 'Vrindavan'
    };

    stmt.run(newVehicleData);

    // Update owner vehicle count if owner exists, or register owner
    const existingOwner = db.prepare('SELECT * FROM owners WHERE name = ?').get(newVehicleData.ownerName);
    if (existingOwner) {
      db.prepare('UPDATE owners SET vehiclesCount = vehiclesCount + 1 WHERE id = ?').run(existingOwner.id);
    } else {
      db.prepare(`
        INSERT INTO owners (id, name, phone, email, verificationStatus, vehiclesCount, earnings, status)
        VALUES (?, ?, ?, ?, 'Pending', 1, 0, 'active')
      `).run(newVehicleData.ownerId, newVehicleData.ownerName, newVehicleData.ownerPhone, newVehicleData.ownerEmail);
    }

    const created = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(newId);
    res.status(201).json(formatVehicle(created));
  } catch (error) {
    console.error('Error adding vehicle:', error);
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
});

// PATCH /api/vehicles/:id/status - Toggle active/suspended (Owner & Admin only)
router.patch('/:id/status', requireRole('owner', 'admin'), (req, res) => {
  try {
    const current = db.prepare('SELECT status FROM vehicles WHERE id = ?').get(req.params.id);
    if (!current) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const newStatus = req.body.status || (current.status === 'active' ? 'suspended' : 'active');
    db.prepare('UPDATE vehicles SET status = ? WHERE id = ?').run(newStatus, req.params.id);

    const updated = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(req.params.id);
    res.json(formatVehicle(updated));
  } catch (error) {
    console.error('Error toggling vehicle status:', error);
    res.status(500).json({ error: 'Failed to update vehicle status' });
  }
});

// PATCH /api/vehicles/:id/verify - Admin Verify / Reject / Request Changes (Admin only)
router.patch('/:id/verify', requireRole('admin'), (req, res) => {
  try {
    const { action } = req.body; // 'Verified' | 'Rejected' | 'Changes Requested' | 'Suspended' | boolean

    let isVerified = 0;
    let statusText = 'pending_approval';
    let vStatus = 'Pending';

    if (action === true || action === 'Verified') {
      isVerified = 1;
      statusText = 'active';
      vStatus = 'Verified';
    } else if (action === 'Rejected') {
      isVerified = 0;
      statusText = 'rejected';
      vStatus = 'Rejected';
    } else if (action === 'Changes Requested') {
      isVerified = 0;
      statusText = 'changes_requested';
      vStatus = 'Changes Requested';
    } else if (action === 'Suspended' || action === false) {
      isVerified = 0;
      statusText = 'suspended';
      vStatus = 'Suspended';
    }

    db.prepare(`
      UPDATE vehicles
      SET vehicleVerified = ?, documentsVerified = ?, verificationStatus = ?, status = ?
      WHERE id = ?
    `).run(isVerified, isVerified, vStatus, statusText, req.params.id);

    const updated = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(req.params.id);
    res.json(formatVehicle(updated));
  } catch (error) {
    console.error('Error verifying vehicle:', error);
    res.status(500).json({ error: 'Failed to verify vehicle' });
  }
});

export default router;
