import express from 'express';
import { db } from '../db.js';
import { deleteSettlementImagesForBooking } from '../imagekit.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

// All dispute operations require Admin access
router.use(requireRole('admin'));

function formatDispute(row) {
  if (!row) return null;
  return {
    ...row,
    notes: typeof row.notes === 'string' ? JSON.parse(row.notes || '[]') : row.notes || [],
    evidence: typeof row.evidence === 'string' ? JSON.parse(row.evidence || '[]') : row.evidence || []
  };
}

// GET /api/disputes - List all disputes
router.get('/', async (req, res) => {
  try {
    const rows = await db.prepare('SELECT * FROM disputes ORDER BY createdAt DESC').all();
    res.json(rows.map(formatDispute));
  } catch (error) {
    console.error('Error fetching disputes:', error);
    res.status(500).json({ error: 'Failed to fetch disputes' });
  }
});

// POST /api/disputes - Open new dispute
router.post('/', async (req, res) => {
  try {
    const { bookingId, issue, notesText, evidenceUrl } = req.body;
    if (!bookingId) {
      return res.status(400).json({ error: 'bookingId is required' });
    }

    const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
    const newId = `DISP-${Math.floor(100 + Math.random() * 899)}`;
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const initialNotes = [
      {
        sender: 'Admin',
        time: nowTime,
        text: notesText || 'Dispute opened by Administrator.'
      }
    ];

    const evidence = evidenceUrl
      ? [evidenceUrl]
      : ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80'];

    const stmt = db.prepare(`
      INSERT INTO disputes (
        id, bookingId, customerName, ownerName, vehicleName, issue, notes, evidence, status, outcome, createdAt
      ) VALUES (
        @id, @bookingId, @customerName, @ownerName, @vehicleName, @issue, @notes, @evidence, 'Open', '', @createdAt
      )
    `);

    await stmt.run({
      id: newId,
      bookingId,
      customerName: booking?.customerName || 'Customer',
      ownerName: booking?.ownerName || 'Owner',
      vehicleName: booking?.vehicleName || 'Vehicle',
      issue: issue || 'Inspection disparity dispute',
      notes: JSON.stringify(initialNotes),
      evidence: JSON.stringify(evidence),
      createdAt: nowTime
    });

    // Update booking status to 'Dispute'
    await db.prepare("UPDATE bookings SET status = 'Dispute' WHERE id = ?").run(bookingId);

    const created = await db.prepare('SELECT * FROM disputes WHERE id = ?').get(newId);
    res.status(201).json(formatDispute(created));
  } catch (error) {
    console.error('Error opening dispute:', error);
    res.status(500).json({ error: 'Failed to open dispute' });
  }
});

// POST /api/disputes/:id/notes - Append note to dispute
router.post('/:id/notes', async (req, res) => {
  try {
    const { text, sender = 'Admin' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Note text is required' });
    }

    const current = await db.prepare('SELECT * FROM disputes WHERE id = ?').get(req.params.id);
    if (!current) {
      return res.status(404).json({ error: 'Dispute not found' });
    }

    const notes = typeof current.notes === 'string' ? JSON.parse(current.notes || '[]') : current.notes || [];
    const newNote = {
      sender,
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      text
    };
    notes.push(newNote);

    await db.prepare('UPDATE disputes SET notes = ? WHERE id = ?').run(JSON.stringify(notes), req.params.id);

    const updated = await db.prepare('SELECT * FROM disputes WHERE id = ?').get(req.params.id);
    res.json(formatDispute(updated));
  } catch (error) {
    console.error('Error adding dispute note:', error);
    res.status(500).json({ error: 'Failed to add dispute note' });
  }
});

// PATCH /api/disputes/:id/resolve - Mark dispute resolved with outcome
router.patch('/:id/resolve', async (req, res) => {
  try {
    const { outcome = 'Resolved by Administrator' } = req.body;

    await db.prepare("UPDATE disputes SET status = 'Resolved', outcome = ? WHERE id = ?").run(outcome, req.params.id);

    const updated = await db.prepare('SELECT * FROM disputes WHERE id = ?').get(req.params.id);
    if (!updated) {
      return res.status(404).json({ error: 'Dispute not found' });
    }

    // Final settlement: mark booking completed and purge temporary dispute photos
    if (updated.bookingId) {
      await db.prepare("UPDATE bookings SET status = 'Completed' WHERE id = ?").run(updated.bookingId);
      try {
        await deleteSettlementImagesForBooking(updated.bookingId);
      } catch (purgeErr) {
        console.warn(`Could not purge images after resolving dispute for ${updated.bookingId}:`, purgeErr.message);
      }
    }

    res.json(formatDispute(updated));
  } catch (error) {
    console.error('Error resolving dispute:', error);
    res.status(500).json({ error: 'Failed to resolve dispute' });
  }
});

export default router;
