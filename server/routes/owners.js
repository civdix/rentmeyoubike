import express from 'express';
import { db } from '../db.js';
import { requireRole, activeSessions } from '../middleware/rbac.js';
import { sanitizeUser } from '../security.js';

const router = express.Router();

const SAFE_OWNER_COLUMNS = 'id, name, phone, email, upiId, emailVerified, verificationStatus, vehiclesCount, earnings, status, joinedDate';

// GET /api/owners/payout/upi - Fetch current logged-in host's UPI ID
router.get('/payout/upi', async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.isAuthenticated) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    let upiId = '';
    // 1. Look up by ID
    let owner = await db.prepare('SELECT upiId FROM owners WHERE id = ?').get(user.id);

    // 2. Look up by Phone digits
    if (!owner && user.phone) {
      const digits = user.phone.replace(/[^0-9]/g, '');
      if (digits.length >= 10) {
        owner = await db.prepare(`
          SELECT upiId FROM owners 
          WHERE REPLACE(REPLACE(phone, ' ', ''), '-', '') LIKE ?
        `).get(`%${digits.slice(-10)}`);
      }
    }

    // 3. Look up by Email
    if (!owner && user.email) {
      owner = await db.prepare('SELECT upiId FROM owners WHERE LOWER(email) = ?').get(user.email.toLowerCase().trim());
    }

    if (owner && owner.upiId) {
      upiId = owner.upiId;
    }

    res.json({ upiId });
  } catch (error) {
    console.error('Error fetching host UPI:', error);
    res.status(500).json({ error: 'Failed to fetch host UPI' });
  }
});

// PUT /api/owners/payout/upi - Save current logged-in host's UPI ID
router.put('/payout/upi', async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.isAuthenticated) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { upiId } = req.body;
    if (!upiId || typeof upiId !== 'string' || !upiId.trim()) {
      return res.status(400).json({ error: 'A valid UPI ID is required (e.g. 9837144520@upi or yourname@bank)' });
    }

    const cleanUpi = upiId.trim();

    if (!cleanUpi.includes('@') || cleanUpi.length < 5 || cleanUpi.length > 60) {
      return res.status(400).json({ error: 'Please enter a valid UPI Virtual Payment Address (e.g. yourname@bank or mobile@upi)' });
    }

    // 1. Try updating by user id
    let updated = await db.prepare('UPDATE owners SET upiId = ? WHERE id = ?').run(cleanUpi, user.id);

    // 2. If no row updated, try updating by phone
    const digits = (user.phone || '').replace(/[^0-9]/g, '');
    if ((!updated || updated.changes === 0) && digits.length >= 10) {
      updated = await db.prepare(`
        UPDATE owners SET upiId = ? 
        WHERE REPLACE(REPLACE(phone, ' ', ''), '-', '') LIKE ?
      `).run(cleanUpi, `%${digits.slice(-10)}`);
    }

    // 3. If still no row updated, try updating by email
    if ((!updated || updated.changes === 0) && user.email) {
      updated = await db.prepare('UPDATE owners SET upiId = ? WHERE LOWER(email) = ?').run(cleanUpi, user.email.toLowerCase().trim());
    }

    // 4. If owner record doesn't exist yet, insert a synchronized host record
    if (!updated || updated.changes === 0) {
      const ownerId = user.id && user.id.startsWith('own-') ? user.id : `own-${Date.now()}`;
      await db.prepare(`
        INSERT INTO owners (id, name, phone, email, upiId, verificationStatus, vehiclesCount, earnings, status)
        VALUES (?, ?, ?, ?, ?, 'Approved', 0, 0, 'active')
      `).run(ownerId, user.name || 'Fleet Host', user.phone || '', user.email || '', cleanUpi);
    }

    // Update in-memory session user
    if (user.token && activeSessions.has(user.token)) {
      const sess = activeSessions.get(user.token);
      if (sess && sess.user) {
        sess.user.upiId = cleanUpi;
      }
    }

    res.json({
      success: true,
      message: 'Payout UPI ID saved successfully!',
      upiId: cleanUpi
    });
  } catch (error) {
    console.error('Error saving host UPI:', error);
    res.status(500).json({ error: 'Failed to save payout UPI ID' });
  }
});

