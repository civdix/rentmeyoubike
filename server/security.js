import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const BCRYPT_SALT_ROUNDS = 12;

/**
 * Hashes a plaintext password using bcrypt with 12 salt rounds.
 * Enforces length constraints to prevent memory exhaustion / DoS attacks.
 */
export async function hashPassword(plainPassword) {
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Password must be a non-empty string.');
  }

  const clean = plainPassword.trim();
  if (clean.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }
  if (clean.length > 128) {
    throw new Error('Password exceeds maximum allowed length of 128 characters.');
  }

  return await bcrypt.hash(clean, BCRYPT_SALT_ROUNDS);
}

/**
 * Verifies a plaintext password against a stored hash or legacy plaintext password.
 * Returns { match: boolean, needsRehash: boolean }
 * If matched against a legacy plain-text password, needsRehash is true so the
 * caller can seamlessly upgrade the stored hash to bcrypt without disrupting the user.
 */
export async function verifyPassword(plainPassword, storedPasswordOrHash) {
  if (!plainPassword || !storedPasswordOrHash || typeof plainPassword !== 'string') {
    return { match: false, needsRehash: false };
  }

  const clean = plainPassword.trim();
  const stored = String(storedPasswordOrHash).trim();

  // Check if stored value matches standard bcrypt hash pattern ($2a$, $2b$, or $2y$)
  const isBcryptHash = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(stored);

  if (isBcryptHash) {
    try {
      const match = await bcrypt.compare(clean, stored);
      return { match, needsRehash: false };
    } catch (err) {
      console.error('Bcrypt comparison error:', err.message);
      return { match: false, needsRehash: false };
    }
  }

  // Legacy plaintext fallback: use constant-time buffer comparison to prevent timing leaks
  const bufPlain = Buffer.from(clean);
  const bufStored = Buffer.from(stored);

  let match = false;
  if (bufPlain.length === bufStored.length) {
    match = crypto.timingSafeEqual(bufPlain, bufStored);
  } else {
    // Perform dummy timing-safe compare to avoid timing differences on length mismatch
    crypto.timingSafeEqual(bufPlain, bufPlain);
  }

  return { match, needsRehash: match };
}

/**
 * Constant-time string comparison to prevent side-channel timing attacks.
 * Ideal for comparing admin PINs, secret keys, or authentication tokens.
 */
export function timingSafeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;

  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Generates a cryptographically strong, unguessable random session token.
 * Replaces insecure Math.random() with Node.js crypto.randomBytes.
 */
export function generateSecureToken(prefix = 'vr_usr') {
  const randomHex = crypto.randomBytes(24).toString('hex');
  return `${prefix}_${Date.now()}_${randomHex}`;
}

/**
 * Strips sensitive/critical security fields (passwords, PINs, OTPs, internal attempts)
 * from user or customer objects before sending them in API responses or saving to sessions.
 */
export function sanitizeUser(user) {
  if (!user || typeof user !== 'object') return null;

  const {
    password,
    pin,
    otp,
    attempts,
    expiresAt,
    ...safeUser
  } = user;

  return safeUser;
}

/**
 * Validates password strength according to standard security guidelines.
 * Returns { valid: boolean, error?: string }
 */
export function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required.' };
  }

  const clean = password.trim();

  if (clean.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long.' };
  }

  if (clean.length > 128) {
    return { valid: false, error: 'Password cannot exceed 128 characters.' };
  }

  return { valid: true };
}

/**
 * Migrates existing legacy plaintext passwords in SQLite or PostgreSQL
 * to modern bcrypt hashes upon server startup.
 */
export async function migrateLegacyPlaintextPasswords(db) {
  try {
    // 1. Check and upgrade customers
    const customers = await db.prepare('SELECT id, password FROM customers WHERE password IS NOT NULL').all();
    let migratedCustCount = 0;

    for (const cust of (customers || [])) {
      if (cust.password && !/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(cust.password)) {
        const hashed = await hashPassword(cust.password);
        await db.prepare('UPDATE customers SET password = ? WHERE id = ?').run(hashed, cust.id);
        migratedCustCount++;
      }
    }

    // 2. Check and upgrade owners
    const owners = await db.prepare('SELECT id, password FROM owners WHERE password IS NOT NULL').all();
    let migratedOwnerCount = 0;

    for (const own of (owners || [])) {
      if (own.password && !/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(own.password)) {
        const hashed = await hashPassword(own.password);
        await db.prepare('UPDATE owners SET password = ? WHERE id = ?').run(hashed, own.id);
        migratedOwnerCount++;
      }
    }

    if (migratedCustCount > 0 || migratedOwnerCount > 0) {
      console.log(`🔒 [Security] Auto-migrated plaintext passwords to bcrypt: ${migratedCustCount} customer(s), ${migratedOwnerCount} owner(s).`);
    }
  } catch (err) {
    console.warn('⚠️ [Security] Notice during legacy password migration:', err.message);
  }
}
