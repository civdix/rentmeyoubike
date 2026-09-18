import pg from 'pg';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const dbPath = path.join(__dirname, 'vrindavan.db');

// Resolve database URL (automatically routes Supabase direct IPv6 hosts to IPv4 pooler to prevent ENETUNREACH on Render/cloud containers)
export function resolveDatabaseUrl(rawUrl) {
  if (!rawUrl) return rawUrl;
  try {
    const parsed = new URL(rawUrl);
    // Supabase direct host db.<project-ref>.supabase.co only has IPv6 (AAAA) DNS records.
    // Cloud environments like Render lack outbound IPv6 routing and throw ENETUNREACH.
    // We rewrite it to the official Supabase IPv4 Supavisor connection pooler.
    const directMatch = parsed.hostname.match(/^db\.([a-z0-9]+)\.supabase\.co$/i);
    if (directMatch) {
      const projectRef = directMatch[1];
      const baseUser = parsed.username || 'postgres';
      const poolerUser = baseUser.includes('.') ? baseUser : `${baseUser}.${projectRef}`;
      const password = parsed.password;
      const port = '6543'; // Transaction pooler on IPv4
      const poolerHost = 'aws-0-ap-south-1.pooler.supabase.com';
      const dbName = parsed.pathname || '/postgres';
      console.log(`ℹ️ [Database] Auto-resolving Supabase direct IPv6 host '${parsed.hostname}' to IPv4 pooler '${poolerHost}:${port}'`);
      return `postgresql://${encodeURIComponent(poolerUser)}:${encodeURIComponent(password)}@${poolerHost}:${port}${dbName}`;
    }
  } catch (err) {
    // If URL parsing fails, return rawUrl
  }
  return rawUrl;
}

// Check if PostgreSQL connection string is provided
const rawDbUrl = process.env.DATABASE_URL || 'postgresql://postgres.xgehhlmkhzekhakmcrcg:yMrQPO15lJOd1TfY@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';
export const DATABASE_URL = resolveDatabaseUrl(rawDbUrl);
export const isPostgres = Boolean(DATABASE_URL && DATABASE_URL.startsWith('postgres'));

let pgPool = null;
let sqliteDb = null;

if (isPostgres) {
  pgPool = new pg.Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
  });

  pgPool.on('error', (err) => {
    console.error('⚠️ Unexpected error on idle PostgreSQL client:', err.message);
  });
} else {
  sqliteDb = new Database(dbPath);
  sqliteDb.pragma('journal_mode = WAL');
  sqliteDb.pragma('foreign_keys = ON');
}

