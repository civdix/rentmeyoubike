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

/**
 * Universal email dispatcher supporting:
 * 1. HTTPS Email API (EMAIL_API_TOKEN / EMAIL_API_ENDPOINT)
 * 2. Resend REST API (RESEND_API_KEY)
 * 3. Nodemailer SMTP (IPv4 direct)
 */
export async function sendEmail({ to, subject, text, html }) {
  const normalized = normalizeEmail(to);
  const senderEmail = process.env.SMTP_USER || 'no-reply@rentoncent.bond';

  if (!normalized) {
    return { success: false, error: 'Recipient email address is invalid or empty' };
  }

  const cleanSubject = String(subject || 'Rent on Cent Notification').trim();
  const plainText = String(text || '').trim();
  const htmlContent = String(html || plainText).trim();

  // 1. Primary: If EMAIL_API_TOKEN is configured, use HTTPS email API (Port 443, reliable on Render)
  if (process.env.EMAIL_API_TOKEN) {
    try {
      const endpoint = process.env.EMAIL_API_ENDPOINT || 'https://shivamdixit.vercel.app/api/send-email';
      const headerSubject = /[^\x20-\x7E]/.test(cleanSubject)
        ? `=?UTF-8?B?${Buffer.from(cleanSubject, 'utf-8').toString('base64')}?=`
        : cleanSubject;

      const singleLineHtml = htmlContent.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
      const headerHtml = Array.from(singleLineHtml)
        .map((char) => (char.codePointAt(0) > 127 ? `&#${char.codePointAt(0)};` : char))
        .join('');

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
        console.log(`✉️ [EmailAPI] Email delivered to ${normalized} via ${endpoint}`);
        return { success: true };
      } else {
        const errText = await apiRes.text().catch(() => '');
        console.warn(`⚠️ [EmailAPI] Send returned HTTP ${apiRes.status}:`, errText);
      }
    } catch (apiErr) {
      console.warn('⚠️ [EmailAPI] Request failed:', apiErr.message);
    }
  }

  // 2. Secondary: If RESEND_API_KEY is configured, use Resend REST API
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Rent on Cent <onboarding@resend.dev>',
          to: [normalized],
          subject: cleanSubject,
          text: plainText,
          html: htmlContent
        })
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`✉️ [Resend] Email sent to ${normalized} (Message ID: ${data.id})`);
        return { success: true, messageId: data.id };
      } else {
        console.warn('⚠️ [Resend] API error:', data);
      }
    } catch (resendErr) {
      console.warn('⚠️ [Resend] Request failed:', resendErr.message);
    }
  }

  // 3. Fallback: Nodemailer SMTP
  try {
    const transporter = await getTransporter();
    if (transporter) {
      const info = await transporter.sendMail({
        from: `"Rent on Cent" <${senderEmail}>`,
        to: normalized,
        subject: cleanSubject,
        text: plainText,
        html: htmlContent
      });
      console.log(`✉️ [SMTP] Email sent to ${normalized} (Message ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    }
  } catch (err) {
    console.error(`⚠️ SMTP error for ${normalized}: ${err.message}.`);
    cachedTransporter = null;
  }

  return {
    success: true,
    message: `Email queued for ${normalized}`
  };
}

export async function sendEmailOtp(toEmail, otp, role = 'customer') {
  const normalized = normalizeEmail(toEmail);
  const subject = `🌸 Your Rent to Cent Verification Code: ${otp}`;
  const text = `Radhe Radhe!\n\nYour 6-digit verification code is: ${otp}\n\nValid for 10 minutes. Please do not share this OTP with anyone.\n\nRent to Cent`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 480px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
      <h2 style="color: #059669; margin-top: 0; font-size: 20px;">🌸 Rent to Cent</h2>
      <p style="color: #334155; font-size: 14px;">Radhe Radhe! Your email verification code is:</p>
      <div style="background: #ecfdf5; border: 2px dashed #059669; padding: 16px; text-align: center; border-radius: 12px; margin: 20px 0;">
        <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #065f46;">${otp}</span>
      </div>
      <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">This OTP code is valid for 10 minutes. If you did not request this, please disregard this email.</p>
    </div>
  `;

  return sendEmail({ to: normalized, subject, text, html });
}

/**
 * Dispatches an immediate booking notification email to the platform administrator
 */
export async function sendBookingNotificationToAdmin(booking) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'admin@rentoncent.bond';
  const ref = booking.id || 'NEW';
  const vehicleName = booking.vehicleName || 'Rental Bike / Scooter';
  const subject = `🛵 New Booking Received #${ref} - ${vehicleName}`;

  const text =
    `Radhe Radhe Admin!\n\n` +
    `A new rental booking has been received on Rent to Cent:\n\n` +
    `📋 Booking Reference: #${ref}\n` +
    `🛵 Vehicle: ${vehicleName} (${booking.vehicleId || 'N/A'})\n` +
    `👤 Customer Name: ${booking.customerName || 'Pilgrim'}\n` +
    `📞 Customer Phone: ${booking.customerPhone || 'Not provided'}\n` +
    `✉️ Customer Email: ${booking.customerEmail || 'Not provided'}\n` +
    `📅 Rental Dates: ${booking.startDate} to ${booking.endDate} (${booking.totalDays || 1} day(s))\n` +
    `💰 Total Amount: ₹${booking.totalAmount || 0}\n` +
    `📍 Pickup Location: ${booking.pickupLocation || 'Vrindavan'}\n` +
    `💬 Channel / Type: ${booking.source || 'WhatsApp / 1-Click Booking'}\n` +
    `🕒 Received At: ${booking.createdAt || new Date().toLocaleString()}\n\n` +
    `Open Admin Console to view and manage: https://rentoncent.bond/admin`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; max-width: 560px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
      <div style="background: #059669; color: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
        <h2 style="margin: 0; font-size: 20px; font-weight: bold;">🌸 New Booking Received!</h2>
        <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.95;">Reference: <strong>#${ref}</strong> • Channel: ${booking.source || 'WhatsApp / 1-Click'}</p>
      </div>

      <h3 style="font-size: 15px; color: #0f172a; margin-top: 0; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
        Booking &amp; Customer Details
      </h3>

      <table style="width: 100%; border-collapse: collapse; font-size: 13px; line-height: 1.6; margin-bottom: 24px;">
        <tbody>
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 38%;">Vehicle:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${vehicleName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Customer Name:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${booking.customerName || 'Guest Pilgrim'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Customer Phone:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #059669;">
              <a href="tel:${booking.customerPhone}" style="color: #059669; text-decoration: none;">${booking.customerPhone || 'N/A'}</a>
              ${booking.customerPhone ? `<a href="https://wa.me/${String(booking.customerPhone).replace(/[^0-9]/g, '')}" style="margin-left: 8px; font-size: 11px; color: #25D366; text-decoration: underline;">(WhatsApp)</a>` : ''}
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Customer Email:</td>
            <td style="padding: 6px 0; color: #0f172a;">${booking.customerEmail || 'None provided'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Rental Period:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${booking.startDate} to ${booking.endDate} (${booking.totalDays || 1} day(s))</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Total Amount:</td>
            <td style="padding: 6px 0; font-weight: 800; color: #0f172a; font-size: 16px;">₹${booking.totalAmount || 0}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Pickup Location:</td>
            <td style="padding: 6px 0; color: #0f172a;">${booking.pickupLocation || 'Prem Mandir Area, Vrindavan'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Status:</td>
            <td style="padding: 6px 0; color: #d97706; font-weight: bold;">${booking.status || 'Inquiry'}</td>
          </tr>
        </tbody>
      </table>

      <div style="text-align: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9;">
        <a href="https://rentoncent.bond/admin" style="background: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold; font-size: 13px; display: inline-block;">
          Open Admin Control Center
        </a>
      </div>
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 16px; margin-bottom: 0;">
        Automated alert from Rent on Cent booking dispatch system.
      </p>
    </div>
  `;

  console.log(`📢 Dispatching new booking notification to admin (${adminEmail}) for Ref: #${ref}...`);
  return sendEmail({ to: adminEmail, subject, text, html });
}

/**
 * Dispatches an HTML digest email to Admin when customer messages remain unread for too long
 */
export async function sendPendingMessagesAlertToAdmin({ unreadMessages, conversationsCount, totalUnreadCount }) {
  const adminEmail = process.env.ADMIN_EMAIL || 'shivdixittt@gmail.com';
  const subject = `🔔 Action Required: ${totalUnreadCount} Pending Customer Messages on Rent on Cent`;

  let text = `Radhe Radhe Admin!\n\n` +
    `You have ${totalUnreadCount} unread customer message(s) across ${conversationsCount} conversation(s) awaiting response on Rent on Cent.\n\n` +
    `--- PENDING MESSAGES SUMMARY ---\n`;

  for (const msg of unreadMessages) {
    text += `\n👤 Customer: ${msg.customerName || 'Customer'} (${msg.customerPhone || 'N/A'})\n` +
      `📋 Booking Ref: #${msg.bookingId || 'Inquiry'}\n` +
      `💬 Message: "${msg.text}"\n` +
      `🕒 Sent At: ${msg.createdAt}\n` +
      `📱 WhatsApp: https://wa.me/${String(msg.customerPhone || '').replace(/[^0-9]/g, '')}\n`;
  }

  text += `\n👉 Reply directly in Admin Live Chat: https://rentoncent.bond/admin?tab=chat\n`;

  const conversationCardsHtml = unreadMessages.map((msg) => {
    const cleanPhone = String(msg.customerPhone || '').replace(/[^0-9]/g, '');
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Radhe Radhe ${msg.customerName || ''}! I am replying from Rent on Cent regarding your message.`)}`
      : null;

    return `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 14px;">
        <div style="margin-bottom: 8px;">
          <strong style="color: #0f172a; font-size: 14px;">${msg.customerName || 'Guest Customer'}</strong>
          ${msg.bookingId ? `<span style="background: #e0e7ff; color: #3730a3; font-family: monospace; font-size: 11px; padding: 2px 8px; border-radius: 6px; margin-left: 6px; font-weight: bold;">Ref: #${msg.bookingId}</span>` : ''}
        </div>

        <div style="font-size: 12px; color: #475569; margin-bottom: 10px;">
          📞 Phone: <a href="tel:${cleanPhone}" style="color: #059669; text-decoration: none; font-weight: bold;">${msg.customerPhone || 'Not provided'}</a>
        </div>

        <div style="background: #ffffff; border-left: 4px solid #10b981; border-radius: 6px; padding: 12px 14px; margin-bottom: 12px; font-size: 13px; color: #1e293b; line-height: 1.5; white-space: pre-line;">
          ${msg.text}
        </div>

        <div>
          <a href="https://rentoncent.bond/admin?tab=chat" style="background: #059669; color: #ffffff; text-decoration: none; padding: 7px 16px; border-radius: 8px; font-size: 12px; font-weight: bold; display: inline-block;">
            💬 Reply in Admin Chat
          </a>
          ${waUrl ? `
            <a href="${waUrl}" style="background: #25D366; color: #ffffff; text-decoration: none; padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: bold; display: inline-block; margin-left: 6px;">
              WhatsApp Customer
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 22px; border-radius: 12px; margin-bottom: 20px;">
        <div style="display: inline-block; background: #ef4444; color: #ffffff; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
          Action Required
        </div>
        <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff;">
          🔔 ${totalUnreadCount} Pending Customer Message${totalUnreadCount > 1 ? 's' : ''}
        </h2>
        <p style="margin: 6px 0 0; font-size: 13px; color: #94a3b8;">
          Rent on Cent Vrindavan • Awaiting Admin Response
        </p>
      </div>

      <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: #92400e;">
        ⚠️ <strong>${conversationsCount} customer(s)</strong> have sent inquiries that have not yet been opened or answered in Live Chat.
      </div>

      <h3 style="font-size: 14px; color: #0f172a; margin-top: 0; margin-bottom: 12px; font-weight: 700;">
        Pending Customer Inquiries:
      </h3>

      ${conversationCardsHtml}

      <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
        <a href="https://rentoncent.bond/admin?tab=chat" style="background: #059669; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 800; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.2);">
          👉 Open Admin Live Chat Room
        </a>
      </div>

      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 20px; margin-bottom: 0;">
        Automated alert from Rent on Cent Dispatch Service. Admin email: ${adminEmail}
      </p>
    </div>
  `;

  console.log(`📢 Dispatching pending messages alert to admin (${adminEmail}) for ${totalUnreadCount} message(s)...`);
  return sendEmail({ to: adminEmail, subject, text, html });
}

export default {
  isValidEmail,
  normalizeEmail,
  sendEmail,
  sendEmailOtp,
  sendBookingNotificationToAdmin,
  sendPendingMessagesAlertToAdmin
};
