import express from 'express';
import multer from 'multer';
import {
  MAX_PHOTO_SIZE_BYTES,
  getUploadAuthParameters,
  uploadPhotoToImageKit,
  deletePhotoFromImageKit,
  deleteSettlementImagesForBooking,
  isImageKitConfigured
} from '../imagekit.js';
import { requireAuth } from '../middleware/rbac.js';

const router = express.Router();

// Multer memory storage with strict 5 MB photo upload limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_PHOTO_SIZE_BYTES // 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image files (JPEG, PNG, WebP) are allowed.'), false);
    }
  }
});

// Middleware to handle multer file size limit errors gracefully
function handleMulterErrors(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Photo exceeds the 5 MB limit. Please select an image under 5 MB.',
        code: 'LIMIT_FILE_SIZE',
        maxLimitBytes: MAX_PHOTO_SIZE_BYTES
      });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
}

// GET /api/upload/auth - Returns authentication parameters for ImageKit client-side uploads
router.get('/auth', (req, res) => {
  try {
    const authParams = getUploadAuthParameters();
    res.json({
      ...authParams,
      isImageKitConfigured: isImageKitConfigured(),
      maxSizeBytes: MAX_PHOTO_SIZE_BYTES
    });
  } catch (error) {
    console.error('Error generating ImageKit auth parameters:', error);
    res.status(500).json({ error: 'Failed to generate upload authorization' });
  }
});

// POST /api/upload - Upload a photo (supports multipart form file OR base64 data URL)
// Enforces 5 MB file size limit strictly
router.post(
  '/',
  (req, res, next) => {
    // If request is multipart/form-data, process with multer; otherwise pass through for JSON base64
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
      return upload.single('photo')(req, res, next);
    }
    next();
  },
  handleMulterErrors,
  async (req, res) => {
    try {
      let fileBuffer = null;
      let base64 = null;
      let fileName = 'inspection_photo.jpg';
      let mimeType = 'image/jpeg';
      let bookingId = req.body?.bookingId || null;
      let vehicleId = req.body?.vehicleId || null;
      let category = req.body?.category || 'inspection';

      if (req.file) {
        // Multipart file upload
        fileBuffer = req.file.buffer;
        fileName = req.file.originalname || fileName;
        mimeType = req.file.mimetype || mimeType;

        // Double check 5 MB limit
        if (fileBuffer.length > MAX_PHOTO_SIZE_BYTES) {
          return res.status(400).json({
            error: 'Photo exceeds 5 MB limit. Please upload a photo under 5 MB.',
            maxLimitBytes: MAX_PHOTO_SIZE_BYTES
          });
        }
      } else if (req.body?.image) {
        // Base64 or Data URI string upload
        base64 = req.body.image;
        if (req.body.fileName) fileName = req.body.fileName;

        // Calculate approximate byte size of base64
        const stringLength = base64.length - (base64.indexOf(',') + 1);
        const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383687;
        if (sizeInBytes > MAX_PHOTO_SIZE_BYTES) {
          return res.status(400).json({
            error: 'Photo exceeds 5 MB limit. Please upload a photo under 5 MB.',
            maxLimitBytes: MAX_PHOTO_SIZE_BYTES
          });
        }
      } else {
        return res.status(400).json({
          error: 'No image provided. Please include a photo file or base64 image data.'
        });
      }

      const result = await uploadPhotoToImageKit({
        fileBuffer,
        base64,
        fileName,
        mimeType,
        bookingId,
        vehicleId,
        category
      });

      res.status(201).json(result);
    } catch (error) {
      console.error('Error in /api/upload:', error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || 'Failed to upload photo' });
    }
  }
);

// DELETE /api/upload/:fileId - Delete an individual image
router.delete('/:fileId', requireAuth, async (req, res) => {
  try {
    const result = await deletePhotoFromImageKit(req.params.fileId);
    res.json(result);
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete photo from storage' });
  }
});

// POST /api/upload/settlement-cleanup/:bookingId - Purge images upon final settlement
router.post('/settlement-cleanup/:bookingId', requireAuth, async (req, res) => {
  try {
    const result = await deleteSettlementImagesForBooking(req.params.bookingId);
    res.json(result);
  } catch (error) {
    console.error('Error during settlement photo purge:', error);
    res.status(500).json({ error: 'Failed to purge settlement photos' });
  }
});

export default router;
