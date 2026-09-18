/**
 * In-memory sliding-window rate limiter middleware with automatic memory cleanup.
 * Enforces request thresholds per IP and/or per account identifier to safeguard against
 * credential stuffing, brute force, denial of service, and spam attacks.
 */

export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = forwarded.split(',').map((ip) => ip.trim());
    if (ips.length > 0 && ips[0]) return ips[0];
  }
  return req.ip || req.socket?.remoteAddress || '127.0.0.1';
}

/**
 * Creates an Express middleware for rate limiting.
 */
export function createRateLimiter({
  windowMs = 15 * 60 * 1000, // 15 minutes default
  max = 10,                   // Maximum requests per window
  message = 'Too many requests. Please slow down and try again later.',
  keyGenerator = (req) => getClientIp(req),
  statusCode = 429
} = {}) {
  // Map of key -> { count: number, resetTime: number }
  const store = new Map();

  // Periodic garbage collection every 60 seconds to prevent memory leaks
  const gcInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now >= record.resetTime) {
        store.delete(key);
      }
    }
  }, 60 * 1000);

  if (gcInterval.unref) gcInterval.unref();

  return (req, res, next) => {
    const key = keyGenerator(req);
    const now = Date.now();

    let record = store.get(key);

    if (!record || now >= record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      store.set(key, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, max - record.count);
    const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

    res.setHeader('RateLimit-Limit', max);
    res.setHeader('RateLimit-Remaining', remaining);
    res.setHeader('RateLimit-Reset', resetSeconds);

    if (record.count > max) {
      res.setHeader('Retry-After', resetSeconds);
      return res.status(statusCode).json({
        error: message,
        retryAfter: resetSeconds,
        rateLimited: true
      });
    }

    next();
  };
}

// ==================== SPECIALIZED RATE LIMITERS ====================

// 1. Account Login Limiter (Keyed by IP + Identifier to prevent brute forcing single accounts)
export const loginAccountLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8,                    // 8 attempts per account/IP
  message: 'Too many failed login attempts for this account. Please wait 15 minutes before trying again.',
  keyGenerator: (req) => {
    const ip = getClientIp(req);
    const ident = (req.body?.identifier || req.body?.phone || req.body?.email || '').toLowerCase().trim();
    return `login_${ip}_${ident}`;
  }
});

// 2. Global IP Login Limiter (Limits overall login attempts from a single IP to stop credential stuffing)
export const loginIpLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // 20 total login attempts per IP
  message: 'Too many login attempts from this network. Please try again after 15 minutes.',
  keyGenerator: (req) => `login_ip_${getClientIp(req)}`
});

// 3. User Registration / Signup Limiter
export const registerLimiter = createRateLimiter({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 5,                    // 5 registrations per IP
  message: 'Account creation limit reached from this network. Please try again after 30 minutes.',
  keyGenerator: (req) => `register_${getClientIp(req)}`
});

// 4. Admin PIN & Privilege Limiter
export const adminAuthLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // 5 attempts per IP
  message: 'Too many admin authorization attempts. Access temporarily restricted. Try again in 15 minutes.',
  keyGenerator: (req) => `admin_pin_${getClientIp(req)}`
});

// 5. Email OTP Send Limiter
export const otpSendLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 4,                    // 4 requests per email/IP
  message: 'Too many OTP requests. Please wait a few minutes before requesting another code.',
  keyGenerator: (req) => {
    const ip = getClientIp(req);
    const email = (req.body?.email || '').toLowerCase().trim();
    return `otp_send_${ip}_${email}`;
  }
});

// 6. Email OTP Verification Limiter
export const otpVerifyLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8,                    // 8 verification attempts
  message: 'Too many incorrect OTP attempts. Please wait 15 minutes or request a new code.',
  keyGenerator: (req) => {
    const ip = getClientIp(req);
    const email = (req.body?.email || '').toLowerCase().trim();
    return `otp_verify_${ip}_${email}`;
  }
});

// 7. Check Email / Account Distinction Limiter (Mitigates account harvesting / user enumeration)
export const checkEmailLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,  // 1 minute
  max: 20,                  // 20 requests per minute
  message: 'Too many email checks. Please wait a moment before trying again.',
  keyGenerator: (req) => `check_email_${getClientIp(req)}`
});

// 8. Contact Form Limiter
export const contactFormLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // 5 messages per 15 minutes
  message: 'You have submitted too many messages. Please wait 15 minutes before sending another inquiry.',
  keyGenerator: (req) => `contact_${getClientIp(req)}`
});

// 9. Database Download Limiter
export const dbDownloadLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // 5 attempts per IP
  message: 'Database access limit exceeded. Please wait 15 minutes.',
  keyGenerator: (req) => `db_dl_${getClientIp(req)}`
});
