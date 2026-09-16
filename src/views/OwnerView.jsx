import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { VerifiedOwnerBadge, VerifiedVehicleBadge, BookingStatusBadge } from '../components/TrustBadges';
import { VehiclePhotoUpload } from '../components/VehiclePhotoUpload';
import { EmailVerificationField } from '../components/EmailVerificationField';
import {
  PlusCircle, Upload, CheckCircle2, ShieldCheck, Clock, FileText, Bike, MapPin,
  IndianRupee, AlertCircle, Phone, User, Calendar, Camera, Check, XCircle,
  AlertOctagon, Building2, Sparkles, ChevronRight, X, Lock, CheckSquare, Eye, LogIn,
  Loader2, Trash2, ArrowLeft
} from 'lucide-react';
import { apiUploadPhoto, MAX_PHOTO_UPLOAD_BYTES } from '../api/client';
import {
  VrindavanScooterIcon, VrindavanFeatherIcon, WhatsAppBrandIcon, HelmetsIcon,
  OdometerGaugeIcon, DigitalInspectionIcon, RupeeStackIcon, KeyHandoverIcon
} from '../components/CustomIcons';

export const OwnerView = () => {
  const { vehicles, bookings, addVehicle, toggleVehicleStatus, currentUser, openLoginModal, setRole, setCustomerTab } = useApp();

  // Navigation tab: 'my_listings' | 'add_new'
  const [activeTab, setActiveTab] = useState('my_listings');

  // Form Step State (1 through 7)
  const [step, setStep] = useState(1);

  // Success Submitted Banner State
  const [submittedNotice, setSubmittedNotice] = useState(false);

  // STEP 1: Personal Information State
  const [ownerName, setOwnerName] = useState(() => (currentUser?.role === 'owner' && currentUser.name) || '');
  const [ownerPhone, setOwnerPhone] = useState(() => (currentUser?.role === 'owner' && currentUser.phone) || '');
  const [ownerEmail, setOwnerEmail] = useState(() => (currentUser?.role === 'owner' && currentUser.email) || '');
  const [ownerEmailVerified, setOwnerEmailVerified] = useState(() => Boolean(currentUser?.role === 'owner' && currentUser.emailVerified));
  const [ownerCity, setOwnerCity] = useState('Vrindavan');
  const [ownerAddress, setOwnerAddress] = useState('');

  React.useEffect(() => {
    if (currentUser?.role === 'owner') {
      if (currentUser.name && !ownerName) setOwnerName(currentUser.name);
      if (currentUser.phone && !ownerPhone) setOwnerPhone(currentUser.phone);
      if (currentUser.email && !ownerEmail) setOwnerEmail(currentUser.email);
      if (currentUser.emailVerified) setOwnerEmailVerified(true);
    }
  }, [currentUser]);

  // STEP 2: Host Identity Verification State (Genuine Document Verification)
  const [hostIdType, setHostIdType] = useState('Aadhaar Card');
  const [hostIdNumber, setHostIdNumber] = useState('');
  const [hostIdDoc, setHostIdDoc] = useState({ name: '', uploaded: false, preview: null, fileId: null, url: '' });
  const [isUploadingHostId, setIsUploadingHostId] = useState(false);
  const [hostIdError, setHostIdError] = useState('');

  const [hostPanNumber, setHostPanNumber] = useState('');
  const [hostPanDoc, setHostPanDoc] = useState({ name: '', uploaded: false, preview: null, fileId: null, url: '' });
  const [isUploadingHostPan, setIsUploadingHostPan] = useState(false);
  const [hostPanError, setHostPanError] = useState('');

  const hostIdInputRef = useRef(null);
  const hostPanInputRef = useRef(null);

  const handleHostDocUpload = async (type, file) => {
    if (!file) return;
    if (type === 'id') setHostIdError('');
    if (type === 'pan') setHostPanError('');

    if (file.size > MAX_PHOTO_UPLOAD_BYTES) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      const err = `File size (${mb} MB) exceeds maximum 5 MB limit. Please select a photo under 5 MB.`;
      if (type === 'id') setHostIdError(err);
      if (type === 'pan') setHostPanError(err);
      return;
    }

    let localPreview = null;
    if (file.type && file.type.startsWith('image/')) {
      try {
        localPreview = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
        });
      } catch {
        localPreview = null;
      }
    }

    if (type === 'id') {
      setIsUploadingHostId(true);
      setHostIdDoc({ name: file.name, preview: localPreview, fileId: null, url: '', uploaded: false });
    } else {
      setIsUploadingHostPan(true);
      setHostPanDoc({ name: file.name, preview: localPreview, fileId: null, url: '', uploaded: false });
    }

    try {
      const res = await apiUploadPhoto(file, {
        category: type === 'id' ? 'host_identity' : 'host_pan',
        fileName: file.name
      });
      const finalUrl = res?.url || localPreview || '';
      const fileId = res?.fileId || null;

      if (type === 'id') {
        setHostIdDoc({ name: file.name, preview: localPreview || finalUrl, fileId, url: finalUrl, uploaded: true });
      } else {
        setHostPanDoc({ name: file.name, preview: localPreview || finalUrl, fileId, url: finalUrl, uploaded: true });
      }
    } catch (err) {
      console.warn(`[HostKYC] Upload notice for ${type}:`, err.message);
      if (type === 'id') {
        setHostIdDoc((prev) => ({ ...prev, uploaded: true }));
      } else {
        setHostPanDoc((prev) => ({ ...prev, uploaded: true }));
      }
    } finally {
      if (type === 'id') setIsUploadingHostId(false);
      if (type === 'pan') setIsUploadingHostPan(false);
    }
  };

  // STEP 3: Vehicle Information State
  const [regNumber, setRegNumber] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [year, setYear] = useState(() => String(new Date().getFullYear()));
  const [vehicleType, setVehicleType] = useState('scooter');
  const [fuelType, setFuelType] = useState('Petrol');
  const [transmission, setTransmission] = useState('automatic');
  const [dailyRate, setDailyRate] = useState(400);
  const [ownerLocality, setOwnerLocality] = useState('Prem Mandir Road');
  const [pickupAddress, setPickupAddress] = useState('');

  // EV Specific Onboarding State
  const [evRangeKm, setEvRangeKm] = useState(80);
  const [chargingCostIncluded, setChargingCostIncluded] = useState(true);
  const [nearbyChargingStations, setNearbyChargingStations] = useState('');
  const [spareBatteryAvailable, setSpareBatteryAvailable] = useState(false);

  // STEP 4: Vehicle Documents Upload Files & State
  const [rcDoc, setRcDoc] = useState({ name: '', uploaded: false, preview: null });
  const [insuranceDoc, setInsuranceDoc] = useState({ name: '', uploaded: false, preview: null });
  const [otherDoc, setOtherDoc] = useState({ name: '', uploaded: false, preview: null });

  const rcInputRef = useRef(null);
  const insuranceInputRef = useRef(null);
  const otherDocInputRef = useRef(null);

  const handleDocFileUpload = (type, file) => {
    if (!file) return;
    if (file.size > MAX_PHOTO_UPLOAD_BYTES) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      alert(`File "${file.name}" (${mb} MB) exceeds the 5 MB limit. Please select a document under 5 MB.`);
      return;
    }
    const docData = { name: file.name, uploaded: true, preview: null };
    if (file.type && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        docData.preview = e.target.result;
        if (type === 'rc') setRcDoc({ ...docData });
        if (type === 'insurance') setInsuranceDoc({ ...docData });
        if (type === 'other') setOtherDoc({ ...docData });
      };
      reader.readAsDataURL(file);
    } else {
      if (type === 'rc') setRcDoc(docData);
      if (type === 'insurance') setInsuranceDoc(docData);
      if (type === 'other') setOtherDoc(docData);
    }
  };

  // STEP 5: 6 Required Vehicle Photos State
  const [photos, setPhotos] = useState({
    front: '',
    rear: '',
    left: '',
    right: '',
    dashboard: '',
    damageCloseUp: ''
  });

  // STEP 6: Availability Dates & Days
  const [availableFrom, setAvailableFrom] = useState(() => new Date().toISOString().split('T')[0]);
  const [availableTo, setAvailableTo] = useState(() => new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]);
  const [availableDays, setAvailableDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

  const toggleDay = (day) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // STEP 7: Final Submit & Creation
  const handleFinalSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      openLoginModal('owner');
      return;
    }

    if (currentUser.role !== 'owner' && currentUser.role !== 'admin') {
      alert('You must be signed in with a Fleet Host account to list a vehicle.');
      openLoginModal('owner');
      return;
    }

    if (!hostIdDoc.uploaded || !hostPanDoc.uploaded) {
      alert('Please upload your Government Photo ID and PAN Card in Step 2.');
      setStep(2);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!ownerEmail || !emailRegex.test(ownerEmail.trim())) {
      alert('A valid Host email address is required to list a vehicle. Please check Step 1.');
      setStep(1);
      return;
    }

    if (!rcDoc.uploaded || !insuranceDoc.uploaded) {
      alert('RC and Insurance document uploads are required!');
      return;
    }

    const vehicleImages = [
      photos.front,
      photos.rear,
      photos.left,
      photos.right,
      photos.dashboard,
      photos.damageCloseUp
    ].filter((img) => Boolean(img && typeof img === 'string' && img.trim() !== ''));

    const newVeh = addVehicle({
      name: `${make} ${model} (${variant})`,
      type: vehicleType,
      make,
      model,
      variant,
      year: Number(year),
      registrationNumber: regNumber.toUpperCase(),
      dailyRate: Number(dailyRate),
      hourlyRate: Math.round(Number(dailyRate) / 7),
      depositAmount: 0,
      locationArea: ownerLocality,
      pickupAddress,
      ownerId: currentUser.id || `owner-${Date.now()}`,
      ownerName: currentUser.name || ownerName,
      ownerPhone: currentUser.phone || ownerPhone,
      ownerEmail: currentUser.email || ownerEmail,
      ownerCity,
      ownerAddress,
      fuelType,
      isEV: vehicleType === 'electric' || fuelType === 'Electric' || fuelType === 'Electric Assist',
      evRangeKm: Number(evRangeKm) || 105,
      chargingCostIncluded,
      nearbyChargingStations,
      spareBatteryAvailable,
      odometer: 0,
      helmetIncluded: true,
      helmetsProvided: 2,
      images: vehicleImages.length > 0 ? vehicleImages : [],
      photos,
      documents: {
        rc: rcDoc.name,
        insurance: insuranceDoc.name,
        other: otherDoc.name,
        governmentId: hostIdDoc.name,
        governmentIdUrl: hostIdDoc.url || hostIdDoc.preview,
        governmentIdType: hostIdType,
        governmentIdNumber: hostIdNumber,
        panCard: hostPanDoc.name,
        panCardUrl: hostPanDoc.url || hostPanDoc.preview,
        panNumber: hostPanNumber.toUpperCase()
      },
      features: ['USB Phone Charging Port', 'Mobile Phone Holder', '33L Prasad Boot Storage', 'Sanitized Helmets Included'],
      rentalRules: ['Valid Driving Licence required for self-ride', 'Helmets mandatory for safety'],
      availability: {
        from: availableFrom,
        to: availableTo,
        days: availableDays
      },
      status: 'pending_approval' // Clear status: Pending Verification
    });

    setSubmittedNotice(true);
    setStep(1);
    setActiveTab('my_listings');
  };

  // Status helper renderer for Dashboard badges
  const renderVerificationBadge = (vStatus) => {
    switch (vStatus) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-400 shadow-xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" strokeWidth={2.5} />
            Verified
          </span>
        );
      case 'pending_approval':
      case 'Pending Verification':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-amber-400 shadow-xs">
            <Clock className="w-3 h-3 text-amber-700" strokeWidth={2.5} />
            Pending Verification
          </span>
        );
      case 'rejected':
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-rose-400 shadow-xs">
            <XCircle className="w-3 h-3 text-rose-700" strokeWidth={2.5} />
            Rejected
          </span>
        );
      case 'suspended':
      case 'Suspended':
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-slate-400 shadow-xs">
            <AlertOctagon className="w-3 h-3 text-slate-700" strokeWidth={2.5} />
            Suspended
          </span>
        );
    }
  };

  // Filter ONLY vehicles belonging to this specific host/owner
  const myVehicles = vehicles.filter((v) => {
    const currentHostPhone = (ownerPhone || '').replace(/[^0-9]/g, '');
    const vOwnerPhone = (v.ownerPhone || '').replace(/[^0-9]/g, '');
    if (currentHostPhone && vOwnerPhone && currentHostPhone.slice(-10) === vOwnerPhone.slice(-10)) {
      return true;
    }
    if (v.ownerName && ownerName && v.ownerName.toLowerCase().trim() === ownerName.toLowerCase().trim()) {
      return true;
    }
    return false;
  });

  // Filter ONLY bookings for this host's fleet
  const myBookings = bookings.filter((b) => {
    const currentHostPhone = (ownerPhone || '').replace(/[^0-9]/g, '');
    const bOwnerPhone = (b.ownerPhone || '').replace(/[^0-9]/g, '');
    if (currentHostPhone && bOwnerPhone && currentHostPhone.slice(-10) === bOwnerPhone.slice(-10)) {
      return true;
    }
    if (b.ownerName && ownerName && b.ownerName.toLowerCase().trim() === ownerName.toLowerCase().trim()) {
      return true;
    }
    return false;
  });

  // Calculate Owner Earnings Metrics exclusively for this owner
  const totalRevenue = myBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const netEarnings = Math.round(totalRevenue * 0.85);

  // AUTHENTICATION GATE: Require Host or Admin login before accessing Host Portal or Listing Bikes
  if (!currentUser || (currentUser.role !== 'owner' && currentUser.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-slate-50 pb-16 font-sans">
        <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 animate-in fade-in">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-600 mx-auto flex items-center justify-center shadow-lg">
            <KeyHandoverIcon className="w-8 h-8 text-amber-500" />
          </div>

          <div className="space-y-2">
            <span className="bg-amber-100 text-amber-950 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-300">
              Host Sign In Required
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
              Sign In to List Your Bike in Vrindavan
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              {currentUser?.role === 'customer'
                ? `You are signed in as a Renter (${currentUser.name}). To list vehicles, track earnings, and manage fleet bookings, please switch to a Fleet Host account.`
                : 'To list your scooter or motorcycle, manage fleet availability, and receive 85% payouts, please sign in with your Host mobile number.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-left text-xs space-y-3">
            <div className="flex items-center gap-3 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>85% Direct Net Payouts:</strong> Earn up to ₹22,000/month per vehicle via daily UPI settlements.</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Digital Inspection Protection:</strong> Photo audits protect your bike before & after every rental ride.</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Verified Renters Only:</strong> Every pilgrim is verified with Government ID & Driving Licence.</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => openLoginModal('owner')}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-md transition-transform active:scale-95 text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-slate-950" />
              <span>{currentUser?.role === 'customer' ? 'Switch to Host Account' : 'Sign In as Fleet Host'}</span>
            </button>

            <button
              onClick={() => {
                setRole('customer');
                if (setCustomerTab) setCustomerTab('browse');
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Return to Rental Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16 font-sans">
      {/* Sub Header Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex gap-6 text-xs font-bold">
            <button
              onClick={() => setActiveTab('my_listings')}
              className={`py-3 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'my_listings'
                  ? 'border-emerald-600 text-emerald-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Bike className="w-4 h-4" strokeWidth={2.5} />
              Owner Dashboard ({myVehicles.length} Listed Vehicles)
            </button>

            <button
              onClick={() => {
                setActiveTab('add_new');
                setSubmittedNotice(false);
              }}
              className={`py-3 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'add_new'
                  ? 'border-emerald-600 text-emerald-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
              List Your Bike (7-Step Onboarding)
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
            <span>Owner Earnings Payout: 85% Direct Bank Settlement</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* SUBMISSION SUCCESS ALERT NOTICE */}
        {submittedNotice && (
          <div className="bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/60 p-5 rounded-2xl mb-6 flex items-start justify-between gap-4 shadow-md animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base text-slate-900">
                  Your vehicle has been submitted for verification.
                </h3>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  Our Vrindavan Rides admin team is auditing your RC, Insurance, and 6-angle photos. <strong>Admin must approve the listing before it becomes publicly visible</strong> on the marketplace (/bikes).
                </p>
              </div>
            </div>
            <button onClick={() => setSubmittedNotice(false)} className="text-slate-500 hover:text-slate-800 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {activeTab === 'my_listings' ? (
          <div className="space-y-6">
            {/* Header Banner & Earnings Summary */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 max-w-xl z-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full inline-flex items-center gap-1.5 border border-amber-300">
                    <VrindavanFeatherIcon className="w-3.5 h-3.5 text-slate-950" />
                    <span>Host Earnings Hub</span>
                  </span>
                  <div className="bg-slate-950/80 border border-slate-700/80 px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1.5 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Host: <strong className="text-white">{ownerName || 'Verified Host'}</strong></span>
                  </div>
                </div>

                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">Owner Control Center</h1>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Manage your vehicle verification statuses, daily rental availability, incoming bookings, and 85% net payouts.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => openLoginModal('owner')}
                    className="text-xs text-amber-400 hover:text-amber-300 underline font-semibold flex items-center gap-1"
                  >
                    <span>{ownerName ? `Not ${ownerName}? Switch host account` : 'Switch host account'}</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 text-xs space-y-3 w-full md:w-72 shrink-0 z-10 shadow-lg">
                <div className="text-amber-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <RupeeStackIcon className="w-4 h-4 text-emerald-400" />
                  <span>Your Earnings Summary</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between">
                  <span className="text-slate-400">Your Fleet Gross:</span>
                  <strong className="text-white font-mono">₹{totalRevenue}</strong>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between">
                  <span className="text-slate-400">Your 85% Payout:</span>
                  <strong className="text-emerald-400 font-mono text-sm">₹{netEarnings}</strong>
                </div>
                <div className="text-[10px] text-slate-500 pt-1">• Next payout batch: Everyday 11:00 AM UPI</div>
              </div>
            </div>

            {/* Listed Vehicles Grid with Verification Statuses */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-extrabold text-slate-900 text-xl">My Listed Vehicles ({myVehicles.length})</h3>
                  <p className="text-xs text-slate-500">Only showing two-wheelers registered under your host profile ({ownerPhone}).</p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('add_new');
                    setSubmittedNotice(false);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 shrink-0"
                >
                  <PlusCircle className="w-4 h-4" strokeWidth={2.5} />
                  <span>List New Bike</span>
                </button>
              </div>

              {myVehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myVehicles.map((v) => (
                    <div key={v.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
                      <div className="flex gap-4">
                        <img src={v.images[0]} alt="" className="w-28 h-28 object-cover rounded-2xl shrink-0 border border-slate-200" />
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-heading font-bold text-slate-900 text-sm line-clamp-1">{v.name}</h4>
                            {renderVerificationBadge(v.status)}
                          </div>

                          <p className="text-xs text-slate-500 font-mono">Reg: {v.registrationNumber}</p>

                          <p className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" strokeWidth={2.5} />
                            {v.locationArea}
                          </p>

                          <div className="text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-100 text-slate-600">
                            <span className="font-bold text-slate-800 block">Availability:</span>
                            <span>{v.availability?.from || 'Available'} to {v.availability?.to || 'Ongoing'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 text-[10px] block">Daily Rental</span>
                          <span className="font-heading font-extrabold text-base text-slate-900">₹{v.dailyRate}/day</span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleVehicleStatus(v.id)}
                            className={`font-bold text-xs px-3 py-1.5 rounded-xl border transition-colors ${
                              v.status === 'active'
                                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                                : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                            }`}
                          >
                            {v.status === 'active' ? 'Suspend Vehicle' : 'Activate Vehicle'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-200">
                    <Bike className="w-7 h-7" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h4 className="font-heading font-extrabold text-lg text-slate-900">No Vehicles Listed {ownerName ? `for ${ownerName}` : 'Yet'}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      You haven't added any vehicles under this host account yet. Complete our quick 7-step onboarding to submit your bike for Admin Verification!
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('add_new');
                      setSubmittedNotice(false);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-md transition-transform active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>List Your First Bike</span>
                  </button>
                </div>
              )}
            </div>

            {/* Owner Bookings & Payouts Pipeline */}
            <div className="space-y-3">
              <h3 className="font-heading font-extrabold text-slate-900 text-xl">Incoming Bookings for Your Fleet ({myBookings.length})</h3>
              {myBookings.length > 0 ? (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                  {myBookings.map((b) => (
                    <div key={b.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs hover:bg-slate-100/60 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-sm">#{b.id}</span>
                          <BookingStatusBadge status={b.status} />
                        </div>
                        <p className="text-slate-800 font-bold">{b.vehicleName} • Customer: {b.customerName}</p>
                        <p className="text-slate-500 text-[11px]">{b.startDate} to {b.endDate} ({b.totalDays} day(s)) • {b.pickupLocation}</p>
                      </div>

                      <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Host Net Share (85%)</span>
                        <span className="font-heading font-extrabold text-base text-emerald-700">
                          ₹{Math.round(b.totalAmount * 0.85)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center text-xs text-slate-500">
                  No active or past bookings for your fleet yet. Bookings and 85% payouts will appear here once riders book your bike.
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 7-STEP OWNER ONBOARDING WIZARD */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xl max-w-3xl mx-auto space-y-6">
            <div>
              <span className="bg-emerald-100 text-emerald-950 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full mb-2 inline-block border border-emerald-300">
                Owner Onboarding • Step {step} of 7
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">List Your Bike in Vrindavan</h2>
              <p className="text-xs text-slate-500 mt-1">
                Complete the 7 onboarding steps below for Admin Verification & public listing.
              </p>
            </div>

            {/* 7-Step Progress Bar */}
            <div className="grid grid-cols-7 gap-1 text-[10px] font-extrabold text-center pt-2">
              {[
                '1. Personal',
                '2. Identity',
                '3. Vehicle',
                '4. Docs',
                '5. Photos',
                '6. Dates',
                '7. Review'
              ].map((label, idx) => (
                <div key={idx} className="space-y-1">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      step >= idx + 1 ? 'bg-emerald-600 shadow-xs' : 'bg-slate-200'
                    }`}
                  ></div>
                  <span className={step === idx + 1 ? 'text-emerald-700 font-extrabold' : 'text-slate-400 font-normal hidden sm:inline'}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleFinalSubmit} className="space-y-6 text-xs pt-2">
              {/* STEP 1: PERSONAL INFORMATION */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
                    STEP 1 — Personal Information
                  </h3>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                      <input
                        type="text"
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
                        required
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <EmailVerificationField
                        value={ownerEmail}
                        onChange={setOwnerEmail}
                        role="owner"
                        isVerified={ownerEmailVerified}
                        onVerified={(verifiedEmail) => {
                          setOwnerEmailVerified(Boolean(verifiedEmail));
                        }}
                        theme="emerald"
                        variant="light"
                        required={true}
                        label="Host Email Address"
                        helperText="Live format check & OTP code"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">City *</label>
                      <input
                        type="text"
                        value={ownerCity}
                        onChange={(e) => setOwnerCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Locality Zone *</label>
                      <select
                        value={ownerLocality}
                        onChange={(e) => setOwnerLocality(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                      >
                        <option value="Prem Mandir Road">Prem Mandir Road</option>
                        <option value="Bankey Bihari Temple Road">Bankey Bihari Temple Road</option>
                        <option value="ISKCON Temple Chowk">ISKCON Temple Chowk</option>
                        <option value="Vrindavan Railway Station">Vrindavan Railway Station</option>
                        <option value="Chattikara Road">Chattikara Road</option>
                        <option value="Raman Reti">Raman Reti</option>
                        <option value="Seva Kunj Road">Seva Kunj Road</option>
                        <option value="Sunrakh Road">Sunrakh Road</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Residential Address *</label>
                    <input
                      type="text"
                      value={ownerAddress}
                      onChange={(e) => setOwnerAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!ownerName.trim()) {
                        alert('Please enter your full name in Step 1.');
                        return;
                      }
                      if (!ownerPhone.trim()) {
                        alert('Please enter your mobile phone number in Step 1.');
                        return;
                      }
                      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                      if (!ownerEmail.trim() || !emailRegex.test(ownerEmail.trim())) {
                        alert('Please enter a valid Host email address before proceeding.');
                        return;
                      }
                      if (!ownerAddress.trim()) {
                        alert('Please enter your residential address in Step 1.');
                        return;
                      }
                      setStep(2);
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Step 2: Identity Verification</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: HOST IDENTITY VERIFICATION */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
                      STEP 2 — Host Identity Verification
                    </h3>
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">
                      Step 2 of 7
                    </span>
                  </div>

                  {/* Hidden File Inputs */}
                  <input
                    type="file"
                    ref={hostIdInputRef}
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleHostDocUpload('id', e.target.files[0])}
                  />
                  <input
                    type="file"
                    ref={hostPanInputRef}
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleHostDocUpload('pan', e.target.files[0])}
                  />

                  {/* Security Guarantee Note */}
                  <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
                      <Lock className="w-4 h-4 text-amber-400" strokeWidth={2.5} />
                      <span>Host Verification & Privacy Security</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      All uploaded identity documents are 256-bit SSL encrypted and used exclusively for Mathura-Vrindavan municipal vehicle sharing compliance and host payout registration.
                    </p>
                  </div>

                  <div className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                    {/* Document 1: Government Photo ID */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">1. Government Photo ID *</span>
                            {hostIdDoc.uploaded ? (
                              <span className="bg-emerald-100 text-emerald-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                Document Uploaded • Under Verification
                              </span>
                            ) : (
                              <span className="bg-amber-100 text-amber-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-amber-300">
                                Upload Required
                              </span>
                            )}
                          </div>
                          <span className="text-slate-500 text-xs block mt-0.5">
                            Aadhaar Card, Indian Passport, or Voter ID
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Select ID Document Type *</label>
                          <select
                            value={hostIdType}
                            onChange={(e) => setHostIdType(e.target.value)}
                            className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="Aadhaar Card">Aadhaar Card</option>
                            <option value="Indian Passport">Indian Passport</option>
                            <option value="Voter ID Card">Voter ID Card</option>
                            <option value="Driving Licence">Driving Licence</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {hostIdType} Number *
                          </label>
                          <input
                            type="text"
                            placeholder={hostIdType === 'Aadhaar Card' ? '1234 5678 9012' : 'Enter document number'}
                            value={hostIdNumber}
                            onChange={(e) => setHostIdNumber(e.target.value)}
                            className="w-full text-xs font-mono font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      {/* ID Upload Box */}
                      <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center bg-slate-50/70">
                        {isUploadingHostId ? (
                          <div className="py-2 flex items-center justify-center gap-2 text-xs font-bold text-slate-700">
                            <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                            <span>Uploading {hostIdType} photo...</span>
                          </div>
                        ) : hostIdDoc.uploaded ? (
                          <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-300 rounded-xl">
                            <div className="flex items-center gap-2 text-left">
                              {hostIdDoc.preview ? (
                                <img
                                  src={hostIdDoc.preview}
                                  alt="Host ID"
                                  className="w-10 h-10 rounded-lg object-cover border border-emerald-200"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                                  DOC
                                </div>
                              )}
                              <div>
                                <span className="text-xs font-bold text-emerald-950 block truncate max-w-[200px]">
                                  {hostIdDoc.name}
                                </span>
                                <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Attached • Pending Admin Verification
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => hostIdInputRef.current?.click()}
                                className="text-[11px] font-bold px-2.5 py-1 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700"
                              >
                                Replace
                              </button>
                              <button
                                type="button"
                                onClick={() => setHostIdDoc({ name: '', uploaded: false, preview: null, fileId: null, url: '' })}
                                className="p-1 text-slate-400 hover:text-red-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="py-1 flex flex-col sm:flex-row items-center justify-between gap-2 px-2">
                            <div className="text-left">
                              <span className="text-xs font-bold text-slate-800 block">Upload {hostIdType} Document</span>
                              <span className="text-[10px] text-slate-500">Front & back photo or PDF • Max 5 MB</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => hostIdInputRef.current?.click()}
                              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-sm"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Select File</span>
                            </button>
                          </div>
                        )}
                      </div>
                      {hostIdError && (
                        <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {hostIdError}
                        </p>
                      )}
                    </div>

                    {/* Document 2: PAN Card */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">2. PAN Card Verification *</span>
                            {hostPanDoc.uploaded ? (
                              <span className="bg-emerald-100 text-emerald-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                Document Uploaded • Under Verification
                              </span>
                            ) : (
                              <span className="bg-amber-100 text-amber-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-amber-300">
                                Upload Required
                              </span>
                            )}
                          </div>
                          <span className="text-slate-500 text-xs block mt-0.5">
                            Mandatory for bank settlement & host tax compliance
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          10-Character PAN Number *
                        </label>
                        <input
                          type="text"
                          maxLength={10}
                          placeholder="ABCDE1234F"
                          value={hostPanNumber}
                          onChange={(e) => setHostPanNumber(e.target.value.toUpperCase())}
                          className="w-full text-xs font-mono uppercase font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      {/* PAN Upload Box */}
                      <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center bg-slate-50/70">
                        {isUploadingHostPan ? (
                          <div className="py-2 flex items-center justify-center gap-2 text-xs font-bold text-slate-700">
                            <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                            <span>Uploading PAN card photo...</span>
                          </div>
                        ) : hostPanDoc.uploaded ? (
                          <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-300 rounded-xl">
                            <div className="flex items-center gap-2 text-left">
                              {hostPanDoc.preview ? (
                                <img
                                  src={hostPanDoc.preview}
                                  alt="PAN Card"
                                  className="w-10 h-10 rounded-lg object-cover border border-emerald-200"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                                  DOC
                                </div>
                              )}
                              <div>
                                <span className="text-xs font-bold text-emerald-950 block truncate max-w-[200px]">
                                  {hostPanDoc.name}
                                </span>
                                <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Attached • Pending Admin Verification
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => hostPanInputRef.current?.click()}
                                className="text-[11px] font-bold px-2.5 py-1 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700"
                              >
                                Replace
                              </button>
                              <button
                                type="button"
                                onClick={() => setHostPanDoc({ name: '', uploaded: false, preview: null, fileId: null, url: '' })}
                                className="p-1 text-slate-400 hover:text-red-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="py-1 flex flex-col sm:flex-row items-center justify-between gap-2 px-2">
                            <div className="text-left">
                              <span className="text-xs font-bold text-slate-800 block">Upload PAN Card Document</span>
                              <span className="text-[10px] text-slate-500">Clear front photo or PDF • Max 5 MB</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => hostPanInputRef.current?.click()}
                              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-sm"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Select File</span>
                            </button>
                          </div>
                        )}
                      </div>
                      {hostPanError && (
                        <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {hostPanError}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!hostIdNumber.trim()) {
                          alert(`Please enter your ${hostIdType} number.`);
                          return;
                        }
                        if (!hostIdDoc.uploaded) {
                          alert(`Please upload your ${hostIdType} document.`);
                          return;
                        }
                        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
                        if (!hostPanNumber.trim() || !panRegex.test(hostPanNumber.trim())) {
                          alert('Please enter a valid 10-character PAN number (e.g. ABCDE1234F).');
                          return;
                        }
                        if (!hostPanDoc.uploaded) {
                          alert('Please upload your PAN card document.');
                          return;
                        }
                        setStep(3);
                      }}
                      className="w-2/3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-1"
                    >
                      <span>Proceed to Step 3: Vehicle Information</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: VEHICLE INFORMATION */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Bike className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
                    STEP 3 — Vehicle Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Registration Number (UP 85...) *</label>
                      <input
                        type="text"
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                        className="w-full uppercase font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Make (Manufacturer) *</label>
                      <input
                        type="text"
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        placeholder="e.g. Honda, TVS, Royal Enfield"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Model *</label>
                      <input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="e.g. Activa, Classic 350, Lectro"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Variant *</label>
                      <input
                        type="text"
                        value={variant}
                        onChange={(e) => setVariant(e.target.value)}
                        placeholder="e.g. 6G DLX, Dual ABS, C7 EV"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mfg Year *</label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                      >
                        {['2026', '2025', '2024', '2023', '2022', '2021', '2020'].map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Vehicle Type *</label>
                      <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                      >
                        <option value="scooter">Scooter</option>
                        <option value="motorcycle">Motorcycle</option>
                        <option value="bicycle">Bicycle / Cycle</option>
                        <option value="cruiser">Cruiser</option>
                        <option value="electric">Electric EV</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Transmission *</label>
                      <select
                        value={transmission}
                        onChange={(e) => setTransmission(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                      >
                        <option value="automatic">Automatic</option>
                        <option value="manual">Manual</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Fuel Type *</label>
                      <select
                        value={fuelType}
                        onChange={(e) => setFuelType(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Electric">Electric</option>
                        <option value="Electric Assist">Electric Assist</option>
                        <option value="Human Powered">Human Powered</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Daily Rental Price (₹/day) *</label>
                      <input
                        type="number"
                        value={dailyRate}
                        onChange={(e) => setDailyRate(e.target.value)}
                        className="w-full text-base font-extrabold text-emerald-700 px-3.5 py-2 rounded-xl border border-slate-300"
                        required
                      />
                    </div>
                  </div>

                  {/* EV SPECIFIC ONBOARDING QUESTIONS */}
                  {(vehicleType === 'electric' || fuelType === 'Electric' || fuelType === 'Electric Assist') && (
                    <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-300 space-y-3 animate-in fade-in">
                      <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                        <span className="text-emerald-700 font-black text-sm">⚡</span>
                        <span>EV Electric Vehicle Specifics (Explicit Specification)</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Full Charge Range / Mileage (km) *</label>
                          <input
                            type="number"
                            value={evRangeKm}
                            onChange={(e) => setEvRangeKm(e.target.value)}
                            placeholder="e.g. 105 km"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-emerald-800"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Charging Cost Included in Daily Rate? *</label>
                          <select
                            value={chargingCostIncluded ? 'yes' : 'no'}
                            onChange={(e) => setChargingCostIncluded(e.target.value === 'yes')}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                          >
                            <option value="yes">Yes — Free Charging Included</option>
                            <option value="no">No — Renter Pays Charging Fee</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Nearby Charging Stations in Vrindavan *</label>
                          <input
                            type="text"
                            value={nearbyChargingStations}
                            onChange={(e) => setNearbyChargingStations(e.target.value)}
                            placeholder="e.g. Prem Mandir Hub, ISKCON Gate 3, Chattikara"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Spare Battery Available / Included? *</label>
                          <select
                            value={spareBatteryAvailable ? 'yes' : 'no'}
                            onChange={(e) => setSpareBatteryAvailable(e.target.value === 'yes')}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                          >
                            <option value="yes">Yes — Spare Battery Provided</option>
                            <option value="no">No — Fixed Battery Unit</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Pickup Location Address *</label>
                    <input
                      type="text"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-1/3 bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="w-2/3 bg-slate-900 text-white font-extrabold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-1"
                    >
                      <span>Proceed to Step 4: Documents</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: VEHICLE DOCUMENTS */}
              {step === 4 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
                    STEP 4 — Vehicle Documents Upload
                  </h3>

                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {/* Hidden inputs */}
                    <input
                      type="file"
                      ref={rcInputRef}
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleDocFileUpload('rc', e.target.files[0])}
                    />
                    <input
                      type="file"
                      ref={insuranceInputRef}
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleDocFileUpload('insurance', e.target.files[0])}
                    />
                    <input
                      type="file"
                      ref={otherDocInputRef}
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleDocFileUpload('other', e.target.files[0])}
                    />

                    {/* RC Document */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 block">1. Registration Certificate (RC) *</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">UP 85</span>
                        </div>
                        <span className="text-slate-500 text-[11px] block mt-0.5">
                          {rcDoc.uploaded ? `✓ File: ${rcDoc.name}` : 'Upload valid UP 85 Registration Document (PDF or Photo)'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => rcInputRef.current?.click()}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                            rcDoc.uploaded
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{rcDoc.uploaded ? 'Replace' : 'Upload File'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Insurance Policy */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 block">2. Insurance Policy Document *</span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">Active</span>
                        </div>
                        <span className="text-slate-500 text-[11px] block mt-0.5">
                          {insuranceDoc.uploaded ? `✓ File: ${insuranceDoc.name}` : 'Comprehensive or 3rd Party Policy'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => insuranceInputRef.current?.click()}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                            insuranceDoc.uploaded
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{insuranceDoc.uploaded ? 'Replace' : 'Upload File'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Other Documents */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 gap-3">
                      <div>
                        <span className="font-bold text-slate-900 block">3. Pollution PUC / Self-Drive Permit</span>
                        <span className="text-slate-500 text-[11px] block mt-0.5">
                          {otherDoc.uploaded ? `✓ File: ${otherDoc.name}` : 'Pollution under control (PUC) or permit document'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => otherDocInputRef.current?.click()}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                            otherDoc.uploaded
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{otherDoc.uploaded ? 'Replace' : 'Upload File'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="w-1/3 bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(5)}
                      className="w-2/3 bg-slate-900 text-white font-extrabold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-1"
                    >
                      <span>Proceed to Step 5: Vehicle Photos</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: VEHICLE PHOTOS (INTERACTIVE 6-ANGLES PHOTO UPLOAD SYSTEM) */}
              {step === 5 && (
                <div className="space-y-4 animate-in fade-in">
                  <VehiclePhotoUpload
                    photos={photos}
                    onChange={(updatedPhotos) => setPhotos(updatedPhotos)}
                  />

                  <div className="flex gap-2 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const uploadedCount = Object.values(photos).filter(
                          (p) => p && typeof p === 'string' && p.trim() !== ''
                        ).length;
                        if (uploadedCount === 0) {
                          alert('Please upload vehicle photos before proceeding!');
                          return;
                        }
                        setStep(6);
                      }}
                      className="w-2/3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-1 transition-colors active:scale-95"
                    >
                      <span>Proceed to Step 6: Availability</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: AVAILABILITY */}
              {step === 6 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
                    STEP 6 — Vehicle Availability
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Available From Date *</label>
                      <input
                        type="date"
                        value={availableFrom}
                        onChange={(e) => setAvailableFrom(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Available To Date *</label>
                      <input
                        type="date"
                        value={availableTo}
                        onChange={(e) => setAvailableTo(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-2">Available Operating Days *</label>
                    <div className="flex flex-wrap gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                            availableDays.includes(day)
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(5)}
                      className="w-1/3 bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(7)}
                      className="w-2/3 bg-slate-900 text-white font-extrabold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-1"
                    >
                      <span>Proceed to Step 7: Final Review</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 7: REVIEW & SUBMIT */}
              {step === 7 && (
                <div className="space-y-5 animate-in fade-in">
                  <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
                    STEP 7 — Review & Submit
                  </h3>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500 font-bold">Owner:</span>
                      <strong className="text-slate-900">{ownerName} ({ownerPhone})</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500 font-bold">Vehicle:</span>
                      <strong className="text-slate-900">{make} {model} ({variant}) — {year}</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500 font-bold">Reg Number & Type:</span>
                      <strong className="text-slate-900">{regNumber} • {vehicleType.toUpperCase()} ({transmission})</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500 font-bold">Daily Rental Rate:</span>
                      <strong className="text-emerald-700 text-sm font-extrabold">₹{dailyRate}/day</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500 font-bold">Availability Window:</span>
                      <strong className="text-slate-900">{availableFrom} to {availableTo} ({availableDays.join(', ')})</strong>
                    </div>

                    {/* Uploaded Photos Gallery Preview */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-700 font-extrabold text-xs flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Uploaded Vehicle Photos:</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setStep(5)}
                          className="text-emerald-700 hover:text-emerald-800 font-extrabold text-[11px] underline"
                        >
                          Edit Photos
                        </button>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {[
                          { key: 'front', label: 'Front' },
                          { key: 'rear', label: 'Rear' },
                          { key: 'left', label: 'Left' },
                          { key: 'right', label: 'Right' },
                          { key: 'dashboard', label: 'Meter' },
                          { key: 'damageCloseUp', label: 'Condition' }
                        ].map((item) => (
                          <div
                            key={item.key}
                            className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video relative group"
                          >
                            {photos[item.key] ? (
                              <img
                                src={photos[item.key]}
                                alt={item.label}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-bold bg-slate-200">
                                Missing
                              </div>
                            )}
                            <span className="absolute bottom-0 inset-x-0 bg-slate-950/75 text-[9px] text-white text-center py-0.5 truncate font-medium">
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-300 text-amber-950 space-y-1">
                    <span className="font-extrabold block text-xs">Notice Upon Submission:</span>
                    <p className="text-[11px] leading-relaxed">
                      "Your vehicle has been submitted for verification. Admin must approve the listing before it becomes publicly visible."
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(6)}
                      className="w-1/3 bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
                      <span>Submit Vehicle for Admin Verification</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
