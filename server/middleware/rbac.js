import { db } from '../db.js';
import { timingSafeCompare, sanitizeUser } from '../security.js';

// Role-Based Access Control (RBAC) Middleware

export const ADMIN_PIN = process.env.ADMIN_PIN || '7777';

// In-memory active admin tokens & active user sessions
export const validAdminTokens = new Set();
export const activeSessions = new Map(); // token -> { role, user }

export async function authenticateUser(req, res, next) {
  // Allow login endpoints without prior token
  if (req.path.includes('/login')) {
    return next();
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const pinHeader = req.headers['x-admin-pin'];

  let role = 'guest';
  let isAuthenticated = false;
  let sessionUser = null;

  // 1. Check if token matches active in-memory session or admin token
  if (token && activeSessions.has(token)) {
    const session = activeSessions.get(token);
    role = session.role;
    sessionUser = sanitizeUser(session.user);
    isAuthenticated = true;
  } else if (token && validAdminTokens.has(token)) {
    role = 'admin';
    sessionUser = { id: 'admin-1', name: 'Platform Administrator', role: 'admin' };
    isAuthenticated = true;
  } else if (token) {
    // 2. Check sessions table in DB
    try {
      const row = await db.prepare('SELECT * FROM sessions WHERE token = ?').get(token);
      if (row) {
        const parsedUser = row.userData ? JSON.parse(row.userData) : { id: row.userId, role: row.role };
        const safeUser = sanitizeUser(parsedUser);
        role = row.role;
        sessionUser = safeUser;
        isAuthenticated = true;
        activeSessions.set(token, { role, user: safeUser });
        if (role === 'admin') {
          validAdminTokens.add(token);
        }
      }
    } catch (err) {
      // Ignore if session lookup fails
    }
  } else if (pinHeader && timingSafeCompare(String(pinHeader).trim(), ADMIN_PIN)) {
    role = 'admin';
    sessionUser = { id: 'admin-1', name: 'Platform Administrator', role: 'admin' };
    isAuthenticated = true;
  }

  // Enrich user session with phone & email from database if missing
  if (sessionUser && (!sessionUser.phone || !sessionUser.email) && sessionUser.id && sessionUser.id !== 'admin-1' && sessionUser.id !== 'guest') {
    try {
      const uRow = (await db.prepare('SELECT name, phone, email FROM customers WHERE id = ?').get(sessionUser.id)) ||
                   (await db.prepare('SELECT name, phone, email FROM owners WHERE id = ?').get(sessionUser.id));
      if (uRow) {
        sessionUser = { ...sessionUser, ...uRow };
      }
    } catch (e) {}
  }

  req.user = {
    ...(sessionUser || { id: 'guest', name: 'Guest Rider', role: 'guest' }),
    role: isAuthenticated ? role : 'guest',
    isAuthenticated,
    token
  };

  next();
}

export function requireAuth(req, res, next) {
  if (!req.user || !req.user.isAuthenticated) {
    return res.status(401).json({
      error: 'Unauthorized: Authentication required. Please sign in before performing this action.'
    });
  }
  next();
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.isAuthenticated) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required. Please sign in first.' });
    }

    // Admin always has universal access
    if (req.user.role === 'admin') {
      return next();
    }

    // If owner/host role is allowed, permit any authenticated platform host, owner, or unified user
    const isOwnerAllowed = allowedRoles.includes('owner') || allowedRoles.includes('host');
    const isUserOwnerCapable = req.user.role === 'owner' || req.user.role === 'host' || req.user.role === 'user' || req.user.role === 'customer' || Boolean(req.user.isHost);

    if (isOwnerAllowed && isUserOwnerCapable) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: Access restricted to roles: [${allowedRoles.join(', ')}]. Your role is '${req.user.role}'`
      });
    }

    next();
  };
}
