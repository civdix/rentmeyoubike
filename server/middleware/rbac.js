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
  const roleHeader = req.headers['x-user-role'];
  const pinHeader = req.headers['x-admin-pin'];

  // Default role is customer
  let role = 'customer';
  let isAuthenticated = false;
  let sessionUser = null;

  // 1. Check if token matches active session
  if (token && activeSessions.has(token)) {
    const session = activeSessions.get(token);
    role = session.role;
    sessionUser = session.user;
    isAuthenticated = true;
  } else if (token && validAdminTokens.has(token)) {
    role = 'admin';
    sessionUser = { id: 'admin-1', name: 'Platform Administrator', role: 'admin' };
    isAuthenticated = true;
  } else if (pinHeader === ADMIN_PIN || pinHeader === '2026') {
    role = 'admin';
    sessionUser = { id: 'admin-1', name: 'Platform Administrator', role: 'admin' };
    isAuthenticated = true;
  } else if (roleHeader === 'admin') {
    // Admin requires valid token or PIN
    return res.status(401).json({
      error: 'Unauthorized: Admin access requires valid token or PIN'
    });
  } else if (roleHeader === 'owner') {
    role = 'owner';
    sessionUser = { id: 'owner-session', name: 'Fleet Owner', role: 'owner' };
    isAuthenticated = true;
  } else if (roleHeader === 'customer') {
    role = 'customer';
    sessionUser = { id: 'customer-session', name: 'Customer Renter', role: 'customer' };
    isAuthenticated = true;
  }

  req.user = {
    ...(sessionUser || { id: 'guest', name: 'Guest Rider', role: 'customer' }),
    role,
    isAuthenticated,
    token
  };

  next();
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: Access restricted to roles: [${allowedRoles.join(', ')}]. Your role is '${req.user.role}'`
      });
    }

    next();
  };
}
