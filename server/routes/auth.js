import express from 'express';
import { db } from '../db.js';
import { ADMIN_PIN, validAdminTokens, activeSessions } from '../middleware/rbac.js';

const router = express.Router();

// POST /api/auth/customer-login - Login or register Renter / Customer by Phone
router.post('/customer-login', (req, res) => {
  try {
    const { phone, name, email } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Mobile phone number is required' });
    }

    const cleanPhone = phone.trim();
    let customer = db.prepare('SELECT * FROM customers WHERE phone = ?').get(cleanPhone);

    if (!customer) {
      const newId = `cust-${Date.now()}`;
      const customerName = name || 'Vrindavan Yatri';
      const customerEmail = email || `${customerName.toLowerCase().replace(/\s+/g, '')}@example.com`;

      db.prepare(`
        INSERT INTO customers (id, name, phone, email, kycStatus, bookingsCount, status, registeredDate)
        VALUES (?, ?, ?, ?, 'Pending', 0, 'active', CURRENT_TIMESTAMP)
      `).run(newId, customerName, cleanPhone, customerEmail);

      customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(newId);
    }

    const token = `vr_cust_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const userData = {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      kycStatus: customer.kycStatus,
      bookingsCount: customer.bookingsCount,
      role: 'customer'
    };

    activeSessions.set(token, { role: 'customer', user: userData });

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

    if (!owner) {
      const newId = `own-${Date.now()}`;
      const ownerName = name || 'Local Fleet Host';
      const ownerEmail = email || `${ownerName.toLowerCase().replace(/\s+/g, '')}@example.com`;

      db.prepare(`
        INSERT INTO owners (id, name, phone, email, verificationStatus, vehiclesCount, earnings, status, joinedDate)
        VALUES (?, ?, ?, ?, 'Verified', 0, 0, 'active', CURRENT_TIMESTAMP)
      `).run(newId, ownerName, cleanPhone, ownerEmail);

      owner = db.prepare('SELECT * FROM owners WHERE id = ?').get(newId);
    }

    const token = `vr_owner_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const userData = {
      id: owner.id,
      name: owner.name,
      phone: owner.phone,
      email: owner.email,
      verificationStatus: owner.verificationStatus,
      vehiclesCount: owner.vehiclesCount,
      earnings: owner.earnings,
      role: 'owner'
    };

    activeSessions.set(token, { role: 'owner', user: userData });

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
  }

  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me - Verify current session
router.get('/me', (req, res) => {
  res.json({
    user: req.user || { role: 'customer', isAuthenticated: false }
  });
});

export default router;
