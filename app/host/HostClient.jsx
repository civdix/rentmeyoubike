'use client';

import React from 'react';
import { useApp } from '../../src/context/AppContext';
import { ShieldCheck, IndianRupee, Key, Smartphone, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { VrindavanScooterIcon } from '../../src/components/CustomIcons';

export default function HostClient() {
  const { role, setRole, currentUser, promptSwitchToHost, openLoginModal } = useApp();

  const handleStartHosting = () => {
    if (!currentUser) {
      openLoginModal('owner');
      return;
    }
    if (promptSwitchToHost) {
      promptSwitchToHost();
    } else {
      setRole('owner');
    }
  };

  return (
    <div className="w-full bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-300">
            Braj Host Network
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Turn Your Idle Two-Wheeler Into Monthly Income in Vrindavan
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Thousands of pilgrims visit Bankey Bihari, Prem Mandir, and Govardhan every week seeking reliable scooters and bikes. List your vehicle on Rent on Cent and earn up to ₹15,000 per month with complete safety assurance.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleStartHosting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Key className="w-5 h-5" />
              <span>List Your Bike Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Key Host Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-base">Verified Devotee Riders</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every customer must upload verified Aadhaar and valid Driving Licence before picking up keys.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
              <IndianRupee className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-base">Direct &amp; Fast Payouts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Keep 85% of your rental earnings. Transparent commission with zero listing fees or hidden charges.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-base">Digital Photo Audit</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              6-angle condition photos and odometer reading logged before and after every rental trip.
            </p>
          </div>
        </div>

        {/* 5-Step Process */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold font-heading text-slate-900 mb-6 text-center">
            How Listing Works on Rent on Cent
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold mx-auto flex items-center justify-center">1</div>
              <h4 className="font-bold text-xs text-slate-900">Add Vehicle</h4>
              <p className="text-[11px] text-slate-500">Fill model, year, RC &amp; rental price</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold mx-auto flex items-center justify-center">2</div>
              <h4 className="font-bold text-xs text-slate-900">Fast Audit</h4>
              <p className="text-[11px] text-slate-500">Admin verifies documents &amp; activates</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold mx-auto flex items-center justify-center">3</div>
              <h4 className="font-bold text-xs text-slate-900">Get Bookings</h4>
              <p className="text-[11px] text-slate-500">Receive WhatsApp booking alerts</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold mx-auto flex items-center justify-center">4</div>
              <h4 className="font-bold text-xs text-slate-900">Key Handover</h4>
              <p className="text-[11px] text-slate-500">Verify customer KYC on app</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold mx-auto flex items-center justify-center">5</div>
              <h4 className="font-bold text-xs text-slate-900">Daily Payout</h4>
              <p className="text-[11px] text-slate-500">Direct UPI or bank transfer</p>
            </div>
          </div>
        </div>

        {/* CTA Card */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 rounded-2xl text-center space-y-4 border border-slate-700">
          <h3 className="text-xl font-bold font-heading">Ready to List Your Two-Wheeler?</h3>
          <p className="text-xs text-slate-300 max-w-xl mx-auto">
            Join 50+ local vehicle hosts in Mathura and Vrindavan who earn with Rent on Cent every month.
          </p>
          <button
            onClick={handleStartHosting}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-md cursor-pointer"
          >
            Launch Host Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
