import express from 'express';
import { db, seedInitialData } from '../db.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/settings - Get platform settings and legal config
router.get('/', (req, res) => {
  try {
    const adminSettings = db.prepare('SELECT * FROM admin_settings WHERE id = 1').get() || {};
    const legalConfigRow = db.prepare('SELECT * FROM legal_config WHERE id = 1').get() || {};

    const legalConfig = {
      ...legalConfigRow,
      citiesAvailable: typeof legalConfigRow.citiesAvailable === 'string'
        ? JSON.parse(legalConfigRow.citiesAvailable || '[]')
        : legalConfigRow.citiesAvailable || ['Vrindavan', 'Mathura']
    };

    res.json({
      adminSettings: {
        platformCommission: adminSettings.platformCommission ?? 15,
        minRentalDuration: adminSettings.minRentalDuration || '1 Day',
        whatsAppNumber: adminSettings.whatsAppNumber || '+919837144520',
        supportContact: adminSettings.supportContact || 'support@vrindavanrides.in',
        protectionInfo: adminSettings.protectionInfo || '',
        rentalRules: adminSettings.rentalRules || '',
        cancellationRules: adminSettings.cancellationRules || ''
      },
      legalConfig
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT /api/settings - Update admin settings
router.put('/', requireRole('admin'), (req, res) => {
  try {
    const s = req.body;
    db.prepare(`
      INSERT OR REPLACE INTO admin_settings (
        id, platformCommission, minRentalDuration, whatsAppNumber, supportContact,
        protectionInfo, rentalRules, cancellationRules
      ) VALUES (
        1, @platformCommission, @minRentalDuration, @whatsAppNumber, @supportContact,
        @protectionInfo, @rentalRules, @cancellationRules
      )
    `).run({
      platformCommission: Number(s.platformCommission) || 15,
      minRentalDuration: s.minRentalDuration || '1 Day',
      whatsAppNumber: s.whatsAppNumber || '+919837144520',
      supportContact: s.supportContact || 'support@vrindavanrides.in',
      protectionInfo: s.protectionInfo || '',
      rentalRules: s.rentalRules || '',
      cancellationRules: s.cancellationRules || ''
    });

    const updated = db.prepare('SELECT * FROM admin_settings WHERE id = 1').get();
    res.json(updated);
  } catch (error) {
    console.error('Error updating admin settings:', error);
    res.status(500).json({ error: 'Failed to update admin settings' });
  }
});

// PUT /api/settings/legal - Update legal config
router.put('/legal', requireRole('admin'), (req, res) => {
  try {
    const l = req.body;
    db.prepare(`
      INSERT OR REPLACE INTO legal_config (
        id, protectionTitle, protectionDisclaimer, legalPolicyNote, citiesAvailable, supportWhatsApp
      ) VALUES (
        1, @protectionTitle, @protectionDisclaimer, @legalPolicyNote, @citiesAvailable, @supportWhatsApp
      )
    `).run({
      protectionTitle: l.protectionTitle || '',
      protectionDisclaimer: l.protectionDisclaimer || '',
      legalPolicyNote: l.legalPolicyNote || '',
      citiesAvailable: JSON.stringify(Array.isArray(l.citiesAvailable) ? l.citiesAvailable : ['Vrindavan', 'Mathura']),
      supportWhatsApp: l.supportWhatsApp || '+919876543210'
    });

    const updated = db.prepare('SELECT * FROM legal_config WHERE id = 1').get();
    res.json({
      ...updated,
      citiesAvailable: JSON.parse(updated.citiesAvailable || '[]')
    });
  } catch (error) {
    console.error('Error updating legal settings:', error);
    res.status(500).json({ error: 'Failed to update legal settings' });
  }
});

// POST /api/settings/reset - Reset demo database
router.post('/reset', requireRole('admin'), (req, res) => {
  try {
    db.exec(`
      DELETE FROM vehicles;
      DELETE FROM bookings;
      DELETE FROM inspections;
      DELETE FROM customers;
      DELETE FROM owners;
      DELETE FROM disputes;
      DELETE FROM admin_settings;
      DELETE FROM legal_config;
    `);

    seedInitialData();
    res.json({ success: true, message: 'Demo database reset successfully' });
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

export default router;
