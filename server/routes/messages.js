import express from 'express';
import crypto from 'crypto';
import { db } from '../db.js';
import { requireRole } from '../middleware/rbac.js';
import { sendPendingMessagesAlertToAdmin } from '../email.js';

const router = express.Router();

function formatMessage(row) {
  if (!row) return null;
  return {
    ...row,
    id: row.id,
    bookingId: row.bookingId || row.bookingid || null,
    conversationId: row.conversationId || row.conversationid || '',
    senderRole: row.senderRole || row.senderrole || 'customer',
    senderName: row.senderName || row.sendername || '',
    senderPhone: row.senderPhone || row.senderphone || '',
    receiverRole: row.receiverRole || row.receiverrole || 'admin',
    customerPhone: row.customerPhone || row.customerphone || '',
    customerName: row.customerName || row.customername || '',
    text: row.text,
    isRead: Boolean(row.isRead !== undefined ? row.isRead : row.isread),
    createdAt: row.createdAt || row.createdat || ''
  };
}

// GET /api/messages/conversations - List all active conversations (Admin only)
router.get('/conversations', requireRole('admin'), async (req, res) => {
  try {
    // Group messages by conversationId, get the latest message and unread count
    const rows = await db.prepare(`
      SELECT 
        m.conversationId,
        m.bookingId,
        m.customerName,
        m.customerPhone,
        m.text AS lastMessageText,
        m.senderRole AS lastMessageSender,
        m.createdAt AS lastMessageTime,
        (SELECT COUNT(*) FROM messages u WHERE u.conversationId = m.conversationId AND u.receiverRole = 'admin' AND u.isRead = 0) AS unreadCount,
        (SELECT COUNT(*) FROM messages t WHERE t.conversationId = m.conversationId) AS totalMessages
      FROM messages m
      INNER JOIN (
        SELECT conversationId, MAX(createdAt) AS maxCreatedAt
        FROM messages
        GROUP BY conversationId
      ) latest ON m.conversationId = latest.conversationId AND m.createdAt = latest.maxCreatedAt
      ORDER BY m.createdAt DESC
    `).all();

    const normalized = (rows || []).map(row => ({
      conversationId: row.conversationId || row.conversationid || '',
      bookingId: row.bookingId || row.bookingid || null,
      customerName: row.customerName || row.customername || 'Customer',
      customerPhone: row.customerPhone || row.customerphone || '',
      lastMessageText: row.lastMessageText || row.lastmessagetext || '',
      lastMessageSender: row.lastMessageSender || row.lastmessagesender || '',
      lastMessageTime: row.lastMessageTime || row.lastmessagetime || row.createdAt || row.createdat || '',
      unreadCount: Number(row.unreadCount || row.unreadcount || 0),
      totalMessages: Number(row.totalMessages || row.totalmessages || 0)
    }));

    res.json(normalized);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// GET /api/messages - Fetch messages for a specific conversation / booking / customer
router.get('/', async (req, res) => {
  try {
    const { conversationId, bookingId, customerPhone, limit, offset } = req.query;

    if (!conversationId && !bookingId && !customerPhone) {
      return res.status(400).json({ error: 'conversationId, bookingId, or customerPhone is required' });
    }

    let filterClause = ' WHERE 1=1';
    const params = {};

    if (conversationId) {
      filterClause += ' AND conversationId = @conversationId';
      params.conversationId = String(conversationId).trim();
    } else if (bookingId) {
      filterClause += ' AND (bookingId = @bookingId OR conversationId = @bookingId OR conversationId = @convBooking)';
      params.bookingId = String(bookingId).trim();
      params.convBooking = `conv-${String(bookingId).trim()}`;
    } else if (customerPhone) {
      const digits = String(customerPhone).replace(/[^0-9]/g, '');
      filterClause += ' AND (customerPhone LIKE @phonePattern OR conversationId LIKE @phonePattern)';
      params.phonePattern = `%${digits.slice(-10)}%`;
    }

    // Default limit: 50 messages, max: 100, default offset: 0
    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));
    const parsedOffset = Math.max(0, parseInt(offset, 10) || 0);

    // Get total message count
    const countRow = await db.prepare(`SELECT COUNT(*) AS total FROM messages${filterClause}`).get(params);
    const total = Number(countRow?.total || countRow?.TOTAL || 0);

    // Fetch latest messages (ordered DESC) with LIMIT & OFFSET
    const dataQuery = `SELECT * FROM messages${filterClause} ORDER BY createdAt DESC LIMIT ${parsedLimit} OFFSET ${parsedOffset}`;
    const rows = await db.prepare(dataQuery).all(params);

    // Reverse to chronological order (oldest to newest for the client's chat feed)
    const messages = (rows || []).reverse().map(formatMessage);
    const hasMore = parsedOffset + parsedLimit < total;

    // Auto-mark as read based on who is reading
    const isAdmin = req.user && req.user.role === 'admin';
    const targetRole = isAdmin ? 'admin' : 'customer';

    if (messages.length > 0) {
      const activeConvId = conversationId || messages[messages.length - 1]?.conversationId;
      if (activeConvId) {
        db.prepare('UPDATE messages SET isRead = 1 WHERE conversationId = ? AND receiverRole = ?').run(activeConvId, targetRole);
      }
    }

    res.json({
      messages,
      total,
      hasMore,
      limit: parsedLimit,
      offset: parsedOffset
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /api/messages - Send a message (Customer to Admin or Admin to Customer)
router.post('/', async (req, res) => {
  try {
    const {
      conversationId: inputConvId,
      bookingId,
      text,
      customerName: inputName,
      customerPhone: inputPhone
    } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Message text cannot be empty' });
    }

    const cleanText = text.trim();
    const isAdmin = req.user && req.user.role === 'admin';

    // Determine sender & receiver roles (support explicit senderRole from client)
    const requestedRole = req.body.senderRole;
    const senderRole = (requestedRole === 'customer' || requestedRole === 'admin')
      ? requestedRole
      : (isAdmin ? 'admin' : 'customer');
    const receiverRole = senderRole === 'admin' ? 'customer' : 'admin';
    const senderName = senderRole === 'admin'
      ? (req.user?.name || 'Rent on Cent Admin')
      : (inputName || req.user?.name || 'Vrindavan Pilgrim');
    const senderPhone = senderRole === 'admin' ? '' : (inputPhone || req.user?.phone || '');

    // Resolve conversationId
    let conversationId = inputConvId;
    if (!conversationId) {
      if (bookingId) {
        conversationId = `conv-${bookingId}`;
      } else if (senderPhone) {
        const digits = senderPhone.replace(/[^0-9]/g, '').slice(-10);
        conversationId = `conv-${digits}`;
      } else {
        conversationId = `conv-chat-${Date.now()}`;
      }
    }

    // Resolve customer info for this conversation
    let customerName = inputName || req.user?.name || 'Customer';
    let customerPhone = inputPhone || req.user?.phone || '';

    // If Admin is sending, try to populate customer name/phone from existing conversation messages
    if (isAdmin && (!customerPhone || customerName === 'Customer')) {
      const prevMsg = await db.prepare('SELECT customerName, customerPhone, bookingId FROM messages WHERE conversationId = ? LIMIT 1').get(conversationId);
      if (prevMsg) {
        if (prevMsg.customerName) customerName = prevMsg.customerName;
        if (prevMsg.customerPhone) customerPhone = prevMsg.customerPhone;
      }
    }

    const messageId = `msg-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;

    const newMsgData = {
      id: messageId,
      bookingId: bookingId || null,
      conversationId,
      senderRole,
      senderName,
      senderPhone: senderPhone || null,
      receiverRole,
      customerPhone: customerPhone || null,
      customerName,
      text: cleanText,
      isRead: 0
    };

    await db.prepare(`
      INSERT INTO messages (
        id, bookingId, conversationId, senderRole, senderName, senderPhone,
        receiverRole, customerPhone, customerName, text, isRead
      ) VALUES (
        @id, @bookingId, @conversationId, @senderRole, @senderName, @senderPhone,
        @receiverRole, @customerPhone, @customerName, @text, @isRead
      )
    `).run(newMsgData);

    const saved = await db.prepare('SELECT * FROM messages WHERE id = ?').get(messageId);
    res.status(201).json(formatMessage(saved));
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// PATCH /api/messages/:conversationId/read - Mark messages as read
router.patch('/:conversationId/read', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const isAdmin = req.user && req.user.role === 'admin';
    const targetRole = isAdmin ? 'admin' : 'customer';

    await db.prepare('UPDATE messages SET isRead = 1 WHERE conversationId = ? AND receiverRole = ?').run(conversationId, targetRole);
    res.json({ success: true, conversationId });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

// Check for unattended customer messages and dispatch digest email to admin
export async function checkAndAlertUnattendedMessages() {
  try {
    const rows = await db.prepare(`
      SELECT * FROM messages 
      WHERE receiverRole = 'admin' 
        AND isRead = 0 
        AND (emailNotified = 0 OR emailNotified IS NULL)
      ORDER BY createdAt ASC
    `).all();

    if (!rows || rows.length === 0) return { alertSent: false, count: 0 };

    const now = Date.now();
    const olderRows = rows.filter(r => {
      const msgTime = new Date(r.createdAt || r.createdat).getTime();
      return !isNaN(msgTime) && (now - msgTime) >= 120000; // Unviewed for > 2 minutes
    });

    if (olderRows.length === 0) return { alertSent: false, count: 0 };

    const distinctConvs = new Set(olderRows.map(r => r.conversationId || r.conversationid)).size;
    const formatted = olderRows.map(formatMessage);

    console.log(`⏰ Found ${olderRows.length} unattended message(s) awaiting response (> 2 mins). Dispatching digest to shivdixittt@gmail.com...`);
    await sendPendingMessagesAlertToAdmin({
      unreadMessages: formatted,
      conversationsCount: distinctConvs,
      totalUnreadCount: olderRows.length
    });

    for (const msg of olderRows) {
      await db.prepare('UPDATE messages SET emailNotified = 1 WHERE id = ?').run(msg.id);
    }

    return { alertSent: true, count: olderRows.length, conversationsCount: distinctConvs };
  } catch (err) {
    console.warn('⚠️ Error in checkAndAlertUnattendedMessages:', err.message);
    return { alertSent: false, error: err.message };
  }
}

// Background scheduler running every 2 minutes
setInterval(checkAndAlertUnattendedMessages, 120000);

// POST /api/messages/check-unattended - Manually trigger check
router.post('/check-unattended', async (req, res) => {
  const result = await checkAndAlertUnattendedMessages();
  res.json(result);
});

export default router;
