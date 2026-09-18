'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../src/context/AppContext';
import { AdminView } from '../../src/views/AdminView';
import { apiAdminLogin } from '../../src/api/client';
import { ShieldCheck, Lock, ArrowLeft, KeyRound, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';

export default function AdminClient() {
  const { currentUser, role, setRole, setCurrentUser, refreshData, openLoginModal } = useApp();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    const cleanPin = pin.trim();
    if (!cleanPin) {
      setErrorMsg('Please enter your Admin Passcode / PIN.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await apiAdminLogin(cleanPin);
      if (res?.success) {
        if (setCurrentUser) setCurrentUser(res.user);
        if (setRole) setRole('admin');
        if (refreshData) refreshData();
      } else {
        setErrorMsg(res?.error || 'Invalid Admin Passcode. Access denied.');
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Authentication failed. Please verify your Admin PIN.');
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated as administrator, render the full admin console
  const hasAdminToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('vr_admin_token') || localStorage.getItem('vr_role') === 'admin');
  if (currentUser?.role === 'admin' || role === 'admin' || hasAdminToken) {
    return (
      <div className="w-full">
        <AdminView />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto shadow-inner">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Admin Control Center</h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Restricted to authorized Rent on Cent administrators. Authenticate with your security PIN to manage vehicle verifications, booking audits, and platform settings.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-rose-400 text-xs flex items-center gap-2 text-left animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Direct Admin Passcode Form */}
        <form onSubmit={handlePinSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Admin Security Passcode</span>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer font-normal"
              >
                {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPin ? 'Hide' : 'Show'}</span>
              </button>
            </label>

            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter Admin PIN (Default: 7777)"
                className="w-full bg-slate-950 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700 text-sm font-mono tracking-wider focus:outline-none focus:border-purple-500 transition-colors"
                autoFocus
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Default system PIN is <code className="text-purple-400 font-mono">7777</code> (or configured in server env <code className="text-slate-400 font-mono">ADMIN_PIN</code>).
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            {loading ? (
              <span>Verifying Passcode...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Authenticate as Administrator</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <button
            type="button"
            onClick={() => openLoginModal('admin', 'login')}
            className="w-full text-xs text-slate-400 hover:text-purple-400 font-semibold py-1.5 transition-colors cursor-pointer"
          >
            Or log in with Admin Email &amp; Password
          </button>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Rental Marketplace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
