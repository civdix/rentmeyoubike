import React, { useState, useEffect, useRef } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2, Send, KeyRound, ShieldCheck } from 'lucide-react';
import { apiCheckEmail, apiSendEmailOtp, apiVerifyEmailOtp } from '../api/client';

export const EmailVerificationField = ({
  value = '',
  onChange,
  role = 'customer',
  isVerified = false,
  onVerified,
  label = 'Email Address',
  required = true,
  theme = 'emerald', // 'emerald' | 'amber'
  variant = 'dark',  // 'dark' | 'light'
  helperText,
  disabled = false
}) => {
  const [checking, setChecking] = useState(false);
  const [distinction, setDistinction] = useState(null); // { status, message, maskedPhone, registeredAs }
  const [formatError, setFormatError] = useState('');
  
  // OTP flow state
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpSentMessage, setOtpSentMessage] = useState('');
  const [otpError, setOtpError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState('');

  const debounceTimerRef = useRef(null);
  const cooldownIntervalRef = useRef(null);

  // Email format regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const isValidFormat = (email) => {
    return emailRegex.test(email.trim());
  };

  // Debounced check for email distinction while user is typing
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmed = value.trim();

    if (!trimmed) {
      setFormatError('');
      setDistinction(null);
      setChecking(false);
      return;
    }

    // Check basic format structure
    if (!isValidFormat(trimmed)) {
      if (trimmed.includes('@')) {
        setFormatError('Incomplete domain (e.g. user@gmail.com)');
      } else {
        setFormatError('Valid email format required (e.g. name@domain.com)');
      }
      setDistinction(null);
      setChecking(false);
      return;
    }

    // Format is valid, clear error and run distinction check against backend
    setFormatError('');
    setChecking(true);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await apiCheckEmail(trimmed, role);
        if (res?.valid) {
          setDistinction({
            status: res.status,
            message: res.message,
            maskedPhone: res.existingAccount?.maskedPhone || null,
            registeredAs: res.existingAccount?.registeredAs || null,
            isEmailVerified: res.isEmailVerified
          });

          // If backend already marked this email as verified
          if (res.isEmailVerified && !isVerified && onVerified) {
            onVerified(trimmed);
          }
        }
      } catch (err) {
        // In case of network failure or offline, distinguish gracefully
        setDistinction(null);
      } finally {
        setChecking(false);
      }
    }, 400);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [value, role]);

  // Cooldown countdown timer for OTP resend
  useEffect(() => {
    if (cooldown > 0) {
      cooldownIntervalRef.current = setInterval(() => {
        setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    } else {
      if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current);
    }
    return () => {
      if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current);
    };
  }, [cooldown]);

  const handleSendOtp = async () => {
    const trimmed = value.trim();
    if (!isValidFormat(trimmed)) {
      setFormatError('Please enter a valid email address before requesting an OTP.');
      return;
    }

    setSendingOtp(true);
    setOtpError('');
    setOtpSentMessage('');

    try {
      const res = await apiSendEmailOtp(trimmed, role);
      setShowOtpInput(true);
      setOtpSentMessage(res?.message || `Verification code sent to ${trimmed}`);
      setCooldown(60); // 60s cooldown
      if (res?.devOtp) {
        setDevOtpHint(res.devOtp);
      } else {
        setDevOtpHint('');
      }
    } catch (err) {
      setOtpError(err.message || 'Failed to send OTP. Please check your connection.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const trimmed = value.trim();
    const code = otpCode.trim();

    if (!code || code.length < 6) {
      setOtpError('Please enter the full 6-digit verification code.');
      return;
    }

    setVerifyingOtp(true);
    setOtpError('');

    try {
      const res = await apiVerifyEmailOtp(trimmed, code);
      if (res?.success) {
        setShowOtpInput(false);
        setOtpCode('');
        setOtpSentMessage('');
        setDevOtpHint('');
        if (onVerified) onVerified(trimmed);
      } else {
        setOtpError(res?.error || 'Invalid OTP code. Please try again.');
      }
    } catch (err) {
      setOtpError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const isDark = variant === 'dark';
  const isEmerald = theme === 'emerald';

  const labelClass = isDark
    ? 'text-slate-300 font-bold'
    : 'text-slate-700 font-bold';

  const inputBgClass = isDark
    ? 'bg-slate-950 text-white border-slate-700'
    : 'bg-white text-slate-900 border-slate-300';

  const focusBorderClass = isEmerald ? 'focus:border-emerald-500' : 'focus:border-amber-500';

  const btnColor = isEmerald
    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold';

  return (
    <div className="space-y-2 text-xs">
      {/* Label and Status */}
      <div className="flex items-center justify-between">
        <label className={`block ${labelClass}`}>
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        
        {/* Verification Status Pill */}
        {isVerified ? (
          <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
            isDark
              ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/40'
              : 'text-emerald-900 bg-emerald-100 border border-emerald-400'
          }`}>
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Verified
          </span>
        ) : (
          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {helperText || 'Live format validation'}
          </span>
        )}
      </div>

      {/* Input Group */}
      <div className="relative">
        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="email"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            // Reset verified status if email changed
            if (isVerified && onVerified && e.target.value.trim() !== value.trim()) {
              onVerified(null);
            }
          }}
          disabled={disabled}
          placeholder="yourname@domain.com"
          className={`w-full ${inputBgClass} pl-10 pr-24 py-2.5 rounded-xl border ${
            formatError
              ? 'border-rose-500'
              : isVerified
              ? 'border-emerald-500'
              : ''
          } text-xs font-mono focus:outline-none ${focusBorderClass} transition-colors`}
          required={required}
          autoComplete="email"
        />

        {/* Action button inside input */}
        <div className="absolute right-2 top-2">
          {isVerified ? (
            <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border ${
              isDark
                ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40'
                : 'text-emerald-900 bg-emerald-100 border-emerald-300'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={!isValidFormat(value) || sendingOtp || cooldown > 0 || disabled}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed ${btnColor}`}
            >
              {sendingOtp ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : cooldown > 0 ? (
                <span>{cooldown}s</span>
              ) : (
                <>
                  <Send className="w-3 h-3" />
                  <span>{showOtpInput ? 'Resend' : 'Verify OTP'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Real-time Validation & Distinction Feedback */}
      <div className="space-y-1">
        {checking && (
          <div className={`flex items-center gap-1.5 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
            <span>Checking email directory...</span>
          </div>
        )}

        {formatError && (
          <div className="flex items-center gap-1.5 text-[11px] text-rose-500 animate-fadeIn">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{formatError}</span>
          </div>
        )}

        {!formatError && distinction && (
          <div className="animate-fadeIn">
            {distinction.status === 'available' && (
              <div className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border ${
                isDark
                  ? 'text-emerald-400 bg-emerald-950/30 border-emerald-500/20'
                  : 'text-emerald-950 bg-emerald-50 border-emerald-300 font-semibold'
              }`}>
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>New email • Available for {role === 'owner' ? 'Fleet Host' : 'Renter'} registration</span>
              </div>
            )}

            {distinction.status === 'registered_same_role' && (
              <div className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border ${
                isDark
                  ? 'text-sky-400 bg-sky-950/30 border-sky-500/20'
                  : 'text-sky-950 bg-sky-50 border-sky-300 font-semibold'
              }`}>
                <CheckCircle2 className="w-3 h-3 text-sky-600 shrink-0" />
                <span>
                  Registered {role === 'owner' ? 'Host' : 'Renter'} account found
                  {distinction.maskedPhone && ` (Phone: ${distinction.maskedPhone})`}
                </span>
              </div>
            )}

            {distinction.status === 'registered_other_role' && (
              <div className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border ${
                isDark
                  ? 'text-amber-400 bg-amber-950/30 border-amber-500/20'
                  : 'text-amber-950 bg-amber-50 border-amber-300 font-semibold'
              }`}>
                <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                <span>
                  Note: Email linked to {distinction.registeredAs} account
                  {distinction.maskedPhone && ` (${distinction.maskedPhone})`}.
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* OTP Code Entry Section */}
      {showOtpInput && !isVerified && (
        <div className={`p-3 rounded-2xl border space-y-2.5 animate-fadeIn ${
          isDark
            ? 'bg-slate-950/80 border-slate-800'
            : 'bg-slate-50 border-slate-300'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <div className={`flex items-center gap-1.5 font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span>Enter 6-Digit Email OTP</span>
            </div>
            {cooldown > 0 && (
              <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Resend in {cooldown}s
              </span>
            )}
          </div>

          {otpSentMessage && (
            <p className="text-[11px] text-emerald-600 font-medium">{otpSentMessage}</p>
          )}

          {devOtpHint && (
            <div className={`p-2 rounded-xl text-[11px] flex items-center justify-between border ${
              isDark
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}>
              <span>Dev Simulation Code: <strong className="font-mono text-xs font-black">{devOtpHint}</strong></span>
              <button
                type="button"
                onClick={() => setOtpCode(devOtpHint)}
                className="text-[10px] text-amber-700 underline font-bold hover:text-amber-800"
              >
                Auto-fill
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className={`flex-1 px-3 py-2 rounded-xl border text-center font-mono tracking-widest text-base font-extrabold focus:outline-none ${focusBorderClass} ${
                isDark
                  ? 'bg-slate-900 text-white border-slate-700'
                  : 'bg-white text-slate-900 border-slate-300'
              }`}
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={otpCode.trim().length !== 6 || verifyingOtp}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold disabled:opacity-50 transition-all ${btnColor} flex items-center gap-1 shadow-sm`}
            >
              {verifyingOtp ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify Code</span>
                </>
              )}
            </button>
          </div>

          {otpError && (
            <div className="flex items-center gap-1.5 text-[11px] text-rose-500">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{otpError}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
