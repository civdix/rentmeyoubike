import React from 'react';
import { X, ArrowRight, CheckCircle2, Sparkles, LogIn } from 'lucide-react';
import { VrindavanFeatherIcon, KeyHandoverIcon } from './CustomIcons';

export const SwitchToHostModal = ({ isOpen, onClose, onConfirm, currentUser, onRequireLogin }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!currentUser && onRequireLogin) {
      onClose();
      onRequireLogin();
      return;
    }
    if (onConfirm) {
      onConfirm();
    }
    if (typeof window !== 'undefined' && window.location.pathname !== '/host') {
      window.location.href = '/host';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-slate-100 flex flex-col">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-lg text-slate-950 font-black shrink-0">
              <KeyHandoverIcon className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-heading font-extrabold text-base text-white">
                  Switch to Host Mode
                </h3>
                <VrindavanFeatherIcon className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-[11px] text-slate-400">Rent on Cent Host Portal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-750 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* User Requested Notification Banner */}
          <div className="bg-gradient-to-br from-amber-500/15 via-amber-400/10 to-transparent border-2 border-amber-400/40 rounded-2xl p-4 text-amber-200 shadow-inner">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-bold text-amber-100 leading-snug">
                You will be switched to host on Rent on Cent where you can list your bike to host on renttocent.
              </p>
            </div>
          </div>

          {/* Value props */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-3 text-xs">
            <div className="flex items-start gap-2.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>List in Minutes:</strong> Add your scooter or motorcycle with quick photo upload &amp; set your daily rate.</span>
            </div>
            <div className="flex items-start gap-2.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Earn Up to 85%:</strong> Keep 85% of every rental with daily direct payouts.</span>
            </div>
            <div className="flex items-start gap-2.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Unified Account:</strong> You can switch between Renter and Host modes anytime in one click.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition-all active:scale-[0.98] text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyHandoverIcon className="w-4 h-4 text-slate-950" />
              <span>{currentUser ? 'Continue to Host Portal' : 'Sign In & Continue to Host Portal'}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            {!currentUser && (
              <p className="text-[11px] text-center text-slate-400">
                Sign in with your unified account to activate Host Mode and list bikes.
              </p>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Stay as Renter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
