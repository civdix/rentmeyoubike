import express from 'express';

const router = express.Router();

// Email format regex (RFC 5322 compatible format check)
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
 * POST /api/contact
 * Handles contact form submissions and securely forwards them to the external email API.
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    // 1. Validate Visitor Name
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Please enter your name.' });
    }
    const cleanName = name.trim();
    if (cleanName.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long.' });
    }
    if (cleanName.length > 100) {
      return res.status(400).json({ error: 'Name cannot exceed 100 characters.' });
    }

    // 2. Validate Email
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Please enter your email address.' });
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address (e.g. name@domain.com).' });
    }

    // 3. Validate Subject
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

    // 4. Validate Message
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

    // 5. Verify server-side authorization token exists
    const emailApiToken = process.env.EMAIL_API_TOKEN;
    if (!emailApiToken || !emailApiToken.trim()) {
      console.error('[ContactAPI] Missing EMAIL_API_TOKEN in server environment variables.');
      return res.status(500).json({
        error: 'Email service is not configured on the server (missing authorization token).'
      });
    }

    // 6. Safely sanitize and escape all user-provided values before HTML embedding
    const safeName = escapeHtml(cleanName);
    const safeEmail = escapeHtml(cleanEmail);
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
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 24px; color: #ffffff;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 700;">&#127800; Vrindavan Rides &mdash; Contact Inquiry</h2>
            <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">New message submitted via website contact form</p>
          </div>

          <!-- Content Body -->
          <div style="padding: 24px;">
            <!-- Metadata Box -->
            <div style="margin-bottom: 20px; padding: 16px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #edf2f7;">
              <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>From:</strong> ${safeName} &lt;<a href="mailto:${safeEmail}" style="color: #059669; text-decoration: none;">${safeEmail}</a>&gt;</p>
              <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Subject:</strong> ${safeSubject}</p>
              <p style="margin: 0; font-size: 12px; color: #64748b;"><strong>Received:</strong> ${new Date().toUTCString()}</p>
            </div>

            <!-- Message Box -->
            <div style="border-left: 4px solid #059669; padding: 12px 16px; background-color: #ffffff; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">Message Content:</h4>
              <div style="font-size: 15px; line-height: 1.6; color: #0f172a;">${safeMessageBody}</div>
            </div>
          </div>

          <!-- Footer Note -->
          <div style="background-color: #f1f5f9; padding: 16px 24px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0;">
            Reply directly to this email to contact <strong>${safeName}</strong> at 
            <a href="mailto:${safeEmail}" style="color: #059669; text-decoration: none;">${safeEmail}</a>.
          </div>
        </div>
      </body>
      </html>
    `.trim();

    // 7. Prepare ByteString-safe header values
    const headerSubject = formatHeaderSubject(cleanSubject);
    const headerHtml = toAsciiHtml(sanitizedHtml);

    // 8. Submit request server-side to external email API
    const targetEndpoint = process.env.EMAIL_API_ENDPOINT || 'https://shivamdixit.vercel.app/api/send-email';

    const externalResponse = await fetch(targetEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailApiToken.trim()}`,
        'X-Email-Subject': headerSubject,
        'X-Email-HTML': headerHtml,
        'X-Email-Reply-To': cleanEmail
      }
    });

    // 9. Handle responses per requirements:
    // "Show a success message only when the API returns HTTP 200."
    // "Show a useful error message for validation, unauthorized, or server errors."
    if (externalResponse.status === 200) {
      console.log(`✉️ [ContactAPI] Message successfully forwarded for ${cleanEmail}`);
      return res.status(200).json({
        success: true,
        message: 'Your message has been sent successfully. We will get back to you shortly!'
      });
    }

    let responseBodyText = '';
    try {
      responseBodyText = await externalResponse.text();
    } catch {
      responseBodyText = '';
    }

    if (externalResponse.status === 401 || externalResponse.status === 403) {
      console.error(`[ContactAPI] External email API unauthorized (${externalResponse.status}):`, responseBodyText);
      return res.status(401).json({
        error: 'Email service authorization failed. Please check server authorization token.'
      });
    }

    if (externalResponse.status === 404) {
      console.error(`[ContactAPI] External email endpoint not found (${externalResponse.status}):`, targetEndpoint);
      return res.status(404).json({
        error: 'External email service endpoint not found (HTTP 404). Please contact support.'
      });
    }

    console.error(`[ContactAPI] External email API error status ${externalResponse.status}:`, responseBodyText);
    return res.status(externalResponse.status >= 400 && externalResponse.status < 600 ? externalResponse.status : 502).json({
      error: `Email delivery failed: ${responseBodyText || `External service returned HTTP ${externalResponse.status}`}`
    });

  } catch (error) {
    console.error('[ContactAPI] Internal server error handling contact submission:', error);
    return res.status(500).json({
      error: `Server error while processing your request: ${error.message}`
    });
  }
});

export default router;
