import ImageKit from 'imagekit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Strict 5 MB maximum file upload limit (5 * 1024 * 1024 bytes)
export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024; // 5,242,880 bytes

// Uploads directory for local dev simulation fallback
const DEV_UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(DEV_UPLOADS_DIR)) {
  fs.mkdirSync(DEV_UPLOADS_DIR, { recursive: true });
}

// Check if ImageKit credentials are provided in environment
export function isImageKitConfigured() {
  return Boolean(
    process.env.IMAGEKIT_PUBLIC_KEY &&
    process.env.IMAGEKIT_PRIVATE_KEY &&
    process.env.IMAGEKIT_URL_ENDPOINT
  );
}

// Initialize ImageKit client if keys are present
let imagekitInstance = null;
export function getImageKitClient() {
  if (!imagekitInstance && isImageKitConfigured()) {
    imagekitInstance = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
  }
  return imagekitInstance;
}

// Get client-side upload authentication parameters
export function getUploadAuthParameters() {
  const ik = getImageKitClient();
  if (ik) {
    return ik.getAuthenticationParameters();
  }
  // Dev simulation auth fallback
  return {
    token: `dev_token_${Date.now()}`,
    expire: Math.floor(Date.now() / 1000) + 1800,
    signature: 'dev_simulated_signature'
  };
}

/**
 * Upload a photo buffer or base64 data URL to ImageKit (or local dev storage)
 * Enforces the strict 5 MB photo size limit.
 */
