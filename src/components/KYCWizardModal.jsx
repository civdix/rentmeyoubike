import React, { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle2, Upload, AlertCircle, Lock, ArrowRight, X, Cpu } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const KYCWizardModal = ({ bookingId, onClose, onSuccess }) => {
  const { bookings, verifyKYC, currentUser, openLoginModal } = useApp();
  const booking = bookings.find((b) => b.id === bookingId);

  const [activeStep, setActiveStep] = useState(1); // 1: Aadhaar, 2: PAN, 3: Driving Licence
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [dlNumber, setDlNumber] = useState('');
  const [documentsUploaded, setDocumentsUploaded] = useState({
    aadhaarFront: false,
    panCard: false,
    drivingLicence: false
  });
  const [docNames, setDocNames] = useState({
    aadhaarFront: '',
    panCard: '',
    drivingLicence: ''
  });
  const [isVerifying, setIsVerifying] = useState(false);

  const handleFileChange = (field, file) => {
    if (!file) return;
    setDocNames((prev) => ({ ...prev, [field]: file.name }));
    setDocumentsUploaded((prev) => ({ ...prev, [field]: true }));
  };

  const handleSimulateKYCSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      openLoginModal('customer');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      verifyKYC(bookingId, {
        aadhaarNumber: aadhaarNumber || '',
        panNumber: panNumber || '',
        dlNumber: dlNumber || ''
      });
      if (onSuccess) onSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="font-heading text-lg font-bold">Customer Identity Verification (KYC)</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Booking Ref: #{bookingId || 'N/A'}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Third Party Architecture Note */}
        <div className="bg-emerald-50 border-b border-emerald-100 p-3 px-5 text-xs text-emerald-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Third-Party KYC Ready:</strong> Integrates with Cashfree / Digilocker / Surepass APIs.
            </span>
          </div>
          <span className="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded">256-bit Encrypted</span>
        </div>

        {/* Steps Progress */}
        <div className="p-4 px-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div
            onClick={() => setActiveStep(1)}
            className={`flex items-center gap-2 cursor-pointer ${activeStep === 1 ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeStep === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200'}`}>1</div>
            <span className="text-xs">1. Aadhaar ID</span>
          </div>
          <div className="w-8 h-[2px] bg-slate-200"></div>
          <div
            onClick={() => setActiveStep(2)}
            className={`flex items-center gap-2 cursor-pointer ${activeStep === 2 ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeStep === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200'}`}>2</div>
            <span className="text-xs">2. PAN Card</span>
          </div>
          <div className="w-8 h-[2px] bg-slate-200"></div>
          <div
            onClick={() => setActiveStep(3)}
            className={`flex items-center gap-2 cursor-pointer ${activeStep === 3 ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeStep === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200'}`}>3</div>
            <span className="text-xs">3. Driving Licence</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSimulateKYCSubmit} className="p-6">
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Aadhaar Card Verification
                </h4>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">Step 1 of 3</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Aadhaar Number (12 Digits)</label>
                <input
                  type="text"
                  maxLength={14}
                  placeholder="XXXX - XXXX - XXXX"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              {/* Upload Card */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50 hover:bg-slate-100/80 transition-colors">
                <input
                  type="file"
                  id="aadhaar-file-input"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileChange('aadhaarFront', e.target.files[0])}
                />
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-700">Upload Front & Back Photo of Aadhaar Card</p>
                <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, PDF up to 5MB</p>
                {documentsUploaded.aadhaarFront ? (
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs px-3 py-1.5 rounded-lg border border-emerald-300 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Attached: {docNames.aadhaarFront}</span>
                  </div>
                ) : (
                  <label
                    htmlFor="aadhaar-file-input"
                    className="mt-3 inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs px-3.5 py-1.5 rounded-lg shadow-sm font-semibold cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Document</span>
                  </label>
                )}
              </div>

              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md"
              >
                <span>Continue to PAN Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  PAN Card Verification
                </h4>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">Step 2 of 3</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">PAN Number (10 Alphanumeric)</label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="ABCDE1234F"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  className="w-full text-sm uppercase px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50">
                <input
                  type="file"
                  id="pan-file-input"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileChange('panCard', e.target.files[0])}
                />
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-700">Upload Front Photo of PAN Card</p>
                {documentsUploaded.panCard ? (
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs px-3 py-1.5 rounded-lg border border-emerald-300 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Attached: {docNames.panCard}</span>
                  </div>
                ) : (
                  <label
                    htmlFor="pan-file-input"
                    className="mt-3 inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs px-3.5 py-1.5 rounded-lg shadow-sm font-semibold cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Document</span>
                  </label>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="w-2/3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Continue to Driving Licence</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Driving Licence (DL) Verification
                </h4>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">Step 3 of 3</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Driving Licence Number</label>
                <input
                  type="text"
                  placeholder="UP85 20210049210"
                  value={dlNumber}
                  onChange={(e) => setDlNumber(e.target.value.toUpperCase())}
                  className="w-full text-sm uppercase px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50">
                <input
                  type="file"
                  id="dl-file-input"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileChange('drivingLicence', e.target.files[0])}
                />
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-700">Upload Both Sides of Driving Licence</p>
                {documentsUploaded.drivingLicence ? (
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs px-3 py-1.5 rounded-lg border border-emerald-300 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Attached: {docNames.drivingLicence}</span>
                  </div>
                ) : (
                  <label
                    htmlFor="dl-file-input"
                    className="mt-3 inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs px-3.5 py-1.5 rounded-lg shadow-sm font-semibold cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Document</span>
                  </label>
                )}
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Requirement Check:</strong> Licence must be valid for two-wheeler vehicles (MCWG / LMV) and not expired.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying Documents...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Submit KYC Verification</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
