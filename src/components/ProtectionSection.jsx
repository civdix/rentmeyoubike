import React from 'react';
import { ShieldCheck, Info, CheckCircle2, AlertTriangle, FileText, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProtectionSection = ({ compact = false }) => {
  const { legalConfig } = useApp();

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-0 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                {legalConfig.protectionTitle}
              </h3>
              <p className="text-xs text-slate-400">Configurable P2P Vehicle Protection Framework</p>
            </div>
          </div>
          <span className="bg-slate-800 text-emerald-400 border border-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Lock className="w-3 h-3" />
            No Security Deposit Required
          </span>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
          <Info className="w-4 h-4 text-emerald-400 inline mr-1.5 shrink-0" />
          {legalConfig.protectionDisclaimer}
        </p>

        {!compact && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
                <CheckCircle2 className="w-4 h-4" />
                Included Coverages
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1">
                <li>• 24/7 Roadside Assistance in Vrindavan</li>
                <li>• Pre-rental Digital Inspection Lock</li>
                <li>• Owner Handover Damage Verification</li>
              </ul>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-1">
                <AlertTriangle className="w-4 h-4" />
                Standard Deductibles & Exclusions
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1">
                <li>• Violations of traffic laws or helmet rules</li>
                <li>• Driving under influence / unauthorized drivers</li>
                <li>• Unreported pre-existing damage</li>
              </ul>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs mb-1">
                <FileText className="w-4 h-4" />
                Eligibility Criteria
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1">
                <li>• Verified Aadhaar / Driving Licence</li>
                <li>• Mandatory Digital Inspection before ride</li>
                <li>• Age 18+ for scooters, 21+ for motorcycles</li>
              </ul>
            </div>
          </div>
        )}

        {/* Legal Disclaimer Box */}
        <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-400 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-300">Regulatory & Legal Notice:</strong> {legalConfig.legalPolicyNote}
          </span>
        </div>
      </div>
    </div>
  );
};
