import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, X, CheckCheck, Send, ShieldCheck, Bike, ArrowRight, Smartphone, MessageSquare, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookingStatusBadge } from './TrustBadges';
import { WhatsAppBrandIcon } from './CustomIcons';
import { apiFetchMessages, apiSendMessage } from '../api/client';

export const WhatsAppModal = ({ booking, vehicle, onClose, onLaunchKYC }) => {
  const { legalConfig, updateBookingStatus, setActiveInspectionModal, currentUser } = useApp();

  const conversationId = booking?.id
    ? `conv-${booking.id}`
    : (booking?.customerPhone ? `conv-${booking.customerPhone.replace(/[^0-9]/g, '').slice(-10)}` : `conv-veh-${booking?.vehicleId || vehicle?.id || 'guest'}`);

  const defaultInitialMessage = {
    id: 'welcome-msg',
    conversationId,
    senderRole: 'admin',
    senderName: 'Rent to Cent Admin',
    text: `Radhe Radhe! 🙏 Welcome to Rent to Cent.\n\nYour Booking Inquiry for *${vehicle?.name || booking?.vehicleName || 'Rental Vehicle'}* has been received!\n\n📋 *Booking Reference*: #${booking?.id || 'NEW'}\n📍 *Pickup Area*: ${booking?.pickupLocation || 'Prem Mandir Area, Vrindavan'}\n📅 *Dates*: ${booking?.startDate || 'Today'} to ${booking?.endDate || 'Tomorrow'} (${booking?.totalDays || 1} day(s))\n💰 *Total Amount*: ₹${booking?.totalAmount || 400}\n\nOur Vrindavan administrative desk is active here. You can chat with us live, ask any questions about pickup/deposit, or complete KYC verification below.`,
    createdAt: new Date().toISOString()
  };

  const [messages, setMessages] = useState([defaultInitialMessage]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const phone = (legalConfig?.supportWhatsApp || '+919837144520').replace(/[^0-9]/g, '');
  const exactPrefilledMsg = `Hi, I want to rent ${vehicle?.name || booking?.vehicleName || 'a bike'} (${vehicle?.id || booking?.vehicleId || 'veh-1'}) in Vrindavan.\n\nRental dates:\n${booking?.startDate || ''} to ${booking?.endDate || ''}\n\nPlease confirm availability and booking requirements.`;
  const encodedText = encodeURIComponent(exactPrefilledMsg);
  const waUrl = `https://wa.me/${phone}?text=${encodedText}`;

  const formatTime = (ts) => {
    if (!ts) return 'Just now';
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return 'Just now';
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  // Fetch real message history and auto-poll every 2.5 seconds
  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      try {
        const fetched = await apiFetchMessages({
          conversationId,
          bookingId: booking?.id,
          customerPhone: booking?.customerPhone || currentUser?.phone
        });

        if (isMounted) {
          if (Array.isArray(fetched) && fetched.length > 0) {
            setMessages(fetched);
          } else {
            setMessages([defaultInitialMessage]);
          }
        }
      } catch (err) {
        console.warn('Error polling messages:', err.message);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [conversationId, booking?.id, booking?.customerPhone, currentUser?.phone]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const textToSend = inputText.trim();
    setInputText('');
    setIsSending(true);

    const customerName = booking?.customerName || currentUser?.name || 'Customer';
    const customerPhone = booking?.customerPhone || currentUser?.phone || '';

    const tempMsg = {
      id: `temp-${Date.now()}`,
      conversationId,
      bookingId: booking?.id || null,
      senderRole: 'customer',
      senderName: customerName,
      text: textToSend,
      createdAt: new Date().toISOString(),
      isSending: true
    };

    setMessages((prev) => [...prev, tempMsg]);

    try {
      const saved = await apiSendMessage({
        conversationId,
        bookingId: booking?.id || null,
        customerName,
        customerPhone,
        text: textToSend
      });

      setMessages((prev) =>
        prev.map((m) => (m.id === tempMsg.id ? saved : m))
      );
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* WhatsApp Styled Header */}
        <div className="bg-emerald-700 text-white p-4 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800 border border-emerald-500 flex items-center justify-center font-bold text-lg text-white">
              <WhatsAppBrandIcon className="w-5 h-5 fill-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Rent to Cent Support</h3>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
              </div>
              <p className="text-xs text-emerald-100 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Admin Desk • Official Verified</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-100 hover:text-white p-1.5 rounded-lg hover:bg-emerald-600/50 transition-colors"
            title="Close Chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Booking Ref Summary Banner */}
        <div className="bg-emerald-50 p-2.5 px-4 border-b border-emerald-100 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <Bike className="w-4 h-4 text-emerald-700" />
            <span className="font-bold text-emerald-950">Ref: #{booking?.id || 'NEW'}</span>
            <span className="text-slate-600 truncate max-w-[150px]">({booking?.vehicleName || vehicle?.name})</span>
          </div>
          <BookingStatusBadge status={booking?.status || 'Inquiry'} />
        </div>

        {/* Real Live WhatsApp Chat Feed */}
        <div className="p-4 bg-[#efeae2] flex-1 overflow-y-auto min-h-[280px] max-h-[360px] flex flex-col gap-3 custom-scrollbar">
          {messages.map((msg, index) => {
            const isMe = msg.senderRole === 'customer';
            return (
              <div
                key={msg.id || index}
                className={`max-w-[85%] rounded-lg p-3 text-xs shadow-sm relative transition-all ${
                  isMe
                    ? 'bg-[#d9fdd3] text-slate-900 self-end rounded-tr-none'
                    : 'bg-white text-slate-900 self-start rounded-tl-none border border-slate-200/50'
                }`}
              >
                {!isMe && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 mb-1">
                    <span>{msg.senderName || 'Rent to Cent Admin'}</span>
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  </div>
                )}

                <p className="whitespace-pre-line leading-relaxed font-sans">{msg.text}</p>

                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                  <span>{formatTime(msg.createdAt)}</span>
                  {isMe && (
                    <CheckCheck className={`w-3.5 h-3.5 ${msg.isRead ? 'text-sky-500' : 'text-emerald-600'}`} />
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="bg-slate-100 p-2.5 px-3 flex items-center gap-2 border-t border-slate-200 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message to Admin..."
            disabled={isSending}
            className="flex-1 bg-white text-xs px-3.5 py-2.5 rounded-full border border-slate-300 focus:outline-none focus:border-emerald-600 disabled:bg-slate-50"
          />
          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2.5 rounded-full shadow-sm transition-transform active:scale-95 flex items-center justify-center cursor-pointer"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>

        {/* Action Buttons Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center gap-2 shrink-0">
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-1/3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => {
              if (booking?.id) updateBookingStatus(booking.id, 'KYC Pending');
              onClose();
              if (onLaunchKYC && booking?.id) onLaunchKYC(booking.id);
            }}
            className="w-full sm:w-1/3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <span>Proceed to KYC</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>

          <button
            onClick={() => {
              onClose();
              if (booking?.id) setActiveInspectionModal({ bookingId: booking.id, type: 'pre' });
            }}
            className="w-full sm:w-1/3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <Smartphone className="w-4 h-4" />
            <span>Inspection Link</span>
          </button>
        </div>
      </div>
    </div>
  );
};
