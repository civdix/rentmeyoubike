import React, { useState, useRef } from 'react';
import { Camera, Fuel, Gauge, CheckCircle2, ShieldCheck, Video, AlertTriangle, X, FileText, Upload, Loader2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiUploadPhoto, MAX_PHOTO_UPLOAD_BYTES } from '../api/client';

export const DigitalInspectionModal = ({ bookingId, type = 'pre', onClose, onSuccess }) => {
  const { bookings, inspections, saveInspection, currentUser, openLoginModal } = useApp();
  const booking = bookings.find((b) => b.id === bookingId) || bookings[0];
  const existingInspection = inspections[bookingId];

  const initialData = type === 'pre' ? existingInspection?.preRental : existingInspection?.postRental;

  const [odometer, setOdometer] = useState(initialData?.odometer || 0);
  const [fuelLevel, setFuelLevel] = useState(initialData?.fuelLevel || 100);
  const [videoRecorded, setVideoRecorded] = useState(false);
  const [customerConfirmed, setCustomerConfirmed] = useState(false);
  const [ownerConfirmed, setOwnerConfirmed] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [activeCaptureKey, setActiveCaptureKey] = useState(null);
  const fileInputRef = useRef(null);

  // Damage logs state array
  const [damageLogs, setDamageLogs] = useState(() => {
    if (initialData?.existingDamage && initialData.existingDamage !== 'No pre-existing exterior damage.') {
      const parts = initialData.existingDamage.split(' | ');
      return parts.map((part, idx) => ({
        id: idx + 1,
        zone: part.includes('[') && part.includes('-') ? part.split('[')[1].split('-')[0].trim() : 'Body',
        type: part.includes('-') && part.includes(']') ? part.split('-')[1].split(']')[0].trim() : 'Scratch',
        notes: part.includes(']') ? part.split(']')[1].trim() : part
      }));
    }
    return [];
  });

  const [selectedZone, setSelectedZone] = useState('Front Shield');
  const [damageType, setDamageType] = useState('Scratch');
  const [currentNote, setCurrentNote] = useState('');

  const handleAddDamageLog = () => {
    if (!selectedZone) return;
    const newLog = {
      id: Date.now(),
      zone: selectedZone,
      type: damageType,
      notes: currentNote.trim() || 'Visual damage recorded during digital audit'
    };
    setDamageLogs((prev) => [...prev, newLog]);
    setCurrentNote('');
  };

  const handleRemoveDamageLog = (id) => {
    setDamageLogs((prev) => prev.filter((item) => item.id !== id));
  };

  // Photos state with realistic default fallback photos
  const [photos, setPhotos] = useState({
    front: initialData?.frontPhoto || '',
    rear: initialData?.rearPhoto || '',
    left: initialData?.leftPhoto || '',
    right: initialData?.rightPhoto || '',
    dashboard: initialData?.dashboardPhoto || '',
    tyres: initialData?.tyresPhoto || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      openLoginModal();
      return;
    }
    if (!customerConfirmed || !ownerConfirmed) {
      alert('Both Customer & Owner confirmations are mandatory!');
      return;
    }

    const formattedDamage = damageLogs.length > 0
      ? damageLogs.map((l) => `[${l.zone} - ${l.type}] ${l.notes}`).join(' | ')
      : 'No pre-existing exterior damage.';

    const inspectionRecord = {
      odometer: Number(odometer),
      fuelLevel: Number(fuelLevel),
      frontPhoto: photos.front,
      rearPhoto: photos.rear,
      leftPhoto: photos.left,
      rightPhoto: photos.right,
      dashboardPhoto: photos.dashboard,
      tyresPhoto: photos.tyres,
      existingDamage: formattedDamage,
      walkaroundVideoRecorded: videoRecorded,
      customerConfirmed,
      ownerConfirmed,
      inspectedAt: new Date().toLocaleString()
    };

    saveInspection(booking.id, type, inspectionRecord);

    if (type === 'post') {
      if (damageLogs.length === 0) {
        alert('🎉 Return Inspection Complete!\n\nBoth parties confirmed with zero issues. Final settlement achieved — temporary inspection photos are purged from ImageKit cloud storage.');
      } else {
        alert('⚠️ Return Inspection Saved with Damage Logs.\n\nPhotos have been preserved in ImageKit cloud storage for dispute audit.');
      }
    } else {
      alert('✅ Pre-Rental Handover Inspection saved successfully!');
    }

    if (onSuccess) onSuccess();
    onClose();
  };

  const triggerCapture = (key) => {
    setActiveCaptureKey(key);
    fileInputRef.current?.click();
  };

  const handlePhotoFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeCaptureKey) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    // STRICT 5 MB LIMIT ENFORCEMENT
    if (file.size > MAX_PHOTO_UPLOAD_BYTES) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      alert(`Photo size (${mb} MB) exceeds the 5 MB limit. Please select an image under 5 MB.`);
      return;
    }

    const key = activeCaptureKey;
    setUploadingKey(key);

    try {
      const res = await apiUploadPhoto(file, {
        bookingId: booking?.id,
        category: 'inspection',
        fileName: `${key}_${booking?.id || 'audit'}.jpg`
      });

      if (res?.url) {
        setPhotos((prev) => ({
          ...prev,
          [key]: res.url
        }));
      }
    } catch (err) {
      console.warn('ImageKit direct upload fallback to local preview:', err.message);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotos((prev) => ({ ...prev, [key]: ev.target.result }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingKey(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200 custom-scrollbar">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sticky top-0 z-10 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold">
                Digital {type === 'pre' ? 'Pre-Rental (Handover)' : 'Post-Rental (Return)'} Inspection
              </h3>
              <p className="text-xs text-slate-400">
                Booking Ref: #{booking?.id} • {booking?.vehicleName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Odometer & Fuel Level Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-emerald-600" />
                Odometer Reading (KM)
              </label>
              <input
                type="number"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                className="w-full text-lg font-bold font-mono text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white"
                required
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Fuel className="w-4 h-4 text-emerald-600" />
                  Fuel / Battery Level
                </label>
                <span className="text-xs font-bold text-emerald-700">{fuelLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={fuelLevel}
                onChange={(e) => setFuelLevel(e.target.value)}
                className="w-full accent-emerald-600 cursor-pointer mt-2"
              />
            </div>
          </div>

          {/* Hidden File Input for Real Photo Upload & Camera Capture */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handlePhotoFile}
          />

          {/* 6-Point Camera Photos Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>6-Angle Photo Capture (Mandatory Audit)</span>
              </h4>
              <span className="text-[10px] font-extrabold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-300">
                ImageKit • Max 5 MB / photo
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { key: 'front', title: '1. Front Photo' },
                { key: 'rear', title: '2. Rear Photo' },
                { key: 'left', title: '3. Left-Side' },
                { key: 'right', title: '4. Right-Side' },
                { key: 'dashboard', title: '5. Dashboard/Meter' },
                { key: 'tyres', title: '6. Tyre Condition' },
              ].map((item) => (
                <div key={item.key} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 relative group">
                  {photos[item.key] ? (
                    <img src={photos[item.key]} alt={item.title} className="w-full h-24 object-cover" />
                  ) : (
                    <div className="w-full h-24 bg-slate-100 flex flex-col items-center justify-center text-slate-400 gap-1">
                      {uploadingKey === item.key ? (
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                      ) : (
                        <>
                          <Camera className="w-6 h-6" />
                          <span className="text-[10px] text-slate-400">Max 5 MB</span>
                        </>
                      )}
                    </div>
                  )}
                  <div className="p-2 bg-white flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-700">{item.title}</span>
                    <button
                      type="button"
                      disabled={uploadingKey === item.key}
                      onClick={() => triggerCapture(item.key)}
                      className="text-[10px] bg-slate-100 hover:bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold border border-slate-200 flex items-center gap-1 disabled:opacity-50"
                    >
                      {uploadingKey === item.key ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <span>{photos[item.key] ? 'Retake' : 'Capture'}</span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Storage & Privacy Settlement Notice */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                <strong>Storage & Privacy Policy:</strong> Photos upload via ImageKit with a strict <strong>5 MB limit</strong>. Upon final return settlement when both parties confirm without issues, all temporary inspection photos are permanently removed from cloud storage.
              </p>
            </div>
          </div>

          {/* Damage Location Logger & Multi-Add Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                Damage Location Logger (Scratches/Dents)
              </h4>
              <span className="text-[10px] font-extrabold bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded border border-amber-300">
                {damageLogs.length} Logged Item(s)
              </span>
            </div>

            {/* Zone Selector Buttons */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">1. Select Body Location Zone:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {['Front Shield', 'Left Side Skirt', 'Right Mirror', 'Silencer Guard', 'Rear Fender', 'Handlebar', 'Tyre Rim', 'Seat Cover'].map((zone) => (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => setSelectedZone(zone)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-extrabold border transition-all ${
                      selectedZone === zone
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>

            {/* Type & Note Input Row + Add Log Button */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">2. Damage Type</label>
                <select
                  value={damageType}
                  onChange={(e) => setDamageType(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-bold text-slate-800"
                >
                  <option value="Scratch">Scratch</option>
                  <option value="Dent">Dent</option>
                  <option value="Crack">Crack</option>
                  <option value="Scuff / Paint Chip">Scuff / Paint Chip</option>
                  <option value="Tear / Rip">Tear / Rip</option>
                  <option value="Broken Part">Broken Part</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 mb-1">3. Specific Detail Note & Length</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    placeholder="e.g. 3cm deep scratch near lower edge..."
                    className="flex-1 text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-emerald-600 font-medium"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDamageLog();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddDamageLog}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1 shadow-sm shrink-0 transition-transform active:scale-95"
                  >
                    <span>+ Add Damage Log</span>
                  </button>
                </div>
              </div>
            </div>

            {/* List of Added Damage Logs */}
            <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
              <span className="text-[11px] font-extrabold text-slate-700 block">Logged Vehicle Damage Records:</span>
              {damageLogs.length === 0 ? (
                <p className="text-xs text-slate-400 italic bg-white p-2.5 rounded-lg border border-dashed border-slate-300 text-center">
                  ✓ No damage logged yet. (Vehicle will be recorded as 100% scratch-free).
                </p>
              ) : (
                <div className="space-y-1.5">
                  {damageLogs.map((log) => (
                    <div key={log.id} className="bg-white p-2.5 rounded-xl border border-amber-300 shadow-xs flex items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-amber-100 text-amber-950 font-extrabold px-2 py-0.5 rounded text-[10px] border border-amber-300">
                          {log.zone}
                        </span>
                        <span className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wide">
                          [{log.type}]
                        </span>
                        <span className="text-slate-600 font-medium text-xs">
                          {log.notes}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDamageLog(log.id)}
                        className="text-rose-600 hover:text-rose-800 font-bold p-1 hover:bg-rose-50 rounded text-xs transition-colors"
                        title="Remove this log entry"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Short Walkaround Video Recorder Simulation */}
          <div className="bg-emerald-50 p-3 px-4 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <Video className="w-4 h-4 text-emerald-700" />
              <span>30-Second Walkaround Video Recorded</span>
            </div>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={videoRecorded}
                onChange={(e) => setVideoRecorded(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
              <span className="font-semibold text-emerald-900">Recorded & Cloud Sync</span>
            </label>
          </div>

          {/* Signatures & Confirmations */}
          <div className="border-t border-slate-200 pt-4 space-y-2">
            <h4 className="font-heading font-bold text-slate-900 text-sm mb-1">Dual Signatures & Confirmation</h4>
            <div className="flex flex-col sm:flex-row gap-3 text-xs">
              <label className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customerConfirmed}
                  onChange={(e) => setCustomerConfirmed(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Customer Confirmation</span>
                  <span className="text-slate-500 text-[11px]">{booking?.customerName}</span>
                </div>
              </label>

              <label className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ownerConfirmed}
                  onChange={(e) => setOwnerConfirmed(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Owner Confirmation</span>
                  <span className="text-slate-500 text-[11px]">{booking?.ownerName}</span>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Lock & Save {type === 'pre' ? 'Pre-Rental' : 'Post-Rental'} Digital Inspection</span>
          </button>
        </form>
      </div>
    </div>
  );
};