// GET /api/owners - List fleet owners (Password never exposed)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = `SELECT ${SAFE_OWNER_COLUMNS} FROM owners WHERE 1=1`;
    const params = {};

    if (search) {
      query += ' AND (name LIKE @search OR phone LIKE @search OR email LIKE @search)';
      params.search = `%${search}%`;
    }

    query += ' ORDER BY joinedDate DESC';
    const rows = await db.prepare(query).all(params);
    res.json((rows || []).map(sanitizeUser));
  } catch (error) {
    console.error('Error fetching owners:', error);
    res.status(500).json({ error: 'Failed to fetch owners' });
  }
});

// GET /api/owners/:id - Fetch owner details by id (Password never exposed)
router.get('/:id', async (req, res) => {
  try {
    const row = await db.prepare(`SELECT ${SAFE_OWNER_COLUMNS} FROM owners WHERE id = ?`).get(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Owner not found' });
    }
    res.json(sanitizeUser(row));
  } catch (error) {
    console.error('Error fetching owner by id:', error);
    res.status(500).json({ error: 'Failed to fetch owner' });
  }
});

// PATCH /api/owners/:id/status - Toggle active/suspended (Admin only)
router.patch('/:id/status', requireRole('admin'), async (req, res) => {
  try {
    const current = await db.prepare('SELECT status FROM owners WHERE id = ?').get(req.params.id);
    if (!current) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    const newStatus = req.body.status || (current.status === 'active' ? 'suspended' : 'active');
    await db.prepare('UPDATE owners SET status = ? WHERE id = ?').run(newStatus, req.params.id);

    const updated = await db.prepare(`SELECT ${SAFE_OWNER_COLUMNS} FROM owners WHERE id = ?`).get(req.params.id);
    res.json(sanitizeUser(updated));
  } catch (error) {
    console.error('Error toggling owner status:', error);
    res.status(500).json({ error: 'Failed to update owner status' });
  }
});

// PUT /api/owners/:id/upi - Save UPI ID by owner id
router.put('/:id/upi', async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.isAuthenticated) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { upiId } = req.body;
    if (!upiId || typeof upiId !== 'string' || !upiId.trim()) {
      return res.status(400).json({ error: 'A valid UPI ID is required' });
    }

    const cleanUpi = upiId.trim();
    if (!cleanUpi.includes('@') || cleanUpi.length < 5 || cleanUpi.length > 60) {
      return res.status(400).json({ error: 'Invalid UPI ID format' });
    }

    // Check permissions: Admin or self
    const isAdmin = user.role === 'admin';
    const isSelf = user.id === req.params.id;
    if (!isAdmin && !isSelf) {
      const owner = await db.prepare('SELECT phone, email FROM owners WHERE id = ?').get(req.params.id);
      const ownerDigits = (owner?.phone || '').replace(/[^0-9]/g, '');
      const userDigits = (user.phone || '').replace(/[^0-9]/g, '');
      const isPhoneMatch = ownerDigits && userDigits && ownerDigits.slice(-10) === userDigits.slice(-10);
      const isEmailMatch = owner?.email && user.email && owner.email.trim().toLowerCase() === user.email.trim().toLowerCase();
      if (!isPhoneMatch && !isEmailMatch) {
        return res.status(403).json({ error: 'Unauthorized: You can only edit your own payout account.' });
      }
    }

    await db.prepare('UPDATE owners SET upiId = ? WHERE id = ?').run(cleanUpi, req.params.id);

    res.json({
      success: true,
      message: 'Payout UPI ID saved successfully!',
      upiId: cleanUpi
    });
  } catch (error) {
    console.error('Error saving owner UPI by id:', error);
    res.status(500).json({ error: 'Failed to save payout UPI ID' });
  }
});

export default router;
