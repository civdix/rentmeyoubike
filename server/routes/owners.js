import express from 'express';
import { db } from '../db.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/owners - List fleet owners
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM owners WHERE 1=1';
    const params = {};

    if (search) {
      query += ' AND (name LIKE @search OR phone LIKE @search OR email LIKE @search)';
      params.search = `%${search}%`;
    }

    query += ' ORDER BY joinedDate DESC';
    const rows = await db.prepare(query).all(params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching owners:', error);
    res.status(500).json({ error: 'Failed to fetch owners' });
  }
});

// GET /api/owners/:id
router.get('/:id', async (req, res) => {
  try {
    const row = await db.prepare('SELECT * FROM owners WHERE id = ?').get(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Owner not found' });
    }
    res.json(row);
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

    const updated = await db.prepare('SELECT * FROM owners WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (error) {
    console.error('Error toggling owner status:', error);
    res.status(500).json({ error: 'Failed to update owner status' });
  }
});

export default router;
