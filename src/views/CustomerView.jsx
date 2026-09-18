'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { MarketplaceView } from './MarketplaceView';
import { VehicleDetailView } from './VehicleDetailView';
import { VerifiedOwnerBadge, VerifiedVehicleBadge, DivineVerifiedBadge, TemplePassBadge, BookingStatusBadge } from '../components/TrustBadges';
import { ProtectionSection } from '../components/ProtectionSection';
import {
  Search, Filter, MapPin, Calendar, MessageSquare, ShieldCheck, Star, Bike, ArrowRight, Plus,
  Info, CheckCircle2, ChevronRight, AlertCircle, Clock, Sparkles, Heart, Compass,
  HelpCircle, ChevronDown, Check, FileText, Camera, IndianRupee, PhoneCall, Key, Award,
  Smartphone, UserCheck, RefreshCw, Lock,
  Home, LogIn, User, UserPlus, Zap
} from 'lucide-react';
import {
  VrindavanScooterIcon, VrindavanFeatherIcon, WhatsAppBrandIcon, HelmetsIcon,
  OdometerGaugeIcon, DigitalInspectionIcon, RupeeStackIcon, KeyHandoverIcon, BikeSaathiIcon
} from '../components/CustomIcons';

export const CustomerView = () => {
  const router = useRouter();
  const {
    vehicles,
    bookings,
    setRole,
    setSelectedVehicle,
    selectedVehicle,
    createBooking,
    setActiveWhatsAppModal,
    setActiveKYCModal,
    setActivePaymentModal,
    setActiveInspectionModal,
    setActiveDiffModal,
    legalConfig,
    currentUser,
    openLoginModal,
    customerTab: activeTab,
    setCustomerTab: setActiveTab,
    promptSwitchToHost
  } = useApp();

  // Filter ONLY user-belonged bookings
  const userBookings = useMemo(() => {
    if (!currentUser) return [];
    const cleanUserPhone = (currentUser.phone || '').replace(/[^0-9]/g, '');
    return bookings.filter((b) => {
      const cleanBookingPhone = (b.customerPhone || '').replace(/[^0-9]/g, '');
      if (cleanUserPhone && cleanBookingPhone && cleanUserPhone.slice(-10) === cleanBookingPhone.slice(-10)) {
        return true;
      }
      if (currentUser.name && b.customerName && b.customerName.toLowerCase().trim() === currentUser.name.toLowerCase().trim()) {
        return true;
      }
      return false;
    });
  }, [bookings, currentUser]);

  // How It Works sub-tab: 'customer' | 'owner'
  const [howItWorksRole, setHowItWorksRole] = useState('customer');

  // FAQ Accordion Open State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Search Module State
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [searchLocation, setSearchLocation] = useState('all');
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(tomorrowStr);
  const [vehicleType, setVehicleType] = useState('all');
  const [maxPrice, setMaxPrice] = useState(1000);

  // Booking Form Drawer State
  const [bookingDrawerVehicle, setBookingDrawerVehicle] = useState(null);
  const [customerName, setCustomerName] = useState(() => currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(() => currentUser?.phone || '');

  useEffect(() => {
    if (currentUser?.name && !customerName) setCustomerName(currentUser.name);
    if (currentUser?.phone && !customerPhone) setCustomerPhone(currentUser.phone);
  }, [currentUser]);

  // Featured 6 Bikes (Only Admin-Verified & Active listings)
  const featuredBikes = useMemo(() => {
    const activeV = vehicles.filter(
      (v) => v.status === 'active' && (v.vehicleVerified || v.verificationStatus === 'Verified')
    );
    return activeV.slice(0, 6);
  }, [vehicles]);

  const handleInitiateBooking = (e, isOneClick = false) => {
    if (e) e.preventDefault();
    if (!bookingDrawerVehicle) return;

    const phone = (customerPhone || currentUser?.phone || '').trim();
    const name = (customerName || currentUser?.name || 'Vrindavan Pilgrim').trim();

    if (!phone || phone.replace(/[^0-9]/g, '').length < 10) {
      alert('Please enter a valid 10-digit WhatsApp mobile phone number.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const newBooking = createBooking({
      vehicle: bookingDrawerVehicle,
      customerName: name,
      customerPhone: phone,
      startDate,
      endDate,
      totalDays: diffDays,
      source: isOneClick ? '1-Click Instant Booking' : 'WhatsApp Booking'
    });

    const bookedVehicle = bookingDrawerVehicle;
    setBookingDrawerVehicle(null);
    setSelectedVehicle(null);

    if (!isOneClick) {
      const supportPhone = (legalConfig?.supportWhatsApp || '+919837144520').replace(/[^0-9]/g, '');
      const prefilled = `Hi, I want to rent ${bookedVehicle.name} (${bookedVehicle.id}) in Vrindavan.\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n📅 Dates: ${startDate} to ${endDate}\n\nPlease confirm availability.`;
      if (typeof window !== 'undefined') {
        window.open(`https://wa.me/${supportPhone}?text=${encodeURIComponent(prefilled)}`, '_blank');
      }
    }

    setActiveWhatsAppModal({
      booking: newBooking,
      vehicle: bookedVehicle
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push('/bikes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // FAQ List (All 7 required prompt items)
  const faqData = [
    {
      q: 'What documents are required?',
      a: 'You will need an original Government-issued photo ID (Aadhaar Card or Passport), a valid Driving Licence (DL) for two-wheelers, and a mobile phone linked to WhatsApp. Documents are uploaded digitally before pickup.'
    },
    {
      q: 'Is a driving licence required?',
      a: 'Yes, a valid Indian or International Driving Licence (MCWG / LMV class) is mandatory for renting any scooter or motorcycle on Rent to Cent.'
    },
    {
      q: 'How does booking work?',
      a: 'Browse bikes -> Click "Book on WhatsApp" -> Submit your preferred dates & vehicle -> Verify your ID & DL online -> Complete payment link -> Receive pickup location pin in Vrindavan.'
    },
    {
      q: 'How does the bike inspection work?',
      a: 'Before taking keys, both you and the owner log odometer reading, fuel level, and capture 6 photos plus a 30-second walkaround video in our digital inspection tool. The same inspection is performed upon return to protect both parties.'
    },
    {
      q: 'What happens if the bike is damaged?',
      a: 'Pre-existing damages are logged during pre-inspection and won\'t be charged. For new damages incurred during your rental, repair costs are calculated transparently using standard authorized service center rates or covered under applicable Protection Plan terms.'
    },
    {
      q: 'What happens if I need to cancel?',
      a: 'Free cancellation up to 12 hours before pickup. Cancellations made within 12 hours receive a full credit voucher valid for 12 months for your next Vrindavan trip.'
    },
    {
      q: 'How does protection/insurance work?',
      a: 'Our optional Protection Plan covers roadside assistance in Vrindavan, third-party liability, and digital inspection audit protection without requiring huge security cash deposits.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      {/* HERO SECTION */}
          <section className="relative bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 text-white py-12 sm:py-20 px-4 overflow-hidden border-b border-teal-900/50">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/2 -left-32 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
              <div className="max-w-3xl mb-8">
                <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-teal-500/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold px-3.5 py-1.5 rounded-full mb-4 shadow-sm">
                  <VrindavanFeatherIcon className="w-4 h-4 text-amber-400" />
                  <span>Verified Vrindavan & Mathura P2P Rentals</span>
                </span>

                <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                  Rent a Bike in Vrindavan
                </h1>

                <p className="text-slate-300 text-sm sm:text-lg leading-relaxed mb-6 sm:mb-8 font-normal max-w-2xl">
                  Verified bikes and scooters for exploring Vrindavan and Mathura.
                </p>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => router.push('/bikes')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm py-3 sm:py-3.5 px-5 sm:px-7 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-transform active:scale-95 shrink-0"
                  >
                    <VrindavanScooterIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.2} />
                    <span>Browse Bikes</span>
                  </button>

                  <a
                    href={`https://wa.me/${legalConfig.supportWhatsApp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs sm:text-sm py-3 sm:py-3.5 px-5 sm:px-6 rounded-xl flex items-center gap-2 shadow-md transition-transform active:scale-95 shrink-0"
                  >
                    <WhatsAppBrandIcon className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                    <span>WhatsApp Support</span>
                  </a>

                  {currentUser && (
                    <div className="bg-slate-900/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-xl flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Logged in: <strong>{currentUser.name}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Quick Access Bar - only shown when logged in */}
              {currentUser && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/80 border border-slate-800 backdrop-blur-md rounded-2xl p-3 px-4 mb-4 text-xs text-slate-300 shadow-lg">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Logged in as <strong className="text-white">{currentUser.name}</strong> ({currentUser.phone || currentUser.email}) • View your active rental bookings & inspections.
                    </span>
                  </div>
                  <button
                    onClick={() => router.push('/my-bookings')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-sm transition-all shrink-0 cursor-pointer"
                  >
                    View My Bookings
                  </button>
                </div>
              )}

              {/* SEARCH MODULE */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 text-slate-900 shadow-2xl border border-amber-500/30">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-700">
                  <Search className="w-4 h-4 text-emerald-600" />
                  <span>Search & Rent Bikes in Vrindavan</span>
                </div>

                <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-extrabold text-slate-500 mb-1">Pickup Location</label>
                    <select
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:border-emerald-600 font-semibold"
                    >
                      <option value="all">All Vrindavan Hubs</option>
                      <option value="Prem Mandir Road">Prem Mandir Road</option>
                      <option value="Bankey Bihari Temple Road">Bankey Bihari Temple Road</option>
                      <option value="ISKCON Temple Chowk">ISKCON Temple Chowk</option>
                      <option value="Vrindavan Railway Station">Vrindavan Railway Station</option>
                      <option value="Chattikara Road">Chattikara Road</option>
                      <option value="Seva Kunj Road">Seva Kunj Road</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-extrabold text-slate-500 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:border-emerald-600 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-extrabold text-slate-500 mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:border-emerald-600 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-extrabold text-slate-500 mb-1">Vehicle Type</label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:border-emerald-600 font-semibold"
                    >
                      <option value="all">All Types (Scooter/Bike/Bicycle/EV)</option>
                      <option value="scooter">Scooters (Activa, Jupiter, Access)</option>
                      <option value="bicycle">Bicycles / Cycles (Hero Lectro, Firefox, Decathlon)</option>
                      <option value="cruiser">Cruisers (Classic 350, Hunter)</option>
                      <option value="motorcycle">Motorcycles (Shine, Raider, FZ)</option>
                      <option value="electric">Electric (Ather 450X)</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] uppercase font-extrabold text-slate-500">Price Range</label>
                      <span className="text-xs font-bold text-emerald-700">Under ₹{maxPrice}/day</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="1200"
                      step="50"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer mt-1"
                    />
                    <button
                      type="submit"
                      className="mt-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Search className="w-3.5 h-3.5 text-emerald-400" />
                      Find Bikes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          {/* 1. FEATURED BIKES SECTION */}
          <section className="max-w-7xl mx-auto px-4 py-14">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Top Rated Vehicles</span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">Featured Bikes & Scooters</h2>
                <p className="text-xs text-slate-500 mt-1">Verified vehicles available for instant booking near temple zones.</p>
              </div>
              <button
                onClick={() => router.push('/bikes')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                <span>View All {vehicles.filter(v => v.status === 'active' && (v.vehicleVerified || v.verificationStatus === 'Verified')).length} Bikes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {featuredBikes.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-xl mx-auto shadow-xs">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <Bike className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-extrabold text-lg text-slate-800 mb-1">No bikes listed yet</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  Be the first to list your two-wheeler in Mathura & Vrindavan and start earning daily!
                </p>
                <button
                  onClick={promptSwitchToHost}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>List Your Bike Now</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredBikes.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setSelectedVehicle(vehicle)}>
                      <img
                        src={vehicle.images[0]}
                        alt={vehicle.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        {/* <DivineVerifiedBadge size="xs" /> */}
                        {vehicle.ownerVerified && <VerifiedOwnerBadge size="xs" />}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{vehicle.rating} ({vehicle.reviewsCount})</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            onClick={() => setSelectedVehicle(vehicle)}
                            className="font-heading font-bold text-base text-slate-900 hover:text-emerald-700 cursor-pointer line-clamp-1"
                          >
                            {vehicle.name} ({vehicle.year})
                          </h3>
                          <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                            {vehicle.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          {vehicle.locationArea}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Helmets</span>
                          <span className="font-semibold text-emerald-700">2 Free Included</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Transmission</span>
                          <span className="font-semibold text-slate-800 capitalize">{vehicle.transmission}</span>
                        </div>
                      </div>

                      {/* Amount & Host Section */}
                      <div className="pt-3 border-t border-slate-100 flex items-end justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Daily Rental</span>
                          <div className="flex items-baseline gap-1">
                            <span className="font-heading font-black text-2xl text-emerald-600">₹{vehicle.dailyRate}</span>
                            <span className="text-xs text-slate-500 font-semibold">/ day</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Host: <strong className="text-slate-700 font-bold">{vehicle.ownerName}</strong></span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified Host
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons (Clean Grid) */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => setSelectedVehicle(vehicle)}
                          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-3 rounded-xl transition-all active:scale-[0.98] text-center border border-slate-200/80"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => setBookingDrawerVehicle(vehicle)}
                          className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all active:scale-[0.98]"
                        >
                          <WhatsAppBrandIcon className="w-4 h-4 fill-white shrink-0" />
                          <span>Book WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 2. HOW IT WORKS SECTION */}
          <section className="bg-white py-16 border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Simple Process</span>
                <h2 className="font-heading font-extrabold text-3xl text-slate-900 mt-1">How It Works</h2>
                <p className="text-xs text-slate-500 mt-1">Clear, transparent steps for both customers and bike owners.</p>

                <div className="inline-flex bg-slate-100 p-1 rounded-xl mt-6 border border-slate-200 text-xs font-bold">
                  <button
                    onClick={() => setHowItWorksRole('customer')}
                    className={`px-5 py-2 rounded-lg transition-all ${howItWorksRole === 'customer'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    For Customers (Renters)
                  </button>
                  <button
                    onClick={() => setHowItWorksRole('owner')}
                    className={`px-5 py-2 rounded-lg transition-all ${howItWorksRole === 'owner'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    For Bike Owners (Hosts)
                  </button>
                </div>
              </div>

              {howItWorksRole === 'customer' ? (
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {[
                    { step: '01', title: 'Choose a Bike', desc: 'Browse verified scooters & motorcycles near temple spots.', icon: Bike },
                    { step: '02', title: 'Verify ID', desc: 'Submit Aadhaar & Driving Licence digitally via WhatsApp link.', icon: UserCheck },
                    { step: '03', title: 'Pay Online', desc: 'Secure payment via UPI QR code or debit/credit card link.', icon: IndianRupee },
                    { step: '04', title: 'Pick Up', desc: 'Meet local owner at designated Vrindavan pickup point.', icon: MapPin },
                    { step: '05', title: 'Ride Safely', desc: 'Perform pre-inspection and explore temple galis hassle-free.', icon: Compass },
                    { step: '06', title: 'Easy Return', desc: 'Return bike, log post-inspection, and complete booking.', icon: CheckCircle2 }
                  ].map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative text-center flex flex-col items-center hover:shadow-md transition-all group">
                        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full mb-3 border border-emerald-200">
                          Step {item.step}
                        </span>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 via-teal-950 to-slate-900 text-emerald-400 border-2 border-emerald-400/50 shadow-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <IconComp className="w-6 h-6 text-emerald-400" strokeWidth={2.5} />
                        </div>
                        <h4 className="font-heading font-bold text-slate-900 text-xs mb-1">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-tight">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[
                    { step: '01', title: 'List Bike', desc: 'Fill owner details, vehicle specs & pickup address in 2 minutes.', icon: Key },
                    { step: '02', title: 'Admin Verify', desc: 'Our team verifies your RC, Insurance & vehicle condition.', icon: ShieldCheck },
                    { step: '03', title: 'Receive Booking', desc: 'Get instant WhatsApp notifications when a pilgrim requests your bike.', icon: Smartphone },
                    { step: '04', title: 'Handover', desc: 'Hand over keys after digital pre-inspection on app.', icon: UserCheck },
                    { step: '05', title: 'Earn Daily', desc: 'Receive payouts directly into your bank account within 24h.', icon: IndianRupee }
                  ].map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <div key={idx} className="bg-amber-50/70 p-5 rounded-2xl border border-amber-300 text-center flex flex-col items-center shadow-xs hover:shadow-md transition-all group">
                        <span className="text-[10px] font-extrabold text-amber-950 bg-amber-200 px-2.5 py-0.5 rounded-full mb-3 border border-amber-300">
                          Step {item.step}
                        </span>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-slate-950 border-2 border-amber-300 shadow-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <IconComp className="w-6 h-6 text-slate-950" strokeWidth={2.5} />
                        </div>
                        <h4 className="font-heading font-bold text-slate-900 text-xs mb-1">{item.title}</h4>
                        <p className="text-[11px] text-slate-600 leading-tight">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* 3. WHY RENT WITH US SECTION */}
          <section className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Trust & Quality Guarantees</span>
              <h2 className="font-heading font-extrabold text-3xl text-slate-900 mt-1">Why Rent With Us</h2>
              <p className="text-xs text-slate-500 mt-1">Built specifically for Vrindavan tourists, pilgrims, and local vehicle hosts.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Verified Vehicles', desc: 'Every bike undergoes document RC/Insurance checks and admin approval before going live.', icon: ShieldCheck, badge: 'Radhe Verified' },
                { title: 'Verified Riders', desc: 'Mandatory Aadhaar & Driving Licence KYC check before key handover.', icon: UserCheck, badge: 'KYC Encrypted' },
                { title: 'Transparent Pricing', desc: 'No hidden charges, zero security deposit options, clear daily rates in ₹.', icon: IndianRupee, badge: 'No Deposit' },
                { title: 'WhatsApp Support', desc: 'Direct WhatsApp booking & 24/7 on-ground assistance during your trip.', icon: MessageSquare, badge: 'Fast Response' },
                { title: 'Digital Inspection', desc: 'Before & after 6-angle photo audit protecting both renter and owner.', icon: Camera, badge: 'Dual Signature' },
                { title: 'Protection Options', desc: 'Roadside assistance in Vrindavan & third-party liability coverage.', icon: Award, badge: 'Configurable' }
              ].map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-teal-500/20 to-amber-500/15 text-emerald-700 flex items-center justify-center border-2 border-emerald-400/50 shadow-md group-hover:scale-105 transition-transform">
                        <IconComp className="w-6 h-6 text-emerald-700" strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-extrabold bg-amber-50 text-amber-950 px-2.5 py-1 rounded-full border border-amber-300 shadow-xs">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-slate-900 text-base mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4. BIKE INSPECTION SECTION */}
          <section className="bg-slate-900 text-white py-16 border-y border-slate-800 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Transparent & Fair</span>
                <h2 className="font-heading font-extrabold text-3xl text-white mt-1">Digital Bike Inspection System</h2>
                <p className="text-xs text-slate-400 mt-1">We capture Before vs. After status so you never pay for pre-existing scratches.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { step: '1', title: 'Odometer & Fuel Gauge', desc: 'Record start KM reading & fuel percentage (0-100%).', icon: RefreshCw },
                  { step: '2', title: '6-Angle Photo Capture', desc: 'Front, Rear, Left, Right, Dashboard & Tyre condition photos.', icon: Camera },
                  { step: '3', title: 'Damage Zone Logger', desc: 'Select pre-existing scratch locations on interactive diagram.', icon: AlertCircle },
                  { step: '4', title: 'Dual Signature Lock', desc: 'Customer & Owner confirm timestamped digital audit on app.', icon: Lock }
                ].map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div key={idx} className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700 text-center flex flex-col items-center shadow-md">
                      <span className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center justify-center mb-3 shadow-sm border border-amber-300">
                        {item.step}
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-slate-950 text-emerald-400 border-2 border-emerald-400/40 flex items-center justify-center mb-3 shadow-inner">
                        <IconComp className="w-6 h-6 text-emerald-400" strokeWidth={2.5} />
                      </div>
                      <h4 className="font-heading font-bold text-white text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 5. FOR BIKE OWNERS SECTION */}
          <section className="max-w-7xl mx-auto px-4 py-16">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl relative z-10">
                <span className="bg-slate-950 text-amber-400 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full mb-4 inline-block">
                  Earn in Vrindavan
                </span>
                <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-950 tracking-tight mb-3">
                  Your bike can earn when you're not using it.
                </h2>
                <p className="text-slate-900 text-xs sm:text-sm font-medium leading-relaxed mb-6">
                  Turn your idle scooter or motorcycle into passive income. Verified yatra riders, digital inspection locks, and direct 24h bank payouts.
                </p>
                <button
                  onClick={promptSwitchToHost}
                  className="bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-sm py-3.5 px-7 rounded-xl flex items-center gap-2 shadow-xl transition-transform active:scale-95 cursor-pointer"
                >
                  <Key className="w-5 h-5 text-amber-400" />
                  <span>List Your Bike</span>
                </button>
              </div>

              <div className="bg-slate-950 text-white p-6 rounded-2xl border border-amber-400/30 text-xs space-y-3 w-full md:w-72 shrink-0 relative z-10 shadow-xl">
                <div className="text-amber-400 font-extrabold text-sm">Owner Earnings Estimator</div>
                <div className="border-t border-slate-800 pt-2 flex justify-between">
                  <span className="text-slate-400">1 Scooty (Activa/Jupiter):</span>
                  <strong className="text-emerald-400">₹8,000 - ₹12,000/mo</strong>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between">
                  <span className="text-slate-400">1 Bike (Classic 350):</span>
                  <strong className="text-emerald-400">₹15,000 - ₹22,000/mo</strong>
                </div>
                <div className="text-[10px] text-slate-500 pt-1">• 85% net payout kept by owner</div>
              </div>
            </div>
          </section>

          {/* 6. FAQ SECTION */}
          <section className="bg-white py-16 border-t border-slate-200">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-10">
                <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider font-mono">Got Questions?</span>
                <h2 className="font-heading font-extrabold text-3xl text-slate-900 mt-1">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-3">
                {faqData.map((faq, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-heading font-bold text-slate-900 text-sm hover:bg-slate-100 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 transition-transform ${openFaqIndex === idx ? 'rotate-180 text-emerald-600' : ''}`}
                      />
                    </button>
                    {openFaqIndex === idx && (
                      <div className="p-4 sm:p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

      {/* DETAILED VEHICLE LISTING PAGE MODAL VIEW */}
      {selectedVehicle && (
        <VehicleDetailView
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}

      {/* Booking Form Modal */}
      {bookingDrawerVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between mb-4 items-center">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900">Reserve Vehicle</h3>
                <p className="text-xs text-slate-500">{bookingDrawerVehicle.name} • ₹{bookingDrawerVehicle.dailyRate}/day</p>
              </div>
              <button onClick={() => setBookingDrawerVehicle(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={(e) => handleInitiateBooking(e, false)} className="space-y-3.5 text-xs">
              {!currentUser && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[11px] text-slate-600 flex items-center justify-between gap-2">
                  <span>Guest booking enabled. Instant email alert sent to admin.</span>
                  <button
                    type="button"
                    onClick={() => openLoginModal('customer')}
                    className="text-emerald-700 font-bold hover:underline shrink-0 cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              )}
              <div>
                <label className="block font-semibold mb-1 text-slate-700">Your Full Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-700">WhatsApp Mobile Number (10 Digits)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">+91</span>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full pl-11 pr-3 py-2.5 rounded-xl border border-slate-300 font-mono font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98]"
                >
                  <WhatsAppBrandIcon className="w-4 h-4 fill-white" />
                  <span>Book via WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleInitiateBooking(e, true)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98] border border-slate-700"
                >
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>1-Click Instant Booking (Mails Admin)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
