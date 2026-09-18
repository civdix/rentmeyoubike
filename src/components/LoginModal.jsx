import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiLogin, apiRegister, apiAdminLogin } from '../api/client';
import {
  X,
  Phone,
  Key,
  ShieldCheck,
  User,
  Bike,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowRight,
  Mail,
  Eye,
  EyeOff,
  UserPlus,
  LogIn
} from 'lucide-react';
import { VrindavanFeatherIcon } from './CustomIcons';
import { EmailVerificationField } from './EmailVerificationField';

export const LoginModal = ({ initialMode = 'login', initialRole = 'customer', onClose, onSuccess }) => {
  const { setRole, setCurrentUser, refreshData, loginRoleTarget } = useApp();
  const targetRole = loginRoleTarget || initialRole || 'customer';

  // Mode: 'login' | 'signup'
  const [mode, setMode] = useState(initialMode || 'login');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // LOGIN Form State
  const [loginIdentifier, setLoginIdentifier] = useState(''); // Email or Phone
  const [loginPassword, setLoginPassword] = useState('');

  // SIGN UP Form State (Unified Onboarding)
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [isSignupEmailVerified, setIsSignupEmailVerified] = useState(false);
  const [signupPassword, setSignupPassword] = useState('');

  // Sync mode if initialMode changes or if targetRole is admin
  useEffect(() => {
    if (initialMode) setMode(initialMode);
    if (targetRole === 'admin') {
      setMode('login');
      if (!loginIdentifier) setLoginIdentifier('admin');
    }
  }, [initialMode, targetRole]);

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // ==================== HANDLE LOGIN ====================
  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanIdentifier = loginIdentifier.trim();
    const cleanPassword = loginPassword.trim();

    if (!cleanIdentifier && targetRole !== 'admin') {
      setErrorMsg('Please enter your email address or mobile phone number.');
      return;
    }

    if (!cleanPassword) {
      setErrorMsg(targetRole === 'admin' ? 'Please enter your Admin Passcode / PIN.' : 'Please enter your account password.');
      return;
    }

    setLoading(true);

    try {
      let res;
      // If targeting admin or identifier is admin or user typed PIN
      if (targetRole === 'admin' || cleanIdentifier.toLowerCase() === 'admin') {
        try {
          res = await apiAdminLogin(cleanPassword || cleanIdentifier);
        } catch {
          res = await apiLogin({
            identifier: cleanIdentifier || 'admin',
            password: cleanPassword
          });
        }
      } else {
        res = await apiLogin({
          identifier: cleanIdentifier,
          password: cleanPassword
        });
      }

      if (res?.success) {
        if (setCurrentUser) setCurrentUser(res.user);
        // If authorized as admin, switch to admin; if target was host, switch to owner and route to /host; otherwise start on Renter view
        if (res.role === 'admin' || res.user?.role === 'admin' || targetRole === 'admin') {
          setRole('admin');
          if (typeof window !== 'undefined' && window.location.pathname !== '/admin') {
            window.location.href = '/admin';
          }
        } else if (targetRole === 'owner') {
          setRole('owner');
          localStorage.setItem('vr_role', 'owner');
          if (typeof window !== 'undefined' && window.location.pathname !== '/host') {
            window.location.href = '/host';
          }
        } else {
          setRole('customer');
        }
        if (refreshData) refreshData();
        if (onSuccess) onSuccess(res.user);
        onClose();
      } else {
        setErrorMsg(res?.error || 'Login failed. Please verify your credentials.');
      }
    } catch (err) {
      const msg = err?.message || 'Login failed. Please check your credentials or switch to Sign Up.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // ==================== HANDLE SIGN UP ====================
  const handleSignupSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanName = signupName.trim();
    const cleanPhone = signupPhone.trim();
    const cleanEmail = signupEmail.trim();
    const cleanPass = signupPassword.trim();

    if (!cleanName) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!cleanPhone || cleanPhone.replace(/[^0-9]/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    if (!cleanEmail) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!isSignupEmailVerified) {
      setErrorMsg('Please verify your email address with the OTP verification code first.');
      return;
    }

    if (!cleanPass || cleanPass.length < 6) {
      setErrorMsg('Please choose a secure password of at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await apiRegister({
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        password: cleanPass
      });

      if (res?.success) {
        setSuccessMsg('Account created successfully! Logging you in...');
        if (setCurrentUser) setCurrentUser(res.user);
        if (targetRole === 'owner') {
          setRole('owner');
          localStorage.setItem('vr_role', 'owner');
        } else {
          setRole('customer');
        }
        if (refreshData) refreshData();
        if (onSuccess) onSuccess(res.user);
        setTimeout(() => {
          onClose();
          if (targetRole === 'owner' && typeof window !== 'undefined' && window.location.pathname !== '/host') {
            window.location.href = '/host';
          }
        }, 600);
      } else {
        setErrorMsg(res?.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      const msg = err?.message || 'Registration failed. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-emerald-400/40 p-1 flex items-center justify-center shadow-lg text-white shrink-0">
              <img src="/logo_square_share_area.png" alt="Rent to Cent Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-heading font-extrabold text-base text-white">
                  {mode === 'login' ? 'Welcome to Rent to Cent' : 'Create Your Account'}
                </h3>
                <VrindavanFeatherIcon className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-[11px] text-slate-400">
                {mode === 'login'
                  ? 'Sign in to access rentals, bookings & fleet hosting'
                  : 'One unified account for Renters & Fleet Hosts'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-750 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Segmented Mode Switch: [Log In] vs [Sign Up] (Hidden for Admin) */}
        {targetRole !== 'admin' ? (
          <div className="p-2.5 sm:p-3 bg-slate-950/90 border-b border-slate-800 flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleModeSwitch('login')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'login'
                  ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeSwitch('signup')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up / Register</span>
            </button>
          </div>
        ) : (
          <div className="bg-purple-500/15 border-b border-purple-500/30 px-4 py-2.5 text-purple-200 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="leading-tight">
              <strong>Admin Authentication:</strong> Enter your security passcode to access the admin portal.
            </span>
          </div>
        )}

        {targetRole === 'owner' && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-amber-200 text-xs flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="leading-tight">
              Sign in with your unified account to activate <strong>Host Mode</strong> and list your bike.
            </span>
          </div>
        )}

        {/* Form Body - Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-rose-400 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ==================== LOGIN MODE ==================== */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {targetRole === 'admin' ? 'Admin Identifier' : 'Email or Mobile Phone Number'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={targetRole === 'admin' ? 'admin' : 'name@domain.com or 10-digit mobile'}
                    className="w-full bg-slate-950 text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-purple-500"
                    required
                    autoFocus={targetRole !== 'admin'}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    {targetRole === 'admin' ? 'Admin Passcode / PIN' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={targetRole === 'admin' ? 'Enter PIN (Default: 7777)' : 'Enter your account password'}
                    className="w-full bg-slate-950 text-white pl-10 pr-10 py-2.5 rounded-xl border border-slate-700 text-sm font-mono focus:outline-none focus:border-purple-500"
                    required
                    autoFocus={targetRole === 'admin'}
                  />
                </div>
                {targetRole === 'admin' && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Default PIN is <code className="text-purple-400 font-mono">7777</code>.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-2 py-3 rounded-xl text-sm font-extrabold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.98] ${
                  targetRole === 'admin'
                    ? 'bg-purple-600 hover:bg-purple-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>{targetRole === 'admin' ? 'Unlock Admin Console' : 'Log In to Rent to Cent'}</span>
                  </>
                )}
              </button>

              {targetRole !== 'admin' && (
                <div className="pt-2 text-center">
                  <p className="text-xs text-slate-400">
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('signup')}
                      className="font-bold text-emerald-400 hover:underline cursor-pointer"
                    >
                      Sign Up / Register here
                    </button>
                  </p>
                </div>
              )}
            </form>
          )}

          {/* ==================== SIGN UP MODE ==================== */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {/* Field 1: Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Enter your legal full name"
                    className="w-full bg-slate-950 text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Field 2: Mobile Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Mobile Phone Number (10 Digits)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-xs">+91</span>
                  <input
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                      setSignupPhone(val);
                    }}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full bg-slate-950 text-white pl-12 pr-4 py-2.5 rounded-xl border border-slate-700 text-sm font-mono tracking-wider focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Field 3: Email Verification with OTP */}
              <div>
                <EmailVerificationField
                  value={signupEmail}
                  onChange={(val) => {
                    setSignupEmail(val);
                    setIsSignupEmailVerified(false);
                  }}
                  onVerifiedChange={(verified) => setIsSignupEmailVerified(verified)}
                  role="customer"
                  theme="dark"
                  label="Email Address (OTP Verification Required)"
                  required
                />
              </div>

              {/* Field 4: Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300">Choose a Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Min 4 characters"
                    minLength={4}
                    className="w-full bg-slate-950 text-white pl-10 pr-10 py-2.5 rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isSignupEmailVerified}
                className={`w-full mt-2 py-3 rounded-xl text-sm font-extrabold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${
                  isSignupEmailVerified
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Rent to Cent Account</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <p className="text-xs text-slate-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('login')}
                    className="font-bold text-emerald-400 hover:underline cursor-pointer"
                  >
                    Log In here
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
