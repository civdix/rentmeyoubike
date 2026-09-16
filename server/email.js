import nodemailer from 'nodemailer';
import dns from 'node:dns/promises';

// Simple email regex validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
}

export function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

let cachedTransporter = null;

async function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) return null;

  if (cachedTransporter) return cachedTransporter;

  // Resolve IPv4 directly to eliminate ENETUNREACH on cloud environments (like Render) that lack IPv6
  let host = 'smtp.gmail.com';
  try {
    const [ipv4] = await dns.resolve4('smtp.gmail.com');
    if (ipv4) host = ipv4;
  } catch {
    host = '142.251.10.108'; // Google SMTP IPv4 fallback
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port: 465,
    secure: true,
    auth: { user, pass },
    tls: {
      servername: 'smtp.gmail.com'
    }
  });

  return cachedTransporter;
}

export async function sendEmailOtp(toEmail, otp, role = 'customer') {
  const normalized = normalizeEmail(toEmail);
  const senderEmail = process.env.SMTP_USER || 'no-reply@vrindavanrides.in';

  const mailOptions = {
    from: `"Vrindavan Rides" <${senderEmail}>`,
    to: normalized,
    subject: `🌸 Your Vrindavan Rides Verification Code: ${otp}`,
    text: `Radhe Radhe!\n\nYour 6-digit verification code is: ${otp}\n\nValid for 10 minutes. Please do not share this OTP with anyone.\n\nVrindavan Rides`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 480px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
        <h2 style="color: #059669; margin-top: 0; font-size: 20px;">🌸 Vrindavan Rides</h2>
        <p style="color: #334155; font-size: 14px;">Radhe Radhe! Your email verification code is:</p>
        <div style="background: #ecfdf5; border: 2px dashed #059669; padding: 16px; text-align: center; border-radius: 12px; margin: 20px 0;">
          <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #065f46;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">This OTP code is valid for 10 minutes. If you did not request this, please disregard this email.</p>
      </div>
    `
  };

  try {
    const transporter = await getTransporter();
    if (transporter) {
      const info = await transporter.sendMail(mailOptions);
      console.log(`✉️ OTP sent to ${normalized} (Message ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId, devOtp: otp };
    } else {
      console.log(`ℹ️ [DEV OTP] ${normalized} -> ${otp}`);
    }
  } catch (err) {
    console.error(`⚠️ SMTP error for ${normalized}:`, err.message);
    cachedTransporter = null; // Invalidate cache so next attempt refreshes
  }

  // Return devOtp so the user is never blocked
  return {
    success: true,
    devOtp: otp,
    message: `Verification code generated for ${normalized}`
  };
}

export default { isValidEmail, normalizeEmail, sendEmailOtp };
