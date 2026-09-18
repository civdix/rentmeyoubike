'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiFetchMessages } from '../api/client';

export const FloatingChatButton = () => {
  const {
    bookings,
    currentUser,
    role,
    activeWhatsAppModal,
    setActiveWhatsAppModal
  } = useApp();

  const [hasUnreadAdminReply, setHasUnreadAdminReply] = useState(false);

  // Find most recent booking for this user
  const latestBooking = React.useMemo(() => {
    if (!bookings || bookings.length === 0) return null;
    if (currentUser) {
      const cleanUserPhone = (currentUser.phone || '').replace(/[^0-9]/g, '');
      const matched = bookings.filter((b) => {
        const cleanBookingPhone = (b.customerPhone || '').replace(/[^0-9]/g, '');
        if (cleanUserPhone && cleanBookingPhone && cleanUserPhone.slice(-10) === cleanBookingPhone.slice(-10)) {
          return true;
        }
        if (currentUser.name && b.customerName && b.customerName.toLowerCase().trim() === currentUser.name.toLowerCase().trim()) {
          return true;
        }
        return false;
      });
      if (matched.length > 0) return matched[0];
    }
    return bookings[0];
  }, [bookings, currentUser]);

  // Check if admin replied
  useEffect(() => {
    if (!latestBooking?.id) return;

    const checkAdminReplies = async () => {
      try {
        const msgs = await apiFetchMessages({
          conversationId: `conv-${latestBooking.id}`,
          bookingId: latestBooking.id
        });
        if (Array.isArray(msgs)) {
          const unreadFromAdmin = msgs.some((m) => m.senderRole === 'admin' && !m.isRead);
          setHasUnreadAdminReply(unreadFromAdmin);
        }
      } catch {
        // ignore
      }
    };

    checkAdminReplies();
    const timer = setInterval(checkAdminReplies, 5000);
    return () => clearInterval(timer);
  }, [latestBooking?.id]);

  // Do not show button if modal is already open or in Admin mode
  if (activeWhatsAppModal || role === 'admin' || currentUser?.role === 'admin') {
    return null;
  }

  const handleOpenChat = () => {
    const fallbackBooking = latestBooking || {
      id: `INQ-${Date.now().toString().slice(-4)}`,
      customerName: currentUser?.name || 'Vrindavan Pilgrim',
      customerPhone: currentUser?.phone || '',
      vehicleName: 'Bike Rental Inquiry',
      pickupLocation: 'Prem Mandir Hub, Vrindavan',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      totalDays: 1,
      totalAmount: 400,
      status: 'Inquiry'
    };

    setHasUnreadAdminReply(false);
    setActiveWhatsAppModal({
      booking: fallbackBooking,
      vehicle: null
    });
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={handleOpenChat}
        className={`group flex items-center gap-2.5 p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all cursor-pointer transform hover:scale-105 active:scale-95 ${
          hasUnreadAdminReply
            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white ring-4 ring-emerald-300 animate-bounce'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
        }`}
        title="Chat live with Vrindavan Hub Admin"
      >
        <div className="relative flex items-center justify-center">
          <MessageSquare className="w-5 h-5 fill-white" />
          {hasUnreadAdminReply ? (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white animate-ping" />
          ) : (
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-300 rounded-full border border-emerald-800" />
          )}
        </div>

        <span className="text-xs font-bold font-sans hidden sm:inline">
          {hasUnreadAdminReply ? 'Admin Replied! View & Reply' : 'Live Chat / Inquiries'}
        </span>

        {hasUnreadAdminReply && (
          <span className="bg-white text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
            New
          </span>
        )}
      </button>
    </div>
  );
};
