'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { Home, Bike, Clock, MessageSquare, PlusCircle, CalendarCheck, IndianRupee } from 'lucide-react';
import { KeyHandoverIcon, VrindavanScooterIcon } from './CustomIcons';

export const MobileBottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    role,
    setRole,
    currentUser,
    promptSwitchToHost,
    vehicles,
    bookings,
    legalConfig,
    hostTab,
    setHostTab
  } = useApp();

  // Active renter bookings count
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

  // Host incoming rented bookings count
  const myHostBookingsCount = React.useMemo(() => {
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
  const isHost = pathname === '/host';

  const handleHostAction = () => {
    if (role === 'owner') {
      if (typeof window !== 'undefined') window.location.href = '/host';
    } else {
      promptSwitchToHost();
    }
  };

  const handleSwitchToRenter = () => {
    setRole('customer');
    router.push('/');
  };

  return (
    <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md px-2 py-1.5 border-t border-slate-800 flex items-center justify-around gap-1 shadow-2xl">
      {role === 'owner' ? (
        <>
          {/* Host Tab 1: Inventory */}
          <button
            type="button"
            onClick={() => {
              setHostTab('inventory');
              if (pathname !== '/host') router.push('/host?tab=inventory');
            }}
            className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-all cursor-pointer ${
              pathname === '/host' && (hostTab === 'inventory' || hostTab === 'my_listings')
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Inventory</span>
          </button>

          {/* Host Tab 2: List Bike */}
          <button
            type="button"
            onClick={() => {
              setHostTab('add_new');
              if (pathname !== '/host') router.push('/host?tab=add_new');
            }}
            className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-all cursor-pointer ${
              pathname === '/host' && hostTab === 'add_new'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Bike</span>
          </button>

          {/* Host Tab 3: My Bookings (Rentals History) */}
          <button
            type="button"
            onClick={() => {
              setHostTab('bookings');
              if (pathname !== '/host') router.push('/host?tab=bookings');
            }}
            className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-all relative cursor-pointer ${
              pathname === '/host' && hostTab === 'bookings'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Bookings</span>
            {myHostBookingsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-3"></span>
            )}
          </button>

          {/* Host Tab 4: Payments & Refunds */}
          <button
            type="button"
            onClick={() => {
              setHostTab('payments');
              if (pathname !== '/host') router.push('/host?tab=payments');
            }}
            className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-all cursor-pointer ${
              pathname === '/host' && hostTab === 'payments'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <IndianRupee className="w-4 h-4" />
            <span>Payments</span>
          </button>

          {/* Switch back to Customer Renter View */}
          <button
            type="button"
            onClick={handleSwitchToRenter}
            className="flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer"
            title="Switch to Customer Renter Mode"
          >
            <VrindavanScooterIcon className="w-4 h-4 text-emerald-400" />
            <span>Renters</span>
          </button>
        </>
      ) : (
        <>
          {/* Customer Tab 1: Home */}
          <Link
            href="/"
            aria-label="Rent on Cent Mobile Homepage"
            className={`flex-1 py-1.5 px-2 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-all ${
              isHome
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>

          {/* Customer Tab 2: Fleet / Bikes */}
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

          {/* Customer Tab 3: My Bookings */}
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

          {/* Customer Tab 4: Host / List Bike */}
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
            <span>List Bike</span>
          </button>

          {/* Customer Tab 5: WhatsApp Support */}
          <a
            href={`https://wa.me/${(legalConfig?.supportWhatsApp || '+919837144520').replace(/[^0-9]/g, '')}?text=Radhe%20Radhe!%20I%20have%20an%20inquiry.`}
            target="_blank"
            rel="noreferrer"
            aria-label="Instant WhatsApp Helpdesk"
            className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-[10px] py-1.5 px-2.5 rounded-xl flex flex-col items-center justify-center gap-0.5 shadow-sm active:scale-95 transition-transform shrink-0"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Support</span>
          </a>
        </>
      )}
    </nav>
  );
};
