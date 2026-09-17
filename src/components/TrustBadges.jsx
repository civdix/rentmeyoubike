import React from 'react';
import { ShieldCheck, CheckCircle2, FileCheck, ClipboardCheck, Clock, AlertTriangle, XCircle, Shield, Crown } from 'lucide-react';
import { VrindavanFeatherIcon, VrindavanTemplePassIcon, VerifiedShieldIcon, DigitalInspectionIcon } from './CustomIcons';

export const DivineVerifiedBadge = ({ size = 'sm' }) => (
  <span className={`inline-flex items-center gap-1.5 font-black rounded-full bg-gradient-to-r from-amber-500/20 via-amber-300 to-amber-400 text-slate-950 border-2 border-amber-100 shadow-lg ring-2 ring-amber-500/40 drop-shadow-md ${size === 'xs' ? 'px-2.5 text-[10px] sm:text-[11px]' : 'px-3.5  text-xs'}`}>
    <VrindavanFeatherIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 shrink-0" />
    <span className="tracking-wider uppercase font-black">Radhe Verified</span>
  </span>
);

export const TemplePassBadge = ({ size = 'sm' }) => (
  <span className={`inline-flex items-center gap-1.5 font-extrabold rounded-full bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-950 border-2 border-teal-400/90 shadow-sm ring-1 ring-teal-400/20 ${size === 'xs' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}`}>
    <VrindavanTemplePassIcon className="w-3.5 h-3.5 text-teal-700 shrink-0" />
    <span>Temple Pass Ready</span>
  </span>
);

export const VerifiedOwnerBadge = ({ size = 'sm' }) => (
  <span className={`inline-flex items-center gap-1.5 font-extrabold rounded-full bg-slate-900/95 text-emerald-400 border-2 border-emerald-400/80 shadow-md ring-1 ring-emerald-400/30 ${size === 'xs' ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'}`}>
    <VerifiedShieldIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
    <span>Verified Host</span>
  </span>
);

export const VerifiedVehicleBadge = ({ size = 'sm' }) => (
  <span className={`inline-flex items-center gap-1.5 font-extrabold rounded-full bg-gradient-to-r from-sky-50 to-blue-50 text-sky-950 border-2 border-sky-400/90 shadow-sm ring-1 ring-sky-400/20 ${size === 'xs' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}`}>
    <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0" strokeWidth={2.5} />
    <span>Verified Bike</span>
  </span>
);

export const DocumentsVerifiedBadge = ({ size = 'sm' }) => (
  <span className={`inline-flex items-center gap-1.5 font-extrabold rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-950 border-2 border-blue-400/90 shadow-sm ring-1 ring-blue-400/20 ${size === 'xs' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}`}>
    <FileCheck className="w-4 h-4 text-blue-700 shrink-0" strokeWidth={2.5} />
    <span>RC & Docs Verified</span>
  </span>
);

export const InspectionCompletedBadge = ({ size = 'sm' }) => (
  <span className={`inline-flex items-center gap-1.5 font-extrabold rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-950 border-2 border-indigo-400/90 shadow-sm ring-1 ring-indigo-400/20 ${size === 'xs' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}`}>
    <DigitalInspectionIcon className="w-4 h-4 text-indigo-700 shrink-0" />
    <span>Audit Inspected</span>
  </span>
);

export const BookingStatusBadge = ({ status }) => {
  const getStyle = (st) => {
    switch (st) {
      case 'Inquiry':
        return { bg: 'bg-slate-100 text-slate-900 border-slate-400', icon: Clock };
      case 'KYC Pending':
        return { bg: 'bg-amber-100 text-amber-950 border-amber-400', icon: AlertTriangle };
      case 'Payment Pending':
        return { bg: 'bg-orange-100 text-orange-950 border-orange-400', icon: Clock };
      case 'Confirmed':
        return { bg: 'bg-blue-100 text-blue-950 border-blue-400', icon: CheckCircle2 };
      case 'Pickup Pending':
        return { bg: 'bg-purple-100 text-purple-950 border-purple-400', icon: Clock };
      case 'Active Rental':
        return { bg: 'bg-emerald-100 text-emerald-950 border-emerald-500 font-extrabold', icon: CheckCircle2 };
      case 'Return Pending':
        return { bg: 'bg-cyan-100 text-cyan-950 border-cyan-400', icon: Clock };
      case 'Completed':
        return { bg: 'bg-emerald-200 text-emerald-950 border-emerald-600 font-black', icon: CheckCircle2 };
      case 'Cancelled':
        return { bg: 'bg-rose-100 text-rose-950 border-rose-400', icon: XCircle };
      case 'Dispute':
        return { bg: 'bg-rose-200 text-rose-950 border-rose-600 font-black animate-pulse', icon: AlertTriangle };
      default:
        return { bg: 'bg-slate-100 text-slate-900 border-slate-400', icon: Clock };
    }
  };

  const style = getStyle(status);
  const IconComponent = style.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-extrabold rounded-lg border-2 shadow-xs ${style.bg}`}>
      <IconComponent className="w-4 h-4 shrink-0" strokeWidth={2.5} />
      <span>{status}</span>
    </span>
  );
};
