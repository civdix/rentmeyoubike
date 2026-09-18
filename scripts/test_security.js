import express from 'express';
import { db, initDatabase } from '../server/db.js';
import { hashPassword, verifyPassword, timingSafeCompare, generateSecureToken, sanitizeUser } from '../server/security.js';
import authRouter from '../server/routes/auth.js';
import customersRouter from '../server/routes/customers.js';
import ownersRouter from '../server/routes/owners.js';
import { authenticateUser } from '../server/middleware/rbac.js';

async function runTests() {
  console.log('🚀 Starting Security & Rate Limiting Verification Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Password Hashing & Security Tests
  console.log('--- 1. Password Hashing & Security Tests ---');
  const plain = 'Vrindavan@2026Safe';
  const hashed = await hashPassword(plain);
  assert(hashed.startsWith('$2b$12$') || hashed.startsWith('$2a$12$'), 'hashPassword produces valid bcrypt hash with 12 rounds');
  assert(hashed !== plain, 'Hashed password is not equal to plaintext');

  const correctVerify = await verifyPassword(plain, hashed);
  assert(correctVerify.match === true && correctVerify.needsRehash === false, 'verifyPassword correctly matches valid password against bcrypt hash');

  const wrongVerify = await verifyPassword('WrongPassword', hashed);
  assert(wrongVerify.match === false, 'verifyPassword rejects incorrect password');

  // 2. Legacy Migration Test
  console.log('\n--- 2. Legacy Password Migration Test ---');
  const legacyVerify = await verifyPassword('LegacyPlain123', 'LegacyPlain123');
  assert(legacyVerify.match === true && legacyVerify.needsRehash === true, 'verifyPassword recognizes legacy plaintext and flags needsRehash = true');

  // 3. Timing Safe Compare
  console.log('\n--- 3. Timing Safe Comparison Tests ---');
  assert(timingSafeCompare('7777', '7777') === true, 'timingSafeCompare succeeds for matching PINs');
  assert(timingSafeCompare('7777', '1234') === false, 'timingSafeCompare rejects non-matching PINs of same length');
  assert(timingSafeCompare('7777', '12345') === false, 'timingSafeCompare rejects different length strings safely');

  // 4. Secure Random Token
  console.log('\n--- 4. Cryptographic Token Generation Tests ---');
  const token1 = generateSecureToken('vr_usr');
  const token2 = generateSecureToken('vr_usr');
  assert(token1.startsWith('vr_usr_') && token1.length > 40, 'generateSecureToken produces prefixed high-entropy string');
  assert(token1 !== token2, 'Generated tokens are unique and non-colliding');

  // 5. Data Sanitization Tests
  console.log('\n--- 5. User Object Sanitization Tests ---');
  const dirtyUser = {
    id: 'cust-101',
    name: 'Gaurav Das',
    email: 'gaurav@example.com',
    password: '$2b$12$samplehashvalue',
    pin: '7777',
    otp: '123456',
    attempts: 3,
    role: 'customer'
  };
  const cleaned = sanitizeUser(dirtyUser);
  assert(cleaned.password === undefined, 'sanitizeUser strips password');
  assert(cleaned.pin === undefined, 'sanitizeUser strips pin');
  assert(cleaned.otp === undefined, 'sanitizeUser strips otp');
  assert(cleaned.attempts === undefined, 'sanitizeUser strips attempts');
  assert(cleaned.name === 'Gaurav Das' && cleaned.role === 'customer', 'sanitizeUser retains public fields');

  // 6. Test Express Server Setup with Routes & Rate Limiters
  console.log('\n--- 6. API Route & Rate Limiting Integration Tests ---');
  await initDatabase();

  const app = express();
  app.use(express.json());
  app.use(authenticateUser);
  app.use('/api/auth', authRouter);
  app.use('/api/customers', customersRouter);
  app.use('/api/owners', ownersRouter);

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api`;

  try {
    // Test A: Weak password rejection on signup
    const weakRegRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Weak Pass User',
        phone: '+91 99887 76655',
        email: `weak_${Date.now()}@example.com`,
        password: '123'
      })
    });
    const weakRegData = await weakRegRes.json();
    assert(weakRegRes.status === 400 && weakRegData.error?.includes('6 characters'), 'Register rejects passwords shorter than 6 characters');

    // Test B: Successful registration stores bcrypt hash in DB
    const testEmail = `sec_test_${Date.now()}@example.com`;
    const testPhone = `98${Date.now().toString().slice(-8)}`;
    const strongPass = 'SecureRadhePass@2026';
    const goodRegRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Secure Test Rider',
        phone: testPhone,
        email: testEmail,
        password: strongPass
      })
    });
    const goodRegData = await goodRegRes.json();
    assert(goodRegRes.status === 201, 'Register returns 201 Created on valid input');
    assert(goodRegData.user?.password === undefined, 'Register response does NOT leak password');

    // Inspect database record directly to verify password is NOT plaintext
    const dbCustomer = await db.prepare('SELECT * FROM customers WHERE email = ?').get(testEmail);
    assert(dbCustomer && dbCustomer.password && dbCustomer.password.startsWith('$2b$'), 'Password stored in database is a bcrypt hash starting with $2b$');
    assert(dbCustomer.password !== strongPass, 'Password in database is definitely NOT plaintext');

    // Test C: Login with correct password
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: testEmail,
        password: strongPass
      })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.success === true, 'Login succeeds with correct password');
    assert(loginData.user?.password === undefined, 'Login response does NOT leak password');
    assert(loginData.token && loginData.token.startsWith('vr_usr_'), 'Login issues cryptographically secure vr_usr token');

    // Test D: Rate limiting on login (send repeated failed logins)
    console.log('\n--- Testing Rate Limiter Trigger ---');
    let rateLimited = false;
    let rateLimitHeaderFound = false;

    for (let i = 0; i < 15; i++) {
      const failRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: 'rate_test@example.com',
          password: 'WrongPasswordEveryTime'
        })
      });

      if (failRes.headers.get('ratelimit-limit')) {
        rateLimitHeaderFound = true;
      }

      if (failRes.status === 429) {
        rateLimited = true;
        const errJson = await failRes.json();
        assert(errJson.rateLimited === true, `Rate limit triggered on attempt ${i + 1} with HTTP 429 and Retry-After`);
        break;
      }
    }
    assert(rateLimitHeaderFound, 'RateLimit standard HTTP headers present in response');
    assert(rateLimited, 'Rate limiter actively blocks brute force login attempts');

    // Test E: Public owners list does NOT expose passwords
    const ownersRes = await fetch(`${baseUrl}/owners`);
    const ownersList = await ownersRes.json();
    assert(Array.isArray(ownersList) && ownersList.length > 0, 'GET /api/owners returns array of owners');
    const anyOwnerHasPassword = ownersList.some(o => o.password !== undefined);
    assert(!anyOwnerHasPassword, 'GET /api/owners NEVER exposes password field in any row');

    // Test F: Customer details cannot be fetched unauthenticated
    const unauthCustRes = await fetch(`${baseUrl}/customers/cust-1`);
    assert(unauthCustRes.status === 401, 'GET /api/customers/:id correctly rejects unauthenticated requests');

  } finally {
    server.close();
  }

  console.log(`\n========================================`);
  console.log(`Summary: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
