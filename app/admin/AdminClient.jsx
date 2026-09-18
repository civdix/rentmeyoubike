'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../src/context/AppContext';
import { AdminView } from '../../src/views/AdminView';
import { ShieldCheck, Lock, ArrowLeft, LogIn } from 'lucide-react';

export default function AdminClient() {
  const { currentUser, role, setRole, openLoginModal } = useApp();

  if (currentUser?.role === 'admin') {
    return (
      <div className="w-full">
        <AdminView />
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto border border-purple-200">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900">Admin Control Center</h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            This area is restricted to authorized Rent on Cent administrators. Please authenticate with administrator credentials to manage vehicle audits, disputes, and payouts.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => openLoginModal('admin')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In with Admin Passcode</span>
          </button>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Rental Marketplace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
