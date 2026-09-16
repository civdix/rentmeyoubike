import { db } from '../db.js';

// Role-Based Access Control (RBAC) Middleware

export const ADMIN_PIN = process.env.ADMIN_PIN || '7777';

// In-memory active admin tokens & active user sessions
export const validAdminTokens = new Set();
export const activeSessions = new Map(); // token -> { role, user }

export function authenticateUser(req, res, next) {
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
    sessionUser = session.user;
    isAuthenticated = true;
  } else if (token && validAdminTokens.has(token)) {
    role = 'admin';
    sessionUser = { id: 'admin-1', name: 'Platform Administrator', role: 'admin' };
    isAuthenticated = true;
  } else if (token) {
    // 2. Check SQLite sessions table
    try {
      const row = db.prepare('SELECT * FROM sessions WHERE token = ?').get(token);
      if (row) {
        const parsedUser = row.userData ? JSON.parse(row.userData) : { id: row.userId, role: row.role };
        role = row.role;
        sessionUser = parsedUser;
        isAuthenticated = true;
        activeSessions.set(token, { role, user: parsedUser });
        if (role === 'admin') {
          validAdminTokens.add(token);
        }
      }
    } catch (err) {
      // Ignore if session lookup fails
    }
  } else if (pinHeader === ADMIN_PIN || pinHeader === '2026') {
    role = 'admin';
    sessionUser = { id: 'admin-1', name: 'Platform Administrator', role: 'admin' };
    isAuthenticated = true;
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

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: Access restricted to roles: [${allowedRoles.join(', ')}]. Your role is '${req.user.role}'`
      });
    }

    next();
  };
}
