import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock, Key, TrendingUp, Building2, Hotel, Megaphone, Compass, Sparkles,
  CheckCircle2, ArrowRight, ShieldCheck, IndianRupee, PieChart, Users, QrCode,
  Download, Zap, HelpCircle, MapPin, Eye, FileText, AlertTriangle
} from 'lucide-react';

export const AdminStrategyView = () => {
  const { legalConfig } = useApp();

  // Admin Pin Protection State (Default unlocked for demo, togglable)
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Commission Strategy State
  const [commissionRate, setCommissionRate] = useState(12); // 12% per hotel booking
  const [hotelPartnerCount, setHotelPartnerCount] = useState(24);

  // Cost Comparison Calculator state (Default 1 Day, 2 Passengers)
  const [rentalDays, setRentalDays] = useState(2);

  const eRickshawCostPerDay = 900; // Average spent haggling autos per day in Vrindavan
  const scootyCostPerDay = 400; // Flat Vrindavan Rides scooty rate

  const totalAutoMessCost = eRickshawCostPerDay * rentalDays;
  const totalScootyCost = scootyCostPerDay * rentalDays;
  const savings = totalAutoMessCost - totalScootyCost;

  const handleUnlock = (e) => {
    e.preventDefault();
    if (inputPin === '2026' || inputPin === 'admin') {
      setIsUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-[70vh] bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto text-2xl">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-white">Admin Strategy Portal</h2>
          <p className="text-xs text-slate-400">Enter Admin PIN to access future growth & partnership roadmap.</p>
          <form onSubmit={handleUnlock} className="space-y-3">
            <input
              type="password"
              placeholder="Enter PIN"
              value={inputPin}
              onChange={(e) => setInputPin(e.target.value)}
              className="w-full text-center text-sm font-mono tracking-widest px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:border-emerald-500"
            />
            {pinError && <p className="text-xs text-rose-400">Incorrect PIN! Please check your credentials.</p>}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs py-3 rounded-xl shadow-md"
            >
              Unlock Growth Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full mb-3 inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            Confidential Admin Growth Roadmap
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            Future Expansion & Marketing Strategy Hub
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed font-normal">
            Strategic blueprint for Vrindavan Rides: Hotel/Guest House commission partnerships, temple-side GenZ OOH posters, and total freedom cost comparison matrices.
          </p>
        </div>
      </div>

      {/* STRATEGY PILLAR 1: HOTEL & GUEST HOUSE COMMISSION PARTNERSHIPS */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/30 to-amber-500/20 border-2 border-amber-400/50 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
              <Building2 className="w-6 h-6 text-amber-400" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-white text-xl">1. Hotel & Guest House Commission Network</h3>
              <p className="text-xs text-slate-400">Promote Vrindavan Rides via hotel reception desks on a commission-per-booking model.</p>
            </div>
          </div>

          <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-extrabold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
            <Hotel className="w-4 h-4 text-amber-400" strokeWidth={2.5} />
            {hotelPartnerCount} Vrindavan Partner Hotels Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Commission Config Card */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-semibold">Hotel Commission Share</span>
              <span className="font-extrabold text-amber-400 text-sm">{commissionRate}% / booking</span>
            </div>
            <input
              type="range"
              min="8"
              max="20"
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Hotels earn <strong className="text-amber-300">₹{Math.round(400 * (commissionRate / 100))} per day</strong> per bike booked via reception QR code.
            </p>
          </div>

          {/* Lobby Poster Placement Strategy */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <Megaphone className="w-4 h-4 text-amber-400" strokeWidth={2.5} />
              Lobby & Reception Poster Ads
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Place custom acrylic QR code stands & posters at hotel entrances, reception counters, and guest house elevators across Vrindavan.
            </p>
          </div>

          {/* QR Generator Mock */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 flex items-center justify-between">
            <div>
              <span className="text-slate-300 font-bold block">Hotel Partner QR Poster</span>
              <span className="text-[10px] text-slate-500">Auto-tracks hotel referral ID</span>
            </div>
            <div className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center shrink-0">
              <QrCode className="w-full h-full text-slate-950" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Partnered Hotels Mock List */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-bold block mb-2">Sample Partner Hotels & Guest Houses in Vrindavan:</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            {['Radhe Kunj Guest House', 'Bhakti Dham Residency', 'Prem Mandir View Hotel', 'Vrindavan Palace', 'ISKCON Guest House Annex', 'Yamuna Kunj Stay', 'Nidhivan Inn', 'Seva Kunj Resort'].map((h, i) => (
              <div key={i} className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2.5} />
                <span className="truncate">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STRATEGY PILLAR 2: GEN-Z & PILGRIM OOH TEMPLE AD CAMPAIGNS */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-teal-500/20 via-emerald-500/30 to-teal-500/20 border-2 border-teal-400/50 text-teal-400 flex items-center justify-center shrink-0 shadow-md">
            <Megaphone className="w-6 h-6 text-teal-400" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-white text-xl">2. Temple Entrance OOH Poster Ads & GenZ Tagline Hook</h3>
            <p className="text-xs text-slate-400">High-visibility posters placed near major temple gates, parking zones, and entry points.</p>
          </div>
        </div>

        {/* GenZ Hook Banner Mockup */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 p-6 rounded-2xl border border-emerald-500/40 relative shadow-inner">
          <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
            GenZ Temple Poster Hook Design
          </div>
          <blockquote className="font-heading font-extrabold text-xl sm:text-2xl text-white leading-tight mb-3">
            "Why stuck in lines & e-rickshaw traffic when you can get a bike or scooty?"
          </blockquote>
          <p className="text-xs text-emerald-200">
            "Unlock 100% freedom in Vrindavan. Rent a verified scooty for ₹400/day and zip past traffic to Bankey Bihari, Prem Mandir & ISKCON!"
          </p>
        </div>

        {/* Poster Locations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            { zone: 'Prem Mandir Entrance', detail: 'Main gate & auto-stand exit poster' },
            { zone: 'Bankey Bihari Parikrama', detail: 'VIP parking exit & gallery wall' },
            { zone: 'ISKCON Chowk', detail: 'Bhakti Vedanta Marg billboard' },
            { zone: 'Vrindavan Station Exit', detail: 'Arrival hall & taxi stand poster' },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-white flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" strokeWidth={2.5} />
                {item.zone}
              </span>
              <p className="text-[11px] text-slate-400">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* STRATEGY PILLAR 3: COST COMPARISON & FREEDOM VALUE PROPOSITION */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/30 to-emerald-500/20 border-2 border-emerald-400/50 text-emerald-400 flex items-center justify-center shrink-0 shadow-md">
              <IndianRupee className="w-6 h-6 text-emerald-400" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-white text-xl">3. Freedom & Cost Savings Calculator Matrix</h3>
              <p className="text-xs text-slate-400">Comparing Vrindavan Rides Scooty vs. Whole-day E-Rickshaw & Auto Haggling Mess.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Trip Days:</span>
            <input
              type="number"
              min="1"
              max="10"
              value={rentalDays}
              onChange={(e) => setRentalDays(Number(e.target.value))}
              className="w-16 bg-slate-950 text-white font-bold text-center py-1 rounded-lg border border-slate-700"
            />
          </div>
        </div>

        {/* Side-by-Side Matrix Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* E-Rickshaw / Auto Mess (The Problem) */}
          <div className="bg-rose-950/30 p-6 rounded-2xl border border-rose-900/60 space-y-3">
            <div className="flex items-center justify-between text-rose-400 font-bold text-sm">
              <span>❌ Auto / E-Rickshaw Mess</span>
              <span className="text-lg font-extrabold text-rose-400">₹{totalAutoMessCost}</span>
            </div>

            <ul className="space-y-2 text-xs text-rose-200">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Spent haggling fares every 2-3 km (₹150 - ₹200 per short ride)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Stuck waiting in long e-rickshaw lines outside Prem Mandir & ISKCON</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Fixed restricted routes — cannot explore offbeat Yamuna ghats or Nidhivan galis</span>
              </li>
            </ul>
          </div>

          {/* Vrindavan Rides Scooty (The Solution) */}
          <div className="bg-emerald-950/40 p-6 rounded-2xl border border-emerald-500/60 space-y-3 relative shadow-lg">
            <div className="flex items-center justify-between text-emerald-400 font-bold text-sm">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                ✓ Vrindavan Rides P2P Scooty
              </span>
              <span className="text-xl font-extrabold text-emerald-400">₹{totalScootyCost}</span>
            </div>

            <ul className="space-y-2 text-xs text-emerald-100">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Flat ₹400/day — <strong>Save ₹{savings}</strong> over {rentalDays} day(s)!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>100% freedom to go wherever you wanna go, whenever you wanna go!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Bypass traffic lines in narrow galis & park easily near temple gates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
