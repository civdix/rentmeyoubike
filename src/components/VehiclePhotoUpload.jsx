import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Eye,
  RefreshCw,
  Sparkles,
  Check,
  Maximize2,
  FileImage,
  Smartphone,
  ArrowUpRight
} from 'lucide-react';
import { apiUploadPhoto, MAX_PHOTO_UPLOAD_BYTES } from '../api/client';

// Client-side image compression using HTML5 Canvas
export const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    if (!file.type || !file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const REQUIRED_PHOTO_SLOTS = [
  {
    key: 'front',
    title: '1. Front View',
    subtitle: 'Headlight, front fender & UP 85 registration plate',
    required: true,
    tag: 'Registration Plate'
  },
  {
    key: 'rear',
    title: '2. Rear View',
    subtitle: 'Tail lamp, indicators, silencer & rear plate',
    required: true,
    tag: 'Exhaust & Tail'
  },
  {
    key: 'left',
    title: '3. Left Profile',
    subtitle: 'Full left body side panel, wheels & footrest',
    required: true,
    tag: 'Full Left Side'
  },
  {
    key: 'right',
    title: '4. Right Profile',
    subtitle: 'Full right body, exhaust pipe & engine casing',
    required: true,
    tag: 'Full Right Side'
  },
  {
    key: 'dashboard',
    title: '5. Dashboard / Meter',
    subtitle: 'Speedometer, odometer reading & fuel gauge',
    required: true,
    tag: 'Odometer Reading'
  },
  {
    key: 'damageCloseUp',
    title: '6. Close-up Condition',
    subtitle: 'Tyre tread depth, Prasad basket or any existing scratches',
    required: true,
    tag: 'Tyre & Condition'
  }
];

export const VehiclePhotoUpload = ({ photos = {}, onChange }) => {
  const [activeZoomPhoto, setActiveZoomPhoto] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const [isBatchDragging, setIsBatchDragging] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const fileInputRefs = useRef({});
  const cameraInputRefs = useRef({});
  const batchInputRef = useRef(null);

  // Count uploaded photos
  const uploadedCount = REQUIRED_PHOTO_SLOTS.filter(
    (slot) => photos[slot.key] && photos[slot.key].trim() !== ''
  ).length;

  const isAllUploaded = uploadedCount === REQUIRED_PHOTO_SLOTS.length;

  // Single Slot File Processing
  const handleSlotFile = async (slotKey, file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP, HEIC).');
      return;
    }

    // STRICT 5 MB LIMIT ENFORCEMENT
    if (file.size > MAX_PHOTO_UPLOAD_BYTES) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      setUploadError(`Photo exceeds 5 MB limit (${mb} MB). Please choose a smaller photo under 5 MB.`);
      return;
    }

    try {
      setUploadError(null);
      setUploadingSlot(slotKey);

      let finalUrl;
      try {
        // Attempt ImageKit cloud upload
        const uploadRes = await apiUploadPhoto(file, {
          category: 'vehicle',
          fileName: `${slotKey}_${Date.now()}.jpg`
        });
        if (uploadRes?.url) {
          finalUrl = uploadRes.url;
        }
      } catch (cloudErr) {
        console.warn('ImageKit direct upload fallback to local compression:', cloudErr.message);
      }

      // Fallback to local canvas compression if cloud upload not reachable
      if (!finalUrl) {
        finalUrl = await compressImage(file, 1280, 1280, 0.85);
      }

      onChange({
        ...photos,
        [slotKey]: finalUrl
      });
    } catch (err) {
      console.error('Photo processing error:', err);
      setUploadError('Could not process this image. Please try another.');
    } finally {
      setUploadingSlot(null);
    }
  };

  // Remove photo from slot
  const handleRemoveSlot = (slotKey, e) => {
    e?.stopPropagation();
    onChange({
      ...photos,
      [slotKey]: ''
    });
  };

  // Batch Multi-Upload
  const handleBatchFiles = async (files) => {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileList.length === 0) {
      setUploadError('No valid image files found in selection.');
      return;
    }

    // STRICT 5 MB LIMIT ENFORCEMENT FOR BATCH
    const oversized = fileList.filter((f) => f.size > MAX_PHOTO_UPLOAD_BYTES);
    if (oversized.length > 0) {
      setUploadError('One or more selected photos exceed the 5 MB limit. All photos must be under 5 MB.');
      return;
    }

    setUploadError(null);
    setUploadingSlot('batch');

    try {
      // Find slots that are empty first, then fill in order
      const newPhotos = { ...photos };
      const emptySlots = REQUIRED_PHOTO_SLOTS.filter(
        (s) => !newPhotos[s.key] || newPhotos[s.key].trim() === ''
      );

      // If all are full or fewer empty than files, assign sequentially
      const targetSlots = emptySlots.length > 0 ? emptySlots : REQUIRED_PHOTO_SLOTS;

      for (let i = 0; i < Math.min(fileList.length, targetSlots.length); i++) {
        const slot = targetSlots[i];
        const file = fileList[i];
        let finalUrl;

        try {
          const uploadRes = await apiUploadPhoto(file, {
            category: 'vehicle',
            fileName: `${slot.key}_${Date.now()}.jpg`
          });
          if (uploadRes?.url) finalUrl = uploadRes.url;
        } catch (e) {
          // fallback
        }

        if (!finalUrl) {
          finalUrl = await compressImage(file, 1280, 1280, 0.85);
        }

        newPhotos[slot.key] = finalUrl;
      }

      onChange(newPhotos);
    } catch (err) {
      console.error('Batch upload error:', err);
      setUploadError('Failed to process batch upload.');
    } finally {
      setUploadingSlot(null);
      if (batchInputRef.current) batchInputRef.current.value = '';
    }
  };

  // Clear all photos
  const handleClearAllPhotos = () => {
    const empty = {};
    REQUIRED_PHOTO_SLOTS.forEach((s) => {
      empty[s.key] = '';
    });
    onChange(empty);
  };

  return (
    <div className="space-y-4">
      {/* Upload Header with Counter and Quick Actions */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              6 Mandatory Vehicle Angles
            </span>
            <span
              className={`text-[11px] font-mono font-extrabold px-2.5 py-0.5 rounded-full border ${
                isAllUploaded
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}
            >
              {uploadedCount} / 6 Uploaded
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            High-resolution photos protect both you and riders against false damage claims.
          </p>
        </div>

        {/* Quick action controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {uploadedCount > 0 && (
            <button
              type="button"
              onClick={handleClearAllPhotos}
              className="text-[11px] font-bold text-rose-400 hover:text-rose-300 bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-rose-900/40 transition-colors"
              title="Reset all photos"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-700 flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{uploadError}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-rose-500 hover:text-rose-800 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Quick Master Batch Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsBatchDragging(true);
        }}
        onDragLeave={() => setIsBatchDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsBatchDragging(false);
          handleBatchFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-2xl p-4 transition-all text-center flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isBatchDragging
            ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01]'
            : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-400'
        }`}
      >
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0">
            <Upload className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <span className="font-extrabold text-slate-800 text-xs block">
              Quick Multi-Photo Upload
            </span>
            <span className="text-[11px] text-slate-500">
              Drag and drop all 6 bike photos here, or select files from your computer / gallery
            </span>
          </div>
        </div>

        <div>
          <input
            type="file"
            ref={batchInputRef}
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleBatchFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => batchInputRef.current?.click()}
            disabled={uploadingSlot === 'batch'}
            className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
          >
            {uploadingSlot === 'batch' ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FileImage className="w-3.5 h-3.5" />
                <span>Browse Multiple Photos</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Individual 6 Angles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {REQUIRED_PHOTO_SLOTS.map((slot) => {
          const photoUrl = photos[slot.key];
          const hasPhoto = Boolean(photoUrl && photoUrl.trim() !== '');
          const isSlotUploading = uploadingSlot === slot.key;
          const isSlotDragOver = dragOverSlot === slot.key;

          return (
            <div
              key={slot.key}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverSlot(slot.key);
              }}
              onDragLeave={() => setDragOverSlot(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverSlot(null);
                if (e.dataTransfer.files?.[0]) {
                  handleSlotFile(slot.key, e.dataTransfer.files[0]);
                }
              }}
              className={`rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                hasPhoto
                  ? 'border-emerald-400 bg-white shadow-xs'
                  : isSlotDragOver
                  ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400/40'
                  : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
            >
              {/* Card Header: Slot Title & Status Badge */}
              <div className="p-2.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-2">
                <div className="truncate">
                  <span className="font-extrabold text-xs text-slate-900 block truncate">
                    {slot.title}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate block">
                    {slot.tag}
                  </span>
                </div>
                {hasPhoto ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-emerald-300 shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" strokeWidth={2.5} />
                    <span>Captured</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded-full shrink-0">
                    <span>Required</span>
                  </span>
                )}
              </div>

              {/* Card Body: Image Preview or Upload Drop Area */}
              <div className="relative h-40 bg-slate-100 group flex items-center justify-center overflow-hidden">
                {hasPhoto ? (
                  <>
                    <img
                      src={photoUrl}
                      alt={slot.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Hover Overlay with Preview & Remove actions */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 backdrop-blur-xs">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveZoomPhoto({
                            url: photoUrl,
                            title: slot.title,
                            subtitle: slot.subtitle
                          })
                        }
                        className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-900 shadow-md transition-transform active:scale-95"
                        title="View Full Size"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[slot.key]?.click()}
                        className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-900 shadow-md transition-transform active:scale-95"
                        title="Replace Photo"
                      >
                        <RefreshCw className="w-4 h-4 text-emerald-700" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleRemoveSlot(slot.key, e)}
                        className="p-2 rounded-xl bg-white/90 hover:bg-white text-rose-600 shadow-md transition-transform active:scale-95"
                        title="Remove Photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center space-y-2 flex flex-col items-center justify-center h-full">
                    {isSlotUploading ? (
                      <div className="space-y-1">
                        <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
                        <span className="text-[11px] font-bold text-slate-600 block">Processing...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-500">
                          <Camera className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight max-w-[200px]">
                          {slot.subtitle}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer: Action Buttons */}
              <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-1.5">
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={(el) => (fileInputRefs.current[slot.key] = el)}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleSlotFile(slot.key, e.target.files[0]);
                    }
                  }}
                />

                {/* Hidden Camera Input for Mobile */}
                <input
                  type="file"
                  ref={(el) => (cameraInputRefs.current[slot.key] = el)}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleSlotFile(slot.key, e.target.files[0]);
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={() => fileInputRefs.current[slot.key]?.click()}
                  className={`flex-1 text-[11px] font-extrabold py-2 px-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                    hasPhoto
                      ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600 shadow-xs active:scale-95'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{hasPhoto ? 'Replace' : 'Upload Photo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRefs.current[slot.key]?.click()}
                  className="text-[11px] font-bold p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
                  title="Take photo directly with mobile camera"
                >
                  <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Zoom Modal */}
      {activeZoomPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-3 p-4">
            <div className="flex items-center justify-between text-white border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-heading font-extrabold text-sm">{activeZoomPhoto.title}</h4>
                <p className="text-[11px] text-slate-400">{activeZoomPhoto.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveZoomPhoto(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-black max-h-[70vh] flex items-center justify-center">
              <img
                src={activeZoomPhoto.url}
                alt={activeZoomPhoto.title}
                className="w-full max-h-[70vh] object-contain"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Check className="w-4 h-4" />
                Photo ready for Admin Verification
              </span>
              <button
                type="button"
                onClick={() => setActiveZoomPhoto(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-1.5 rounded-xl transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
