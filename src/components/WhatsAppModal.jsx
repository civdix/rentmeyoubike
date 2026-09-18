import React, { useState } from 'react';
import { ExternalLink, X, CheckCheck, Send, ShieldCheck, Bike, ArrowRight, Smartphone, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookingStatusBadge } from './TrustBadges';
import { WhatsAppBrandIcon } from './CustomIcons';

export const WhatsAppModal = ({ booking, vehicle, onClose, onLaunchKYC }) => {
  const { legalConfig, updateBookingStatus, setActiveInspectionModal } = useApp();

  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: `Radhe Radhe! 🙏 Welcome to Rent to Cent.\n\nYour Booking Inquiry for *${vehicle?.name || booking?.vehicleName || 'Rental Vehicle'}* has been received!\n\n📋 *Booking Reference*: #${booking?.id || 'NEW'}\n📍 *Pickup Area*: ${booking?.pickupLocation || 'Prem Mandir Area, Vrindavan'}\n📅 *Dates*: ${booking?.startDate || 'Today'} to ${booking?.endDate || 'Tomorrow'} (${booking?.totalDays || 1} day(s))\n💰 *Total Amount*: ₹${booking?.totalAmount || 400}\n\nTo complete your booking, please complete Customer Identity (KYC) verification.`,
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const phone = (legalConfig?.supportWhatsApp || '+919837144520').replace(/[^0-9]/g, '');
  const exactPrefilledMsg = `Hi, I want to rent ${vehicle?.name || booking?.vehicleName || 'a bike'} (${vehicle?.id || booking?.vehicleId || 'veh-1'}) in Vrindavan.\n\nRental dates:\n${booking?.startDate || ''} to ${booking?.endDate || ''}\n\nPlease confirm availability and booking requirements.`;
  const encodedText = encodeURIComponent(exactPrefilledMsg);
  const waUrl = `https://wa.me/${phone}?text=${encodedText}`;


  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { sender: 'user', text: inputText, time: 'Just now' };
    setChatMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulated Bot response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Thank you! I have forwarded your message to owner ${vehicle?.ownerName || booking?.ownerName}. Please click the button below to submit your Driver's Licence & Aadhaar for instant verification.`,
          time: 'Just now'
        }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
        {/* WhatsApp Styled Header */}
        <div className="bg-emerald-700 text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800 border border-emerald-500 flex items-center justify-center font-bold text-lg text-white">
              <WhatsAppBrandIcon className="w-5 h-5 fill-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Rent to Cent WhatsApp Assistant</h3>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
              </div>
              <p className="text-xs text-emerald-100 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Official Verified Business • +{phone}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-100 hover:text-white p-1 rounded-lg hover:bg-emerald-600/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Booking Ref Summary Banner */}
        <div className="bg-emerald-50 p-3 px-4 border-b border-emerald-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Bike className="w-4 h-4 text-emerald-700" />
            <span className="font-bold text-emerald-950">Ref: #{booking?.id}</span>
            <span className="text-slate-600">({booking?.vehicleName})</span>
          </div>
          <BookingStatusBadge status={booking?.status || 'Inquiry'} />
        </div>

        {/* Simulated Chat Interface */}
        <div className="p-4 bg-[#efeae2] h-72 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[85%] rounded-lg p-3 text-xs shadow-sm relative ${
                msg.sender === 'user'
                  ? 'bg-[#d9fdd3] text-slate-900 self-end rounded-tr-none'
                  : 'bg-white text-slate-900 self-start rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-line leading-relaxed font-sans">{msg.text}</p>
              <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                <span>{msg.time}</span>
                {msg.sender === 'user' && <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="bg-slate-100 p-2 px-3 flex items-center gap-2 border-t border-slate-200">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-white text-xs px-3 py-2 rounded-full border border-slate-300 focus:outline-none focus:border-emerald-600"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full shadow-sm transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Action Buttons Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center gap-2.5">
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-1/3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            Open WhatsApp
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

