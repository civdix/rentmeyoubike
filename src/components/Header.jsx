import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, User, LogIn, LogOut, ChevronDown, ShieldCheck, Bike, Search, CalendarCheck } from 'lucide-react';
import { VrindavanScooterIcon, VrindavanFeatherIcon, WhatsAppBrandIcon, KeyHandoverIcon } from './CustomIcons';

export const Header = () => {
  const {
    role,
    setRole,
    legalConfig,
    currentUser,
    openLoginModal,
    logoutUser,
    customerTab,
    setCustomerTab,
    vehicles,
    bookings
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const activeVehiclesCount = React.useMemo(() => {
    return (vehicles || []).filter((v) => v.status === 'active').length;
  }, [vehicles]);

  const userBookingsCount = React.useMemo(() => {
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

  const navigateTo = (tab) => {
    setRole('customer');
    if (setCustomerTab) setCustomerTab(tab);
    window.dispatchEvent(new CustomEvent('vr_navigate', { detail: tab }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-sm font-sans">
      {/* Top Announcement & Support Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase border border-amber-500/30 flex items-center gap-1.5">
              <VrindavanFeatherIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Radhe Radhe!</span>
            </span>
            <span className="text-slate-300 text-[11px] sm:text-xs">
              Verified Bike & Scooter Rentals in <strong className="text-white">Vrindavan Dham</strong> • Prem Mandir, ISKCON & Bankey Bihari
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href={`https://wa.me/${(legalConfig?.supportWhatsApp || '+919876543210').replace(/[^0-9]/g, '')}?text=Radhe%20Radhe!%20I%20have%20an%20inquiry%20regarding%20bike%20rentals.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold"
            >
              <WhatsAppBrandIcon className="w-3.5 h-3.5 fill-emerald-400" />
              <span>WhatsApp Help: {legalConfig?.supportWhatsApp || '+91 98765 43210'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigateTo('home')}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md border border-emerald-400/40 shrink-0 group-hover:scale-105 transition-transform">
            <VrindavanScooterIcon className="w-6 h-6 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Vrindavan Rides
              </span>
              <span className="bg-emerald-950/90 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-800">
                P2P Rental
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              Direct from Local Verified Hosts
            </p>
          </div>
        </div>

        {/* Customer Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800/80 text-xs font-bold">
          <button
            onClick={() => navigateTo('home')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              role === 'customer' && customerTab === 'home'
                ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>Home</span>
          </button>
          <button
            onClick={() => navigateTo('browse')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              role === 'customer' && customerTab === 'browse'
                ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Browse Marketplace</span>
            {activeVehiclesCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                role === 'customer' && customerTab === 'browse'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}>
                {activeVehiclesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigateTo('my_bookings')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 relative ${
              role === 'customer' && customerTab === 'my_bookings'
                ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>My Bookings</span>
            {userBookingsCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                role === 'customer' && customerTab === 'my_bookings'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
              }`}>
                {userBookingsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Side Actions: Host CTA + Profile / Sign In */}
        <div className="flex items-center gap-3">
          {/* Subtle Host CTA Button */}
          {role === 'owner' ? (
            <button
              onClick={() => setRole('customer')}
              className="inline-flex items-center gap-1.5 bg-amber-500 text-slate-950 hover:bg-amber-400 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95 shrink-0"
              title="Return to Customer Rental Marketplace"
            >
              <VrindavanScooterIcon className="w-4 h-4 text-slate-950" />
              <span>Back to Renter View</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (!currentUser || (currentUser.role !== 'owner' && currentUser.role !== 'admin')) {
                  openLoginModal('owner');
                }
                setRole('owner');
              }}
              className="inline-flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 text-amber-300 hover:text-amber-200 font-bold text-xs px-3 py-2 rounded-xl border border-amber-500/30 hover:border-amber-400/60 transition-all shadow-sm active:scale-95 shrink-0 group"
              title="List your vehicle and earn up to ₹22,000/month"
            >
              <KeyHandoverIcon className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>List Your Bike</span>
              <span className="hidden lg:inline-block bg-amber-400/20 text-amber-300 text-[10px] font-mono px-1.5 py-0.2 rounded-md border border-amber-400/30">
                Earn 85%
              </span>
            </button>
          )}

          {/* User Profile / Sign In Dropdown */}
          <div className="relative">
            {currentUser ? (
              <div>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 py-1.5 px-3 rounded-xl text-xs transition-all shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-extrabold flex items-center justify-center text-[11px] shadow-sm">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="font-bold text-white text-[11px] leading-tight truncate max-w-[100px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[9px] text-emerald-400 uppercase font-semibold">
                      {currentUser.role === 'owner' ? 'Host' : currentUser.role === 'admin' ? 'Admin 🛡️' : 'Renter'}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn">
                    <div className="px-3 py-2.5 border-b border-slate-800 text-[11px]">
                      <p className="text-slate-400">Signed in as</p>
                      <p className="font-bold text-white truncate text-xs">{currentUser.name}</p>
                      <p className="text-[10px] text-emerald-400 font-mono mt-0.5 truncate">
                        {currentUser.phone || currentUser.email || 'Authenticated Session'}
                      </p>
                    </div>

                    <div className="py-1 space-y-0.5 text-xs font-medium">
                      {role !== 'customer' && (
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setRole('customer');
                          }}
                          className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2"
                        >
                          <VrindavanScooterIcon className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Renter Marketplace</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigateTo('my_bookings');
                        }}
                        className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <CalendarCheck className="w-3.5 h-3.5 text-teal-400" />
                        <span>My Bookings</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setRole('owner');
                        }}
                        className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <KeyHandoverIcon className="w-3.5 h-3.5 text-amber-400" />
                        <span>Host Control Center</span>
                      </button>

                      {(currentUser.role === 'admin' || (typeof window !== 'undefined' && localStorage.getItem('vr_admin_token'))) && (
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setRole('admin');
                          }}
                          className="w-full text-left px-3 py-2 text-purple-300 hover:text-white hover:bg-purple-950/40 rounded-xl transition-colors flex items-center gap-2"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                          <span>Admin Control Center</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          openLoginModal(role);
                        }}
                        className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Switch Account</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logoutUser();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-2"
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
                onClick={() => openLoginModal('customer')}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-md active:scale-95 shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 text-white" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
