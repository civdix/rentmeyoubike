import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.xgehhlmkhzekhakmcrcg:yMrQPO15lJOd1TfY@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

export const createTablesSql = `
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
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS inspections (
    id TEXT PRIMARY KEY,
    bookingId TEXT NOT NULL,
    type TEXT NOT NULL,
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
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_booking_type UNIQUE(bookingId, type)
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
    registeredDate TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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
    joinedDate TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS disputes (
    id TEXT PRIMARY KEY,
    bookingId TEXT NOT NULL,
    customerName TEXT,
    ownerName TEXT,
    vehicleName TEXT,
    issue TEXT NOT NULL,
    notes TEXT,
    evidence TEXT,
    status TEXT DEFAULT 'Open',
    outcome TEXT DEFAULT '',
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    platformCommission REAL DEFAULT 15,
    minRentalDuration TEXT DEFAULT '1 Day',
    whatsAppNumber TEXT DEFAULT '+919720965985',
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
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS email_verifications (
    email TEXT PRIMARY KEY,
    otp TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    expiresAt BIGINT NOT NULL,
    verified INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMPTZ
  );

  -- Insert single default admin_settings and legal_config rows if not exist (No mock data)
  INSERT INTO admin_settings (id, platformCommission, minRentalDuration, whatsAppNumber, supportContact, protectionInfo, rentalRules, cancellationRules)
  VALUES (
    1, 15, '1 Day', '+919720965985', 'support@vrindavanrides.in',
    'Sacred Yatra Shield protection covers 3rd-party liability & accidental damage subject to verified handover audit.',
    '1. Valid Driving Licence required for motorized vehicles.\n2. Helmets mandatory for both rider & pillion.\n3. No honking near Prem Mandir & Nidhivan silence zones.\n4. Max Speed: 40 km/h inside temple galis.',
    '1. Free cancellation up to 6 hours before pickup.\n2. 50% refund for cancellations within 6 hours of pickup.\n3. Non-refundable once trip starts.'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO legal_config (id, protectionTitle, protectionDisclaimer, legalPolicyNote, citiesAvailable, supportWhatsApp)
  VALUES (
    1,
    '🪶 Radhe Protection Plan (Sacred Yatra Shield)',
    'Peer-to-peer vehicle sharing protection covers third-party liability and accidental damage subject to verified handover inspection. This is not a substitute for standard motor insurance.',
    'IMPORTANT LEGAL NOTICE: Regulatory guidelines for peer-to-peer motor vehicle sharing operate under owner authorization & verified documents (RC, Commercial/Self-drive permit where applicable). Vrindavan Rides acts as a platform connecting local owners and pilgrims.',
    '["Vrindavan", "Mathura"]',
    '+919720965985'
  )
  ON CONFLICT (id) DO NOTHING;
`;

async function main() {
  console.log('🔄 Initializing Supabase PostgreSQL schema...');
  const client = await pool.connect();
  try {
    await client.query(createTablesSql);
    console.log('✅ All tables successfully created on Supabase PostgreSQL!');

    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('📋 Public tables in Supabase:', res.rows.map(r => r.table_name));
  } catch (err) {
    console.error('❌ Schema initialization error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
