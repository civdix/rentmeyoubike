'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { BookingStatusBadge } from '../components/TrustBadges';
import { Bike, Clock, Search, UserCheck, Lock, ShieldCheck } from 'lucide-react';

export const MyBookingsView = () => {
  const {
    bookings,
    currentUser,
    openLoginModal,
    setActiveKYCModal,
    setActivePaymentModal,
    setActiveInspectionModal
  } = useApp();

  const userBookings = useMemo(() => {
    if (!currentUser) return [];
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
    });
  }, [bookings, currentUser]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-slate-900">My Bookings &amp; Timeline</h1>
          <p className="text-xs text-slate-500 mt-1">Track rental milestones, pre-rental inspections, and digital key handover.</p>
        </div>

        {currentUser ? (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 py-1.5 px-3 rounded-xl text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-700">Renter: <strong className="text-slate-900">{currentUser.name}</strong></span>
            <span className="text-emerald-700 font-mono text-[11px] font-bold">({currentUser.phone || 'Verified'})</span>
          </div>
        ) : (
          <button
            onClick={() => openLoginModal('customer')}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sign In as Renter</span>
          </button>
        )}
      </div>

      {currentUser ? (
        userBookings.length > 0 ? (
          <div className="space-y-4">
            {userBookings.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono font-bold text-base text-slate-900">#{b.id}</span>
                    <h4 className="font-bold text-sm text-slate-900">{b.vehicleName}</h4>
                    <p className="text-xs text-slate-500">{b.startDate} to {b.endDate} • {b.pickupLocation}</p>
                  </div>
                  <BookingStatusBadge status={b.status} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveKYCModal({ bookingId: b.id })}
                    className="text-xs font-bold px-3 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    KYC: {b.kycStatus}
                  </button>
                  <button
                    onClick={() => setActivePaymentModal({ bookingId: b.id })}
                    className="text-xs font-bold px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Payment: {b.paymentStatus}
                  </button>
                  <button
                    onClick={() => setActiveInspectionModal({ bookingId: b.id, type: 'pre' })}
                    className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Pre-Rental Inspection
                  </button>
                  <button
                    onClick={() => setActiveInspectionModal({ bookingId: b.id, type: 'post' })}
                    className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Post-Rental Inspection
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
              <Bike className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-heading font-extrabold text-xl text-slate-900">No Bookings Yet</h3>
              <p className="text-xs text-slate-500">
                No active rental bookings found under <strong>{currentUser.name}</strong> ({currentUser.phone}). Browse our fleet and book your scooter in Vrindavan!
              </p>
            </div>
            <Link
              href="/bikes"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-md transition-transform active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Explore Available Fleet</span>
            </Link>
          </div>
        )
      ) : (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-200">
            <Lock className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-heading font-extrabold text-xl text-slate-900">Sign In to View Your Bookings</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your mobile number to view your confirmed rental vouchers, KYC verification status, and digital inspection records.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => openLoginModal('customer')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Sign In as Renter</span>
            </button>
            <Link
              href="/bikes"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-2 transition-colors"
            >
              <span>Browse Available Fleet</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
