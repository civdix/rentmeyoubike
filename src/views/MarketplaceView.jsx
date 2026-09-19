'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { VerifiedOwnerBadge, VerifiedVehicleBadge, DivineVerifiedBadge, TemplePassBadge } from '../components/TrustBadges';
import { ProtectionSection } from '../components/ProtectionSection';
import { VehicleDetailView } from './VehicleDetailView';
import {
  Search, Filter, MapPin, Calendar, MessageSquare, ShieldCheck, Star, Bike, ArrowRight,
  Info, CheckCircle2, SlidersHorizontal, ArrowUpDown, ChevronDown, Check, Sparkles, RefreshCw, X, Zap
} from 'lucide-react';
import { VrindavanScooterIcon, VrindavanFeatherIcon, WhatsAppBrandIcon, HelmetsIcon, KeyHandoverIcon } from '../components/CustomIcons';

export const MarketplaceView = () => {
  const {
    vehicles,
    setSelectedVehicle,
    selectedVehicle,
    createBooking,
    setActiveWhatsAppModal,
    legalConfig,
    currentUser,
    openLoginModal
  } = useApp();

  // Filters State
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'scooter' | 'motorcycle'
  const [transmissionFilter, setTransmissionFilter] = useState('all'); // 'all' | 'automatic' | 'manual'
  const [priceMax, setPriceMax] = useState(1200);
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [pickupAreaFilter, setPickupAreaFilter] = useState('all');
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(tomorrowStr);

  // Sort State
  const [sortBy, setSortBy] = useState('recommended'); // 'price_asc' | 'price_desc' | 'popular' | 'recommended'

  // Mobile Filter Drawer Toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Booking Form Modal State
  const [bookingDrawerVehicle, setBookingDrawerVehicle] = useState(null);
  const [customerName, setCustomerName] = useState(() => currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(() => currentUser?.phone || '');

  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.name && !customerName) setCustomerName(currentUser.name);
      if (currentUser.phone && !customerPhone) setCustomerPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Filter & Sort Logic
  const filteredAndSortedVehicles = useMemo(() => {
    let result = vehicles.filter((v) => {
      // Must be active AND approved by Admin
      if (v.status !== 'active') return false;
      const isApproved = v.vehicleVerified || v.verificationStatus === 'Verified';
      if (!isApproved) return false;

      // Category filter
      if (categoryFilter !== 'all' && v.type !== categoryFilter) return false;

      // Transmission filter
      if (transmissionFilter !== 'all' && v.transmission !== transmissionFilter) return false;

      // Max price filter
      if (v.dailyRate > priceMax) return false;

      // Pickup area filter
      if (pickupAreaFilter !== 'all' && v.locationArea !== pickupAreaFilter) return false;

      return true;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'price_asc') {
        return a.dailyRate - b.dailyRate;
      }
      if (sortBy === 'price_desc') {
        return b.dailyRate - a.dailyRate;
      }
      if (sortBy === 'popular') {
        return b.reviewsCount - a.reviewsCount;
      }
      // 'recommended'
      return b.rating - a.rating;
    });

    return result;
  }, [vehicles, categoryFilter, transmissionFilter, priceMax, pickupAreaFilter, sortBy]);

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

  const handleResetFilters = () => {
    setCategoryFilter('all');
    setTransmissionFilter('all');
    setPriceMax(1200);
    setPickupAreaFilter('all');
    setSortBy('recommended');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Route & Header Banner */}
      <div className="bg-slate-900 text-white py-8 px-4 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[11px] bg-slate-800 text-emerald-400 font-bold px-2.5 py-0.5 rounded border border-slate-700">
                rentoncent.bond
              </span>
              <span className="text-amber-400 text-xs font-bold flex items-center gap-1">
                <VrindavanFeatherIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Rent • Ride • Explore</span>
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">Browse Bikes & Scooters in Vrindavan</h1>
            <p className="text-xs text-slate-400 mt-1">Verified bikes with transparent pricing, zero security deposits, and direct WhatsApp handover.</p>
          </div>

          <a
            href={`https://wa.me/${legalConfig.supportWhatsApp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 shrink-0"
          >
            <WhatsAppBrandIcon className="w-4 h-4 fill-white" />
            <span>WhatsApp Support</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Control Bar: Mobile Filter Button & Sort Selector */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden bg-slate-900 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 border border-slate-800 shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
              <span>Filters</span>
            </button>

            <span className="text-xs font-extrabold text-slate-700">
              Showing <span className="text-emerald-700">{filteredAndSortedVehicles.length}</span> Verified Vehicles
            </span>
          </div>

          {/* Sort Menu */}
          <div className="flex items-center gap-2 text-xs">
            <label className="font-extrabold text-slate-600 flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-700" strokeWidth={2.5} />
              </div>
              Sort By:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 text-slate-900 font-extrabold text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 shadow-xs"
            >
              <option value="recommended">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 h-fit sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center justify-center shadow-xs">
                  <Filter className="w-4 h-4 text-emerald-700" strokeWidth={2.5} />
                </div>
                Filter Vehicles
              </h3>
              <button onClick={handleResetFilters} className="text-[11px] text-emerald-700 hover:underline font-extrabold">
                Reset All
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Category</label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'all', label: 'All Categories' },
                  { id: 'scooter', label: 'Scooter (Activa, Jupiter, Access)' },
                  { id: 'motorcycle', label: 'Motorcycle (Classic 350, Shine)' },
                  { id: 'bicycle', label: 'Bicycle / Cycle (Hero Lectro, Firefox, Decathlon)' },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-slate-50">
                    <input
                      type="radio"
                      name="category"
                      checked={categoryFilter === item.id}
                      onChange={() => setCategoryFilter(item.id)}
                      className="w-4 h-4 accent-emerald-600"
                    />
                    <span className={categoryFilter === item.id ? 'font-bold text-slate-900' : 'text-slate-600'}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Transmission</label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'all', label: 'All Transmissions' },
                  { id: 'automatic', label: 'Automatic (Gearless / EV / Pedelec)' },
                  { id: 'manual', label: 'Manual (Gears / Pedal)' },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-slate-50">
                    <input
                      type="radio"
                      name="transmission"
                      checked={transmissionFilter === item.id}
                      onChange={() => setTransmissionFilter(item.id)}
                      className="w-4 h-4 accent-emerald-600"
                    />
                    <span className={transmissionFilter === item.id ? 'font-bold text-slate-900' : 'text-slate-600'}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Pickup Area in Vrindavan</label>
              <select
                value={pickupAreaFilter}
                onChange={(e) => setPickupAreaFilter(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-semibold focus:outline-none focus:border-emerald-600"
              >
                <option value="all">All Vrindavan Hubs</option>
                <option value="Prem Mandir Road">Prem Mandir Road</option>
                <option value="Bankey Bihari Temple Road">Bankey Bihari Temple Road</option>
                <option value="ISKCON Temple Chowk">ISKCON Temple Chowk</option>
                <option value="Vrindavan Railway Station">Vrindavan Railway Station</option>
                <option value="Chattikara Road">Chattikara Road</option>
                <option value="Seva Kunj Road">Seva Kunj Road</option>
                <option value="Raman Reti">Raman Reti</option>
                <option value="Sunrakh Road">Sunrakh Road</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Available Dates</label>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Start</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-1.5 rounded-lg border border-slate-300 bg-slate-50"
                  />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">End</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-1.5 rounded-lg border border-slate-300 bg-slate-50"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">Max Price/Day</label>
                <span className="text-xs font-extrabold text-emerald-700">₹{priceMax}/day</span>
              </div>
              <input
                type="range"
                min="100"
                max="1200"
                step="50"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer mt-1"
              />
            </div>
          </div>

          {/* Vehicle Cards Grid / Empty State */}
          <div className="lg:col-span-3">
            {filteredAndSortedVehicles.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto text-2xl">
                  🚲
                </div>
                <h3 className="font-heading font-extrabold text-slate-900 text-xl">
                  No bikes available for these dates.
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your start & end dates, category selection, or expanding your price range slider.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-transform active:scale-95 inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                  <span>Reset All Filters & Dates</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedVehicles.map((vehicle) => (
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

                    <div className="p-4 space-y-3">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            onClick={() => setSelectedVehicle(vehicle)}
                            className="font-heading font-bold text-base text-slate-900 hover:text-emerald-700 cursor-pointer line-clamp-1"
                          >
                            {vehicle.name} ({vehicle.year})
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          {vehicle.locationArea}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Transmission</span>
                          <span className="font-semibold text-slate-800 capitalize">{vehicle.transmission}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Helmet Included</span>
                          <span className="font-semibold text-emerald-700">
                            {vehicle.helmetIncluded ? '2 Free Helmets' : 'Not Included'}
                          </span>
                        </div>
                      </div>

                      {/* Explicit EV Specification Pill */}
                      {(vehicle.fuelType === 'Electric' || vehicle.isEV || vehicle.fuelType === 'Electric Assist') && (
                        <div className="bg-emerald-50 border border-emerald-300 p-2 rounded-xl text-[11px] text-emerald-950 font-bold flex items-center justify-between shadow-2xs">
                          <span className="flex items-center gap-1">
                            <span className="text-emerald-700 font-black">⚡</span>
                            <span>EV Electric • {vehicle.evRangeKm || 105} km Range</span>
                          </span>
                          <span className="bg-emerald-200 text-emerald-950 text-[10px] px-1.5 py-0.5 rounded font-extrabold">
                            {vehicle.chargingCostIncluded !== false ? 'Free Charging' : 'Self Charge'}
                          </span>
                        </div>
                      )}

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
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-end justify-center p-0 lg:hidden">
          <div className="bg-white rounded-t-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                Filter Vehicles
              </h3>
              <button onClick={() => setMobileFilterOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-semibold"
              >
                <option value="all">All Categories</option>
                <option value="scooter">Scooter</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="bicycle">Bicycle / Cycle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Transmission</label>
              <select
                value={transmissionFilter}
                onChange={(e) => setTransmissionFilter(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-semibold"
              >
                <option value="all">All Transmissions</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Pickup Area</label>
              <select
                value={pickupAreaFilter}
                onChange={(e) => setPickupAreaFilter(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-semibold"
              >
                <option value="all">All Vrindavan Hubs</option>
                <option value="Prem Mandir Road">Prem Mandir Road</option>
                <option value="Bankey Bihari Temple Road">Bankey Bihari Temple Road</option>
                <option value="ISKCON Temple Chowk">ISKCON Temple Chowk</option>
                <option value="Vrindavan Railway Station">Vrindavan Railway Station</option>
                <option value="Chattikara Road">Chattikara Road</option>
              </select>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full bg-slate-900 text-white font-bold text-xs py-3 rounded-xl shadow-md"
            >
              Apply Filters ({filteredAndSortedVehicles.length} Bikes)
            </button>
          </div>
        </div>
      )}

      {/* FULL STANDALONE VEHICLE DETAIL PAGE VIEW */}
      {selectedVehicle && (
        <VehicleDetailView
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}

      {/* Booking Form Modal */}
      {bookingDrawerVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900">Book Vehicle</h3>
                <p className="text-xs text-slate-500 font-medium">Rent {bookingDrawerVehicle.name} • Instant confirmation</p>
              </div>
              <button 
                onClick={() => setBookingDrawerVehicle(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={(e) => handleInitiateBooking(e, false)} className="space-y-3 text-xs">
              {!currentUser && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-900 text-xs flex items-center justify-between gap-2">
                  <span>⚡ Quick Guest Booking enabled — no password required!</span>
                  <button
                    type="button"
                    onClick={() => openLoginModal('customer')}
                    className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs shrink-0 hover:bg-emerald-500 cursor-pointer shadow-sm"
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
