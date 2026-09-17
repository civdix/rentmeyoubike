import express from 'express';
import { db } from '../db.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/customers - List customers with search (Admin only)
router.get('/', requireRole('admin'), async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM customers WHERE 1=1';
    const params = {};

    if (search) {
      query += ' AND (name LIKE @search OR phone LIKE @search OR email LIKE @search)';
      params.search = `%${search}%`;
    }

    query += ' ORDER BY registeredDate DESC';
    const rows = await db.prepare(query).all(params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET /api/customers/:id
router.get('/:id', async (req, res) => {
  try {
    const row = await db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(row);
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

    const updated = await db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (error) {
    console.error('Error toggling customer status:', error);
    res.status(500).json({ error: 'Failed to update customer status' });
  }
});

export default router;
