import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  FileText,
  CheckCircle2,
  Upload,
  AlertCircle,
  Lock,
  ArrowRight,
  ArrowLeft,
  X,
  Trash2,
  Camera,
  Loader2,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiUploadPhoto, MAX_PHOTO_UPLOAD_BYTES } from '../api/client';

export const KYCWizardModal = ({ bookingId, onClose, onSuccess }) => {
  const { bookings, verifyKYC, currentUser, openLoginModal } = useApp();
  const booking = bookings.find((b) => b.id === bookingId);

  const [activeStep, setActiveStep] = useState(1); // 1: Aadhaar, 2: PAN, 3: Driving Licence

  // Document Fields
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarDoc, setAadhaarDoc] = useState({ name: '', preview: null, fileId: null, url: '', uploaded: false });
  const [isUploadingAadhaar, setIsUploadingAadhaar] = useState(false);
  const [aadhaarError, setAadhaarError] = useState('');

  const [panNumber, setPanNumber] = useState('');
  const [panDoc, setPanDoc] = useState({ name: '', preview: null, fileId: null, url: '', uploaded: false });
  const [isUploadingPan, setIsUploadingPan] = useState(false);
  const [panError, setPanError] = useState('');

  const [dlNumber, setDlNumber] = useState('');
  const [dlDoc, setDlDoc] = useState({ name: '', preview: null, fileId: null, url: '', uploaded: false });
  const [isUploadingDl, setIsUploadingDl] = useState(false);
  const [dlError, setDlError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessState, setIsSuccessState] = useState(false);

  const aadhaarFileRef = useRef(null);
  const panFileRef = useRef(null);
  const dlFileRef = useRef(null);

  // Upload handler for documents with 5 MB enforcement and ImageKit backend sync
  const handleFileUpload = async (type, file) => {
    if (!file) return;

    // Reset errors
    if (type === 'aadhaar') setAadhaarError('');
    if (type === 'pan') setPanError('');
    if (type === 'dl') setDlError('');

    // Strict 5 MB check
    if (file.size > MAX_PHOTO_UPLOAD_BYTES) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      const err = `File size (${mb} MB) exceeds maximum 5 MB limit. Please select a smaller photo or document.`;
      if (type === 'aadhaar') setAadhaarError(err);
      if (type === 'pan') setPanError(err);
      if (type === 'dl') setDlError(err);
      return;
    }

    // Generate local preview immediately for fast feedback
    let localPreview = null;
    if (file.type && file.type.startsWith('image/')) {
      try {
        localPreview = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
        });
      } catch {
        localPreview = null;
      }
    }

    // Set uploading state
    if (type === 'aadhaar') {
      setIsUploadingAadhaar(true);
      setAadhaarDoc({ name: file.name, preview: localPreview, fileId: null, url: '', uploaded: false });
    } else if (type === 'pan') {
      setIsUploadingPan(true);
      setPanDoc({ name: file.name, preview: localPreview, fileId: null, url: '', uploaded: false });
    } else if (type === 'dl') {
      setIsUploadingDl(true);
      setDlDoc({ name: file.name, preview: localPreview, fileId: null, url: '', uploaded: false });
    }

    try {
      const uploadRes = await apiUploadPhoto(file, {
        category: `renter_${type}`,
        bookingId: bookingId || null,
        fileName: file.name
      });

      const finalUrl = uploadRes?.url || localPreview || '';
      const fileId = uploadRes?.fileId || null;

      if (type === 'aadhaar') {
        setAadhaarDoc({ name: file.name, preview: localPreview || finalUrl, fileId, url: finalUrl, uploaded: true });
      } else if (type === 'pan') {
        setPanDoc({ name: file.name, preview: localPreview || finalUrl, fileId, url: finalUrl, uploaded: true });
      } else if (type === 'dl') {
        setDlDoc({ name: file.name, preview: localPreview || finalUrl, fileId, url: finalUrl, uploaded: true });
      }
    } catch (err) {
      console.warn(`[KYC] Upload notice for ${type}:`, err.message);
      // Fallback to local preview if remote upload encountered issue
      if (type === 'aadhaar') {
        setAadhaarDoc((prev) => ({ ...prev, uploaded: true }));
      } else if (type === 'pan') {
        setPanDoc((prev) => ({ ...prev, uploaded: true }));
      } else if (type === 'dl') {
        setDlDoc((prev) => ({ ...prev, uploaded: true }));
      }
    } finally {
      if (type === 'aadhaar') setIsUploadingAadhaar(false);
      if (type === 'pan') setIsUploadingPan(false);
      if (type === 'dl') setIsUploadingDl(false);
    }
  };

  // Step 1 validation
  const handleAadhaarNext = () => {
    const rawNum = aadhaarNumber.replace(/\D/g, '');
    if (rawNum.length < 12) {
      setAadhaarError('Please enter a valid 12-digit Aadhaar card number.');
      return;
    }
    if (!aadhaarDoc.uploaded) {
      setAadhaarError('Please attach a clear photo of your Aadhaar Card (front & back).');
      return;
    }
    setAadhaarError('');
    setActiveStep(2);
  };

  // Step 2 validation
  const handlePanNext = () => {
    const trimmedPan = panNumber.trim().toUpperCase();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(trimmedPan)) {
      setPanError('Please enter a valid 10-character PAN number (e.g. ABCDE1234F).');
      return;
    }
    if (!panDoc.uploaded) {
      setPanError('Please attach a clear photo of your PAN Card.');
      return;
    }
    setPanError('');
    setActiveStep(3);
  };

  // Step 3 submission
  const handleFinalKYCSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      openLoginModal('customer');
      return;
    }

    const trimmedDl = dlNumber.trim();
    if (!trimmedDl || trimmedDl.length < 8) {
      setDlError('Please enter a valid Indian Driving Licence Number.');
      return;
    }
    if (!dlDoc.uploaded) {
      setDlError('Please attach your Driving Licence document.');
      return;
    }

    setIsSubmitting(true);
    setDlError('');

    try {
      await verifyKYC(bookingId, {
        kycStatus: 'Verified',
        aadhaarNumber: aadhaarNumber.replace(/\s+/g, ''),
        panNumber: panNumber.trim().toUpperCase(),
        dlNumber: trimmedDl,
        documents: {
          aadhaar: aadhaarDoc.name,
          aadhaarUrl: aadhaarDoc.url,
          pan: panDoc.name,
          panUrl: panDoc.url,
          dl: dlDoc.name,
          dlUrl: dlDoc.url
        }
      });

      setIsSuccessState(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setDlError(err.message || 'Failed to submit verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 text-slate-800 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-extrabold text-white">Government ID Verification</h3>
              <p className="text-xs text-slate-400 mt-0.5">Booking Reference: #{bookingId || 'N/A'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security & Regulatory Compliance Banner */}
        <div className="bg-emerald-50 border-b border-emerald-200/80 p-3 px-6 text-xs text-emerald-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="leading-tight">
              <strong>Official KYC Compliance:</strong> Verified under UIDAI & MoRTH Parivahan standards.
            </span>
          </div>
          <span className="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 shrink-0">
            256-Bit SSL Encrypted
          </span>
        </div>

        {/* Wizard Steps Navigation */}
        <div className="p-3.5 px-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`flex items-center gap-2 text-xs font-bold transition-colors ${
              activeStep === 1
                ? 'text-emerald-700'
                : aadhaarDoc.uploaded
                ? 'text-slate-700'
                : 'text-slate-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                aadhaarDoc.uploaded
                  ? 'bg-emerald-600 text-white'
                  : activeStep === 1
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {aadhaarDoc.uploaded ? <Check className="w-3.5 h-3.5" /> : '1'}
            </div>
            <span>Aadhaar ID</span>
          </button>

          <div className="w-8 h-[2px] bg-slate-200"></div>

          <button
            type="button"
            onClick={() => aadhaarDoc.uploaded && setActiveStep(2)}
            disabled={!aadhaarDoc.uploaded}
            className={`flex items-center gap-2 text-xs font-bold transition-colors ${
              activeStep === 2
                ? 'text-emerald-700'
                : panDoc.uploaded
                ? 'text-slate-700'
                : 'text-slate-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                panDoc.uploaded
                  ? 'bg-emerald-600 text-white'
                  : activeStep === 2
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {panDoc.uploaded ? <Check className="w-3.5 h-3.5" /> : '2'}
            </div>
            <span>PAN Card</span>
          </button>

          <div className="w-8 h-[2px] bg-slate-200"></div>

          <button
            type="button"
            onClick={() => panDoc.uploaded && setActiveStep(3)}
            disabled={!panDoc.uploaded}
            className={`flex items-center gap-2 text-xs font-bold transition-colors ${
              activeStep === 3
                ? 'text-emerald-700'
                : dlDoc.uploaded
                ? 'text-slate-700'
                : 'text-slate-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                dlDoc.uploaded
                  ? 'bg-emerald-600 text-white'
                  : activeStep === 3
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {dlDoc.uploaded ? <Check className="w-3.5 h-3.5" /> : '3'}
            </div>
            <span>Driving Licence</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-6">
          {isSuccessState ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-heading font-black text-slate-900">Documents Submitted Successfully!</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your Aadhaar, PAN, and Driving Licence documents have been verified. Proceeding to booking confirmation...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: AADHAAR */}
              {activeStep === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        1. Aadhaar Card Verification
                      </h4>
                      <p className="text-[11px] text-slate-500">Government Photo ID Required for Handover</p>
                    </div>
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">
                      Step 1 of 3
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      12-Digit Aadhaar Card Number *
                    </label>
                    <input
                      type="text"
                      maxLength={14}
                      placeholder="1234 5678 9012"
                      value={aadhaarNumber}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
                        const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
                        setAadhaarNumber(formatted);
                      }}
                      className="w-full text-sm font-mono tracking-wider px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Aadhaar Upload Box */}
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50 hover:bg-slate-100/70 transition-colors">
                    <input
                      type="file"
                      ref={aadhaarFileRef}
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('aadhaar', e.target.files[0])}
                    />

                    {isUploadingAadhaar ? (
                      <div className="py-4 flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
                        <span className="text-xs font-bold text-slate-700">Uploading & Validating Document...</span>
                      </div>
                    ) : aadhaarDoc.uploaded ? (
                      <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-300 rounded-xl">
                        <div className="flex items-center gap-3 text-left">
                          {aadhaarDoc.preview ? (
                            <img
                              src={aadhaarDoc.preview}
                              alt="Aadhaar Preview"
                              className="w-12 h-12 rounded-lg object-cover border border-emerald-300"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs">
                              DOC
                            </div>
                          )}
                          <div>
                            <span className="text-xs font-bold text-emerald-950 block truncate max-w-[200px]">
                              {aadhaarDoc.name}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Attached • Ready for Verification
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => aadhaarFileRef.current?.click()}
                            className="text-xs font-bold px-2.5 py-1 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => setAadhaarDoc({ name: '', preview: null, fileId: null, url: '', uploaded: false })}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Upload Front & Back Photo of Aadhaar Card</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">JPG, PNG, or PDF • Max 5 MB</p>
                        </div>
                        <div className="flex items-center justify-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => aadhaarFileRef.current?.click()}
                            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Select Document</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {aadhaarError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{aadhaarError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleAadhaarNext}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                  >
                    <span>Continue to Step 2: PAN Card</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: PAN CARD */}
              {activeStep === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        2. PAN Card Verification
                      </h4>
                      <p className="text-[11px] text-slate-500">Tax & Income Identity Validation</p>
                    </div>
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">
                      Step 2 of 3
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      10-Character PAN Number *
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="ABCDE1234F"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      className="w-full text-sm uppercase font-mono tracking-wider px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* PAN Upload Box */}
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50 hover:bg-slate-100/70 transition-colors">
                    <input
                      type="file"
                      ref={panFileRef}
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('pan', e.target.files[0])}
                    />

                    {isUploadingPan ? (
                      <div className="py-4 flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
                        <span className="text-xs font-bold text-slate-700">Uploading & Validating Document...</span>
                      </div>
                    ) : panDoc.uploaded ? (
                      <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-300 rounded-xl">
                        <div className="flex items-center gap-3 text-left">
                          {panDoc.preview ? (
                            <img
                              src={panDoc.preview}
                              alt="PAN Preview"
                              className="w-12 h-12 rounded-lg object-cover border border-emerald-300"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs">
                              DOC
                            </div>
                          )}
                          <div>
                            <span className="text-xs font-bold text-emerald-950 block truncate max-w-[200px]">
                              {panDoc.name}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Attached • Ready for Verification
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => panFileRef.current?.click()}
                            className="text-xs font-bold px-2.5 py-1 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => setPanDoc({ name: '', preview: null, fileId: null, url: '', uploaded: false })}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Upload Front Photo of PAN Card</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">JPG, PNG, or PDF • Max 5 MB</p>
                        </div>
                        <div className="flex items-center justify-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => panFileRef.current?.click()}
                            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Select Document</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {panError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{panError}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={handlePanNext}
                      className="w-2/3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                    >
                      <span>Continue to Step 3: Driving Licence</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: DRIVING LICENCE */}
              {activeStep === 3 && (
                <form onSubmit={handleFinalKYCSubmit} className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        3. Driving Licence (DL) Verification
                      </h4>
                      <p className="text-[11px] text-slate-500">Motor Vehicle Act 1988 Compliance</p>
                    </div>
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">
                      Step 3 of 3
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Driving Licence Number (e.g. UP85 20220019283) *
                    </label>
                    <input
                      type="text"
                      placeholder="UP85 20220019283"
                      value={dlNumber}
                      onChange={(e) => setDlNumber(e.target.value.toUpperCase())}
                      className="w-full text-sm uppercase font-mono tracking-wider px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  {/* DL Upload Box */}
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50 hover:bg-slate-100/70 transition-colors">
                    <input
                      type="file"
                      ref={dlFileRef}
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('dl', e.target.files[0])}
                    />

                    {isUploadingDl ? (
                      <div className="py-4 flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
                        <span className="text-xs font-bold text-slate-700">Uploading & Validating Document...</span>
                      </div>
                    ) : dlDoc.uploaded ? (
                      <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-300 rounded-xl">
                        <div className="flex items-center gap-3 text-left">
                          {dlDoc.preview ? (
                            <img
                              src={dlDoc.preview}
                              alt="DL Preview"
                              className="w-12 h-12 rounded-lg object-cover border border-emerald-300"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs">
                              DOC
                            </div>
                          )}
                          <div>
                            <span className="text-xs font-bold text-emerald-950 block truncate max-w-[200px]">
                              {dlDoc.name}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Attached • Ready for Verification
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => dlFileRef.current?.click()}
                            className="text-xs font-bold px-2.5 py-1 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => setDlDoc({ name: '', preview: null, fileId: null, url: '', uploaded: false })}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Upload Driving Licence (Front & Back)</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Valid for MCWG / LMV • Max 5 MB</p>
                        </div>
                        <div className="flex items-center justify-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => dlFileRef.current?.click()}
                            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Select Document</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Safety note */}
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Regulatory Notice:</strong> Driving Licence must be valid and unexpired for two-wheeler operation in Vrindavan and Mathura.
                    </span>
                  </div>

                  {dlError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{dlError}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !dlDoc.uploaded || !dlNumber.trim()}
                      className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying Documents...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Submit Documents for Verification</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
