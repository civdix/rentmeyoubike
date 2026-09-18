'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VerifiedOwnerBadge, VerifiedVehicleBadge, DocumentsVerifiedBadge, DivineVerifiedBadge } from '../components/TrustBadges';
import { ProtectionSection } from '../components/ProtectionSection';
import {
  Bike, MapPin, Calendar, MessageSquare, ShieldCheck, Star, ArrowRight,
  Info, CheckCircle2, AlertCircle, Clock, Sparkles, Flag, ChevronRight,
  Gauge, Fuel, Check, RefreshCw, X, Shield, Share2, Copy, UserCheck, Heart, UserPlus,
  FileText, Zap
} from 'lucide-react';
import {
  VrindavanScooterIcon, VrindavanFeatherIcon, WhatsAppBrandIcon, HelmetsIcon,
  OdometerGaugeIcon, DigitalInspectionIcon, RupeeStackIcon, KeyHandoverIcon, BikeSaathiIcon
} from '../components/CustomIcons';

export const VehicleDetailView = ({ vehicle, onClose }) => {
  const { createBooking, setActiveWhatsAppModal, legalConfig, currentUser, openLoginModal } = useApp();

  // Guard against null/undefined vehicle
  if (!vehicle) return null;

  // Active Image Gallery Index
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking Dates & Renter Details State
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(tomorrowStr);
  const [renterName, setRenterName] = useState(() => currentUser?.name || '');
  const [renterPhone, setRenterPhone] = useState(() => currentUser?.phone || '');

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name && !renterName) setRenterName(currentUser.name);
      if (currentUser.phone && !renterPhone) setRenterPhone(currentUser.phone);
    }
  }, [currentUser]);

  // "Bike Saathi" Add-on State (₹500/day)
  const [addBikeSaathi, setAddBikeSaathi] = useState(false);

  // Report Listing Modal State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('inaccurate_info');
  const [reportDetails, setReportDetails] = useState('');

  // Safe Property Access
  const dailyRate = Number(vehicle.dailyRate) || 400;
  const vehicleName = vehicle.name || 'Two Wheeler';
  const vehicleId = vehicle.id || 'veh-1';
  const vehicleYear = vehicle.year || new Date().getFullYear();
  const vehicleType = vehicle.type || 'scooter';
  const transmission = vehicle.transmission || 'automatic';
  const locationArea = vehicle.locationArea || 'Vrindavan';
  const pickupAddress = vehicle.pickupAddress || `${locationArea}, Vrindavan, UP`;
  const ownerName = vehicle.ownerName || 'Verified Host';

  // Calculate Total Days & Price
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const saathiDailyRate = 500;
  const baseRentalAmount = dailyRate * totalDays;
  const saathiTotalAmount = addBikeSaathi ? saathiDailyRate * totalDays : 0;
  const totalAmount = baseRentalAmount + saathiTotalAmount;

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState('');

  const getEffectiveCustomer = () => {
    const name = (renterName || currentUser?.name || 'Vrindavan Pilgrim').trim();
    const phone = (renterPhone || currentUser?.phone || '').trim();
    return { name, phone };
  };

  // Handle Book on WhatsApp Click
  const handleWhatsAppBooking = (e) => {
    if (e) e.preventDefault();
    setBookingError('');

    const { name, phone } = getEffectiveCustomer();
    if (!phone || phone.replace(/[^0-9]/g, '').length < 10) {
      setBookingError('Please enter a valid 10-digit mobile phone number for your booking.');
      return;
    }

    try {
      const newBooking = createBooking({
        vehicle,
        customerName: name,
        customerPhone: phone,
        customerEmail: currentUser?.email || '',
        startDate,
        endDate,
        totalDays,
        bikeSaathiIncluded: addBikeSaathi,
        saathiFee: saathiTotalAmount,
        source: 'WhatsApp Booking'
      });

      const prefilledText =
        `Hi, I want to rent ${vehicleName} (${vehicleId}) in Vrindavan.\n\n` +
        `👤 Name: ${name}\n` +
        `📞 Phone: ${phone}\n` +
        `📅 Dates: ${startDate} to ${endDate} (${totalDays} day(s))\n` +
        `💰 Total Price: ₹${totalAmount}\n\n` +
        `Please confirm availability and booking requirements.`;

      const supportPhone = (legalConfig?.supportWhatsApp || '+919837144520').replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${supportPhone}?text=${encodeURIComponent(prefilledText)}`;

      if (typeof window !== 'undefined') {
        window.open(waUrl, '_blank');
      }

      setBookingSuccess(newBooking);
      setActiveWhatsAppModal({
        booking: newBooking,
        vehicle
      });
    } catch (err) {
      setBookingError(err?.message || 'Failed to initiate WhatsApp booking.');
    }
  };

  // Handle 1-Click Instant Booking Click (Emails admin immediately and reserves voucher)
  const handleOneClickBooking = (e) => {
    if (e) e.preventDefault();
    setBookingError('');

    const { name, phone } = getEffectiveCustomer();
    if (!phone || phone.replace(/[^0-9]/g, '').length < 10) {
      setBookingError('Please enter a valid 10-digit mobile phone number to confirm your booking.');
      return;
    }

    setBookingLoading(true);
    try {
      const newBooking = createBooking({
        vehicle,
        customerName: name,
        customerPhone: phone,
        customerEmail: currentUser?.email || '',
        startDate,
        endDate,
        totalDays,
        bikeSaathiIncluded: addBikeSaathi,
        saathiFee: saathiTotalAmount,
        source: '1-Click Instant Booking'
      });

      setBookingSuccess(newBooking);
    } catch (err) {
      setBookingError(err?.message || 'Failed to complete 1-Click booking.');
    } finally {
      setBookingLoading(false);
    }
  };


  const handleReportSubmit = (e) => {
    e.preventDefault();
    setReportModalOpen(false);
    alert('Listing report submitted to Vrindavan Rides admin team for review.');
  };

  // Safe Image Gallery List
  const galleryImages = Array.isArray(vehicle.images) && vehicle.images.length > 0
    ? vehicle.images
    : [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=1000&q=80'
    ];

  const currentImage = galleryImages[activeImageIndex] || galleryImages[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 custom-scrollbar my-auto">
        {/* Sticky Top Control Header */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-20 flex items-center justify-between shadow-md border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-emerald-400 font-bold bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
              ID: {vehicleId}
            </span>
            <span className="text-xs text-amber-400 font-bold hidden xs:inline sm:inline">🪶 Radhe Verified Listing</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          {/* TOP SECTION: IMAGE GALLERY & SPECS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gallery Component */}
            <div className="space-y-3">
              <div className="relative aspect-[16/10] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <img
                  src={currentImage}
                  alt={vehicleName}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {/* <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  <DivineVerifiedBadge size="xs" />
                </div> */}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImageIndex === idx
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Title, Badges & Booking Widget */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="inline-flex items-center gap-1 font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Vehicle
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-xs bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Documents Verified
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-xs bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full">
                    🚴 Saathi Ready
                  </span>
                </div>

                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
                  {vehicleName}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-2 font-medium">
                  <span className="font-extrabold text-xl text-emerald-700">₹{dailyRate}/day</span>
                  <span>•</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded font-bold capitalize text-slate-800">
                    {transmission} {vehicleType}
                  </span>
                  <span>•</span>
                  <span className="font-bold text-slate-800">Model Year: {vehicleYear}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-700 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {locationArea}, Vrindavan
                  </span>
                </div>
              </div>

              {/* Instant WhatsApp Booking Widget Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700">Select Dates & Add-ons</span>
                  <span className="text-emerald-700 font-extrabold text-sm">Total: ₹{totalAmount}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white font-semibold"
                    />
                  </div>
                </div>

                {/* Bike Saathi Add-on Option */}
                <div className={`p-3 rounded-xl border transition-all ${addBikeSaathi ? 'bg-amber-50 border-amber-400 text-amber-950' : 'bg-white border-slate-200 text-slate-800'}`}>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addBikeSaathi}
                      onChange={(e) => setAddBikeSaathi(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 rounded mt-0.5 shrink-0"
                    />
                    <div className="text-xs">
                      <div className="flex items-center gap-1.5 font-extrabold">
                        <BikeSaathiIcon className="w-4 h-4 text-amber-700 shrink-0" />
                        <span className="text-amber-700">Add "Bike Saathi" (Rider & Tour Guide)</span>
                        <span className="bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded text-[10px]">+₹500/day</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        Don't have a DL, don't know how to ride, or travelling solo? A verified local Vrindavan rider will drive you around & guide your temple tour!
                      </p>
                    </div>
                  </label>
                </div>

                {bookingError && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-700 text-xs flex items-center gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{bookingError}</span>
                  </div>
                )}

                {/* Guest Contact Details Inputs (if not logged in) */}
                {!currentUser ? (
                  <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/90 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Quick Rider Details</span>
                      <button
                        type="button"
                        onClick={() => openLoginModal('customer')}
                        className="text-emerald-700 font-bold hover:underline text-[11px] cursor-pointer"
                      >
                        Already have an account? Sign in
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        value={renterName}
                        onChange={(e) => setRenterName(e.target.value)}
                        placeholder="e.g. Ramesh Sharma"
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-xs focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">WhatsApp Mobile (10 Digits)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">+91</span>
                        <input
                          type="tel"
                          value={renterPhone}
                          onChange={(e) => setRenterPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                          placeholder="9876543210"
                          maxLength={10}
                          className="w-full pl-11 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white font-mono font-semibold text-xs tracking-wider focus:outline-none focus:border-emerald-600"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 text-[11px] text-emerald-950 flex items-center justify-between">
                    <span>Booking as: <strong>{currentUser.name}</strong> ({currentUser.phone})</span>
                    <span className="bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.5 rounded text-[10px]">Verified Account</span>
                  </div>
                )}

                {/* Booking Success Confirmation Banner */}
                {bookingSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-400 rounded-2xl p-4 text-emerald-950 space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <strong className="text-sm">Booking Reserved! Ref: #{bookingSuccess.id}</strong>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Radhe Radhe! Your booking for <strong>{vehicleName}</strong> has been registered and an email notification has been dispatched to the platform admin.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <a
                        href={`https://wa.me/${(legalConfig?.supportWhatsApp || '+919837144520').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I just booked ${vehicleName} (Ref: #${bookingSuccess.id}). Please confirm availability.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm text-center"
                      >
                        <WhatsAppBrandIcon className="w-3.5 h-3.5 fill-white" />
                        <span>Open WhatsApp</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setActiveWhatsAppModal({ booking: bookingSuccess, vehicle })}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-sm text-center cursor-pointer"
                      >
                        View Assistant
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Button 1: Book on WhatsApp */}
                    <button
                      type="button"
                      onClick={handleWhatsAppBooking}
                      className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs py-3 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <WhatsAppBrandIcon className="w-4 h-4 fill-white shrink-0" />
                      <span className="font-bold">Book via WhatsApp ({addBikeSaathi ? 'With Guide' : 'Self Ride'})</span>
                    </button>

                    {/* Button 2: 1-Click Instant Booking */}
                    <button
                      type="button"
                      onClick={handleOneClickBooking}
                      disabled={bookingLoading}
                      className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs py-3 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all active:scale-[0.98] cursor-pointer border border-slate-700"
                    >
                      <Zap className="w-4 h-4 text-amber-400 shrink-0 fill-amber-400" />
                      <span>{bookingLoading ? 'Reserving...' : '1-Click Instant Booking (Mails Admin)'}</span>
                    </button>

                    <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1 pt-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Zero cancellation fee • Instant email alert sent to admin</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* 10 SECTIONS */}
          <div className="space-y-8 text-xs">
            {/* 1. ABOUT THIS VEHICLE */}
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-300 shadow-xs shrink-0">
                  <Info className="w-4 h-4 text-emerald-700" strokeWidth={2.5} />
                </div>
                1. About this vehicle
              </h3>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                The <strong className="text-slate-900">{vehicleName} ({vehicleYear})</strong> is a high-efficiency, verified two-wheeler tailored specifically for navigating Vrindavan's narrow temple galis, parikrama routes, and busy markets near Prem Mandir & Bankey Bihari Temple.
              </p>
            </div>

            {/* EXPLICIT EV ELECTRIC VEHICLE SPECIFICATIONS */}
            {(vehicle.fuelType === 'Electric' || vehicle.isEV || vehicle.fuelType === 'Electric Assist' || vehicleType === 'electric') && (
              <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white p-5 rounded-2xl border-2 border-emerald-500/80 space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black text-sm">⚡</span>
                    <div>
                      <h4 className="font-heading font-extrabold text-white text-sm">EV Electric Vehicle Specifications</h4>
                      <p className="text-[11px] text-emerald-300">Eco-Friendly & Zero-Emission Yatra Vehicle</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wide">
                    100% Electric EV
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 text-xs">
                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Full Charge Mileage / Range</span>
                    <strong className="text-emerald-400 font-extrabold text-sm">{vehicle.evRangeKm || 105} km / Full Charge</strong>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Charging Cost</span>
                    <strong className="text-amber-300 font-extrabold text-xs">
                      {vehicle.chargingCostIncluded !== false ? 'Free Charging Included' : 'Self Charging'}
                    </strong>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Nearby Charging Stations</span>
                    <strong className="text-slate-200 font-semibold text-[11px] block leading-tight">
                      {vehicle.nearbyChargingStations || 'Prem Mandir Gate 2 Hub, ISKCON Gate 3, Chattikara Crossing'}
                    </strong>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Spare Battery Option</span>
                    <strong className="text-emerald-400 font-extrabold text-xs">
                      {vehicle.spareBatteryAvailable !== false ? 'Spare Battery Provided' : 'Fixed High-Capacity Pack'}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* 2. FEATURES */}
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center border border-amber-300 shadow-xs shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                </div>
                2. Features
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(vehicle.features || ['Combi-Brake System', 'Silent Start Engine', 'Mobile Phone Holder', '33L Prasad Boot Storage']).map((feat, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2 font-semibold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2.5} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. RENTAL PRICE */}
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center border border-teal-300 shadow-xs shrink-0">
                  <Gauge className="w-4 h-4 text-teal-700" strokeWidth={2.5} />
                </div>
                3. Rental price breakdown
              </h3>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">Daily Vehicle Rate</span>
                  <span className="font-extrabold text-slate-900 text-sm">₹{dailyRate}/day</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Bike Saathi Add-on</span>
                  <span className="font-extrabold text-amber-700">₹500/day (Optional)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Security Deposit</span>
                  <span className="font-extrabold text-emerald-700">₹0 (Digital Protection)</span>
                </div>
              </div>
            </div>

            {/* 4. WHAT'S INCLUDED */}
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-300 shadow-xs shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" strokeWidth={2.5} />
                </div>
                4. What's included
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                <li className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 flex items-center gap-2 font-semibold text-emerald-950">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2.5} />
                  2 Free Sanitized Helmets (Rider + Pillion) with Tilak liners
                </li>
                <li className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 flex items-center gap-2 font-semibold text-emerald-950">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2.5} />
                  Option for "Bike Saathi" Verified Rider & Tour Guide (₹500/day)
                </li>
                <li className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 flex items-center gap-2 font-semibold text-emerald-950">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2.5} />
                  24/7 Roadside Emergency Assistance in Vrindavan
                </li>
                <li className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 flex items-center gap-2 font-semibold text-emerald-950">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2.5} />
                  Digital Pre & Post Rental Photo Inspection Audit
                </li>
              </ul>
            </div>

            {/* 5. PICKUP AND RETURN */}
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center border border-sky-300 shadow-xs shrink-0">
                  <MapPin className="w-4 h-4 text-sky-700" strokeWidth={2.5} />
                </div>
                5. Pickup and return location
              </h3>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">{pickupAddress}</p>
                <p className="text-slate-500">Locality Hub: {locationArea}, Vrindavan, Uttar Pradesh</p>
                <p className="text-emerald-700 font-semibold pt-1">• Handover Timings: 7:00 AM to 9:00 PM Daily</p>
              </div>
            </div>

            {/* 6. RENTAL RULES */}
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-300 shadow-xs shrink-0">
                  <FileText className="w-4 h-4 text-slate-800" strokeWidth={2.5} />
                </div>
                6. Rental rules & mandates
              </h3>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 text-slate-700">
                {(vehicle.rentalRules || ['Valid Driving Licence required for self-ride', 'Helmets mandatory for both rider & pillion']).map((rule, idx) => (
                  <div key={idx} className="flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. PROTECTION INFORMATION */}
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center border border-blue-300 shadow-xs shrink-0">
                  <Shield className="w-4 h-4 text-blue-700" strokeWidth={2.5} />
                </div>
                7. Protection information
              </h3>
              <ProtectionSection compact={true} />
            </div>

            {/* 8. INSPECTION PROCESS */}
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center border border-purple-300 shadow-xs shrink-0">
                  <RefreshCw className="w-4 h-4 text-purple-700" strokeWidth={2.5} />
                </div>
                8. Inspection process
              </h3>
              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-2">
                <p className="text-slate-300">
                  Before key handover, both renter and owner record starting odometer, fuel gauge level, capture 6 exterior photos, and log pre-existing scratches on the Vrindavan Rides app.
                </p>
                <span className="text-emerald-400 font-bold block">• Protects renters from pre-existing damage charges</span>
              </div>
            </div>

            {/* 9. CANCELLATION POLICY */}
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center border border-amber-300 shadow-xs shrink-0">
                  <Clock className="w-4 h-4 text-amber-700" strokeWidth={2.5} />
                </div>
                9. Cancellation policy
              </h3>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-700">
                <p>Free cancellation up to 12 hours prior to pickup date. Cancellations made within 12 hours receive 100% rental credit voucher valid for 12 months.</p>
              </div>
            </div>

            {/* 10. FREQUENTLY ASKED QUESTIONS */}
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-300 shadow-xs shrink-0">
                  <Info className="w-4 h-4 text-emerald-700" strokeWidth={2.5} />
                </div>
                10. Frequently asked questions
              </h3>
              <div className="space-y-2">
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-300">
                  <span className="font-bold text-amber-950 block">What if I do not have a driving licence or do not know how to ride?</span>
                  <span className="text-amber-900">Simply add <strong>"Bike Saathi" (₹500/day)</strong> during booking! A verified local Vrindavan rider will drive you around and act as your tour guide.</span>
                </div>
              </div>
            </div>

            {/* PRIVACY: OWNER PHONE NUMBER HIDDEN */}
            <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-slate-600 text-[11px]">
              <div>
                <span>Host: <strong className="text-slate-900 font-bold">{ownerName}</strong></span>
                <span className="text-slate-400 block">Owner phone contact is protected & managed via WhatsApp server</span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Verified Host</span>
            </div>

            {/* REPORT LISTING */}
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1.5 p-2 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <Flag className="w-4 h-4" />
                Report this listing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* REPORT MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 text-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-base flex items-center gap-2 text-rose-700">
                <Flag className="w-5 h-5" />
                Report Listing #{vehicleId}
              </h3>
              <button onClick={() => setReportModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Report</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-semibold"
                >
                  <option value="inaccurate_info">Inaccurate Vehicle Information / Price</option>
                  <option value="fake_photos">Suspicious Photos or Misrepresentation</option>
                  <option value="unavailable">Vehicle Not Available at Location</option>
                  <option value="other">Other Concern</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Additional Details</label>
                <textarea
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Describe your concern for admin audit..."
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50"
                  required
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="w-1/3 bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl shadow-md"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
