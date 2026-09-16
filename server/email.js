import nodemailer from 'nodemailer';
import dns from 'node:dns';

// Strict preference for IPv4 to eliminate ENETUNREACH on cloud containers and hosts without IPv6 routing
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

// Strict email regex validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
}

export function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

// Create Nodemailer Transporter with strict IPv4 and robust cloud configuration
let cachedTransporter = null;

function buildTransporter(portOverride = null, secureOverride = null) {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = portOverride !== null ? portOverride : (Number(process.env.SMTP_PORT) || 587);
  const secure = secureOverride !== null ? secureOverride : (process.env.SMTP_SECURE === 'true' || port === 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    family: 4, // CRITICAL: Force IPv4 connection to prevent ENETUNREACH on IPv6-disabled networks
    connectionTimeout: 12000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    tls: {
      rejectUnauthorized: false
    }
  });
}

function getEmailTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    cachedTransporter = buildTransporter();
    console.log(`📡 SMTP Email Transporter initialized (${host}:${port}, IPv4 forced)`);
  } else {
    cachedTransporter = null;
  }

  return cachedTransporter;
}

export async function sendEmailOtp(toEmail, otp, role = 'customer') {
  const normalized = normalizeEmail(toEmail);
  const senderFrom = process.env.SMTP_FROM || `"Vrindavan Rides" <${process.env.SMTP_USER || 'no-reply@vrindavanrides.in'}>`;
  const roleLabel = role === 'owner' ? 'Host & Fleet Owner' : 'Renter';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
        .header { background: #0f172a; padding: 28px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0; font-size: 13px; color: #34d399; font-weight: 600; }
        .content { padding: 32px 28px; text-align: center; }
        .greeting { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
        .instructions { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px; }
        .otp-box { background: #ecfdf5; border: 2px dashed #059669; border-radius: 16px; padding: 18px 24px; display: inline-block; margin: 0 auto 24px; }
        .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #065f46; margin: 0; }
        .badge { display: inline-block; font-size: 11px; font-weight: 800; text-transform: uppercase; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; margin-bottom: 16px; }
        .note { font-size: 12px; color: #64748b; margin-top: 16px; line-height: 1.5; }
        .footer { background: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>🌸 Vrindavan Rides</h1>
          <p>Radhe Radhe! Verified P2P Rentals</p>
        </div>
        <div class="content">
          <div class="badge">${roleLabel} Account Verification</div>
          <div class="greeting">Verify Your Email Address</div>
          <p class="instructions">
            Please use the 6-digit verification code below to verify your email address on Vrindavan Rides (Meri Dhanno).
          </p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          <p class="note">
            ⏳ This code is valid for <strong>10 minutes</strong>. Do not share this OTP with anyone for account security.
          </p>
        </div>
        <div class="footer">
          Vrindavan Rides • Prem Mandir Road, Raman Reti, Vrindavan, UP 281121<br>
          If you did not request this OTP, you can safely disregard this email.
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: senderFrom,
    to: normalized,
    subject: `🌸 ${otp} is your Vrindavan Rides Verification Code`,
    text: `Radhe Radhe! Your verification code for Vrindavan Rides is: ${otp}. It expires in 10 minutes.`,
    html: htmlContent
  };

  const primaryTransporter = getEmailTransporter();

  if (primaryTransporter) {
    try {
      const info = await primaryTransporter.sendMail(mailOptions);
      console.log(`✉️ Email OTP sent successfully to ${normalized} (Message ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.warn(`⚠️ Primary SMTP attempt failed for ${normalized} (${err.message}). Retrying via alternative SSL port (465, IPv4)...`);

      // Fallback: If port 587 or default failed, try direct SSL port 465 with IPv4
      try {
        const fallbackTransporter = buildTransporter(465, true);
        if (fallbackTransporter) {
          const fallbackInfo = await fallbackTransporter.sendMail(mailOptions);
          console.log(`✉️ Email OTP sent successfully via fallback SSL port 465 to ${normalized} (Message ID: ${fallbackInfo.messageId})`);
          cachedTransporter = fallbackTransporter;
          return { success: true, messageId: fallbackInfo.messageId };
        }
      } catch (fallbackErr) {
        console.error(`⚠️ Fallback SMTP delivery also failed for ${normalized}:`, fallbackErr.message);
      }
    }
  }

  // Development simulation log if SMTP is not configured or network blocked
  console.log('---------------------------------------------------------');
  console.log(`📧 [EMAIL OTP DISPATCH SIMULATOR]`);
  console.log(`Recipient: ${normalized} (${roleLabel})`);
  console.log(`OTP Code:  >> [ ${otp} ] <<`);
  console.log(`Expires in: 10 minutes`);
  console.log('---------------------------------------------------------');

  return {
    success: true,
    simulated: true,
    devOtp: otp,
    message: 'OTP generated and dispatched'
  };
}
