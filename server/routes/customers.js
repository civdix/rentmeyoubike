import express from 'express';
import { db } from '../db.js';
import { requireRole } from '../middleware/rbac.js';
import { sanitizeUser } from '../security.js';

const router = express.Router();

const SAFE_CUSTOMER_COLUMNS = 'id, name, phone, email, emailVerified, kycStatus, bookingsCount, status, registeredDate';

// GET /api/customers - List customers with search (Admin only, password never exposed)
router.get('/', requireRole('admin'), async (req, res) => {
  try {
    const { search } = req.query;
    let query = `SELECT ${SAFE_CUSTOMER_COLUMNS} FROM customers WHERE 1=1`;
    const params = {};

    if (search) {
      query += ' AND (name LIKE @search OR phone LIKE @search OR email LIKE @search)';
      params.search = `%${search}%`;
    }

    query += ' ORDER BY registeredDate DESC';
    const rows = await db.prepare(query).all(params);
    res.json((rows || []).map(sanitizeUser));
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET /api/customers/:id - Fetch customer details (Restricted to Admin or self, password never exposed)
router.get('/:id', async (req, res) => {
  try {
    const requestedId = req.params.id;

    // Authorization: User must be authenticated AND either be admin OR requesting their own record
    if (!req.user || !req.user.isAuthenticated) {
      return res.status(401).json({ error: 'Authentication required to view customer details.' });
    }

    const isAdmin = req.user.role === 'admin';
    const isSelf = req.user.id === requestedId;

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ error: 'Access denied: You can only view your own profile.' });
    }

    const row = await db.prepare(`SELECT ${SAFE_CUSTOMER_COLUMNS} FROM customers WHERE id = ?`).get(requestedId);
    if (!row) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(sanitizeUser(row));
  } catch (error) {
    console.error('Error fetching customer by id:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// PATCH /api/customers/:id/status - Toggle active/suspended (Admin only)
router.patch('/:id/status', requireRole('admin'), async (req, res) => {
  try {
    const current = await db.prepare('SELECT status FROM customers WHERE id = ?').get(req.params.id);
    if (!current) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const newStatus = req.body.status || (current.status === 'active' ? 'suspended' : 'active');
    await db.prepare('UPDATE customers SET status = ? WHERE id = ?').run(newStatus, req.params.id);

    const updated = await db.prepare(`SELECT ${SAFE_CUSTOMER_COLUMNS} FROM customers WHERE id = ?`).get(req.params.id);
    res.json(sanitizeUser(updated));
  } catch (error) {
    console.error('Error toggling customer status:', error);
    res.status(500).json({ error: 'Failed to update customer status' });
  }
});

export default router;