// Complete dictionary of all camelCase columns across all tables
const COLUMN_MAP = {
  // common
  createdat: 'createdAt',
  deletedat: 'deletedAt',

  // vehicles
  registrationnumber: 'registrationNumber',
  dailyrate: 'dailyRate',
  hourlyrate: 'hourlyRate',
  depositamount: 'depositAmount',
  locationarea: 'locationArea',
  pickupaddress: 'pickupAddress',
  ownerid: 'ownerId',
  ownername: 'ownerName',
  ownerphone: 'ownerPhone',
  owneremail: 'ownerEmail',
  ownercity: 'ownerCity',
  owneraddress: 'ownerAddress',
  ownerverified: 'ownerVerified',
  vehicleverified: 'vehicleVerified',
  documentsverified: 'documentsVerified',
  inspectioncompleted: 'inspectionCompleted',
  reviewscount: 'reviewsCount',
  fueltype: 'fuelType',
  isev: 'isEV',
  evrangekm: 'evRangeKm',
  chargingcostincluded: 'chargingCostIncluded',
  nearbychargingstations: 'nearbyChargingStations',
  sparebatteryavailable: 'spareBatteryAvailable',
  helmetincluded: 'helmetIncluded',
  helmetsprovided: 'helmetsProvided',
  rentalrules: 'rentalRules',
  verificationstatus: 'verificationStatus',

  // bookings
  vehicleid: 'vehicleId',
  vehiclename: 'vehicleName',
  customername: 'customerName',
  customerphone: 'customerPhone',
  customeremail: 'customerEmail',
  startdate: 'startDate',
  enddate: 'endDate',
  totaldays: 'totalDays',
  dailyprice: 'dailyPrice',
  totalamount: 'totalAmount',
  pickuplocation: 'pickupLocation',
  paymentstatus: 'paymentStatus',
  refundstatus: 'refundStatus',
  paymentid: 'paymentId',
  kycstatus: 'kycStatus',
  preinspectiondone: 'preInspectionDone',
  postinspectiondone: 'postInspectionDone',
  bikesaathiincluded: 'bikeSaathiIncluded',
  saathifee: 'saathiFee',

  // inspections
  bookingid: 'bookingId',
  fuellevel: 'fuelLevel',
  frontphoto: 'frontPhoto',
  rearphoto: 'rearPhoto',
  leftphoto: 'leftPhoto',
  rightphoto: 'rightPhoto',
  dashboardphoto: 'dashboardPhoto',
  fronttyrephoto: 'frontTyrePhoto',
  reartyrephoto: 'rearTyrePhoto',
  existingdamage: 'existingDamage',
  walkaroundvideorecorded: 'walkaroundVideoRecorded',
  customerconfirmed: 'customerConfirmed',
  ownerconfirmed: 'ownerConfirmed',
  inspectedat: 'inspectedAt',
  imagesettled: 'imagesSettled',
  imagesdeletedat: 'imagesDeletedAt',

  // customers
  emailverified: 'emailVerified',
  bookingscount: 'bookingsCount',
  registereddate: 'registeredDate',

  // owners
  upiid: 'upiId',
  vehiclescount: 'vehiclesCount',
  joineddate: 'joinedDate',

  // admin_settings
  platformcommission: 'platformCommission',
  minrentalduration: 'minRentalDuration',
  whatsappnumber: 'whatsAppNumber',
  supportcontact: 'supportContact',
  protectioninfo: 'protectionInfo',
  cancellationrules: 'cancellationRules',

  // legal_config
  protectiontitle: 'protectionTitle',
  protectiondisclaimer: 'protectionDisclaimer',
  legalpolicynote: 'legalPolicyNote',
  citiesavailable: 'citiesAvailable',
  supportwhatsapp: 'supportWhatsApp',

  // sessions
  userid: 'userId',
  userdata: 'userData',

  // email_verifications
  expiresat: 'expiresAt',

  // messages
  conversationid: 'conversationId',
  senderrole: 'senderRole',
  sendername: 'senderName',
  senderphone: 'senderPhone',
  receiverrole: 'receiverRole',
  customerphone: 'customerPhone',
  customername: 'customerName',
  isread: 'isRead',
  emailnotified: 'emailNotified',

  // uploaded_images
  fileid: 'fileId',
  thumbnailurl: 'thumbnailUrl'
};

export function normalizeRow(row) {
  if (!row || typeof row !== 'object') return row;
  const out = {};
  for (const [key, val] of Object.entries(row)) {
    const mapped = COLUMN_MAP[key.toLowerCase()] || key;
    out[mapped] = val;
  }
  return out;
}

