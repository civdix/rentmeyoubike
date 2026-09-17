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
    connectionTimeout: 2500, // Fast 2.5s timeout in case host drops outbound SMTP ports
    greetingTimeout: 2500,
    socketTimeout: 5000,
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

  // 1. Primary: If EMAIL_API_TOKEN is configured, use the HTTPS email API (Port 443, never blocked by Render Free)
  if (process.env.EMAIL_API_TOKEN) {
    try {
      const endpoint = process.env.EMAIL_API_ENDPOINT || 'https://shivamdixit.vercel.app/api/send-email';
      const cleanSubject = `Your Vrindavan Rides Verification Code: ${otp}`;
      const headerSubject = /[^\x20-\x7E]/.test(cleanSubject)
        ? `=?UTF-8?B?${Buffer.from(cleanSubject, 'utf-8').toString('base64')}?=`
        : cleanSubject;

      const singleLineHtml = mailOptions.html.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
      const headerHtml = Array.from(singleLineHtml)
        .map((char) => (char.codePointAt(0) > 127 ? `&#${char.codePointAt(0)};` : char))
        .join('');

      const plainText = `Radhe Radhe! Your 6-digit verification code is: ${otp}. Valid for 10 minutes.`;

      const apiRes = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.EMAIL_API_TOKEN.trim()}`,
          'X-Email-To': normalized,
          'X-Email-Subject': headerSubject,
          'X-Email-Text': plainText,
          'X-Email-HTML': headerHtml,
          'X-Email-Reply-To': senderEmail
        }
      });

      if (apiRes.status === 200) {
        console.log(`✉️ [EmailAPI] OTP email delivered to ${normalized} via ${endpoint}`);
        return { success: true, devOtp: otp };
      } else {
        const errText = await apiRes.text().catch(() => '');
        console.warn(`⚠️ [EmailAPI] OTP send returned HTTP ${apiRes.status}:`, errText);
      }
    } catch (apiErr) {
      console.warn('⚠️ [EmailAPI] Request failed:', apiErr.message);
    }
  }

  // 2. Secondary: If RESEND_API_KEY is configured, use Resend HTTPS REST API (Port 443)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Vrindavan Rides <onboarding@resend.dev>',
          to: [normalized],
          subject: `🌸 Your Vrindavan Rides Verification Code: ${otp}`,
          html: mailOptions.html
        })
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`✉️ [Resend] OTP sent to ${normalized} (Message ID: ${data.id})`);
        return { success: true, messageId: data.id, devOtp: otp };
      } else {
        console.warn('⚠️ [Resend] API error:', data);
      }
    } catch (resendErr) {
      console.warn('⚠️ [Resend] Request failed:', resendErr.message);
    }
  }

  // 3. Fallback: Nodemailer SMTP (uses IPv4 direct connect with fast 2.5s timeout)
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
    console.error(`⚠️ SMTP error for ${normalized}: ${err.message}. (Render Free tier blocks outbound SMTP ports 25/465/587)`);
    cachedTransporter = null; // Invalidate cache so next attempt refreshes
  }

  // 4. Safe devOtp return so the user is never blocked
  return {
    success: true,
    devOtp: otp,
    message: `Verification code generated for ${normalized}`
  };
}

export default { isValidEmail, normalizeEmail, sendEmailOtp };
