import express from 'express';
import crypto from 'crypto';
import { db } from '../db.js';
import { ADMIN_PIN, validAdminTokens, activeSessions } from '../middleware/rbac.js';
import { isValidEmail, normalizeEmail, sendEmailOtp } from '../email.js';
import {
  hashPassword,
  verifyPassword,
  timingSafeCompare,
  generateSecureToken,
  sanitizeUser,
  validatePasswordStrength
} from '../security.js';
import {
  loginAccountLimiter,
  loginIpLimiter,
  registerLimiter,
  adminAuthLimiter,
  otpSendLimiter,
  otpVerifyLimiter,
  checkEmailLimiter
} from '../middleware/rateLimit.js';

const router = express.Router();

function maskPhone(phone) {
  if (!phone) return '';
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length <= 4) return phone;
  return `+91 ${digits.slice(0, 2)}****${digits.slice(-4)}`;
}

// POST /api/auth/check-email - Enforce format validation, rate limiting, and distinguish emails
router.post('/check-email', checkEmailLimiter, async (req, res) => {
  try {
    const { email, role = 'customer' } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email address is required' });
    }

    if (email.length > 254 || !isValidEmail(email)) {
      return res.status(400).json({
        valid: false,
        error: 'Invalid email format. Please enter a valid email address (e.g. name@domain.com).'
      });
    }

    const normalized = normalizeEmail(email);

    const existingCust = await db.prepare('SELECT id, name, phone, email, emailVerified FROM customers WHERE LOWER(email) = ?').get(normalized);
    const existingOwner = await db.prepare('SELECT id, name, phone, email, emailVerified FROM owners WHERE LOWER(email) = ?').get(normalized);
    const existingUser = existingCust || existingOwner;

    const verificationRecord = await db.prepare('SELECT verified FROM email_verifications WHERE email = ?').get(normalized);
    const isEmailVerified = Boolean(verificationRecord?.verified || existingUser?.emailVerified);

    let status = 'available';
    let message = 'Email is valid and ready to be registered.';
    let existingAccount = null;

    if (existingUser) {
      status = 'registered';
      message = 'An account is already registered with this email.';
      existingAccount = {
        name: existingUser.name,
        phoneMasked: maskPhone(existingUser.phone),
        maskedPhone: maskPhone(existingUser.phone),
        emailVerified: Boolean(existingUser.emailVerified)
      };
    }

    return res.json({
      valid: true,
      email: normalized,
      status,
      message,
      isEmailVerified,
      existingAccount
    });
  } catch (error) {
    console.error('Error in /check-email:', error);
    res.status(500).json({ error: 'Failed to validate email address' });
  }
});

