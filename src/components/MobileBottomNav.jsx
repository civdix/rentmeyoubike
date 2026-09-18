'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { Home, Bike, Clock, MessageSquare, Key } from 'lucide-react';
import { KeyHandoverIcon } from './CustomIcons';

export const MobileBottomNav = () => {
  const pathname = usePathname();
  const {
    role,
    currentUser,
    promptSwitchToHost,
    openLoginModal,
    vehicles,
    bookings,
    legalConfig
  } = useApp();

  // Active bookings count
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

  const activeVehiclesCount = React.useMemo(() => {
    return (vehicles || []).filter(
      (v) => v.status === 'active' && (v.vehicleVerified || v.verificationStatus === 'Verified')
    ).length;
  }, [vehicles]);

  const isHome = pathname === '/';
  const isBikes = pathname.startsWith('/bikes');
  const isBookings = pathname === '/my-bookings';
  const isHost = pathname === '/host';

  const handleHostAction = () => {
    if (role === 'owner') {
      if (typeof window !== 'undefined') window.location.href = '/host';
    } else {
      promptSwitchToHost();
    }
  };

  return (
    <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md px-2 py-1.5 border-t border-slate-800 flex items-center justify-around gap-1 shadow-2xl">
      {/* Home */}
      <Link
        href="/"
        className={`flex-1 py-1.5 px-2 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-all ${
          isHome
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>

      {/* Fleet / Bikes */}
      <Link
        href="/bikes"
        className={`flex-1 py-1.5 px-2 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-all ${
          isBikes
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Bike className="w-4 h-4" />
        <span>Fleet {activeVehiclesCount > 0 ? `(${activeVehiclesCount})` : ''}</span>
      </Link>

      {/* My Bookings */}
      <Link
        href="/my-bookings"
        className={`flex-1 py-1.5 px-2 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold relative transition-all ${
          isBookings
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Clock className="w-4 h-4" />
        <span>Bookings</span>
        {userBookingsCount > 0 && (
          <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1 right-3"></span>
        )}
      </Link>

      {/* Host / List Bike */}
      <button
        type="button"
        onClick={handleHostAction}
        className={`flex-1 py-1.5 px-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-all cursor-pointer ${
          isHost
            ? 'bg-amber-500 text-slate-950 shadow-sm'
            : 'text-amber-300 hover:text-amber-200'
        }`}
      >
        <KeyHandoverIcon className="w-4 h-4" />
        <span>{role === 'owner' ? 'Host' : 'List Bike'}</span>
      </button>

      {/* WhatsApp Support */}
      <a
        href={`https://wa.me/${(legalConfig?.supportWhatsApp || '+919837144520').replace(/[^0-9]/g, '')}?text=Radhe%20Radhe!%20I%20have%20an%20inquiry.`}
        target="_blank"
        rel="noreferrer"
        className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-[10px] py-1.5 px-2.5 rounded-xl flex flex-col items-center justify-center gap-0.5 shadow-sm active:scale-95 transition-transform shrink-0"
      >
        <MessageSquare className="w-4 h-4 fill-white" />
        <span>Support</span>
      </a>
    </nav>
  );
};
