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
  Home, LogIn, User, UserPlus, Zap, Linkedin, Globe, Instagram, ExternalLink
} from 'lucide-react';
import { SocialShareBar } from '../components/SocialShareBar';
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
      const supportPhone = (legalConfig?.supportWhatsApp || '+919720965985').replace(/[^0-9]/g, '');
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

  // FAQ List with both short visible summary answers and detailed explanations
  const faqData = [
    {
      q: 'How do I get a bike or scooty on rent in Vrindavan?',
      shortA: 'Choose bike online or WhatsApp (+91 97209 65985), submit Aadhaar & DL for 2-min KYC, and collect keys in 15 mins at Prem Mandir or hotel delivery.',
      a: 'Browse verified two-wheelers on Rent on Cent, choose your rental dates, complete instant digital KYC (Aadhaar & Driving Licence), and confirm booking on WhatsApp (+91 97209 65985). Pickup at Prem Mandir or get 15-minute doorstep delivery at your hotel or Mathura Junction.'
    },
    {
      q: 'What is the price of scooty on rent in Vrindavan?',
      shortA: 'Starts from ₹40/hr and ₹299/day for Honda Activa & TVS Jupiter with 2 free sanitized ISI helmets and zero security deposit.',
      a: 'Scooty on rent in Vrindavan starts from ₹40/hour and ₹299/day for Honda Activa 6G and TVS Jupiter. High-mileage bikes, Royal Enfield Classic 350, and eco-friendly EV scooters are also available with 2 free ISI helmets and zero deposit options.'
    },
    {
      q: 'What documents are required?',
      shortA: 'Valid 2-wheeler Driving Licence (DL) + Aadhaar Card or Passport. DigiLocker uploads are 100% accepted.',
      a: 'You will need an original Government-issued photo ID (Aadhaar Card or Passport), a valid Driving Licence (DL) for two-wheelers, and a mobile phone linked to WhatsApp. Documents are uploaded digitally before pickup.'
    },
    {
      q: 'Is a driving licence required?',
      shortA: 'Yes, a valid Indian or International Driving Licence is legally mandatory for self-drive two-wheeler rentals.',
      a: 'Yes, a valid Indian or International Driving Licence (MCWG / LMV class) is mandatory for renting any scooter or motorcycle on Rent on Cent.'
    },
    {
      q: 'How does booking work?',
      shortA: 'Select bike → confirm on WhatsApp → complete instant digital KYC → collect keys & start your Vrindavan parikrama.',
      a: 'Browse bikes -> Click "Book on WhatsApp" -> Submit your preferred dates & vehicle -> Verify your ID & DL online -> Complete payment link -> Receive pickup location pin in Vrindavan.'
    },
    {
      q: 'How does the bike inspection work?',
      shortA: 'You and host record fuel, odometer, and 6 timestamped photos before handover and at return, completely preventing unfair scratch fees.',
      a: 'Before taking keys, both you and the owner log odometer reading, fuel level, and capture 6 photos plus a 30-second walkaround video in our digital inspection tool. The same inspection is performed upon return to protect both parties.'
    },
    {
      q: 'What happens if the bike is damaged?',
      shortA: 'Pre-existing scratches logged in pre-inspection are 100% exempt. New damages are settled at authorized service rates or covered by protection.',
      a: 'Pre-existing damages are logged during pre-inspection and won\'t be charged. For new damages incurred during your rental, repair costs are calculated transparently using standard authorized service center rates or covered under applicable Protection Plan terms.'
    },
    {
      q: 'What happens if I need to cancel?',
      shortA: '100% free cancellation up to 12 hours before pickup. Cancellations within 12 hours receive a full 12-month credit voucher.',
      a: 'Free cancellation up to 12 hours before pickup. Cancellations made within 12 hours receive a full credit voucher valid for 12 months for your next Vrindavan trip.'
    },
    {
      q: 'How does protection/insurance work?',
      shortA: 'Protection plans cover 24/7 on-ground roadside assistance across Mathura-Vrindavan, third-party liability, and digital damage audit.',
      a: 'Our optional Protection Plan covers roadside assistance in Vrindavan, third-party liability, and digital inspection audit protection without requiring huge security cash deposits.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 text-white py-10 sm:py-16 px-4 overflow-hidden border-b border-teal-900/50">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-8 sm:mb-12">
            {/* Left Column: Heading & Value Proposition */}
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-teal-500/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold px-3.5 py-1.5 rounded-full mb-4 shadow-sm">
                <VrindavanFeatherIcon className="w-4 h-4 text-amber-400" />
                <span>Rent • Ride • Explore — Vrindavan &amp; Mathura</span>
              </span>

              <h1 className="font-heading text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.15]">
                Bike on Rent in Vrindavan &mdash; Scooty &amp; Two Wheeler Rental
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-normal max-w-2xl">
                Looking for a verified <strong>bike on rent in Vrindavan</strong> or the most reliable <strong>Vrindavan rental</strong> service? Rent Honda Activa 6G, EV scooters &amp; Royal Enfield for seamless temple darshan and Govardhan Parikrama. Transparent daily rates from ₹299/day or ₹40/hr with ₹0 deposit and free doorstep delivery to your ashram or railway station.
              </p>

              {/* Key Value Points */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6 text-xs text-slate-200 max-w-2xl">
                <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>₹0 Cash Deposit Available</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>2 Free Clean Helmets</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>15-Min Doorstep Drop</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <button
                  onClick={() => router.push('/bikes')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-transform active:scale-95 shrink-0 cursor-pointer"
                >
                  <VrindavanScooterIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.2} />
                  <span>Browse Available Bikes</span>
                </button>

                <a
                  href={`https://wa.me/${legalConfig.supportWhatsApp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Book Vrindavan Bike on WhatsApp Helpline"
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-xl flex items-center gap-2 shadow-md transition-transform active:scale-95 shrink-0"
                >
                  <WhatsAppBrandIcon className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                  <span>WhatsApp Booking Help</span>
                </a>

                {currentUser && (
                  <div className="bg-slate-900/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-xl flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Logged in: <strong>{currentUser.name}</strong></span>
                  </div>
                )}
              </div>

              {/* Pilgrim Social Proof Micro-bar */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <strong className="text-white font-bold">4.9 / 5</strong>
                  <span className="text-slate-400 ml-1.5">• 1,200+ Yatris &amp; Pilgrims Served in Vrindavan</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Photo Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-teal-500/30 group bg-slate-900">
                <picture>
                  <source srcSet="/images/hero-rider-vrindavan.webp" type="image/webp" />
                  <img
                    src="/images/hero-rider-vrindavan.webp"
                    alt="Pilgrim riding verified Honda Activa scooter on rent past ancient temples in Vrindavan"
                    width={800}
                    height={533}
                    className="w-full h-72 sm:h-84 lg:h-[390px] object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    fetchPriority="high"
                    decoding="sync"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>

                {/* Top Floating Badge */}
                <div className="absolute top-3.5 left-3.5 bg-slate-950/85 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>UP-85 Mathura Registered Fleet</span>
                </div>

                {/* Bottom Floating Price & Action Badge */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 p-3 sm:p-3.5 rounded-2xl flex items-center justify-between text-xs shadow-xl">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">Activa &amp; EV Scooters</span>
                    <span className="font-heading font-black text-amber-400 text-sm sm:text-base">From ₹299/day <span className="text-slate-400 text-[11px] font-normal">(₹40/hr)</span></span>
                  </div>
                  <button
                    onClick={() => router.push('/bikes')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-sm"
                  >
                    View Fleet &rarr;
                  </button>
                </div>
              </div>
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
              <span>Search &amp; Book Scooty on Rent in Vrindavan</span>
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
            <p className="font-heading font-extrabold text-lg text-slate-800 mb-1">No bikes listed yet</p>
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
                    src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'}
                    alt={`${vehicle.name} available for rent in Vrindavan starting ₹${vehicle.dailyRate}/day`}
                    width={600}
                    height={375}
                    loading="lazy"
                    decoding="async"
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
                      <span
                        onClick={() => setSelectedVehicle(vehicle)}
                        className="font-heading font-bold text-base text-slate-900 hover:text-emerald-700 cursor-pointer line-clamp-1 block"
                      >
                        {vehicle.name} ({vehicle.year})
                      </span>
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

      {/* VISUAL BRAJ & TEMPLE DARSHAN SECTION */}
      <section className="bg-gradient-to-b from-white via-amber-50/25 to-white py-14 sm:py-18 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="text-xs font-extrabold text-amber-700 bg-amber-100/70 border border-amber-300 px-3 py-1 rounded-full uppercase tracking-wider">
              Spiritual Freedom in Braj Bhoomi
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 mt-2.5">
              Explore Sacred Vrindavan &amp; Mathura on Two Wheels
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Cars and large cabs struggle in the historic narrow galis of Vrindavan. A verified scooter or bike gives you the flexibility to glide right to the temple steps and explore at your own divine rhythm.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Real Travel Photography Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-amber-200/80 group bg-slate-900">
                <picture>
                  <source srcSet="/images/prem-mandir-ride.webp" type="image/webp" />
                  <img
                    src="/images/prem-mandir-ride.webp"
                    alt="Honda Activa and Royal Enfield bikes on rent parked near Prem Mandir temple in Vrindavan"
                    width={800}
                    height={600}
                    className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-3.5 left-3.5 bg-slate-950/80 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Prem Mandir &amp; Raman Reti</span>
                </div>
                <div className="absolute bottom-3.5 left-3.5 right-3.5 bg-slate-950/85 backdrop-blur-md p-3 rounded-2xl border border-slate-700/80 text-xs text-white">
                  <p className="font-bold text-amber-300 text-xs mb-0.5">Easy Temple Parking &amp; Zero Traffic Stress</p>
                  <p className="text-[11px] text-slate-300">Park directly at Vidyapeeth Chauraha or Raman Reti without expensive auto haggling.</p>
                </div>
              </div>
            </div>

            {/* Right: Key Temple Circuits */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs mb-2.5">
                  01
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-sm mb-1">
                  Prem Mandir &amp; ISKCON Temple
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Wide Raman Reti corridor with dedicated two-wheeler parking. Ideal for evening musical fountain darshan and sandhya aarti.
                </p>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs mb-2.5">
                  02
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-sm mb-1">
                  Shri Bankey Bihari &amp; Nidhivan
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Inner parikrama marg restricts 4-wheelers. Reach VIP Marg easily and park securely at Vidyapeeth Chauraha or Harinikunj.
                </p>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs mb-2.5">
                  03
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-sm mb-1">
                  Govardhan 21 km Sacred Parikrama
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Complete the holy parikrama at your own peaceful pace on a smooth Activa or EV scooter without fixed taxi time pressures.
                </p>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-xs mb-2.5">
                  04
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-sm mb-1">
                  Mathura Junction (MTJ) to Vrindavan
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Doorstep delivery available directly outside Platform 1 exit. Reach your hotel or ashram in 20 minutes without negotiation.
                </p>
              </div>
            </div>
          </div>
        </div>
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
                    <p className="font-heading font-bold text-slate-900 text-xs mb-1">{item.title}</p>
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
                    <p className="font-heading font-bold text-slate-900 text-xs mb-1">{item.title}</p>
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
                <p className="font-heading font-bold text-slate-900 text-base mb-2">{item.title}</p>
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
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Transparent &amp; Fair Handover</span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mt-1">Digital Bike Inspection System</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">We capture Before vs. After status with timestamped mobile photos so you never pay for pre-existing scratches.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Image Preview */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-950 group">
                <picture>
                  <source srcSet="/images/bike-inspection-mobile.webp" type="image/webp" />
                  <img
                    src="/images/bike-inspection-mobile.webp"
                    alt="Digital 6-angle vehicle inspection system on mobile smartphone for Vrindavan bike rental"
                    width={800}
                    height={600}
                    className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-3.5 left-3.5 bg-slate-950/85 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Live 6-Angle Photo Audit</span>
                </div>
                <div className="absolute bottom-3.5 left-3.5 right-3.5 bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700 text-xs text-white">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">Dual Signature Verified</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">100% Paperless</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Odometer reading, fuel gauge &amp; scratch audit locked on WhatsApp before key handover.</p>
                </div>
              </div>
            </div>

            {/* 4 Inspection Steps */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { step: '1', title: 'Odometer & Fuel Gauge', desc: 'Record start KM reading & fuel percentage (0-100%) to ensure fair usage.', icon: RefreshCw },
                { step: '2', title: '6-Angle Photo Capture', desc: 'Front, Rear, Left, Right, Dashboard & Tyre condition timestamped photos.', icon: Camera },
                { step: '3', title: 'Damage Zone Logger', desc: 'Tag pre-existing scratches on the vehicle diagram so you are never charged.', icon: AlertCircle },
                { step: '4', title: 'Dual Signature Lock', desc: 'Customer & Owner confirm digital audit on app before driving away.', icon: Lock }
              ].map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div key={idx} className="bg-slate-800/80 hover:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-700/80 shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center justify-center shadow-xs">
                        {item.step}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 border border-emerald-400/30 flex items-center justify-center">
                        <IconComp className="w-4 h-4 text-emerald-400" strokeWidth={2.2} />
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-white text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOR BIKE OWNERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-amber-500/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Real Local Host Photo */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-amber-400/30 group bg-slate-950">
                <picture>
                  <source srcSet="/images/vrindavan-host-handover.webp" type="image/webp" />
                  <img
                    src="/images/vrindavan-host-handover.webp"
                    alt="Local Vrindavan bike rental host handing over scooter keys to pilgrim with verified KYC"
                    width={800}
                    height={533}
                    className="w-full h-72 sm:h-84 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-3.5 left-3.5 bg-slate-950/85 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Host in Vrindavan • UP-85</span>
                </div>
                <div className="absolute bottom-3.5 left-3.5 right-3.5 bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-xs">
                  <p className="font-bold text-amber-300">Verified Pilgrims Only</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">Every customer must verify Aadhaar &amp; Driving Licence before pickup.</p>
                </div>
              </div>
            </div>

            {/* Right: Content & Earnings Box */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full mb-3 inline-block">
                  Host Your Two-Wheeler
                </span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
                  Your bike can earn when you&apos;re not using it.
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed mt-2">
                  Turn your idle scooter or motorcycle into steady passive income. Verified pilgrim renters, digital inspection locks, and direct 24-hour bank payouts to your UPI.
                </p>
              </div>

              {/* Earnings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-2xl">
                  <div className="text-slate-400 text-[11px]">Scooty (Activa / Jupiter)</div>
                  <div className="font-heading font-black text-emerald-400 text-lg sm:text-xl mt-0.5">₹8,000 – ₹12,000<span className="text-xs font-normal text-slate-400">/mo</span></div>
                  <div className="text-[10px] text-slate-400 mt-1">High demand year-round</div>
                </div>
                <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-2xl">
                  <div className="text-slate-400 text-[11px]">Cruiser (Classic 350 / Hunter)</div>
                  <div className="font-heading font-black text-amber-400 text-lg sm:text-xl mt-0.5">₹15,000 – ₹22,000<span className="text-xs font-normal text-slate-400">/mo</span></div>
                  <div className="text-[10px] text-slate-400 mt-1">Top earner for Parikrama yatris</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={promptSwitchToHost}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm py-3 px-6 rounded-xl flex items-center gap-2 shadow-xl transition-transform active:scale-95 cursor-pointer"
                >
                  <Key className="w-4 h-4 text-slate-950" />
                  <span>List Your Bike (Takes 2 Mins)</span>
                </button>
                <span className="text-[11px] text-slate-400">• You keep 85% of every rental booking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5.5 MEET THE FOUNDER & LOCAL TEAM */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Avatar & Info */}
            <div className="flex flex-col items-center sm:items-start shrink-0 mx-auto sm:mx-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-xl border-2 border-emerald-400/50 bg-slate-900 relative group">
                <img
                  src="/data/profile-image/shivamdixit.png"
                  alt="Shivam Dixit - Founder & CEO, Rent on Cent"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  width={112}
                  height={112}
                  loading="lazy"
                />
              </div>

              <div className="mt-4 text-center sm:text-left space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                  Shivam Dixit
                </h3>
                <p className="text-xs font-bold text-emerald-700">Founder &amp; CEO, Rent on Cent</p>
                <p className="text-[11px] text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Panighat Parikrama Marg, Vrindavan</span>
                </p>
              </div>

              {/* Founder Social Profile Links */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 w-full justify-center sm:justify-start">
                <a
                  href="https://linkedin.com/in/shivdix"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-sky-600 transition-colors cursor-pointer"
                  title="Shivam Dixit LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://shivamdixit.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
                  title="Shivam Dixit Portfolio"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/rentoncent.official/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-pink-600 transition-colors cursor-pointer"
                  title="Rent on Cent Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Story & Operations */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-900 font-bold text-xs px-3 py-1 rounded-full border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Local Brajwasi Leadership • Tech-Backed Trust</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                Built by Locals to Protect Visiting Pilgrims
              </h2>

              <p>
                &quot;Growing up on <strong>Panighat Parikrama Marg in Vrindavan</strong>, I watched visiting yatris and families face constant exploitation from unverified touts and unreasonable transport fares. As a software engineer, I built <strong>Rent on Cent</strong> to provide a secure, peer-to-peer two-wheeler sharing network — giving yatris clean, verified bikes from ₹299/day while empowering local vehicle owners with fair daily earnings.&quot;
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <div className="font-bold text-slate-900 font-heading">Local Roots</div>
                  <p className="text-slate-500 text-[11px] mt-0.5">Brajwasi native from Panighat Parikrama Marg, Vrindavan.</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <div className="font-bold text-slate-900 font-heading">Digital Safety</div>
                  <p className="text-slate-500 text-[11px] mt-0.5">Automated Aadhaar/DL KYC and timestamped 6-photo inspection.</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <div className="font-bold text-slate-900 font-heading">On-Ground Fleet Team</div>
                  <p className="text-slate-500 text-[11px] mt-0.5">Dedicated hub coordinators at Prem Mandir, Chattikara &amp; Mathura Jn.</p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/about')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                >
                  <span>Read our full story &amp; team mission</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL && (
                  <a
                    href={process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>View on Google Maps ↗</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL SHARING OPTIONS BAR */}
      <SocialShareBar />

      {/* 6. FAQ SECTION */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider font-mono">Got Questions?</span>
            <h2 className="font-heading font-extrabold text-3xl text-slate-900 mt-1">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500 mt-1">Quick, transparent answers for yatris, tourists, and bike renters in Vrindavan.</p>
          </div>

          {/* Quick Answers at a Glance for Most Common Questions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider font-mono">Top Answer • Pricing</span>
              <h4 className="font-bold text-slate-900 text-xs">How much does scooty rental cost?</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                Starts from <strong>₹40/hr</strong> &amp; <strong>₹299/day</strong> for Activa 6G &amp; EV scooters. Includes 2 sanitized ISI helmets, roadside help, and zero security deposit.
              </p>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider font-mono">Top Answer • Documents</span>
              <h4 className="font-bold text-slate-900 text-xs">What documents do I need to rent?</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                Just a valid <strong>two-wheeler Driving Licence (DL)</strong> and government photo ID (<strong>Aadhaar/Passport</strong>). DigiLocker is 100% accepted—no physical papers kept.
              </p>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider font-mono">Top Answer • Cancellation</span>
              <h4 className="font-bold text-slate-900 text-xs">What if I need to cancel my booking?</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>100% free cancellation</strong> up to 12 hours before pickup. If cancelled within 12 hours, you get a full 100% rental credit voucher valid for 12 months.
              </p>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider font-mono">Top Answer • Inspection</span>
              <h4 className="font-bold text-slate-900 text-xs">How does digital inspection protect me?</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                A <strong>6-photo digital check</strong> records fuel, odometer, and prior scratches before handover. You are never blamed or charged for pre-existing marks.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {faqData.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 transition-all">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 font-heading font-bold text-slate-900 text-sm hover:bg-slate-100 transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      {faq.q}
                    </span>
                    {/* Short, Visible Answer Directly Displayed on the page */}
                    <p className="text-xs font-normal text-slate-600 pl-6 leading-relaxed">
                      <span className="font-bold text-emerald-700">Quick Answer:</span> {faq.shortA}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 mt-1 transition-transform ${openFaqIndex === idx ? 'rotate-180 text-emerald-600' : ''}`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="p-4 sm:p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                    <span className="font-bold text-slate-800 block mb-1">Detailed Explanation:</span>
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
                <div className="font-heading text-lg font-bold text-slate-900">Reserve Vehicle</div>
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

              {/* Cancellation, Refund & Protection Policy Rules Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5 text-left">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cancellation, Refund &amp; Protection Rules</span>
                </div>
                <ul className="space-y-1 text-[11px] text-slate-600 pl-0.5">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">•</span>
                    <span><strong>Free Cancellation:</strong> 100% full refund if cancelled up to 12 hours before scheduled pickup.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">•</span>
                    <span><strong>Flexible Credit Voucher:</strong> Cancellations within 12 hours receive 100% rental credit valid for 12 months.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">•</span>
                    <span><strong>Scratch Protection:</strong> 6-photo pre-ride inspection logs prior scratches so you are never charged for pre-existing wear.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">•</span>
                    <span><strong>Zero Cash Deposit:</strong> Verified riders with valid DL &amp; Aadhaar pay ₹0 security cash deposit.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 pt-1">
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
