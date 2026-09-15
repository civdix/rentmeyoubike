import React, { useState } from 'react';
import { CreditCard, QrCode, CheckCircle2, XCircle, RefreshCw, IndianRupee, ShieldCheck, ExternalLink, X, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PaymentModal = ({ bookingId, onClose, onSuccess }) => {
  const { bookings, updatePaymentStatus } = useApp();
  const booking = bookings.find((b) => b.id === bookingId) || bookings[0];

  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi, qr, card
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulateFail, setSimulateFail] = useState(false);

  const handleSimulatePayment = (statusToSet = 'Paid') => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      updatePaymentStatus(booking.id, statusToSet);
      if (statusToSet === 'Paid' && onSuccess) {
        onSuccess();
      }
      if (statusToSet === 'Paid') {
        onClose();
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold">Secure Payment Link</h3>
              <p className="text-xs text-slate-400">Booking Ref: #{booking?.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Amount Card */}
        <div className="bg-slate-50 p-4 px-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Vehicle: {booking?.vehicleName}</span>
            <div className="text-xs text-slate-700 mt-0.5">
              {booking?.totalDays} day(s) × ₹{booking?.dailyPrice}/day
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Total Payable</span>
            <span className="text-xl font-heading font-extrabold text-emerald-600">₹{booking?.totalAmount}</span>
          </div>
        </div>

        {/* Current Payment Status Banner */}
        <div className="p-4 px-6 bg-amber-50 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Current Link Status: <strong>{booking?.paymentStatus || 'Pending'}</strong></span>
          </div>
          <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">Razorpay / Cashfree API</span>
        </div>

        {/* Payment Method Selector */}
        <div className="p-6">
          <div className="flex gap-2 mb-5">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                paymentMethod === 'upi'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <QrCode className="w-4 h-4" />
              UPI / GPay / PhonePe
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                paymentMethod === 'card'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Debit / Credit Card
            </button>
          </div>

          {paymentMethod === 'upi' ? (
            <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl shadow-inner border border-slate-300 flex items-center justify-center mb-3">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=vrindavanrides@upi%26pn=VrindavanRides%26am=${booking?.totalAmount}%26tn=BookingRef_${booking?.id}`}
                  alt="UPI QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs font-bold text-slate-800">Scan QR with GPay, PhonePe, Paytm, or BHIM</p>
              <p className="text-[11px] text-slate-500 mt-1">UPI VPA: vrindavanrides@upi</p>
            </div>
          ) : (
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="4532 •••• •••• 8921"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  defaultValue="4532 8910 2341 8921"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    defaultValue="08/28"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={3}
                    placeholder="•••"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    defaultValue="891"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Simulation Buttons */}
          <div className="mt-5 space-y-2">
            <button
              onClick={() => handleSimulatePayment('Paid')}
              disabled={isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Razorpay Webhook...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulate Successful Payment (₹{booking?.totalAmount})</span>
                </>
              )}
            </button>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleSimulatePayment('Failed')}
                disabled={isProcessing}
                className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-semibold py-2 rounded-lg flex items-center justify-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                Simulate Payment Failed
              </button>
              <button
                onClick={() => handleSimulatePayment('Refunded')}
                disabled={isProcessing}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[11px] font-semibold py-2 rounded-lg flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Simulate Refunded
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
