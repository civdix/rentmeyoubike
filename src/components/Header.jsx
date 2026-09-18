'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { MapPin, User, LogIn, LogOut, ChevronDown, ShieldCheck, Bike, Search, CalendarCheck, UserPlus, Mail, PlusCircle, IndianRupee } from 'lucide-react';
import { VrindavanScooterIcon, VrindavanFeatherIcon, WhatsAppBrandIcon, KeyHandoverIcon } from './CustomIcons';

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const {
    role,
    setRole,
    legalConfig,
    currentUser,
    openLoginModal,
    openContactModal,
    logoutUser,
    vehicles,
    bookings,
    promptSwitchToHost,
    hostTab,
    setHostTab
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const activeVehiclesCount = useMemo(() => {
    return (vehicles || []).filter(
      (v) => v.status === 'active' && (v.vehicleVerified || v.verificationStatus === 'Verified')
    ).length;
  }, [vehicles]);

  const userBookingsCount = useMemo(() => {
    if (!currentUser) return 0;
    const cleanUserPhone = (currentUser.phone || '').replace(/[^0-9]/g, '');
    return (bookings || []).filter((b) => {
      const cleanBookingPhone = (b.customerPhone || '').replace(/[^0-9]/g, '');
      if (cleanUserPhone && cleanBookingPhone && cleanUserPhone.slice(-10) === cleanBookingPhone.slice(-10)) {
        return true;
      }
      if (currentUser.name && b.customerName && b.customerName.toLowerCase().trim() === currentUser.name.toLowerCase().trim()) {
        return true;
      }
      return false;
    }).length;
  }, [bookings, currentUser]);

  // Host fleet vehicles count
  const myVehiclesCount = useMemo(() => {
    if (!currentUser) return 0;
    const currentHostPhone = (currentUser.phone || '').replace(/[^0-9]/g, '');
    const currentHostName = (currentUser.name || '').toLowerCase().trim();
    return (vehicles || []).filter((v) => {
      const vPhone = (v.ownerPhone || '').replace(/[^0-9]/g, '');
      if (currentHostPhone && vPhone && currentHostPhone.slice(-10) === vPhone.slice(-10)) return true;
      if (v.ownerName && currentHostName && v.ownerName.toLowerCase().trim() === currentHostName) return true;
      return false;
    }).length;
  }, [vehicles, currentUser]);

  // Host incoming rented bookings count
  const myHostBookingsCount = useMemo(() => {
    if (!currentUser) return 0;
    const currentHostPhone = (currentUser.phone || '').replace(/[^0-9]/g, '');
    const currentHostName = (currentUser.name || '').toLowerCase().trim();
    return (bookings || []).filter((b) => {
      const bPhone = (b.ownerPhone || '').replace(/[^0-9]/g, '');
      if (currentHostPhone && bPhone && currentHostPhone.slice(-10) === bPhone.slice(-10)) return true;
      if (b.ownerName && currentHostName && b.ownerName.toLowerCase().trim() === currentHostName) return true;
      return false;
    }).length;
  }, [bookings, currentUser]);

  const isHome = pathname === '/';
  const isBikes = pathname.startsWith('/bikes');
  const isBookings = pathname === '/my-bookings';

  const handleSwitchToRenter = () => {
    setRole('customer');
    router.push('/');
  };

  const handleHostClick = () => {
    if (role === 'owner') {
      router.push('/host');
    } else {
      promptSwitchToHost();
    }
  };

  const handleSignOut = () => {
    logoutUser();
    setProfileDropdownOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-sm font-sans">
      {/* Top Announcement & Support Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1 px-3 sm:px-4 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-hidden">
          <div className="flex items-center gap-1.5 min-w-0 truncate">
            <span className="bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] tracking-wide uppercase border border-amber-500/30 flex items-center gap-1 shrink-0">
              <VrindavanFeatherIcon className="w-3 h-3 text-amber-400" />
              <span>Radhe Radhe!</span>
            </span>
            <span className="text-slate-300 text-[10px] sm:text-xs truncate">
              Verified Bike Rentals in <strong className="text-white">Vrindavan Dham</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] shrink-0">
            <a
              href={`https://wa.me/${(legalConfig?.supportWhatsApp || '+919720965985').replace(/[^0-9]/g, '')}?text=Radhe%20Radhe!%20I%20have%20an%20inquiry%20regarding%20bike%20rentals.`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp Bike Rental Inquiry Assistance"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
            >
              <WhatsAppBrandIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-emerald-400" />
              <span className="hidden sm:inline">WhatsApp Help</span>
            </a>

            <span className="text-slate-700 hidden sm:inline">•</span>

            <button
              type="button"
              onClick={() => openContactModal()}
              className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 font-bold transition-colors cursor-pointer"
            >
              <Mail className="w-3 h-3 text-teal-400" />
              <span>Contact</span>
            </button>

            {currentUser ? (
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-slate-700">•</span>
                <span className="text-slate-400 text-[11px]">
                  Hi, <strong className="text-white">{currentUser.name?.split(' ')[0] || 'User'}</strong>
                </span>
                <button
                  onClick={() => role === 'customer' ? promptSwitchToHost() : handleSwitchToRenter()}
                  className="text-amber-400 hover:text-amber-300 font-bold underline text-[10px] cursor-pointer"
                >
                  {role === 'customer' ? 'Host Mode' : 'Renter Mode'}
                </button>
              </div>
            ) : (
              <span className="text-slate-500 text-[10px] hidden md:inline">
                • Verified P2P Fleet
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Tagline */}
        <Link
          href="/"
          aria-label="Rent on Cent - Direct Local Bike Rentals"
          className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center p-1 sm:p-1.5 shadow-md border border-emerald-400/40 shrink-0 group-hover:scale-105 transition-transform">
            <img src="/logo_square_share_area.png" alt="Rent to Cent Logo" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-heading font-extrabold text-base sm:text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors whitespace-nowrap">
                Rent to Cent
              </span>
              <span className="hidden md:inline-block bg-emerald-950/90 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-800">
                P2P Rental
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              Direct from Local Verified Hosts
            </p>
          </div>
        </Link>

        {/* Role-Specific Nav Links */}
        {role === 'owner' ? (
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-amber-500/30 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setHostTab('inventory');
                if (pathname !== '/host') router.push('/host?tab=inventory');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                pathname === '/host' && (hostTab === 'inventory' || hostTab === 'my_listings')
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Inventory</span>
              {myVehiclesCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  pathname === '/host' && (hostTab === 'inventory' || hostTab === 'my_listings')
                    ? 'bg-slate-950 text-amber-300'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {myVehiclesCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setHostTab('add_new');
                if (pathname !== '/host') router.push('/host?tab=add_new');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                pathname === '/host' && hostTab === 'add_new'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List Your Bike</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setHostTab('bookings');
                if (pathname !== '/host') router.push('/host?tab=bookings');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                pathname === '/host' && hostTab === 'bookings'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>My Bookings</span>
              {myHostBookingsCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  pathname === '/host' && hostTab === 'bookings'
                    ? 'bg-slate-950 text-amber-300'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {myHostBookingsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setHostTab('payments');
                if (pathname !== '/host') router.push('/host?tab=payments');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                pathname === '/host' && hostTab === 'payments'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Payments &amp; Refunds</span>
            </button>
          </nav>
        ) : (
          /* Customer Center Nav Links (Next.js real routes) */
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800/80 text-xs font-bold">
            <Link
              href="/"
              aria-label="Rent on Cent Marketplace Home"
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                isHome
                  ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>Home</span>
            </Link>
            <Link
              href="/bikes"
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                isBikes
                  ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Browse Marketplace</span>
              {activeVehiclesCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isBikes
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {activeVehiclesCount}
                </span>
              )}
            </Link>
            <Link
              href="/my-bookings"
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 relative ${
                isBookings
                  ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>My Bookings</span>
              {userBookingsCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isBookings
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {userBookingsCount}
                </span>
              )}
            </Link>
          </nav>
        )}

        {/* Right Side Actions: Host CTA + Profile / Sign In */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Host CTA Button */}
          {role === 'owner' ? (
            <button
              onClick={handleSwitchToRenter}
              className="inline-flex items-center gap-1 sm:gap-1.5 bg-amber-500 text-slate-950 hover:bg-amber-400 font-extrabold text-[11px] sm:text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all shadow-sm active:scale-95 shrink-0 cursor-pointer"
              title="Return to Customer Rental Marketplace"
            >
              <VrindavanScooterIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 shrink-0" />
              <span className="hidden sm:inline">Back to Renter View</span>
              <span className="sm:hidden">Renters</span>
            </button>
          ) : (
            <button
              onClick={handleHostClick}
              className="inline-flex items-center gap-1 sm:gap-1.5 bg-slate-800/80 hover:bg-slate-800 text-amber-300 hover:text-amber-200 font-bold text-[11px] sm:text-xs px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-amber-500/30 hover:border-amber-400/60 transition-all shadow-sm active:scale-95 shrink-0 group cursor-pointer"
              title="List your vehicle and earn up to 85% on Rent to Cent"
            >
              <KeyHandoverIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="hidden sm:inline">List Your Bike</span>
              <span className="sm:hidden">Host</span>
              <span className="hidden lg:inline-block bg-amber-400/20 text-amber-300 text-[10px] font-mono px-1.5 py-0.2 rounded-md border border-amber-400/30">
                Earn 85%
              </span>
            </button>
          )}

          {/* User Profile / Sign In Dropdown */}
          <div className="relative shrink-0">
            {currentUser ? (
              <div>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 py-1 sm:py-1.5 px-2 sm:px-3 rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-extrabold flex items-center justify-center text-[11px] shadow-sm shrink-0">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="font-bold text-white text-[11px] leading-tight truncate max-w-[90px] md:max-w-[120px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[9px] text-emerald-400 uppercase font-semibold">
                      {currentUser.role === 'admin' ? 'Admin 🛡️' : role === 'owner' ? 'Host Mode' : 'Renter Mode'}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 max-w-[calc(100vw-24px)] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn">
                    <div className="px-3 py-2.5 border-b border-slate-800 text-[11px]">
                      <p className="text-slate-400">Signed in as</p>
                      <p className="font-bold text-white truncate text-xs">{currentUser.name}</p>
                      <p className="text-[10px] text-emerald-400 font-mono mt-0.5 truncate">
                        {currentUser.phone || currentUser.email || 'Unified Account'}
                      </p>
                    </div>

                    <div className="py-1 space-y-0.5 text-xs font-medium">
                      {role !== 'customer' ? (
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleSwitchToRenter();
                          }}
                          className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <VrindavanScooterIcon className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Switch to Renter View</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            promptSwitchToHost();
                          }}
                          className="w-full text-left px-3 py-2 text-amber-300 hover:text-amber-200 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2 cursor-pointer font-bold"
                        >
                          <KeyHandoverIcon className="w-3.5 h-3.5 text-amber-400" />
                          <span>Switch to Host / Fleet Host</span>
                        </button>
                      )}

                      {role === 'owner' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setHostTab('bookings');
                            if (pathname !== '/host') router.push('/host?tab=bookings');
                          }}
                          className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <CalendarCheck className="w-3.5 h-3.5 text-teal-400" />
                          <span>Fleet Bookings ({myHostBookingsCount})</span>
                        </button>
                      ) : (
                        <Link
                          href="/my-bookings"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2"
                        >
                          <CalendarCheck className="w-3.5 h-3.5 text-teal-400" />
                          <span>My Bookings</span>
                        </Link>
                      )}

                      {/* Admin Access ONLY for verified platform administrators */}
                      {currentUser?.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full text-left px-3 py-2 text-purple-300 hover:text-white hover:bg-purple-950/40 rounded-xl transition-colors flex items-center gap-2"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openLoginModal('customer', 'login')}
                className="inline-flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold sm:font-extrabold text-[11px] sm:text-xs px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all shadow-md shadow-emerald-950/40 active:scale-95 shrink-0 border border-emerald-400/40 whitespace-nowrap cursor-pointer"
                title="Log In or Sign Up"
              >
                <LogIn className="w-3.5 h-3.5 text-white shrink-0" />
                <span>Log In</span>
                <span className="hidden sm:inline">/ Sign Up</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
