import React, { useState } from 'react';
import {
  Camera,
  Fuel,
  Gauge,
  CheckCircle2,
  ShieldCheck,
  Video,
  AlertTriangle,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Upload,
  Copy,
  ExternalLink,
  RotateCcw,
  Smartphone,
  Bike
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileInspectionView = ({ bookingId, type = 'pre', onClose, onSuccess }) => {
  const { bookings, vehicles, inspections, saveInspection } = useApp();

  const booking = bookings.find((b) => b.id === bookingId) || bookings[0];
  const vehicle = vehicles.find((v) => v.id === booking?.vehicleId) || {
    name: booking?.vehicleName || 'Vehicle',
    registrationNumber: '',
    images: []
  };

  const existingInspection = inspections[booking?.id];
  const initialData = type === 'pre' ? existingInspection?.preRental : existingInspection?.postRental;

  // Step 1 to 8 Wizard State
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  // Step 1: Registration
  const [confirmedRegNum, setConfirmedRegNum] = useState(vehicle.registrationNumber || '');
  const [regConfirmed, setRegConfirmed] = useState(Boolean(vehicle.registrationNumber));

  // Step 2: Odometer
  const [odometer, setOdometer] = useState(initialData?.odometer || 0);

  // Step 3: Fuel level
  const [fuelLevel, setFuelLevel] = useState(initialData?.fuelLevel || 100);

  // Step 4: 7 Mandatory Photos
  const [photos, setPhotos] = useState({
    front: initialData?.frontPhoto || '',
    rear: initialData?.rearPhoto || '',
    left: initialData?.leftPhoto || '',
    right: initialData?.rightPhoto || '',
    dashboard: initialData?.dashboardPhoto || '',
    frontTyre: initialData?.frontTyrePhoto || '',
    rearTyre: initialData?.rearTyrePhoto || ''
  });

  // Step 5: Damage checklist
  const [damageChecklist, setDamageChecklist] = useState({
    scratches: initialData?.existingDamage?.includes('Scratches') || false,
    dents: initialData?.existingDamage?.includes('Dents') || false,
    cracks: initialData?.existingDamage?.includes('Cracks') || false,
    brokenLights: initialData?.existingDamage?.includes('Broken lights') || false,
    mirrorDamage: initialData?.existingDamage?.includes('Mirror damage') || false,
    seatDamage: initialData?.existingDamage?.includes('Seat damage') || false,
    other: false
  });
  const [damageNotes, setDamageNotes] = useState(
    initialData?.existingDamage || ''
  );

  // Step 6: 360-degree Video
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [videoRecorded, setVideoRecorded] = useState(false);

  // Step 7 & 8: Confirmations
  const [customerConfirmed, setCustomerConfirmed] = useState(false);
  const [ownerConfirmed, setOwnerConfirmed] = useState(false);

  const [copiedLink, setCopiedLink] = useState(false);

  const uniqueInspectionUrl = `https://vrindavanrides.in/inspection/${booking?.id}?type=${type}`;

  const toggleDamageCheck = (key) => {
    setDamageChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSimulatePhotoUpload = (angleKey) => {
    const timeStr = new Date().toLocaleTimeString();
    setPhotos((prev) => ({
      ...prev,
      [angleKey]: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80'
    }));
    alert(`📸 Captured timestamped photo for ${angleKey.toUpperCase()} angle at ${timeStr}.`);
  };

  const handleToggleVideoRecord = () => {
    if (!isVideoRecording) {
      setIsVideoRecording(true);
      setTimeout(() => {
        setIsVideoRecording(false);
        setVideoRecorded(true);
        alert('🎥 360° Walkaround Video recorded and uploaded to inspection ledger!');
      }, 2000);
    }
  };

  const handleCompleteInspection = () => {
    if (!customerConfirmed || !ownerConfirmed) {
      alert('Both Customer and Owner confirmations are required to generate inspection record!');
      return;
    }

    // Build damage checklist string
    const selectedDamages = Object.keys(damageChecklist)
      .filter((k) => damageChecklist[k])
      .map((k) => {
        if (k === 'brokenLights') return 'Broken lights';
        if (k === 'mirrorDamage') return 'Mirror damage';
        if (k === 'seatDamage') return 'Seat damage';
        return k.charAt(0).toUpperCase() + k.slice(1);
      });

    const damageSummaryText = selectedDamages.length > 0
      ? `Checklist: [${selectedDamages.join(', ')}] | Notes: ${damageNotes || 'No specific notes.'}`
      : `No damaged items checked. Notes: ${damageNotes || 'Clean condition.'}`;

    const inspectionRecord = {
      odometer: Number(odometer),
      fuelLevel: Number(fuelLevel),
      frontPhoto: photos.front,
      rearPhoto: photos.rear,
      leftPhoto: photos.left,
      rightPhoto: photos.right,
      dashboardPhoto: photos.dashboard,
      frontTyrePhoto: photos.frontTyre,
      rearTyrePhoto: photos.rearTyre,
      tyresPhoto: photos.frontTyre,
      existingDamage: damageSummaryText,
      walkaroundVideoRecorded: videoRecorded,
      customerConfirmed,
      ownerConfirmed,
      inspectedAt: new Date().toLocaleString(),
      inspectionUrl: uniqueInspectionUrl
    };

    saveInspection(booking.id, type, inspectionRecord);
    setIsCompleted(true);
    if (onSuccess) onSuccess();
  };

  const copyUniqueLink = () => {
    navigator.clipboard.writeText(uniqueInspectionUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const photoFields = [
    { key: 'front', label: '1. Front Photo' },
    { key: 'rear', label: '2. Rear Photo' },
    { key: 'left', label: '3. Left-Side' },
    { key: 'right', label: '4. Right-Side' },
    { key: 'dashboard', label: '5. Dashboard / Meter' },
    { key: 'frontTyre', label: '6. Front Tyre' },
    { key: 'rearTyre', label: '7. Rear Tyre' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center sm:p-4 font-sans">
      <div className="bg-slate-900 w-full sm:max-w-lg h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl border border-slate-800 flex flex-col shadow-2xl overflow-hidden">
        
        {/* MOBILE HEADER BAR */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-sm text-white">
                  {type === 'pre' ? 'Pre-Rental Inspection' : 'Post-Rental Inspection'}
                </span>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  #{booking?.id}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {booking?.vehicleName || vehicle.name}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP PROGRESS BAR */}
        {!isCompleted && (
          <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800 shrink-0">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold mb-1">
              <span>Step {currentStep} of 8</span>
              <span className="text-emerald-400 font-mono">
                {Math.round((currentStep / 8) * 100)}% Completed
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / 8) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* WIZARD BODY CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">

          {/* ----------------------------------------------------
              COMPLETED VIEW
              ---------------------------------------------------- */}
          {isCompleted ? (
            <div className="space-y-5 text-center py-6">
              <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-in zoom-in">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-xl text-white">
                  Inspection Record Generated!
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Digital timestamped audit for booking <strong className="text-white font-mono">#{booking?.id}</strong> is locked and saved.
                </p>
              </div>

              {/* Inspection Summary Card */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-2 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Timestamp:</span>
                  <strong className="text-emerald-400 font-mono">{new Date().toLocaleString()}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Odometer:</span>
                  <strong className="text-white font-mono">{odometer} KM</strong>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Fuel Level:</span>
                  <strong className="text-emerald-400 font-bold">{fuelLevel}%</strong>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">7 Photos & Video:</span>
                  <strong className="text-emerald-400 font-bold">✓ 7 Photos + 360° Video</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Signatures:</span>
                  <strong className="text-emerald-400 font-bold">✓ Customer & Owner Confirmed</strong>
                </div>
              </div>

              {/* Unique Link Card */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-left">
                <span className="text-slate-400 text-[11px] font-bold block">Unique Digital Link:</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={uniqueInspectionUrl}
                    className="flex-1 bg-slate-900 text-emerald-400 text-xs p-2.5 rounded-xl border border-slate-800 font-mono truncate"
                  />
                  <button
                    onClick={copyUniqueLink}
                    className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs px-3 py-2.5 rounded-xl flex items-center gap-1 shadow"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedLink ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold py-3.5 rounded-xl text-sm shadow-lg"
              >
                Close & Return to Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* ----------------------------------------------------
                  STEP 1: CONFIRM REGISTRATION NUMBER
                  ---------------------------------------------------- */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block">Step 1 of 8</span>
                    <h3 className="font-heading font-extrabold text-lg text-white mt-0.5">Confirm Vehicle Registration</h3>
                    <p className="text-xs text-slate-400">Verify the license plate attached to the physical bike at handover.</p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <img src={vehicle.images[0]} alt="" className="w-full h-36 object-cover rounded-xl border border-slate-800" />
                    <div>
                      <h4 className="font-bold text-white text-base">{vehicle.name}</h4>
                      <p className="text-xs text-slate-400">Owner: {booking?.ownerName}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Bike Registration Plate Number</label>
                    <input
                      type="text"
                      value={confirmedRegNum}
                      onChange={(e) => setConfirmedRegNum(e.target.value)}
                      className="w-full bg-slate-950 text-emerald-400 font-mono font-extrabold text-lg p-3.5 rounded-xl border border-slate-700 text-center tracking-widest focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <label className="flex items-center gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={regConfirmed}
                      onChange={(e) => setRegConfirmed(e.target.checked)}
                      className="w-5 h-5 accent-emerald-500 rounded"
                    />
                    <span className="text-xs text-slate-200 font-semibold">
                      I confirm physical plate matches <strong className="text-white">{confirmedRegNum}</strong>.
                    </span>
                  </label>
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 2: ENTER ODOMETER
                  ---------------------------------------------------- */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block">Step 2 of 8</span>
                    <h3 className="font-heading font-extrabold text-lg text-white mt-0.5">Enter Current Odometer Reading</h3>
                    <p className="text-xs text-slate-400">Read the total distance meter on the dashboard console.</p>
                  </div>

                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
                    <Gauge className="w-10 h-10 text-emerald-400 mx-auto" />
                    <label className="block text-xs font-bold text-slate-400">Current Odometer Value (Kilometers)</label>
                    <input
                      type="number"
                      value={odometer}
                      onChange={(e) => setOdometer(e.target.value)}
                      className="w-full bg-slate-900 text-white font-mono font-extrabold text-3xl p-4 rounded-xl border border-slate-700 text-center focus:outline-none focus:border-emerald-500"
                      required
                    />
                    <span className="text-[11px] text-slate-500 block">Example: 14250 KM</span>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 3: SELECT FUEL LEVEL
                  ---------------------------------------------------- */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block">Step 3 of 8</span>
                    <h3 className="font-heading font-extrabold text-lg text-white mt-0.5">Select Fuel / Battery Level</h3>
                    <p className="text-xs text-slate-400">Indicate the current gauge level of fuel or electric battery.</p>
                  </div>

                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5 text-center">
                    <Fuel className="w-10 h-10 text-emerald-400 mx-auto" />
                    <div>
                      <span className="text-xs text-slate-400 font-bold block mb-1">Fuel Gauge Reading</span>
                      <div className="font-heading font-extrabold text-4xl text-emerald-400">{fuelLevel}%</div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {[25, 50, 75, 100].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFuelLevel(val)}
                          className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                            fuelLevel === val
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow'
                              : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          {val}% {val === 100 && 'Full'}
                        </button>
                      ))}
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={fuelLevel}
                      onChange={(e) => setFuelLevel(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 4: TAKE/UPLOAD 7 PHOTOS
                  ---------------------------------------------------- */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block">Step 4 of 8</span>
                    <h3 className="font-heading font-extrabold text-lg text-white mt-0.5">7-Angle Photo Capture</h3>
                    <p className="text-xs text-slate-400">Capture mandatory clear photos for all 7 required angles.</p>
                  </div>

                  <div className="space-y-3">
                    {photoFields.map((field) => (
                      <div key={field.key} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {photos[field.key] ? (
                            <img src={photos[field.key]} alt="" className="w-16 h-12 object-cover rounded-lg border border-slate-800" />
                          ) : (
                            <div className="w-16 h-12 bg-slate-900 rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-slate-500">
                              <Camera className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-xs text-white block">{field.label}</span>
                            <span className="text-[10px] text-emerald-400 font-mono">
                              {photos[field.key] ? '✓ Timestamped Capture' : 'Pending Capture'}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSimulatePhotoUpload(field.key)}
                          className="bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          Capture
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 5: EXISTING DAMAGE CHECKLIST
                  ---------------------------------------------------- */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block">Step 5 of 8</span>
                    <h3 className="font-heading font-extrabold text-lg text-white mt-0.5">Existing Damage Checklist</h3>
                    <p className="text-xs text-slate-400">Check all pre-existing damage items present before handover.</p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-slate-300 block">Check All Applicable Damage Types:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'scratches', label: 'Scratches' },
                        { key: 'dents', label: 'Dents' },
                        { key: 'cracks', label: 'Cracks' },
                        { key: 'brokenLights', label: 'Broken lights' },
                        { key: 'mirrorDamage', label: 'Mirror damage' },
                        { key: 'seatDamage', label: 'Seat damage' },
                        { key: 'other', label: 'Other' }
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => toggleDamageCheck(item.key)}
                          className={`p-3 rounded-xl text-xs font-bold border flex items-center justify-between transition-all ${
                            damageChecklist[item.key]
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
                          }`}
                        >
                          <span>{item.label}</span>
                          {damageChecklist[item.key] && <Check className="w-4 h-4 text-amber-400" />}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-bold text-slate-300 mb-1">Specific Damage Description & Notes</label>
                      <textarea
                        rows={3}
                        value={damageNotes}
                        onChange={(e) => setDamageNotes(e.target.value)}
                        placeholder="Detail exact scratch location or mark clean condition..."
                        className="w-full bg-slate-900 text-xs text-slate-200 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 6: RECORD 360-DEGREE WALKAROUND VIDEO
                  ---------------------------------------------------- */}
              {currentStep === 6 && (
                <div className="space-y-4">
                  <div>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block">Step 6 of 8</span>
                    <h3 className="font-heading font-extrabold text-lg text-white mt-0.5">360° Walkaround Video</h3>
                    <p className="text-xs text-slate-400">Record a short 360-degree video walking around the entire bike.</p>
                  </div>

                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                      <Video className="w-8 h-8" />
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-base">360° Inspection Video</h4>
                      <p className="text-xs text-slate-400 mt-1">Walk around the bike continuously for 15-30 seconds.</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleToggleVideoRecord}
                      disabled={isVideoRecording}
                      className={`w-full py-3.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                        isVideoRecording
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : videoRecorded
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
                          : 'bg-rose-600 hover:bg-rose-500 text-white'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      {isVideoRecording
                        ? 'Recording 360 Video...'
                        : videoRecorded
                        ? '✓ 360° Video Recorded (Click to Retake)'
                        : 'Start Recording 360° Video'}
                    </button>

                    {videoRecorded && (
                      <p className="text-[11px] text-emerald-400 font-semibold">
                        ✓ HD Video synced with timestamp & GPS location tag.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 7: CUSTOMER CONFIRMATION
                  ---------------------------------------------------- */}
              {currentStep === 7 && (
                <div className="space-y-4">
                  <div>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block">Step 7 of 8</span>
                    <h3 className="font-heading font-extrabold text-lg text-white mt-0.5">Customer Inspection Confirmation</h3>
                    <p className="text-xs text-slate-400">Read and confirm the pre-rental handover legal agreement.</p>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 text-xs leading-relaxed italic">
                      "I have inspected the vehicle and confirm that the recorded condition accurately represents the vehicle at pickup."
                    </div>

                    <div className="space-y-1 text-xs">
                      <span className="text-slate-400">Rider / Customer Name:</span>
                      <strong className="text-white block text-sm">{booking?.customerName}</strong>
                    </div>

                    <label className="flex items-center gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customerConfirmed}
                        onChange={(e) => setCustomerConfirmed(e.target.checked)}
                        className="w-5 h-5 accent-emerald-500 rounded"
                      />
                      <span className="text-xs text-emerald-400 font-bold">
                        I Agree & Confirm Digital Inspection Record
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 8: OWNER CONFIRMATION
                  ---------------------------------------------------- */}
              {currentStep === 8 && (
                <div className="space-y-4">
                  <div>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block">Step 8 of 8</span>
                    <h3 className="font-heading font-extrabold text-lg text-white mt-0.5">Owner Inspection Confirmation</h3>
                    <p className="text-xs text-slate-400">Host owner verification of physical bike condition.</p>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 text-xs leading-relaxed italic">
                      "Owner Confirmation: I have verified the vehicle condition with the customer and approve this inspection record."
                    </div>

                    <div className="space-y-1 text-xs">
                      <span className="text-slate-400">Host Owner Name:</span>
                      <strong className="text-white block text-sm">{booking?.ownerName}</strong>
                    </div>

                    <label className="flex items-center gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ownerConfirmed}
                        onChange={(e) => setOwnerConfirmed(e.target.checked)}
                        className="w-5 h-5 accent-emerald-500 rounded"
                      />
                      <span className="text-xs text-emerald-400 font-bold">
                        Host Approval & Lock Handover Record
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* MOBILE FOOTER NAVIGATION BAR */}
        {!isCompleted && (
          <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-1 border border-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            ) : (
              <div />
            )}

            {currentStep < 8 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl flex items-center gap-1 shadow-md ml-auto"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompleteInspection}
                className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl flex items-center gap-1.5 shadow-lg ml-auto"
              >
                <ShieldCheck className="w-4 h-4" />
                Generate Inspection Record
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
