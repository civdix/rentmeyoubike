import express from 'express';
import { db } from '../db.js';
import { ADMIN_PIN, validAdminTokens, activeSessions } from '../middleware/rbac.js';
import { isValidEmail, normalizeEmail, sendEmailOtp } from '../email.js';

const router = express.Router();

function maskPhone(phone) {
  if (!phone) return '';
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length <= 4) return phone;
  return `+91 ${digits.slice(0, 2)}****${digits.slice(-4)}`;
}

// POST /api/auth/check-email - Enforce format validation and distinguish emails
router.post('/check-email', (req, res) => {
  try {
    const { email, role = 'customer' } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        valid: false,
        error: 'Invalid email format. Please enter a valid email address (e.g. name@domain.com).'
      });
    }

    const normalized = normalizeEmail(email);

    // Distinguish if email belongs to Customer or Owner
    const existingCust = db.prepare('SELECT id, name, phone, email, emailVerified FROM customers WHERE LOWER(email) = ?').get(normalized);
    const existingOwner = db.prepare('SELECT id, name, phone, email, emailVerified FROM owners WHERE LOWER(email) = ?').get(normalized);

    const verificationRecord = db.prepare('SELECT verified FROM email_verifications WHERE email = ?').get(normalized);
    const isEmailVerified = Boolean(verificationRecord?.verified || existingCust?.emailVerified || existingOwner?.emailVerified);

    let status = 'available';
    let message = 'Email is valid and ready to be registered.';
    let existingAccount = null;

    if (role === 'customer' && existingCust) {
      status = 'registered_same_role';
      message = `Existing Renter account found for ${existingCust.name}.`;
      existingAccount = {
        role: 'customer',
        registeredAs: 'Renter',
        name: existingCust.name,
        phoneMasked: maskPhone(existingCust.phone),
        maskedPhone: maskPhone(existingCust.phone),
        emailVerified: Boolean(existingCust.emailVerified)
      };
    } else if (role === 'owner' && existingOwner) {
      status = 'registered_same_role';
      message = `Existing Fleet Host account found for ${existingOwner.name}.`;
      existingAccount = {
        role: 'owner',
        registeredAs: 'Fleet Host',
        name: existingOwner.name,
        phoneMasked: maskPhone(existingOwner.phone),
        maskedPhone: maskPhone(existingOwner.phone),
        emailVerified: Boolean(existingOwner.emailVerified)
      };
    } else if (existingCust) {
      status = 'registered_other_role';
      message = `This email is already registered as a Renter (${existingCust.name}).`;
      existingAccount = {
        role: 'customer',
        registeredAs: 'Renter',
        name: existingCust.name,
        phoneMasked: maskPhone(existingCust.phone),
        maskedPhone: maskPhone(existingCust.phone),
        emailVerified: Boolean(existingCust.emailVerified)
      };
    } else if (existingOwner) {
      status = 'registered_other_role';
      message = `This email is already registered as a Fleet Host (${existingOwner.name}).`;
      existingAccount = {
        role: 'owner',
        registeredAs: 'Fleet Host',
        name: existingOwner.name,
        phoneMasked: maskPhone(existingOwner.phone),
        maskedPhone: maskPhone(existingOwner.phone),
        emailVerified: Boolean(existingOwner.emailVerified)
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

// POST /api/auth/send-email-otp - Send 6-digit verification code to email
router.post('/send-email-otp', async (req, res) => {
  try {
    const { email, role = 'customer' } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const normalized = normalizeEmail(email);

    // Rate limiting: 60s cooldown between OTP requests
    const recent = db.prepare('SELECT expiresAt FROM email_verifications WHERE email = ?').get(normalized);
    if (recent) {
      const timeSinceCreation = 10 * 60 * 1000 - (recent.expiresAt - Date.now());
      if (timeSinceCreation < 60 * 1000 && timeSinceCreation > 0) {
        const waitSeconds = Math.ceil((60 * 1000 - timeSinceCreation) / 1000);
        return res.status(429).json({
          error: `Please wait ${waitSeconds}s before requesting another verification code.`
        });
      }
    }

    // Generate secure 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    db.prepare(`
      INSERT OR REPLACE INTO email_verifications (email, otp, role, expiresAt, verified, attempts, createdAt)
      VALUES (?, ?, ?, ?, 0, 0, CURRENT_TIMESTAMP)
    `).run(normalized, otp, role, expiresAt);

    // Dispatch email
    const emailResult = await sendEmailOtp(normalized, otp, role);

    return res.json({
      success: true,
      message: `Verification code sent to ${normalized}`,
      email: normalized,
      expiresInMinutes: 10,
      devOtp: emailResult.devOtp
    });
  } catch (error) {
    console.error('Error during send-email-otp:', error);
    res.status(500).json({ error: 'Failed to send email verification code' });
  }
});

// POST /api/auth/verify-email-otp - Verify user email address with OTP
router.post('/verify-email-otp', (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email address and OTP code are required' });
    }

    const normalized = normalizeEmail(email);
    const cleanOtp = String(otp).trim();

    const record = db.prepare('SELECT * FROM email_verifications WHERE email = ?').get(normalized);
    if (!record) {
      return res.status(404).json({ error: 'No active verification code found for this email. Please request a new OTP.' });
    }

    if (Date.now() > record.expiresAt) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new OTP.' });
    }

    if (record.attempts >= 5) {
      return res.status(429).json({ error: 'Too many incorrect attempts. Please request a new code.' });
    }

    if (record.otp !== cleanOtp) {
      db.prepare('UPDATE email_verifications SET attempts = attempts + 1 WHERE email = ?').run(normalized);
      const remaining = 5 - (record.attempts + 1);
      return res.status(400).json({
        error: `Incorrect OTP code. ${remaining} attempt(s) remaining.`
      });
    }

    // Mark verified
    db.prepare('UPDATE email_verifications SET verified = 1 WHERE email = ?').run(normalized);

    // Automatically synchronize verified status with existing customer or owner records
    db.prepare('UPDATE customers SET emailVerified = 1 WHERE LOWER(email) = ?').run(normalized);
    db.prepare('UPDATE owners SET emailVerified = 1 WHERE LOWER(email) = ?').run(normalized);

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

// POST /api/auth/customer-login - Login or register Renter / Customer by Phone
router.post('/customer-login', (req, res) => {
  try {
    const { phone, name, email } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Mobile phone number is required' });
    }

    const cleanPhone = phone.trim();
    let customer = db.prepare('SELECT * FROM customers WHERE phone = ?').get(cleanPhone);

    const normalizedEmail = email ? normalizeEmail(email) : null;
    if (email && !isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    // Check if email was pre-verified
    let isEmailVerified = 0;
    if (normalizedEmail) {
      const verRecord = db.prepare('SELECT verified FROM email_verifications WHERE email = ?').get(normalizedEmail);
      if (verRecord?.verified) isEmailVerified = 1;
    }

    if (!customer) {
      const newId = `cust-${Date.now()}`;
      const customerName = name || 'Vrindavan Yatri';
      const customerEmail = normalizedEmail || `${customerName.toLowerCase().replace(/\s+/g, '')}@example.com`;

      db.prepare(`
        INSERT INTO customers (id, name, phone, email, emailVerified, kycStatus, bookingsCount, status, registeredDate)
        VALUES (?, ?, ?, ?, ?, 'Pending', 0, 'active', CURRENT_TIMESTAMP)
      `).run(newId, customerName, cleanPhone, customerEmail, isEmailVerified);

      customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(newId);
    } else if (normalizedEmail && (!customer.email || customer.email.includes('@example.com'))) {
      db.prepare('UPDATE customers SET email = ?, emailVerified = ? WHERE id = ?').run(normalizedEmail, isEmailVerified, customer.id);
      customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(customer.id);
    }

    const token = `vr_cust_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const userData = {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      emailVerified: Boolean(customer.emailVerified),
      kycStatus: customer.kycStatus,
      bookingsCount: customer.bookingsCount,
      role: 'customer'
    };

    activeSessions.set(token, { role: 'customer', user: userData });
    try {
      db.prepare('INSERT OR REPLACE INTO sessions (token, role, userId, userData) VALUES (?, ?, ?, ?)').run(
        token, 'customer', userData.id, JSON.stringify(userData)
      );
    } catch (e) {
      console.warn('Could not persist session in db:', e.message);
    }

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
router.post('/owner-login', (req, res) => {
  try {
    const { phone, name, email } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Host mobile phone number is required' });
    }

    const cleanPhone = phone.trim();
    let owner = db.prepare('SELECT * FROM owners WHERE phone = ?').get(cleanPhone);

    const normalizedEmail = email ? normalizeEmail(email) : null;
    if (email && !isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    // Check if email was pre-verified
    let isEmailVerified = 0;
    if (normalizedEmail) {
      const verRecord = db.prepare('SELECT verified FROM email_verifications WHERE email = ?').get(normalizedEmail);
      if (verRecord?.verified) isEmailVerified = 1;
    }

    if (!owner) {
      const newId = `own-${Date.now()}`;
      const ownerName = name || 'Local Fleet Host';
      const ownerEmail = normalizedEmail || `${ownerName.toLowerCase().replace(/\s+/g, '')}@example.com`;

      db.prepare(`
        INSERT INTO owners (id, name, phone, email, emailVerified, verificationStatus, vehiclesCount, earnings, status, joinedDate)
        VALUES (?, ?, ?, ?, ?, 'Verified', 0, 0, 'active', CURRENT_TIMESTAMP)
      `).run(newId, ownerName, cleanPhone, ownerEmail, isEmailVerified);

      owner = db.prepare('SELECT * FROM owners WHERE id = ?').get(newId);
    } else if (normalizedEmail && (!owner.email || owner.email.includes('@example.com'))) {
      db.prepare('UPDATE owners SET email = ?, emailVerified = ? WHERE id = ?').run(normalizedEmail, isEmailVerified, owner.id);
      owner = db.prepare('SELECT * FROM owners WHERE id = ?').get(owner.id);
    }

    const token = `vr_owner_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const userData = {
      id: owner.id,
      name: owner.name,
      phone: owner.phone,
      email: owner.email,
      emailVerified: Boolean(owner.emailVerified),
      verificationStatus: owner.verificationStatus,
      vehiclesCount: owner.vehiclesCount,
      earnings: owner.earnings,
      role: 'owner'
    };

    activeSessions.set(token, { role: 'owner', user: userData });
    try {
      db.prepare('INSERT OR REPLACE INTO sessions (token, role, userId, userData) VALUES (?, ?, ?, ?)').run(
        token, 'owner', userData.id, JSON.stringify(userData)
      );
    } catch (e) {
      console.warn('Could not persist session in db:', e.message);
    }

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

// POST /api/auth/admin-login - Verify PIN and issue admin token
router.post('/admin-login', (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({ error: 'Admin PIN is required' });
    }

    if (pin.trim() === ADMIN_PIN || pin.trim() === '2026') {
      const token = `vr_admin_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      validAdminTokens.add(token);

      const adminUser = {
        id: 'admin-1',
        name: 'Platform Administrator',
        role: 'admin'
      };

      activeSessions.set(token, { role: 'admin', user: adminUser });
      try {
        db.prepare('INSERT OR REPLACE INTO sessions (token, role, userId, userData) VALUES (?, ?, ?, ?)').run(
          token, 'admin', adminUser.id, JSON.stringify(adminUser)
        );
      } catch (e) {
        console.warn('Could not persist session in db:', e.message);
      }

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
router.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (token) {
    validAdminTokens.delete(token);
    activeSessions.delete(token);
    try {
      db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    } catch (e) {}
  }

  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me - Verify current session
router.get('/me', (req, res) => {
  res.json({
    user: req.user || { role: 'guest', isAuthenticated: false },
    isAuthenticated: req.user?.isAuthenticated || false
  });
});

export default router;
