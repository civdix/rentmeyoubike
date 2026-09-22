import express from 'express';
import { contactFormLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// Email format regex (RFC 5322 compatible check)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Escapes special HTML characters to prevent XSS / HTML injection in email clients.
 */
function escapeHtml(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Encodes all non-ASCII characters as numeric HTML entities and collapses newlines.
 * Ensures the HTML string contains only 7-bit ASCII characters (< 128) and no newlines,
 * allowing it to be safely transported in HTTP Headers (RFC 7230 / RFC 9110) without ByteString errors.
 */
function toAsciiHtml(str) {
  if (!str || typeof str !== 'string') return '';
  const singleLine = str.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  return Array.from(singleLine)
    .map((char) => {
      const code = char.codePointAt(0);
      return code > 127 ? `&#${code};` : char;
    })
    .join('');
}

/**
 * Prepares the Subject for an HTTP Header.
 * Uses RFC 2047 MIME encoded-word format if any non-ASCII characters are present,
 * ensuring ByteString compatibility with HTTP headers while retaining full Unicode in mail clients.
 */
function formatHeaderSubject(subject) {
  if (!subject || typeof subject !== 'string') return '';
  const clean = subject.replace(/[\r\n]+/g, ' ').trim();
  const hasNonAscii = /[^\x20-\x7E]/.test(clean);
  if (!hasNonAscii) return clean;
  return `=?UTF-8?B?${Buffer.from(clean, 'utf-8').toString('base64')}?=`;
}

/**
 * Formats plain text for an HTTP Header value.
 * Collapses newlines to space and encodes non-ASCII characters safely.
 */
function formatHeaderText(text) {
  if (!text || typeof text !== 'string') return '';
  const clean = text.replace(/[\r\n]+/g, ' ').trim();
  const hasNonAscii = /[^\x20-\x7E]/.test(clean);
  if (!hasNonAscii) return clean;
  return `=?UTF-8?B?${Buffer.from(clean, 'utf-8').toString('base64')}?=`;
}

/**
 * POST /api/contact
 * Handles contact form submissions and securely forwards them to the external email API.
 */
router.post('/', contactFormLimiter, async (req, res) => {
  try {
    const { name, email, to, subject, message } = req.body || {};

    // 1. Validation (Returns HTTP 400 on failure)
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Please enter your email address.' });
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address (e.g. name@domain.com).' });
    }

    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return res.status(400).json({ error: 'Please enter a subject.' });
    }
    const cleanSubject = subject.trim();
    if (cleanSubject.length < 3) {
      return res.status(400).json({ error: 'Subject must be at least 3 characters long.' });
    }
    if (cleanSubject.length > 200) {
      return res.status(400).json({ error: 'Subject cannot exceed 200 characters.' });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Please enter your message.' });
    }
    const cleanMessage = message.trim();
    if (cleanMessage.length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters long.' });
    }
    if (cleanMessage.length > 5000) {
      return res.status(400).json({ error: 'Message cannot exceed 5000 characters.' });
    }

    // Optional visitor name
    const cleanName = (name && typeof name === 'string') ? name.trim() : cleanEmail.split('@')[0];

    // 2. Resolve Recipient Email (X-Email-To)
    // Supports dynamic recipient provided in body (e.g. vehicle host, specific admin, or department)
    // with fallback to EMAIL_API_TO environment variable or site owner email
    let recipientEmail = '';
    if (to && typeof to === 'string' && to.trim()) {
      const cleanTo = to.trim().toLowerCase();
      if (!EMAIL_REGEX.test(cleanTo)) {
        return res.status(400).json({ error: 'Recipient email address (to) is invalid.' });
      }
      recipientEmail = cleanTo;
    } else {
      recipientEmail = (
        process.env.EMAIL_API_TO ||
        process.env.CONTACT_EMAIL_RECIPIENT ||
        process.env.SMTP_USER ||
        'dixitshivam249@gmail.com'
      ).trim();
    }

    // 3. Authentication: Verify server-side EMAIL_API_TOKEN (Returns HTTP 401 if missing)
    const emailApiToken = process.env.EMAIL_API_TOKEN;
    if (!emailApiToken || !emailApiToken.trim()) {
      console.error('[ContactAPI] Missing EMAIL_API_TOKEN in server environment variables.');
      return res.status(401).json({
        error: 'Unauthorized: EMAIL_API_TOKEN is not configured on the server.'
      });
    }

    const targetEndpoint = process.env.EMAIL_API_ENDPOINT || 'https://shivamdixit.vercel.app/api/send-email';

    // 4. Safely sanitize and build HTML body
    const safeName = escapeHtml(cleanName);
    const safeEmail = escapeHtml(cleanEmail);
    const safeRecipient = escapeHtml(recipientEmail);
    const safeSubject = escapeHtml(cleanSubject);
    const safeMessageBody = escapeHtml(cleanMessage).replace(/\n/g, '<br/>');

    const sanitizedHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 24px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 24px; color: #ffffff;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 700;">&#127800; Rent on Cent &mdash; Contact Inquiry</h2>
            <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">New message submitted via website contact form</p>
          </div>
          <div style="padding: 24px;">
            <div style="margin-bottom: 20px; padding: 16px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #edf2f7;">
              <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>To:</strong> <a href="mailto:${safeRecipient}" style="color: #059669; text-decoration: none;">${safeRecipient}</a></p>
              <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>From:</strong> ${safeName} &lt;<a href="mailto:${safeEmail}" style="color: #059669; text-decoration: none;">${safeEmail}</a>&gt;</p>
              <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Subject:</strong> ${safeSubject}</p>
              <p style="margin: 0; font-size: 12px; color: #64748b;"><strong>Received:</strong> ${new Date().toUTCString()}</p>
            </div>
            <div style="border-left: 4px solid #059669; padding: 12px 16px; background-color: #ffffff; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">Message Content:</h4>
              <div style="font-size: 15px; line-height: 1.6; color: #0f172a;">${safeMessageBody}</div>
            </div>
          </div>
          <div style="background-color: #f1f5f9; padding: 16px 24px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0;">
            Reply directly to this email to contact <strong>${safeName}</strong> at 
            <a href="mailto:${safeEmail}" style="color: #059669; text-decoration: none;">${safeEmail}</a>.
          </div>
        </div>
      </body>
      </html>
    `.trim();

    // 5. Prepare Headers
    // Required headers:
    //   Authorization: Bearer ${EMAIL_API_TOKEN}
    //   X-Email-To: recipient@example.com (Dynamic or configured)
    //   X-Email-Subject: New contact form message
    //   X-Email-Text: Plain text message content
    // Optional headers:
    //   X-Email-HTML: <h2>New message</h2><p>Message content</p>
    //   X-Email-Reply-To: visitor@example.com
    const headerSubject = formatHeaderSubject(cleanSubject);
    const headerText = formatHeaderText(cleanMessage);
    const headerHtml = toAsciiHtml(sanitizedHtml);

    const emailHeaders = {
      'Authorization': `Bearer ${emailApiToken.trim()}`,
      'X-Email-To': recipientEmail,
      'X-Email-Subject': headerSubject,
      'X-Email-Text': headerText,
      'X-Email-Reply-To': cleanEmail,
      'X-Email-HTML': headerHtml
    };

    // 6. Submit request server-side
    let externalResponse;
    try {
      externalResponse = await fetch(targetEndpoint, {
        method: 'POST',
        headers: emailHeaders
      });
    } catch (networkErr) {
      console.error('[ContactAPI] Network connection error to email service:', networkErr.message);
      return res.status(502).json({
        error: `Bad Gateway: Unable to connect to email API (${networkErr.message}). Please try again later.`
      });
    }

    // 7. Handle response status codes
    // Requirement: Show success only for HTTP 200
    if (externalResponse.status === 200) {
      console.log(`✉️ [ContactAPI] Message successfully dispatched for ${cleanEmail} -> ${recipientEmail}`);
      return res.status(200).json({
        success: true,
        to: recipientEmail,
        message: 'Your message has been sent successfully. We will get back to you shortly!'
      });
    }

    let responseBodyText = '';
    try {
      responseBodyText = await externalResponse.text();
    } catch {
      responseBodyText = '';
    }

    // Requirement: Handle HTTP 400
    if (externalResponse.status === 400) {
      console.error('[ContactAPI] Upstream email service rejected request (400):', responseBodyText);
      return res.status(400).json({
        error: `Bad Request: Email service rejected the parameters (${responseBodyText || 'Invalid request'}).`
      });
    }

    // Requirement: Handle HTTP 401
    if (externalResponse.status === 401 || externalResponse.status === 403) {
      console.error(`[ContactAPI] Upstream email API unauthorized (${externalResponse.status}):`, responseBodyText);
      return res.status(401).json({
        error: 'Unauthorized: Email service authorization failed. Please check EMAIL_API_TOKEN.'
      });
    }

    // Requirement: Handle HTTP 502 (and other upstream failures)
    console.error(`[ContactAPI] Upstream email API returned status ${externalResponse.status}:`, responseBodyText);
    return res.status(502).json({
      error: `Bad Gateway: Email delivery failed upstream (HTTP ${externalResponse.status}: ${responseBodyText || 'Service error'}).`
    });

  } catch (error) {
    console.error('[ContactAPI] Internal server error handling contact submission:', error);
    return res.status(502).json({
      error: `Bad Gateway: Server error processing email delivery (${error.message}).`
    });
  }
});

export default router;