// POST /api/auth/send-email-otp - Send cryptographically secure 6-digit verification code
router.post('/send-email-otp', otpSendLimiter, async (req, res) => {
  try {
    const { email, role = 'customer' } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email address is required' });
    }

    if (email.length > 254 || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const normalized = normalizeEmail(email);

    // Rate limiting cooldown: 60s between OTP requests for the same email
    const recent = await db.prepare('SELECT expiresAt FROM email_verifications WHERE email = ?').get(normalized);
    if (recent) {
      const timeSinceCreation = 10 * 60 * 1000 - (recent.expiresAt - Date.now());
      if (timeSinceCreation < 60 * 1000 && timeSinceCreation > 0) {
        const waitSeconds = Math.ceil((60 * 1000 - timeSinceCreation) / 1000);
        return res.status(429).json({
          error: `Please wait ${waitSeconds}s before requesting another verification code.`
        });
      }
    }

    // Generate cryptographically secure 6-digit numeric OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    await db.prepare(`
      INSERT OR REPLACE INTO email_verifications (email, otp, role, expiresAt, verified, attempts, createdAt)
      VALUES (?, ?, ?, ?, 0, 0, CURRENT_TIMESTAMP)
    `).run(normalized, otp, role, expiresAt);

    // Dispatch email
    await sendEmailOtp(normalized, otp, role);

    return res.json({
      success: true,
      message: `Verification code sent to ${normalized}. Please check your email inbox.`,
      email: normalized,
      expiresInMinutes: 10
    });
  } catch (error) {
    console.error('Error during send-email-otp:', error);
    return res.status(500).json({ error: 'Failed to generate verification OTP. Please try again.' });
  }
});

// POST /api/auth/verify-email-otp - Verify user email address with OTP
router.post('/verify-email-otp', otpVerifyLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email address and OTP code are required' });
    }

    const normalized = normalizeEmail(String(email).trim());
    const cleanOtp = String(otp).trim();

    const record = await db.prepare('SELECT * FROM email_verifications WHERE email = ?').get(normalized);
    if (!record) {
      return res.status(404).json({ error: 'No active verification code found for this email. Please request a new OTP.' });
    }

    if (Date.now() > record.expiresAt) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new OTP.' });
    }

    if (record.attempts >= 5) {
      return res.status(429).json({ error: 'Too many incorrect attempts. Please request a new code.' });
    }

    // Timing-safe OTP comparison
    const isOtpValid = timingSafeCompare(record.otp, cleanOtp);

    if (!isOtpValid) {
      await db.prepare('UPDATE email_verifications SET attempts = attempts + 1 WHERE email = ?').run(normalized);
      const remaining = Math.max(0, 5 - (record.attempts + 1));
      return res.status(400).json({
        error: `Incorrect OTP code. ${remaining} attempt(s) remaining.`
      });
    }

    // Mark verified
    await db.prepare('UPDATE email_verifications SET verified = 1 WHERE email = ?').run(normalized);

    // Synchronize verified status with existing customer or owner records
    await db.prepare('UPDATE customers SET emailVerified = 1 WHERE LOWER(email) = ?').run(normalized);
    await db.prepare('UPDATE owners SET emailVerified = 1 WHERE LOWER(email) = ?').run(normalized);

    return res.json({
      success: true,
      verified: true,
      message: 'Email address verified successfully!',
      email: normalized
    });
  } catch (error) {
    console.error('Error verifying email OTP:', error);
    res.status(500).json({ error: 'Failed to verify email OTP' });
  }
});

// POST /api/auth/login - Unified Login with Rate Limiting and Hashed Password Verification
router.post('/login', loginIpLimiter, loginAccountLimiter, async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
      return res.status(400).json({ error: 'Email or Mobile Phone Number is required.' });
    }

    if (!password || typeof password !== 'string' || !password.trim()) {
      return res.status(400).json({ error: 'Password is required.' });
    }

    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();

    if (cleanPassword.length > 128) {
      return res.status(400).json({ error: 'Password exceeds maximum length.' });
    }

    // 1. Admin Authorization check (Timing-safe comparison against ADMIN_PIN)
    const isAdminIdentifier = ['admin', 'admin@rentoncent.bond', 'admin@rentoncent.com', 'admin@vrindavanrides.in', 'administrator'].includes(cleanIdentifier.toLowerCase());
    const isAdminPass = timingSafeCompare(cleanPassword, ADMIN_PIN);

    if ((isAdminIdentifier && isAdminPass) || (role === 'admin' && isAdminPass)) {
      const token = generateSecureToken('vr_admin');
      validAdminTokens.add(token);
      const adminUser = { id: 'admin-1', name: 'Platform Administrator', role: 'admin' };
      activeSessions.set(token, { role: 'admin', user: adminUser });
      try {
        await db.prepare('INSERT OR REPLACE INTO sessions (token, role, userId, userData) VALUES (?, ?, ?, ?)').run(
          token, 'admin', adminUser.id, JSON.stringify(adminUser)
        );
      } catch (e) {}
      return res.json({
        success: true,
        message: 'Admin authorization successful',
        token,
        role: 'admin',
        user: adminUser
      });
    }

    // 2. Unified User Search across customers and owners
    const digits = cleanIdentifier.replace(/[^0-9]/g, '');
    let user = null;

    if (cleanIdentifier.includes('@')) {
      user = await db.prepare('SELECT * FROM customers WHERE LOWER(email) = ?').get(normalizeEmail(cleanIdentifier));
      if (!user) {
        user = await db.prepare('SELECT * FROM owners WHERE LOWER(email) = ?').get(normalizeEmail(cleanIdentifier));
      }
    } else if (digits.length >= 10) {
      user = await db.prepare(`
        SELECT * FROM customers 
        WHERE REPLACE(REPLACE(phone, ' ', ''), '-', '') = ? 
           OR REPLACE(REPLACE(phone, ' ', ''), '-', '') LIKE ?
      `).get(digits, `%${digits.slice(-10)}`);
      if (!user) {
        user = await db.prepare(`
          SELECT * FROM owners 
          WHERE REPLACE(REPLACE(phone, ' ', ''), '-', '') = ? 
             OR REPLACE(REPLACE(phone, ' ', ''), '-', '') LIKE ?
        `).get(digits, `%${digits.slice(-10)}`);
      }
    } else {
      user = await db.prepare('SELECT * FROM customers WHERE LOWER(email) = ? OR phone = ?').get(cleanIdentifier.toLowerCase(), cleanIdentifier);
      if (!user) {
        user = await db.prepare('SELECT * FROM owners WHERE LOWER(email) = ? OR phone = ?').get(cleanIdentifier.toLowerCase(), cleanIdentifier);
      }
    }

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials. Please check your email/phone and password, or switch to Sign Up.'
      });
    }

    // 3. Password Verification & Seamless Hash Migration
    let passwordHashToStore = user.password;

    if (!user.password) {
      // Legacy account without password set: hash current entered password and save
      const newHashedPassword = await hashPassword(cleanPassword);
      passwordHashToStore = newHashedPassword;
      try {
        await db.prepare('UPDATE customers SET password = ? WHERE id = ?').run(newHashedPassword, user.id);
        await db.prepare('UPDATE owners SET password = ? WHERE id = ?').run(newHashedPassword, user.id);
      } catch (e) {}
    } else {
      const { match, needsRehash } = await verifyPassword(cleanPassword, user.password);
      if (!match) {
        return res.status(401).json({ error: 'Incorrect password. Please check and try again.' });
      }
      if (needsRehash) {
        // Upgrade legacy plaintext password to modern bcrypt hash
        try {
          const upgradedHash = await hashPassword(cleanPassword);
          passwordHashToStore = upgradedHash;
          await db.prepare('UPDATE customers SET password = ? WHERE id = ?').run(upgradedHash, user.id);
          await db.prepare('UPDATE owners SET password = ? WHERE id = ?').run(upgradedHash, user.id);
        } catch (e) {}
      }
    }

    // 4. Ensure synchronized host & renter profile exists (Store only hashed password!)
    try {
      const ownerExists = await db.prepare('SELECT id FROM owners WHERE id = ? OR LOWER(email) = ?').get(user.id, user.email ? normalizeEmail(user.email) : '');
      if (!ownerExists) {
        await db.prepare(`
          INSERT INTO owners (id, name, phone, email, password, emailVerified, verificationStatus, vehiclesCount, earnings, status)
          VALUES (?, ?, ?, ?, ?, ?, 'Approved', 0, 0, 'active')
        `).run(user.id, user.name, user.phone, user.email, passwordHashToStore, user.emailVerified ? 1 : 0);
      }
      const custExists = await db.prepare('SELECT id FROM customers WHERE id = ? OR LOWER(email) = ?').get(user.id, user.email ? normalizeEmail(user.email) : '');
      if (!custExists) {
        await db.prepare(`
          INSERT INTO customers (id, name, phone, email, password, emailVerified, kycStatus, bookingsCount, status)
          VALUES (?, ?, ?, ?, ?, ?, 'Verified', 0, 'active')
        `).run(user.id, user.name, user.phone, user.email, passwordHashToStore, user.emailVerified ? 1 : 0);
      }
    } catch (e) {}

    // 5. Generate secure session token and sanitize user data (never send or save password!)
    const token = generateSecureToken('vr_usr');
    const userData = sanitizeUser({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      emailVerified: Boolean(user.emailVerified),
      kycStatus: user.kycStatus || 'Verified',
      role: 'user',
      isHost: true
    });

    activeSessions.set(token, { role: 'user', user: userData });
    try {
      await db.prepare('INSERT OR REPLACE INTO sessions (token, role, userId, userData) VALUES (?, ?, ?, ?)').run(
        token, 'user', userData.id, JSON.stringify(userData)
      );
    } catch (e) {}

    return res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      role: 'customer',
      user: userData
    });
  } catch (error) {
    console.error('Error during /api/auth/login:', error);
    res.status(500).json({ error: 'Authentication service failed. Please try again.' });
  }
});

// POST /api/auth/register - Unified Onboarding with Rate Limiting, Password Hashing & Sanitization
router.post('/register', registerLimiter, async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return res.status(400).json({ error: 'Mobile phone number is required.' });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    if (email.length > 254 || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address (e.g. name@domain.com).' });
    }

    // Password strength check
    const passValidation = validatePasswordStrength(password);
    if (!passValidation.valid) {
      return res.status(400).json({ error: passValidation.error });
    }

    const cleanName = name.trim().slice(0, 100);
    const cleanPhone = phone.trim().slice(0, 20);
    const normalizedEmail = normalizeEmail(email);
    const cleanPassword = password.trim();
    const digits = cleanPhone.replace(/[^0-9]/g, '');

    if (digits.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile phone number.' });
    }

    // Check if email OTP was verified
    const verRecord = await db.prepare('SELECT verified FROM email_verifications WHERE email = ?').get(normalizedEmail);
    const emailVerified = verRecord?.verified ? 1 : 0;

    // Check existing customer or owner
    const existingCust = await db.prepare(`
      SELECT id FROM customers 
      WHERE LOWER(email) = ? 
         OR REPLACE(REPLACE(phone, ' ', ''), '-', '') = ? 
         OR REPLACE(REPLACE(phone, ' ', ''), '-', '') LIKE ?
    `).get(normalizedEmail, digits, `%${digits.slice(-10)}`);

    const existingOwner = await db.prepare(`
      SELECT id FROM owners 
      WHERE LOWER(email) = ? 
         OR REPLACE(REPLACE(phone, ' ', ''), '-', '') = ? 
         OR REPLACE(REPLACE(phone, ' ', ''), '-', '') LIKE ?
    `).get(normalizedEmail, digits, `%${digits.slice(-10)}`);

    if (existingCust || existingOwner) {
      return res.status(409).json({
        error: 'An account with this email or phone number is already registered. Please switch to Log In.'
      });
    }

    // Hash password with bcrypt before storing
    const hashedPassword = await hashPassword(cleanPassword);
    const newId = `usr-${Date.now()}`;

    // Create unified records in both customers and owners tables with hashed password
    await db.prepare(`
      INSERT INTO customers (id, name, phone, email, password, emailVerified, kycStatus, bookingsCount, status, registeredDate)
      VALUES (?, ?, ?, ?, ?, ?, 'Pending', 0, 'active', CURRENT_TIMESTAMP)
    `).run(newId, cleanName, cleanPhone, normalizedEmail, hashedPassword, emailVerified);

    await db.prepare(`
      INSERT INTO owners (id, name, phone, email, password, emailVerified, verificationStatus, vehiclesCount, earnings, status, joinedDate)
      VALUES (?, ?, ?, ?, ?, ?, 'Approved', 0, 0, 'active', CURRENT_TIMESTAMP)
    `).run(newId, cleanName, cleanPhone, normalizedEmail, hashedPassword, emailVerified);

    const token = generateSecureToken('vr_usr');
    const userData = sanitizeUser({
      id: newId,
      name: cleanName,
      phone: cleanPhone,
      email: normalizedEmail,
      emailVerified: Boolean(emailVerified),
      kycStatus: 'Pending',
      role: 'user',
      isHost: true
    });

    activeSessions.set(token, { role: 'user', user: userData });
    try {
      await db.prepare('INSERT OR REPLACE INTO sessions (token, role, userId, userData) VALUES (?, ?, ?, ?)').run(
        token, 'user', userData.id, JSON.stringify(userData)
      );
    } catch (e) {}

    return res.status(201).json({
      success: true,
      message: 'Welcome! Your account has been created successfully.',
      token,
      role: 'customer',
      user: userData
    });
  } catch (error) {
    console.error('Error during /api/auth/register:', error);
    res.status(500).json({ error: 'Failed to create user account. Please try again.' });
  }
});

// POST /api/auth/customer-login - Login or register Renter / Customer by Phone
router.post('/customer-login', loginIpLimiter, async (req, res) => {
  try {
    const { phone, name, email } = req.body;

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return res.status(400).json({ error: 'Mobile phone number is required' });
    }

    const cleanPhone = phone.trim();
    let customer = await db.prepare('SELECT * FROM customers WHERE phone = ?').get(cleanPhone);

    const normalizedEmail = email ? normalizeEmail(email) : null;
    if (email && (email.length > 254 || !isValidEmail(email))) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    let isEmailVerified = 0;
    if (normalizedEmail) {
      const verRecord = await db.prepare('SELECT verified FROM email_verifications WHERE email = ?').get(normalizedEmail);
      if (verRecord?.verified) isEmailVerified = 1;
    }

    if (!customer) {
      const newId = `cust-${Date.now()}`;
      const customerName = name ? String(name).trim().slice(0, 100) : 'Vrindavan Yatri';
      const customerEmail = normalizedEmail || `${customerName.toLowerCase().replace(/\s+/g, '')}@example.com`;

      await db.prepare(`
        INSERT INTO customers (id, name, phone, email, emailVerified, kycStatus, bookingsCount, status, registeredDate)
        VALUES (?, ?, ?, ?, ?, 'Pending', 0, 'active', CURRENT_TIMESTAMP)
      `).run(newId, customerName, cleanPhone, customerEmail, isEmailVerified);

      customer = await db.prepare('SELECT * FROM customers WHERE id = ?').get(newId);
    } else if (normalizedEmail && (!customer.email || customer.email.includes('@example.com'))) {
      await db.prepare('UPDATE customers SET email = ?, emailVerified = ? WHERE id = ?').run(normalizedEmail, isEmailVerified, customer.id);
      customer = await db.prepare('SELECT * FROM customers WHERE id = ?').get(customer.id);
    }

    const token = generateSecureToken('vr_cust');
    const userData = sanitizeUser({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      emailVerified: Boolean(customer.emailVerified),
      kycStatus: customer.kycStatus,
      bookingsCount: customer.bookingsCount,
      role: 'customer'
    });

    activeSessions.set(token, { role: 'customer', user: userData });
    try {
      await db.prepare('INSERT OR REPLACE INTO sessions (token, role, userId, userData) VALUES (?, ?, ?, ?)').run(
        token, 'customer', userData.id, JSON.stringify(userData)
      );
    } catch (e) {}

    return res.json({
      success: true,
      message: 'Renter signed in successfully',
      token,
      role: 'customer',
      user: userData
    });
  } catch (error) {
    console.error('Error during customer login:', error);
    res.status(500).json({ error: 'Customer login failed' });
  }
});

// POST /api/auth/owner-login - Login or register Host / Fleet Owner by Phone
router.post('/owner-login', loginIpLimiter, async (req, res) => {
  try {
    const { phone, name, email } = req.body;

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return res.status(400).json({ error: 'Host mobile phone number is required' });
    }

    const cleanPhone = phone.trim();
    let owner = await db.prepare('SELECT * FROM owners WHERE phone = ?').get(cleanPhone);

    const normalizedEmail = email ? normalizeEmail(email) : null;
    if (email && (email.length > 254 || !isValidEmail(email))) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    let isEmailVerified = 0;
    if (normalizedEmail) {
      const verRecord = await db.prepare('SELECT verified FROM email_verifications WHERE email = ?').get(normalizedEmail);
      if (verRecord?.verified) isEmailVerified = 1;
    }

    if (!owner) {
      const newId = `own-${Date.now()}`;
      const ownerName = name ? String(name).trim().slice(0, 100) : 'Local Fleet Host';
      const ownerEmail = normalizedEmail || `${ownerName.toLowerCase().replace(/\s+/g, '')}@example.com`;

      await db.prepare(`
        INSERT INTO owners (id, name, phone, email, emailVerified, verificationStatus, vehiclesCount, earnings, status, joinedDate)
        VALUES (?, ?, ?, ?, ?, 'Verified', 0, 0, 'active', CURRENT_TIMESTAMP)
      `).run(newId, ownerName, cleanPhone, ownerEmail, isEmailVerified);

      owner = await db.prepare('SELECT * FROM owners WHERE id = ?').get(newId);
    } else if (normalizedEmail && (!owner.email || owner.email.includes('@example.com'))) {
      await db.prepare('UPDATE owners SET email = ?, emailVerified = ? WHERE id = ?').run(normalizedEmail, isEmailVerified, owner.id);
      owner = await db.prepare('SELECT * FROM owners WHERE id = ?').get(owner.id);
    }

    const token = generateSecureToken('vr_owner');
    const userData = sanitizeUser({
      id: owner.id,
      name: owner.name,
      phone: owner.phone,
      email: owner.email,
      emailVerified: Boolean(owner.emailVerified),
      verificationStatus: owner.verificationStatus,
      vehiclesCount: owner.vehiclesCount,
      earnings: owner.earnings,
      role: 'owner'
    });

    activeSessions.set(token, { role: 'owner', user: userData });
    try {
      await db.prepare('INSERT OR REPLACE INTO sessions (token, role, userId, userData) VALUES (?, ?, ?, ?)').run(
        token, 'owner', userData.id, JSON.stringify(userData)
      );
    } catch (e) {}

    return res.json({
      success: true,
      message: 'Fleet Host signed in successfully',
      token,
      role: 'owner',
      user: userData
    });
  } catch (error) {
    console.error('Error during owner login:', error);
    res.status(500).json({ error: 'Host login failed' });
  }
});

// POST /api/auth/admin-login - Verify PIN with Timing-Safe comparison and Rate Limiting
router.post('/admin-login', adminAuthLimiter, async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin || typeof pin !== 'string') {
      return res.status(400).json({ error: 'Admin PIN is required' });
    }

    const cleanPin = pin.trim();

    if (timingSafeCompare(cleanPin, ADMIN_PIN)) {
      const token = generateSecureToken('vr_admin');
      validAdminTokens.add(token);

      const adminUser = {
        id: 'admin-1',
        name: 'Platform Administrator',
        role: 'admin'
      };

      activeSessions.set(token, { role: 'admin', user: adminUser });
      try {
        await db.prepare('INSERT OR REPLACE INTO sessions (token, role, userId, userData) VALUES (?, ?, ?, ?)').run(
          token, 'admin', adminUser.id, JSON.stringify(adminUser)
        );
      } catch (e) {}

      return res.json({
        success: true,
        message: 'Admin authorization successful',
        token,
        role: 'admin',
        user: adminUser
      });
    }

    return res.status(401).json({ error: 'Invalid Admin PIN code. Access denied.' });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ error: 'Authentication service failure' });
  }
});

// POST /api/auth/logout - Revoke session
router.post('/logout', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (token) {
    validAdminTokens.delete(token);
    activeSessions.delete(token);
    try {
      await db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    } catch (e) {}
  }

  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me - Verify current session with sanitized user data
router.get('/me', (req, res) => {
  res.json({
    user: sanitizeUser(req.user) || { role: 'guest', isAuthenticated: false },
    isAuthenticated: req.user?.isAuthenticated || false
  });
});

export default router;
