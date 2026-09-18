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

// Helper to verify if an authenticated user is the host/owner of a vehicle or platform admin
export async function isAuthorizedVehicleHost(vehicle, user) {
  if (!vehicle || !user) return false;
  // 1. Admin always has full edit rights
  if (user.role === 'admin') return true;

  // 2. Direct ID matches (handling ID prefixes: own-, usr-, cust-)
  if (user.id && vehicle.ownerId) {
    if (user.id === vehicle.ownerId) return true;
    const cleanUserId = String(user.id).replace(/^(own|usr|cust)-/, '');
    const cleanOwnerId = String(vehicle.ownerId).replace(/^(own|usr|cust)-/, '');
    if (cleanUserId && cleanOwnerId && cleanUserId === cleanOwnerId) return true;
  }

  // 3. Phone matching (compare last 10 digits to normalize +91, spaces, dashes)
  const userDigits = String(user.phone || '').replace(/[^0-9]/g, '');
  const ownerDigits = String(vehicle.ownerPhone || '').replace(/[^0-9]/g, '');
  if (userDigits.length >= 10 && ownerDigits.length >= 10) {
    if (userDigits.slice(-10) === ownerDigits.slice(-10)) return true;
  }

  // 4. Email matching (case-insensitive normalized)
  const userEmail = String(user.email || '').trim().toLowerCase();
  const ownerEmail = String(vehicle.ownerEmail || '').trim().toLowerCase();
  if (userEmail && ownerEmail && userEmail === ownerEmail) return true;

  // 5. Name matching (case-insensitive, trimmed)
  const userName = String(user.name || '').trim().toLowerCase();
  const ownerName = String(vehicle.ownerName || '').trim().toLowerCase();
  if (userName && ownerName && userName === ownerName && userName.length > 2) return true;

  // 6. Check database cross-reference: does the user match an owner record linked to this vehicle?
  try {
    if (vehicle.ownerId) {
      const dbOwner = await db.prepare('SELECT * FROM owners WHERE id = ?').get(vehicle.ownerId);
      if (dbOwner) {
        const dbOwnerDigits = String(dbOwner.phone || '').replace(/[^0-9]/g, '');
        if (userDigits.length >= 10 && dbOwnerDigits.length >= 10 && userDigits.slice(-10) === dbOwnerDigits.slice(-10)) {
          return true;
        }
        if (userEmail && dbOwner.email && userEmail === dbOwner.email.trim().toLowerCase()) {
          return true;
        }
      }
    }
  } catch (e) {}

  // 7. Check database cross-reference: does user record in customers/owners match vehicle's ownerPhone/ownerEmail?
  try {
    if (user.id) {
      const dbUser = (await db.prepare('SELECT phone, email FROM customers WHERE id = ?').get(user.id)) ||
                     (await db.prepare('SELECT phone, email FROM owners WHERE id = ?').get(user.id));
      if (dbUser) {
        const dbUserDigits = String(dbUser.phone || '').replace(/[^0-9]/g, '');
        if (dbUserDigits.length >= 10 && ownerDigits.length >= 10 && dbUserDigits.slice(-10) === ownerDigits.slice(-10)) {
          return true;
        }
        if (ownerEmail && dbUser.email && ownerEmail === dbUser.email.trim().toLowerCase()) {
          return true;
        }
      }
    }
  } catch (e) {}

  // 8. Self-hosted unassigned vehicle or default self listing
  if (!vehicle.ownerId || vehicle.ownerId === 'self' || vehicle.ownerId === 'self-hosted') {
    return true;
  }

  return false;
}