function transformSqlForPostgres(rawSql, params) {
  let cleanSql = rawSql.trim();

  // Convert SQLite "INSERT OR REPLACE INTO table (cols) VALUES (vals)"
  const insertOrReplaceMatch = cleanSql.match(/^INSERT\s+OR\s+REPLACE\s+INTO\s+([a-zA-Z0-9_]+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
  if (insertOrReplaceMatch) {
    const table = insertOrReplaceMatch[1].toLowerCase();
    const columns = insertOrReplaceMatch[2].split(',').map(c => c.trim());
    const values = insertOrReplaceMatch[3];

    let conflictTarget = 'id';
    if (table === 'sessions') conflictTarget = 'token';
    else if (table === 'email_verifications') conflictTarget = 'email';
    else if (table === 'inspections') conflictTarget = 'bookingId, type';
    else if (table === 'admin_settings' || table === 'legal_config') conflictTarget = 'id';

    const updateCols = columns.filter(c => !conflictTarget.toLowerCase().includes(c.toLowerCase()));
    const updateClause = updateCols.map(c => `${c} = EXCLUDED.${c}`).join(', ');

    cleanSql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values}) ON CONFLICT (${conflictTarget}) DO UPDATE SET ${updateClause}`;
  }

  let values = [];
  let paramIndex = 1;

  if (params && typeof params === 'object' && !Array.isArray(params)) {
    const newSql = cleanSql.replace(/@([a-zA-Z0-9_]+)/g, (match, paramName) => {
      values.push(params[paramName]);
      return `$${paramIndex++}`;
    });
    return { sql: newSql, values };
  }

  values = Array.isArray(params) ? params : (params !== undefined ? [params] : []);
  const newSql = cleanSql.replace(/\?/g, () => `$${paramIndex++}`);
  return { sql: newSql, values };
}

function extractParams(args) {
  if (args.length === 0) return undefined;
  if (args.length === 1) return args[0];
  return args;
}

// Unified Database Client Interface
export const db = {
  prepare(sql) {
    if (isPostgres) {
      return {
        async all(...args) {
          const params = extractParams(args);
          const { sql: psql, values } = transformSqlForPostgres(sql, params);
          const res = await pgPool.query(psql, values);
          return res.rows.map(normalizeRow);
        },
        async get(...args) {
          const params = extractParams(args);
          const { sql: psql, values } = transformSqlForPostgres(sql, params);
          const res = await pgPool.query(psql, values);
          return res.rows.length > 0 ? normalizeRow(res.rows[0]) : null;
        },
        async run(...args) {
          const params = extractParams(args);
          const { sql: psql, values } = transformSqlForPostgres(sql, params);
          const res = await pgPool.query(psql, values);
          return { changes: res.rowCount, lastInsertRowid: null };
        }
      };
    } else {
      const stmt = sqliteDb.prepare(sql);
      return {
        async all(...args) {
          const params = extractParams(args);
          const res = params !== undefined ? stmt.all(params) : stmt.all();
          return Promise.resolve(res);
        },
        async get(...args) {
          const params = extractParams(args);
          const res = params !== undefined ? stmt.get(params) : stmt.get();
          return Promise.resolve(res || null);
        },
        async run(...args) {
          const params = extractParams(args);
          const res = params !== undefined ? stmt.run(params) : stmt.run();
          return Promise.resolve(res);
        }
      };
    }
  },

  async query(sql, params) {
    if (isPostgres) {
      const { sql: psql, values } = transformSqlForPostgres(sql, params);
      const res = await pgPool.query(psql, values);
      return res.rows.map(normalizeRow);
    } else {
      const stmt = sqliteDb.prepare(sql);
      const res = params !== undefined ? stmt.all(params) : stmt.all();
      return res;
    }
  },

  async exec(sql) {
    if (isPostgres) {
      return pgPool.query(sql);
    } else {
      return sqliteDb.exec(sql);
    }
  },

  pragma(cmd) {
    if (!isPostgres && sqliteDb) {
      try { return sqliteDb.pragma(cmd); } catch (e) {}
    }
    return null;
  }
};

export async function initDatabase() {
  if (isPostgres) {
    console.log('🌸 Connecting to External PostgreSQL Server (Supabase)...');
    try {
      // Test connection
      const check = await pgPool.query('SELECT NOW() as now;');
      console.log(`✅ Supabase PostgreSQL connected successfully at ${check.rows[0].now}`);

      // Ensure base tables exist
      await pgPool.query(`
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
          upiId TEXT DEFAULT '',
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

        ALTER TABLE owners ADD COLUMN IF NOT EXISTS upiId TEXT DEFAULT '';

        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          bookingId TEXT,
          conversationId TEXT NOT NULL,
          senderRole TEXT NOT NULL,
          senderName TEXT NOT NULL,
          senderPhone TEXT,
          receiverRole TEXT NOT NULL,
          customerPhone TEXT,
          customerName TEXT,
          text TEXT NOT NULL,
          isRead INTEGER DEFAULT 0,
          emailNotified INTEGER DEFAULT 0,
          createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        ALTER TABLE messages ADD COLUMN IF NOT EXISTS emailNotified INTEGER DEFAULT 0;

        CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversationId);
        CREATE INDEX IF NOT EXISTS idx_messages_booking ON messages(bookingId);
      `);
      console.log('✅ Supabase PostgreSQL tables verified ready. No mock data seeded.');
    } catch (pgInitErr) {
      console.error('❌ Failed to initialize Supabase PostgreSQL:', pgInitErr.message);
    }
  } else {
    // SQLite Fallback
    console.log('ℹ️ Running in local SQLite mode (vrindavan.db)');
    try {
      sqliteDb.prepare("ALTER TABLE owners ADD COLUMN upiId TEXT DEFAULT ''").run();
      try {
        sqliteDb.prepare("ALTER TABLE messages ADD COLUMN emailNotified INTEGER DEFAULT 0").run();
      } catch (e) {}
      sqliteDb.exec(`
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          bookingId TEXT,
          conversationId TEXT NOT NULL,
          senderRole TEXT NOT NULL,
          senderName TEXT NOT NULL,
          senderPhone TEXT,
          receiverRole TEXT NOT NULL,
          customerPhone TEXT,
          customerName TEXT,
          text TEXT NOT NULL,
          isRead INTEGER DEFAULT 0,
          emailNotified INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversationId);
        CREATE INDEX IF NOT EXISTS idx_messages_booking ON messages(bookingId);
      `);
    } catch (e) {}
  }
}

// No-op for seedInitialData when using clean external database
export function seedInitialData() {
  if (isPostgres) {
    console.log('ℹ️ External database mode: seedInitialData skipped to maintain clean database.');
    return;
  }
}

export default { db, initDatabase, seedInitialData, dbPath, isPostgres };
