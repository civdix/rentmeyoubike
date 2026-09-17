import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const dbPath = path.join(__dirname, 'vrindavan.db');
export const db = new Database(dbPath);

// Enable foreign keys and WAL mode for better concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      transmission TEXT NOT NULL,
      make TEXT,
      model TEXT,
      variant TEXT,
      year INTEGER,
      registrationNumber TEXT,
      dailyRate INTEGER NOT NULL,
      hourlyRate INTEGER,
      depositAmount INTEGER DEFAULT 0,
      locationArea TEXT,
      pickupAddress TEXT,
      ownerId TEXT,
      ownerName TEXT,
      ownerPhone TEXT,
      ownerEmail TEXT,
      ownerCity TEXT,
      ownerAddress TEXT,
      ownerVerified INTEGER DEFAULT 1,
      vehicleVerified INTEGER DEFAULT 0,
      documentsVerified INTEGER DEFAULT 0,
      inspectionCompleted INTEGER DEFAULT 0,
      rating REAL DEFAULT 5.0,
      reviewsCount INTEGER DEFAULT 0,
      fuelType TEXT,
      isEV INTEGER DEFAULT 0,
      evRangeKm INTEGER DEFAULT 0,
      chargingCostIncluded INTEGER DEFAULT 1,
      nearbyChargingStations TEXT,
      spareBatteryAvailable INTEGER DEFAULT 1,
      odometer INTEGER DEFAULT 0,
      helmetIncluded INTEGER DEFAULT 1,
      helmetsProvided INTEGER DEFAULT 2,
      images TEXT,
      features TEXT,
      rentalRules TEXT,
      availability TEXT,
      verificationStatus TEXT DEFAULT 'Pending',
      status TEXT DEFAULT 'pending_approval',
      city TEXT DEFAULT 'Vrindavan',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      vehicleId TEXT NOT NULL,
      vehicleName TEXT NOT NULL,
      customerName TEXT NOT NULL,
      customerPhone TEXT NOT NULL,
      customerEmail TEXT,
      ownerName TEXT,
      ownerPhone TEXT,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      totalDays INTEGER NOT NULL,
      dailyPrice INTEGER NOT NULL,
      totalAmount INTEGER NOT NULL,
      pickupLocation TEXT,
      status TEXT DEFAULT 'Inquiry',
      paymentStatus TEXT DEFAULT 'Pending',
      refundStatus TEXT DEFAULT 'None',
      paymentId TEXT,
      kycStatus TEXT DEFAULT 'Pending',
      preInspectionDone INTEGER DEFAULT 0,
      postInspectionDone INTEGER DEFAULT 0,
      bikeSaathiIncluded INTEGER DEFAULT 0,
      saathiFee INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS inspections (
      id TEXT PRIMARY KEY,
      bookingId TEXT NOT NULL,
      type TEXT NOT NULL, -- 'pre' or 'post'
      vehicleId TEXT,
      vehicleName TEXT,
      odometer INTEGER,
      fuelLevel INTEGER,
      frontPhoto TEXT,
      rearPhoto TEXT,
      leftPhoto TEXT,
      rightPhoto TEXT,
      dashboardPhoto TEXT,
      frontTyrePhoto TEXT,
      rearTyrePhoto TEXT,
      existingDamage TEXT,
      walkaroundVideoRecorded INTEGER DEFAULT 1,
      customerConfirmed INTEGER DEFAULT 1,
      ownerConfirmed INTEGER DEFAULT 1,
      inspectedAt TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(bookingId, type)
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      password TEXT,
      emailVerified INTEGER DEFAULT 0,
      kycStatus TEXT DEFAULT 'Pending',
      bookingsCount INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      registeredDate TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS owners (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      password TEXT,
      emailVerified INTEGER DEFAULT 0,
      verificationStatus TEXT DEFAULT 'Pending',
      vehiclesCount INTEGER DEFAULT 0,
      earnings INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      joinedDate TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS disputes (
      id TEXT PRIMARY KEY,
      bookingId TEXT NOT NULL,
      customerName TEXT,
      ownerName TEXT,
      vehicleName TEXT,
      issue TEXT NOT NULL,
      notes TEXT, -- JSON array of { sender, time, text }
      evidence TEXT, -- JSON array of URLs
      status TEXT DEFAULT 'Open',
      outcome TEXT DEFAULT '',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      platformCommission REAL DEFAULT 15,
      minRentalDuration TEXT DEFAULT '1 Day',
      whatsAppNumber TEXT DEFAULT '+919837144520',
      supportContact TEXT DEFAULT 'support@vrindavanrides.in',
      protectionInfo TEXT,
      rentalRules TEXT,
      cancellationRules TEXT
    );

    CREATE TABLE IF NOT EXISTS legal_config (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      protectionTitle TEXT,
      protectionDisclaimer TEXT,
      legalPolicyNote TEXT,
      citiesAvailable TEXT,
      supportWhatsApp TEXT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      role TEXT NOT NULL,
      userId TEXT,
      userData TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS email_verifications (
      email TEXT PRIMARY KEY,
      otp TEXT NOT NULL,
      role TEXT DEFAULT 'customer',
      expiresAt INTEGER NOT NULL,
      verified INTEGER DEFAULT 0,
      attempts INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS uploaded_images (
      id TEXT PRIMARY KEY,
      fileId TEXT NOT NULL,
      url TEXT NOT NULL,
      thumbnailUrl TEXT,
      bookingId TEXT,
      vehicleId TEXT,
      category TEXT DEFAULT 'inspection',
      size INTEGER,
      deleted INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      deletedAt TEXT
    );
  `);

  // Non-destructive migrations for emailVerified status and password
  try {
    db.prepare('ALTER TABLE customers ADD COLUMN emailVerified INTEGER DEFAULT 0').run();
  } catch (e) {
    // Column already exists
  }
  try {
    db.prepare('ALTER TABLE owners ADD COLUMN emailVerified INTEGER DEFAULT 0').run();
  } catch (e) {
    // Column already exists
  }
  try {
    db.prepare('ALTER TABLE customers ADD COLUMN password TEXT').run();
  } catch (e) {
    // Column already exists
  }
  try {
    db.prepare('ALTER TABLE owners ADD COLUMN password TEXT').run();
  } catch (e) {
    // Column already exists
  }

  // Non-destructive migrations for image settlement tracking
  try {
    db.prepare('ALTER TABLE inspections ADD COLUMN imagesSettled INTEGER DEFAULT 0').run();
  } catch (e) {
    // Column already exists
  }
  try {
    db.prepare('ALTER TABLE inspections ADD COLUMN imagesDeletedAt TEXT').run();
  } catch (e) {
    // Column already exists
  }
  try {
    db.prepare('ALTER TABLE bookings ADD COLUMN imagesSettled INTEGER DEFAULT 0').run();
  } catch (e) {
    // Column already exists
  }

  // Seed default data if empty
  seedInitialData();
}

export function seedInitialData() {
  const count = db.prepare('SELECT COUNT(*) as count FROM vehicles').get();
  if (count.count > 0) return;

  console.log('Seeding initial Vrindavan Rides database...');

  const insertVehicle = db.prepare(`
    INSERT INTO vehicles (
      id, name, type, transmission, make, model, year, registrationNumber,
      dailyRate, hourlyRate, depositAmount, locationArea, pickupAddress,
      ownerId, ownerName, ownerPhone, ownerVerified, vehicleVerified, documentsVerified,
      inspectionCompleted, rating, reviewsCount, fuelType, isEV, evRangeKm,
      chargingCostIncluded, nearbyChargingStations, spareBatteryAvailable,
      odometer, helmetIncluded, helmetsProvided, images, features, rentalRules,
      verificationStatus, status, city
    ) VALUES (
      @id, @name, @type, @transmission, @make, @model, @year, @registrationNumber,
      @dailyRate, @hourlyRate, @depositAmount, @locationArea, @pickupAddress,
      @ownerId, @ownerName, @ownerPhone, @ownerVerified, @vehicleVerified, @documentsVerified,
      @inspectionCompleted, @rating, @reviewsCount, @fuelType, @isEV, @evRangeKm,
      @chargingCostIncluded, @nearbyChargingStations, @spareBatteryAvailable,
      @odometer, @helmetIncluded, @helmetsProvided, @images, @features, @rentalRules,
      @verificationStatus, @status, @city
    )
  `);

  const initialVehicles = [
    {
      id: 'veh-1',
      name: 'Honda Activa 6G (Radhe Divine Edition)',
      type: 'scooter',
      transmission: 'automatic',
      make: 'Honda',
      model: 'Activa 6G',
      year: 2024,
      registrationNumber: 'UP 85 BL 4921',
      dailyRate: 400,
      hourlyRate: 60,
      depositAmount: 0,
      locationArea: 'Prem Mandir Road',
      pickupAddress: 'Radhe Kunj #12, Near Gate No. 2, Prem Mandir Marg, Vrindavan',
      ownerId: 'owner-1',
      ownerName: 'Radhe Shyam Sharma',
      ownerPhone: '+91 98371 44520',
      ownerVerified: 1,
      vehicleVerified: 1,
      documentsVerified: 1,
      inspectionCompleted: 1,
      rating: 4.9,
      reviewsCount: 38,
      fuelType: 'Petrol',
      isEV: 0,
      evRangeKm: 0,
      chargingCostIncluded: 0,
      nearbyChargingStations: '',
      spareBatteryAvailable: 0,
      odometer: 14250,
      helmetIncluded: 1,
      helmetsProvided: 2,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80'
      ]),
      features: JSON.stringify(['Combi-Brake System', 'Silent Engine in Temple Zones', 'Sanitized Helmets with Tilak Liner', 'Mobile Phone Holder']),
      rentalRules: JSON.stringify(['Valid Driving Licence required', 'Helmets mandatory for both rider & pillion', 'No honking near Prem Mandir & Nidhivan silence zones', 'Max Speed: 40 km/h inside temple galis']),
      verificationStatus: 'Verified',
      status: 'active',
      city: 'Vrindavan'
    },
    {
      id: 'veh-2',
      name: 'Royal Enfield Classic 350 (Bhakti Yatra Edition)',
      type: 'motorcycle',
      transmission: 'manual',
      make: 'Royal Enfield',
      model: 'Classic 350',
      year: 2024,
      registrationNumber: 'UP 85 CZ 9901',
      dailyRate: 950,
      hourlyRate: 140,
      depositAmount: 0,
      locationArea: 'Chattikara Road',
      pickupAddress: 'Chattikara Flyover Junction, Near Highway Motel & Vrindavan Entrance',
      ownerId: 'owner-2',
      ownerName: 'Vikram Singh Jadon',
      ownerPhone: '+91 94122 88310',
      ownerVerified: 1,
      vehicleVerified: 1,
      documentsVerified: 1,
      inspectionCompleted: 1,
      rating: 4.95,
      reviewsCount: 52,
      fuelType: 'Petrol',
      isEV: 0,
      evRangeKm: 0,
      chargingCostIncluded: 0,
      nearbyChargingStations: '',
      spareBatteryAvailable: 0,
      odometer: 8400,
      helmetIncluded: 1,
      helmetsProvided: 2,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=1000&q=80'
      ]),
      features: JSON.stringify(['Dual Channel ABS', 'Tripper Navigation for Parikrama', 'USB Charging Port', 'Saddle Stay Included']),
      rentalRules: JSON.stringify(['Min age: 21 years with valid DL', 'Must use premium petrol', 'Helmets mandatory', 'Goverdhan Parikrama permitted']),
      verificationStatus: 'Verified',
      status: 'active',
      city: 'Vrindavan'
    },
    {
      id: 'veh-3',
      name: 'TVS Jupiter 125 (Bankey Bihari Special)',
      type: 'scooter',
      transmission: 'automatic',
      make: 'TVS',
      model: 'Jupiter 125',
      year: 2023,
      registrationNumber: 'UP 85 BK 1102',
      dailyRate: 450,
      hourlyRate: 70,
      depositAmount: 0,
      locationArea: 'Bankey Bihari Temple Road',
      pickupAddress: 'Near VIP Parking Gate #2, Bankey Bihari Marg, Vrindavan',
      ownerId: 'owner-3',
      ownerName: 'Gopal Krishna Agarwal',
      ownerPhone: '+91 98970 33412',
      ownerVerified: 1,
      vehicleVerified: 1,
      documentsVerified: 1,
      inspectionCompleted: 1,
      rating: 4.8,
      reviewsCount: 29,
      fuelType: 'Petrol',
      isEV: 0,
      evRangeKm: 0,
      chargingCostIncluded: 0,
      nearbyChargingStations: '',
      spareBatteryAvailable: 0,
      odometer: 18900,
      helmetIncluded: 1,
      helmetsProvided: 2,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80'
      ]),
      features: JSON.stringify(['Largest Boot (33L) for Prasad', 'Front Fuel Fill', 'ETFi Tech', 'LED Headlamp']),
      rentalRules: JSON.stringify(['Valid DL mandatory', 'Return with same fuel level', 'Park in designated municipal zones']),
      verificationStatus: 'Verified',
      status: 'active',
      city: 'Vrindavan'
    },
    {
      id: 'veh-4',
      name: 'Ather 450X EV (ISKCON Eco Yatra)',
      type: 'scooter',
      transmission: 'automatic',
      make: 'Ather',
      model: '450X',
      year: 2024,
      registrationNumber: 'UP 85 EV 0088',
      dailyRate: 600,
      hourlyRate: 90,
      depositAmount: 0,
      locationArea: 'ISKCON Temple Chowk',
      pickupAddress: 'Bhakti Vedanta Marg, Opp. ISKCON Guest House, Vrindavan',
      ownerId: 'owner-1',
      ownerName: 'Radhe Shyam Sharma',
      ownerPhone: '+91 98371 44520',
      ownerVerified: 1,
      vehicleVerified: 1,
      documentsVerified: 1,
      inspectionCompleted: 1,
      rating: 5.0,
      reviewsCount: 19,
      fuelType: 'Electric',
      isEV: 1,
      evRangeKm: 105,
      chargingCostIncluded: 1,
      nearbyChargingStations: 'Prem Mandir Gate 2 Hub, ISKCON Gate 3 Ather Grid, Chattikara EV Point',
      spareBatteryAvailable: 1,
      odometer: 5120,
      helmetIncluded: 1,
      helmetsProvided: 2,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80'
      ]),
      features: JSON.stringify(['Zero Emission for Vrindavan Cleanliness', '105 km Range Per Full Charge', 'Free Charging Included', 'Portable Charger & Spare Battery Option']),
      rentalRules: JSON.stringify(['Portable Fast Charger included in boot', 'Free fast charging at ISKCON Ather Grid & Prem Mandir Hub', 'Return with min 20% battery charge']),
      verificationStatus: 'Verified',
      status: 'active',
      city: 'Vrindavan'
    },
    {
      id: 'veh-5',
      name: 'Honda Shine 125 (Yamuna Ghat Express)',
      type: 'motorcycle',
      transmission: 'manual',
      make: 'Honda',
      model: 'Shine 125',
      year: 2023,
      registrationNumber: 'UP 85 AQ 5514',
      dailyRate: 500,
      hourlyRate: 75,
      depositAmount: 0,
      locationArea: 'Vrindavan Railway Station',
      pickupAddress: 'Station Road Exit, Opp. Tourist Information Kiosk, Vrindavan',
      ownerId: 'owner-4',
      ownerName: 'Amitabh Mishra',
      ownerPhone: '+91 97600 12890',
      ownerVerified: 1,
      vehicleVerified: 1,
      documentsVerified: 1,
      inspectionCompleted: 1,
      rating: 4.7,
      reviewsCount: 44,
      fuelType: 'Petrol',
      isEV: 0,
      evRangeKm: 0,
      chargingCostIncluded: 0,
      nearbyChargingStations: '',
      spareBatteryAvailable: 0,
      odometer: 22100,
      helmetIncluded: 1,
      helmetsProvided: 2,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80'
      ]),
      features: JSON.stringify(['5-Speed Gearbox', '65 km/l High Mileage', 'Comfortable Seat for Long Yatra']),
      rentalRules: JSON.stringify(['Valid DL mandatory', 'Fuel to fuel return']),
      verificationStatus: 'Verified',
      status: 'active',
      city: 'Vrindavan'
    },
    {
      id: 'veh-9',
      name: 'Hero Lectro C7 EV Bicycle (Parikrama Eco-Cycle)',
      type: 'bicycle',
      transmission: 'automatic',
      make: 'Hero Lectro',
      model: 'C7 EV',
      year: 2024,
      registrationNumber: 'V-CYCLE-009',
      dailyRate: 200,
      hourlyRate: 35,
      depositAmount: 0,
      locationArea: 'Prem Mandir Road',
      pickupAddress: 'Radhe Kunj #12, Near Gate No. 2, Prem Mandir Marg, Vrindavan',
      ownerId: 'owner-1',
      ownerName: 'Radhe Shyam Sharma',
      ownerPhone: '+91 98371 44520',
      ownerVerified: 1,
      vehicleVerified: 1,
      documentsVerified: 1,
      inspectionCompleted: 1,
      rating: 4.92,
      reviewsCount: 35,
      fuelType: 'Electric Assist',
      isEV: 1,
      evRangeKm: 25,
      chargingCostIncluded: 1,
      nearbyChargingStations: 'Prem Mandir Gate 2 Hub',
      spareBatteryAvailable: 0,
      odometer: 1400,
      helmetIncluded: 1,
      helmetsProvided: 1,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1000&q=80'
      ]),
      features: JSON.stringify(['25 km Pedal Assist Range', 'Front Prasad Basket', 'Sanitized Helmet Included', 'Zero Noise for Nidhivan Silence Zone']),
      rentalRules: JSON.stringify(['Valid Government Photo ID required', 'No driving licence required for bicycles!', 'Helmet included and recommended', 'Lock key provided upon pickup']),
      verificationStatus: 'Verified',
      status: 'active',
      city: 'Vrindavan'
    }
  ];

  for (const v of initialVehicles) {
    insertVehicle.run(v);
  }

  // Seed Customers
  const insertCustomer = db.prepare(`
    INSERT INTO customers (id, name, phone, email, kycStatus, bookingsCount, status, registeredDate)
    VALUES (@id, @name, @phone, @email, @kycStatus, @bookingsCount, @status, @registeredDate)
  `);

  const initialCustomers = [
    { id: 'cust-1', name: 'Ananya Roy', phone: '+91 98199 44321', email: 'ananya.roy@example.com', kycStatus: 'Verified', bookingsCount: 3, status: 'active', registeredDate: '2026-08-15' },
    { id: 'cust-2', name: 'Rajesh Kumar', phone: '+91 97112 55900', email: 'rajesh.k@example.com', kycStatus: 'Verified', bookingsCount: 2, status: 'active', registeredDate: '2026-08-20' },
    { id: 'cust-3', name: 'Priya Sharma', phone: '+91 98765 12345', email: 'priya.s@example.com', kycStatus: 'Verified', bookingsCount: 1, status: 'active', registeredDate: '2026-09-01' },
    { id: 'cust-4', name: 'Vikramaditya Singh', phone: '+91 94120 77112', email: 'vikram.s@example.com', kycStatus: 'Verified', bookingsCount: 4, status: 'active', registeredDate: '2026-07-10' },
    { id: 'cust-5', name: 'Sneha Patel', phone: '+91 99220 88341', email: 'sneha.p@example.com', kycStatus: 'Pending', bookingsCount: 0, status: 'suspended', registeredDate: '2026-09-10' }
  ];

  for (const c of initialCustomers) {
    insertCustomer.run(c);
  }

  // Seed Owners
  const insertOwner = db.prepare(`
    INSERT INTO owners (id, name, phone, email, verificationStatus, vehiclesCount, earnings, status, joinedDate)
    VALUES (@id, @name, @phone, @email, @verificationStatus, @vehiclesCount, @earnings, @status, @joinedDate)
  `);

  const initialOwners = [
    { id: 'owner-1', name: 'Radhe Shyam Sharma', phone: '+91 98371 44520', email: 'radheshyam@vrindavanrides.in', verificationStatus: 'Verified', vehiclesCount: 3, earnings: 14200, status: 'active', joinedDate: '2026-06-01' },
    { id: 'owner-2', name: 'Vikram Singh Jadon', phone: '+91 94122 88310', email: 'vikram.jadon@vrindavanrides.in', verificationStatus: 'Verified', vehiclesCount: 2, earnings: 18500, status: 'active', joinedDate: '2026-06-15' },
    { id: 'owner-3', name: 'Gopal Krishna Agarwal', phone: '+91 98970 33412', email: 'gopal.agarwal@vrindavanrides.in', verificationStatus: 'Verified', vehiclesCount: 3, earnings: 9800, status: 'active', joinedDate: '2026-07-01' },
    { id: 'owner-4', name: 'Amitabh Mishra', phone: '+91 97600 12890', email: 'amitabh.mishra@vrindavanrides.in', verificationStatus: 'Verified', vehiclesCount: 3, earnings: 11400, status: 'active', joinedDate: '2026-07-20' },
    { id: 'owner-5', name: 'Kanhaiya Lal Mathur', phone: '+91 94110 55210', email: 'kanhaiya.mathur@vrindavanrides.in', verificationStatus: 'Pending', vehiclesCount: 1, earnings: 0, status: 'active', joinedDate: '2026-09-09' }
  ];

  for (const o of initialOwners) {
    insertOwner.run(o);
  }

  // Seed Bookings
  const insertBooking = db.prepare(`
    INSERT INTO bookings (
      id, vehicleId, vehicleName, customerName, customerPhone, customerEmail,
      ownerName, ownerPhone, startDate, endDate, totalDays, dailyPrice, totalAmount,
      pickupLocation, status, paymentStatus, refundStatus, paymentId, kycStatus,
      preInspectionDone, postInspectionDone, createdAt
    ) VALUES (
      @id, @vehicleId, @vehicleName, @customerName, @customerPhone, @customerEmail,
      @ownerName, @ownerPhone, @startDate, @endDate, @totalDays, @dailyPrice, @totalAmount,
      @pickupLocation, @status, @paymentStatus, @refundStatus, @paymentId, @kycStatus,
      @preInspectionDone, @postInspectionDone, @createdAt
    )
  `);

  const initialBookings = [
    {
      id: 'VRB-9021',
      vehicleId: 'veh-1',
      vehicleName: 'Honda Activa 6G (Radhe Divine Edition)',
      customerName: 'Ananya Roy',
      customerPhone: '+91 98199 44321',
      customerEmail: 'ananya.roy@example.com',
      ownerName: 'Radhe Shyam Sharma',
      ownerPhone: '+91 98371 44520',
      startDate: '2026-09-12',
      endDate: '2026-09-14',
      totalDays: 2,
      dailyPrice: 400,
      totalAmount: 800,
      pickupLocation: 'Prem Mandir Road, Vrindavan',
      status: 'Confirmed',
      paymentStatus: 'Paid',
      refundStatus: 'None',
      paymentId: 'pay_VRB9021_881',
      kycStatus: 'Verified',
      preInspectionDone: 1,
      postInspectionDone: 0,
      createdAt: '2026-09-11 10:15'
    },
    {
      id: 'VRB-9022',
      vehicleId: 'veh-2',
      vehicleName: 'Royal Enfield Classic 350 (Bhakti Yatra)',
      customerName: 'Rajesh Kumar',
      customerPhone: '+91 97112 55900',
      customerEmail: 'rajesh.k@example.com',
      ownerName: 'Vikram Singh Jadon',
      ownerPhone: '+91 94122 88310',
      startDate: '2026-09-11',
      endDate: '2026-09-13',
      totalDays: 2,
      dailyPrice: 950,
      totalAmount: 1900,
      pickupLocation: 'Chattikara Road, Vrindavan',
      status: 'Active Rental',
      paymentStatus: 'Paid',
      refundStatus: 'None',
      paymentId: 'pay_VRB9022_992',
      kycStatus: 'Verified',
      preInspectionDone: 1,
      postInspectionDone: 0,
      createdAt: '2026-09-10 16:30'
    },
    {
      id: 'VRB-9023',
      vehicleId: 'veh-4',
      vehicleName: 'Ather 450X EV (ISKCON Eco Yatra)',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98765 12345',
      customerEmail: 'priya.s@example.com',
      ownerName: 'Radhe Shyam Sharma',
      ownerPhone: '+91 98371 44520',
      startDate: '2026-09-08',
      endDate: '2026-09-10',
      totalDays: 2,
      dailyPrice: 600,
      totalAmount: 1200,
      pickupLocation: 'ISKCON Temple Chowk, Vrindavan',
      status: 'Completed',
      paymentStatus: 'Paid',
      refundStatus: 'None',
      paymentId: 'pay_VRB9023_771',
      kycStatus: 'Verified',
      preInspectionDone: 1,
      postInspectionDone: 1,
      createdAt: '2026-09-07 14:20'
    },
    {
      id: 'VRB-9024',
      vehicleId: 'veh-2',
      vehicleName: 'Royal Enfield Hunter 350 (Sunrakh Parikrama)',
      customerName: 'Rajesh Kumar',
      customerPhone: '+91 97112 55900',
      customerEmail: 'rajesh.k@example.com',
      ownerName: 'Vikram Singh Jadon',
      ownerPhone: '+91 94122 88310',
      startDate: '2026-09-09',
      endDate: '2026-09-11',
      totalDays: 2,
      dailyPrice: 900,
      totalAmount: 1800,
      pickupLocation: 'Sunrakh Road, Vrindavan',
      status: 'Dispute',
      paymentStatus: 'Paid',
      refundStatus: 'None',
      paymentId: 'pay_VRB9024_554',
      kycStatus: 'Verified',
      preInspectionDone: 1,
      postInspectionDone: 1,
      createdAt: '2026-09-08 09:10'
    },
    {
      id: 'VRB-9025',
      vehicleId: 'veh-3',
      vehicleName: 'TVS Jupiter 125 (Bankey Bihari Special)',
      customerName: 'Vikramaditya Singh',
      customerPhone: '+91 94120 77112',
      customerEmail: 'vikram.s@example.com',
      ownerName: 'Gopal Krishna Agarwal',
      ownerPhone: '+91 98970 33412',
      startDate: '2026-09-15',
      endDate: '2026-09-16',
      totalDays: 1,
      dailyPrice: 450,
      totalAmount: 450,
      pickupLocation: 'Bankey Bihari Temple Road, Vrindavan',
      status: 'Payment Pending',
      paymentStatus: 'Pending',
      refundStatus: 'None',
      paymentId: null,
      kycStatus: 'Verified',
      preInspectionDone: 0,
      postInspectionDone: 0,
      createdAt: '2026-09-11 18:00'
    }
  ];

  for (const b of initialBookings) {
    insertBooking.run(b);
  }

  // Seed Inspections
  const insertInspection = db.prepare(`
    INSERT INTO inspections (
      id, bookingId, type, vehicleId, vehicleName, odometer, fuelLevel,
      frontPhoto, rearPhoto, leftPhoto, rightPhoto, dashboardPhoto,
      frontTyrePhoto, rearTyrePhoto, existingDamage, walkaroundVideoRecorded,
      customerConfirmed, ownerConfirmed, inspectedAt
    ) VALUES (
      @id, @bookingId, @type, @vehicleId, @vehicleName, @odometer, @fuelLevel,
      @frontPhoto, @rearPhoto, @leftPhoto, @rightPhoto, @dashboardPhoto,
      @frontTyrePhoto, @rearTyrePhoto, @existingDamage, @walkaroundVideoRecorded,
      @customerConfirmed, @ownerConfirmed, @inspectedAt
    )
  `);

  const initialInspections = [
    {
      id: 'insp-VRB9022-pre',
      bookingId: 'VRB-9022',
      type: 'pre',
      vehicleId: 'veh-2',
      vehicleName: 'Royal Enfield Classic 350',
      odometer: 8400,
      fuelLevel: 85,
      frontPhoto: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
      rearPhoto: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=600&q=80',
      leftPhoto: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      rightPhoto: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
      dashboardPhoto: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      frontTyrePhoto: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=600&q=80',
      rearTyrePhoto: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=600&q=80',
      existingDamage: 'Minor hairline scratch near silencer heat guard.',
      walkaroundVideoRecorded: 1,
      customerConfirmed: 1,
      ownerConfirmed: 1,
      inspectedAt: '2026-09-11 09:30 AM'
    },
    {
      id: 'insp-VRB9023-pre',
      bookingId: 'VRB-9023',
      type: 'pre',
      vehicleId: 'veh-4',
      vehicleName: 'Ather 450X EV',
      odometer: 5120,
      fuelLevel: 100,
      frontPhoto: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      rearPhoto: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=600&q=80',
      leftPhoto: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      rightPhoto: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
      dashboardPhoto: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      frontTyrePhoto: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=600&q=80',
      rearTyrePhoto: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=600&q=80',
      existingDamage: 'No visible scratches.',
      walkaroundVideoRecorded: 1,
      customerConfirmed: 1,
      ownerConfirmed: 1,
      inspectedAt: '2026-09-08 10:00 AM'
    },
    {
      id: 'insp-VRB9023-post',
      bookingId: 'VRB-9023',
      type: 'post',
      vehicleId: 'veh-4',
      vehicleName: 'Ather 450X EV',
      odometer: 5240,
      fuelLevel: 45,
      frontPhoto: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      rearPhoto: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=600&q=80',
      leftPhoto: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      rightPhoto: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
      dashboardPhoto: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      frontTyrePhoto: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=600&q=80',
      rearTyrePhoto: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=600&q=80',
      existingDamage: 'Vehicle returned in clean condition without new damages.',
      walkaroundVideoRecorded: 1,
      customerConfirmed: 1,
      ownerConfirmed: 1,
      inspectedAt: '2026-09-10 05:30 PM'
    },
    {
      id: 'insp-VRB9024-pre',
      bookingId: 'VRB-9024',
      type: 'pre',
      vehicleId: 'veh-2',
      vehicleName: 'Royal Enfield Hunter 350',
      odometer: 6100,
      fuelLevel: 90,
      frontPhoto: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
      rearPhoto: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=600&q=80',
      leftPhoto: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      rightPhoto: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
      dashboardPhoto: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      frontTyrePhoto: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=600&q=80',
      rearTyrePhoto: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=600&q=80',
      existingDamage: 'Pristine condition.',
      walkaroundVideoRecorded: 1,
      customerConfirmed: 1,
      ownerConfirmed: 1,
      inspectedAt: '2026-09-09 09:30 AM'
    },
    {
      id: 'insp-VRB9024-post',
      bookingId: 'VRB-9024',
      type: 'post',
      vehicleId: 'veh-2',
      vehicleName: 'Royal Enfield Hunter 350',
      odometer: 6280,
      fuelLevel: 25,
      frontPhoto: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
      rearPhoto: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=600&q=80',
      leftPhoto: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      rightPhoto: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
      dashboardPhoto: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      frontTyrePhoto: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=600&q=80',
      rearTyrePhoto: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=600&q=80',
      existingDamage: 'Fresh scuff mark on left leg guard & low fuel return.',
      walkaroundVideoRecorded: 1,
      customerConfirmed: 0,
      ownerConfirmed: 1,
      inspectedAt: '2026-09-11 02:00 PM'
    }
  ];

  for (const i of initialInspections) {
    insertInspection.run(i);
  }

  // Seed Disputes
  const insertDispute = db.prepare(`
    INSERT INTO disputes (id, bookingId, customerName, ownerName, vehicleName, issue, notes, evidence, status, outcome, createdAt)
    VALUES (@id, @bookingId, @customerName, @ownerName, @vehicleName, @issue, @notes, @evidence, @status, @outcome, @createdAt)
  `);

  const initialDisputes = [
    {
      id: 'DISP-101',
      bookingId: 'VRB-9024',
      customerName: 'Rajesh Kumar',
      ownerName: 'Vikram Singh Jadon',
      vehicleName: 'Royal Enfield Hunter 350',
      issue: 'Scratch on leg guard & low fuel return during post-rental inspection.',
      notes: JSON.stringify([
        { sender: 'System Admin', time: '2026-09-11 02:15 PM', text: 'Dispute registered automatically following post-rental inspection disparity.' },
        { sender: 'Owner', time: '2026-09-11 02:45 PM', text: 'Leg guard was scratch-free at handover. Requesting ₹600 repair charge.' },
        { sender: 'Customer', time: '2026-09-11 03:20 PM', text: 'Scuff mark was present when bike was parked at ISKCON parking.' }
      ]),
      evidence: JSON.stringify(['https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80']),
      status: 'Open',
      outcome: '',
      createdAt: '2026-09-11 02:15 PM'
    }
  ];

  for (const d of initialDisputes) {
    insertDispute.run(d);
  }

  // Seed Admin Settings
  db.prepare(`
    INSERT OR REPLACE INTO admin_settings (
      id, platformCommission, minRentalDuration, whatsAppNumber, supportContact,
      protectionInfo, rentalRules, cancellationRules
    ) VALUES (
      1, 15, '1 Day', '+919837144520', 'support@vrindavanrides.in',
      'Sacred Yatra Shield protection covers 3rd-party liability & accidental damage subject to verified handover audit.',
      '1. Valid Driving Licence required for motorized vehicles.\n2. Helmets mandatory for both rider & pillion.\n3. No honking near Prem Mandir & Nidhivan silence zones.\n4. Max Speed: 40 km/h inside temple galis.',
      '1. Free cancellation up to 6 hours before pickup.\n2. 50% refund for cancellations within 6 hours of pickup.\n3. Non-refundable once trip starts.'
    )
  `).run();

  // Seed Legal Config
  db.prepare(`
    INSERT OR REPLACE INTO legal_config (
      id, protectionTitle, protectionDisclaimer, legalPolicyNote, citiesAvailable, supportWhatsApp
    ) VALUES (
      1,
      '🪶 Radhe Protection Plan (Sacred Yatra Shield)',
      'Peer-to-peer vehicle sharing protection covers third-party liability and accidental damage subject to verified handover inspection. This is not a substitute for standard motor insurance.',
      'IMPORTANT LEGAL NOTICE: Regulatory guidelines for peer-to-peer motor vehicle sharing operate under owner authorization & verified documents (RC, Commercial/Self-drive permit where applicable). Vrindavan Rides acts as a platform connecting local owners and pilgrims.',
      '["Vrindavan", "Mathura"]',
      '+919876543210'
    )
  `).run();

  console.log('Database seeded successfully with Vrindavan fleet & bookings!');
}