// GET /api/vehicles - List all vehicles with optional filters
router.get('/', async (req, res) => {
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

    const rows = await db.prepare(query).all(params);
    const vehicles = rows.map(formatVehicle);
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// GET /api/vehicles/:id - Get vehicle details
router.get('/:id', async (req, res) => {
  try {
    const row = await db.prepare('SELECT * FROM vehicles WHERE id = ?').get(req.params.id);
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
router.post('/', requireRole('owner', 'admin'), async (req, res) => {
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
      ownerId: req.user.role === 'owner' ? req.user.id : (v.ownerId || `owner-${Date.now()}`),
      ownerName: req.user.role === 'owner' ? req.user.name : (v.ownerName || 'Host Owner'),
      ownerPhone: req.user.role === 'owner' ? (req.user.phone || v.ownerPhone) : (v.ownerPhone || ''),
      ownerEmail: req.user.role === 'owner' ? (req.user.email || v.ownerEmail) : (v.ownerEmail || ''),
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

    await stmt.run(newVehicleData);

    // Update owner vehicle count if owner exists, or register owner
    const existingOwner = await db.prepare('SELECT * FROM owners WHERE name = ?').get(newVehicleData.ownerName);
    if (existingOwner) {
      await db.prepare('UPDATE owners SET vehiclesCount = vehiclesCount + 1 WHERE id = ?').run(existingOwner.id);
    } else {
      await db.prepare(`
        INSERT INTO owners (id, name, phone, email, verificationStatus, vehiclesCount, earnings, status)
        VALUES (?, ?, ?, ?, 'Pending', 1, 0, 'active')
      `).run(newVehicleData.ownerId, newVehicleData.ownerName, newVehicleData.ownerPhone, newVehicleData.ownerEmail);
    }

    const created = await db.prepare('SELECT * FROM vehicles WHERE id = ?').get(newId);
    res.status(201).json(formatVehicle(created));
  } catch (error) {
    console.error('Error adding vehicle:', error);
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
});

// PUT /api/vehicles/:id - Edit vehicle details (Self-hosted Owner & Admin)
router.put('/:id', requireRole('owner', 'admin'), async (req, res) => {
  try {
    const current = await db.prepare('SELECT * FROM vehicles WHERE id = ?').get(req.params.id);
    if (!current) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Verify user is platform admin OR authorized host of this self-hosted vehicle
    const isAuthorized = await isAuthorizedVehicleHost(current, req.user);
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Forbidden: You can only edit vehicles that you own or host.' });
    }

    const b = req.body;

    // If registration number was modified or vehicle had 'Changes Requested', set back to Pending for review
    const regChanged = b.registrationNumber && b.registrationNumber.toUpperCase() !== current.registrationNumber;
    let newVerificationStatus = current.verificationStatus;
    let newVehicleVerified = current.vehicleVerified;
    let newStatus = current.status;

    if (regChanged || current.verificationStatus === 'Changes Requested') {
      newVerificationStatus = 'Pending';
      newVehicleVerified = 0;
      newStatus = 'pending_approval';
    }

    // Admin override if specified
    if (req.user.role === 'admin' && b.verificationStatus) {
      newVerificationStatus = b.verificationStatus;
      newVehicleVerified = b.verificationStatus === 'Verified' ? 1 : 0;
      if (b.status) newStatus = b.status;
    }

    const updatedData = {
      id: req.params.id,
      name: b.name !== undefined ? b.name : current.name,
      type: b.type !== undefined ? b.type : current.type,
      transmission: b.transmission !== undefined ? b.transmission : current.transmission,
      make: b.make !== undefined ? b.make : current.make,
      model: b.model !== undefined ? b.model : current.model,
      variant: b.variant !== undefined ? b.variant : current.variant,
      year: b.year !== undefined ? Number(b.year) : current.year,
      registrationNumber: b.registrationNumber !== undefined ? b.registrationNumber.toUpperCase() : current.registrationNumber,
      dailyRate: b.dailyRate !== undefined ? Number(b.dailyRate) : current.dailyRate,
      hourlyRate: b.hourlyRate !== undefined ? Number(b.hourlyRate) : current.hourlyRate,
      depositAmount: b.depositAmount !== undefined ? Number(b.depositAmount) : current.depositAmount,
      locationArea: b.locationArea !== undefined ? b.locationArea : current.locationArea,
      pickupAddress: b.pickupAddress !== undefined ? b.pickupAddress : current.pickupAddress,
      fuelType: b.fuelType !== undefined ? b.fuelType : current.fuelType,
      isEV: b.isEV !== undefined ? (b.isEV ? 1 : 0) : current.isEV,
      evRangeKm: b.evRangeKm !== undefined ? Number(b.evRangeKm) : current.evRangeKm,
      chargingCostIncluded: b.chargingCostIncluded !== undefined ? (b.chargingCostIncluded ? 1 : 0) : current.chargingCostIncluded,
      nearbyChargingStations: b.nearbyChargingStations !== undefined ? b.nearbyChargingStations : current.nearbyChargingStations,
      spareBatteryAvailable: b.spareBatteryAvailable !== undefined ? (b.spareBatteryAvailable ? 1 : 0) : current.spareBatteryAvailable,
      odometer: b.odometer !== undefined ? Number(b.odometer) : current.odometer,
      helmetIncluded: b.helmetIncluded !== undefined ? (b.helmetIncluded ? 1 : 0) : current.helmetIncluded,
      helmetsProvided: b.helmetsProvided !== undefined ? Number(b.helmetsProvided) : current.helmetsProvided,
      images: b.images !== undefined ? (typeof b.images === 'string' ? b.images : JSON.stringify(b.images)) : (typeof current.images === 'string' ? current.images : JSON.stringify(current.images || [])),
      features: b.features !== undefined ? (typeof b.features === 'string' ? b.features : JSON.stringify(b.features)) : (typeof current.features === 'string' ? current.features : JSON.stringify(current.features || [])),
      rentalRules: b.rentalRules !== undefined ? (typeof b.rentalRules === 'string' ? b.rentalRules : JSON.stringify(b.rentalRules)) : (typeof current.rentalRules === 'string' ? current.rentalRules : JSON.stringify(current.rentalRules || [])),
      availability: b.availability !== undefined ? (typeof b.availability === 'string' ? b.availability : JSON.stringify(b.availability)) : (typeof current.availability === 'string' ? current.availability : JSON.stringify(current.availability || {})),
      city: b.city !== undefined ? b.city : current.city,
      verificationStatus: newVerificationStatus,
      vehicleVerified: newVehicleVerified,
      status: newStatus
    };

    await db.prepare(`
      UPDATE vehicles SET
        name = @name,
        type = @type,
        transmission = @transmission,
        make = @make,
        model = @model,
        variant = @variant,
        year = @year,
        registrationNumber = @registrationNumber,
        dailyRate = @dailyRate,
        hourlyRate = @hourlyRate,
        depositAmount = @depositAmount,
        locationArea = @locationArea,
        pickupAddress = @pickupAddress,
        fuelType = @fuelType,
        isEV = @isEV,
        evRangeKm = @evRangeKm,
        chargingCostIncluded = @chargingCostIncluded,
        nearbyChargingStations = @nearbyChargingStations,
        spareBatteryAvailable = @spareBatteryAvailable,
        odometer = @odometer,
        helmetIncluded = @helmetIncluded,
        helmetsProvided = @helmetsProvided,
        images = @images,
        features = @features,
        rentalRules = @rentalRules,
        availability = @availability,
        city = @city,
        verificationStatus = @verificationStatus,
        vehicleVerified = @vehicleVerified,
        status = @status
      WHERE id = @id
    `).run(updatedData);

    const updated = await db.prepare('SELECT * FROM vehicles WHERE id = ?').get(req.params.id);
    res.json(formatVehicle(updated));
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ error: 'Failed to update vehicle details' });
  }
});

// PATCH /api/vehicles/:id/status - Toggle active/suspended (Self-hosted Owner & Admin only)
router.patch('/:id/status', requireRole('owner', 'admin'), async (req, res) => {
  try {
    const current = await db.prepare('SELECT * FROM vehicles WHERE id = ?').get(req.params.id);
    if (!current) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isAuthorized = await isAuthorizedVehicleHost(current, req.user);
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Forbidden: You can only update the status of vehicles that you own or host.' });
    }

    const isApproved = current.vehicleVerified === 1 || current.verificationStatus === 'Verified';

    let newStatus = req.body.status;
    if (!newStatus) {
      if (current.status === 'active') {
        newStatus = 'suspended';
      } else {
        // Non-admin host cannot activate unapproved vehicle
        if (!isAdmin && !isApproved) {
          return res.status(403).json({
            error: 'Cannot activate vehicle: This vehicle is awaiting Admin verification. Once approved, you can activate it.'
          });
        }
        newStatus = 'active';
      }
    } else if (newStatus === 'active' && !isAdmin && !isApproved) {
      return res.status(403).json({
        error: 'Cannot activate vehicle: This vehicle is awaiting Admin verification. Once approved, you can activate it.'
      });
    }

    await db.prepare('UPDATE vehicles SET status = ? WHERE id = ?').run(newStatus, req.params.id);

    const updated = await db.prepare('SELECT * FROM vehicles WHERE id = ?').get(req.params.id);
    res.json(formatVehicle(updated));
  } catch (error) {
    console.error('Error toggling vehicle status:', error);
    res.status(500).json({ error: 'Failed to update vehicle status' });
  }
});

// PATCH /api/vehicles/:id/verify - Admin Verify / Reject / Request Changes (Admin only)
router.patch('/:id/verify', requireRole('admin'), async (req, res) => {
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

    await db.prepare(`
      UPDATE vehicles
      SET vehicleVerified = ?, documentsVerified = ?, verificationStatus = ?, status = ?
      WHERE id = ?
    `).run(isVerified, isVerified, vStatus, statusText, req.params.id);

    const updated = await db.prepare('SELECT * FROM vehicles WHERE id = ?').get(req.params.id);
    res.json(formatVehicle(updated));
  } catch (error) {
    console.error('Error verifying vehicle:', error);
    res.status(500).json({ error: 'Failed to verify vehicle' });
  }
});

export default router;