export async function uploadPhotoToImageKit({
  fileBuffer,
  base64,
  fileName = 'photo.jpg',
  mimeType = 'image/jpeg',
  bookingId = null,
  vehicleId = null,
  category = 'inspection'
}) {
  let buffer;

  if (fileBuffer) {
    buffer = fileBuffer;
  } else if (base64) {
    // Handle base64 / data-URI string
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    buffer = Buffer.from(base64Data, 'base64');
  } else {
    throw new Error('No image file or base64 data provided');
  }

  // STRICT 5 MB LIMIT ENFORCEMENT
  if (buffer.length > MAX_PHOTO_SIZE_BYTES) {
    const sizeMb = (buffer.length / (1024 * 1024)).toFixed(2);
    const err = new Error(`Photo size (${sizeMb} MB) exceeds maximum allowed limit of 5 MB.`);
    err.statusCode = 400;
    throw err;
  }

  const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const safeName = `${Date.now()}_${cleanFileName}`;
  const ik = getImageKitClient();

  let fileId;
  let url;
  let thumbnailUrl;
  const size = buffer.length;

  if (ik) {
    // Upload directly to ImageKit cloud
    const tags = [category, 'vrindavan_rides'];
    if (bookingId) tags.push(`booking_${bookingId}`);
    if (vehicleId) tags.push(`vehicle_${vehicleId}`);

    const uploadRes = await ik.upload({
      file: buffer,
      fileName: safeName,
      folder: `/vrindavan_rides/${category}`,
      tags
    });

    fileId = uploadRes.fileId;
    url = uploadRes.url;
    thumbnailUrl = uploadRes.thumbnailUrl || uploadRes.url;
  } else {
    // Dev Mode simulation: Save locally to server/uploads/
    fileId = `ik_dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const localFilePath = path.join(DEV_UPLOADS_DIR, safeName);
    fs.writeFileSync(localFilePath, buffer);
    url = `/uploads/${safeName}`;
    thumbnailUrl = `/uploads/${safeName}`;
    console.log(`[ImageKit Dev Mode] Photo stored locally at /uploads/${safeName} (${(size / 1024).toFixed(1)} KB)`);
  }

  // Record into uploaded_images database table
  const imageRecordId = `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  try {
    await db.prepare(`
      INSERT INTO uploaded_images (id, fileId, url, thumbnailUrl, bookingId, vehicleId, category, size, deleted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).run(imageRecordId, fileId, url, thumbnailUrl, bookingId, vehicleId, category, size);
  } catch (dbErr) {
    console.warn('Could not record uploaded image in database:', dbErr.message);
  }

  return {
    success: true,
    fileId,
    url,
    thumbnailUrl,
    size,
    name: safeName,
    isImageKitHosted: Boolean(ik)
  };
}

/**
 * Delete an individual photo from ImageKit storage and mark it deleted in DB
 */
export async function deletePhotoFromImageKit(fileId) {
  if (!fileId) return { success: false, error: 'fileId is required' };

  const ik = getImageKitClient();
  let deletedFromCloud = false;

  if (ik && !fileId.startsWith('ik_dev_')) {
    try {
      await ik.deleteFile(fileId);
      deletedFromCloud = true;
    } catch (err) {
      console.warn(`ImageKit deletion failed for ${fileId}:`, err.message);
    }
  } else if (fileId.startsWith('ik_dev_')) {
    // Check if recorded in db to find local file
    const record = await db.prepare('SELECT url FROM uploaded_images WHERE fileId = ?').get(fileId);
    if (record?.url && record.url.startsWith('/uploads/')) {
      const localPath = path.join(DEV_UPLOADS_DIR, path.basename(record.url));
      if (fs.existsSync(localPath)) {
        try { fs.unlinkSync(localPath); } catch (e) { /* ignore */ }
      }
    }
  }

  // Update DB status
  await db.prepare('UPDATE uploaded_images SET deleted = 1, deletedAt = CURRENT_TIMESTAMP WHERE fileId = ?').run(fileId);

  return { success: true, fileId, deletedFromCloud };
}

/**
 * PURGE UPON FINAL SETTLEMENT:
 * When return inspection is submitted and neither party has an issue (no damage/dispute),
 * remove all temporary inspection photos from ImageKit cloud storage.
 */
export async function deleteSettlementImagesForBooking(bookingId) {
  if (!bookingId) return { success: false, error: 'bookingId is required' };

  const records = await db.prepare(`
    SELECT * FROM uploaded_images
    WHERE bookingId = ? AND deleted = 0
  `).all(bookingId);

  if (!records || records.length === 0) {
    // Mark inspection as settled even if no external images were recorded
    try {
      await db.prepare('UPDATE inspections SET imagesSettled = 1, imagesDeletedAt = CURRENT_TIMESTAMP WHERE bookingId = ?').run(bookingId);
      await db.prepare('UPDATE bookings SET imagesSettled = 1 WHERE id = ?').run(bookingId);
    } catch (e) { /* ignore */ }
    return { success: true, deletedCount: 0, message: 'No active images to purge' };
  }

  const ik = getImageKitClient();
  const fileIds = records.map((r) => r.fileId);
  const cloudFileIds = fileIds.filter((id) => !id.startsWith('ik_dev_'));

  // Cloud deletion via ImageKit
  if (ik && cloudFileIds.length > 0) {
    try {
      if (typeof ik.bulkDeleteFiles === 'function') {
        await ik.bulkDeleteFiles(cloudFileIds);
      } else {
        await Promise.allSettled(cloudFileIds.map((id) => ik.deleteFile(id)));
      }
      console.log(`[ImageKit Purge] Deleted ${cloudFileIds.length} photos from ImageKit for settled booking ${bookingId}`);
    } catch (err) {
      console.error(`[ImageKit Purge] Bulk deletion warning for booking ${bookingId}:`, err.message);
    }
  }

  // Clean local dev files if any
  for (const r of records) {
    if (r.url && r.url.startsWith('/uploads/')) {
      const localPath = path.join(DEV_UPLOADS_DIR, path.basename(r.url));
      if (fs.existsSync(localPath)) {
        try { fs.unlinkSync(localPath); } catch (e) { /* ignore */ }
      }
    }
  }

  // Mark all images deleted in DB
  await db.prepare(`
    UPDATE uploaded_images
    SET deleted = 1, deletedAt = CURRENT_TIMESTAMP
    WHERE bookingId = ?
  `).run(bookingId);

  // Mark inspection and booking records as settled and purged
  await db.prepare('UPDATE inspections SET imagesSettled = 1, imagesDeletedAt = CURRENT_TIMESTAMP WHERE bookingId = ?').run(bookingId);
  await db.prepare('UPDATE bookings SET imagesSettled = 1 WHERE id = ?').run(bookingId);

  console.log(`[Settlement Complete] All ${records.length} inspection photos purged from storage for settled booking ${bookingId}.`);

  return {
    success: true,
    bookingId,
    deletedCount: records.length,
    fileIds,
    settled: true,
    message: `Final settlement complete. ${records.length} photo(s) purged from cloud storage.`
  };
}
