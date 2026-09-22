import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, Clock, Award, CheckCircle2, AlertTriangle, Zap, MapPin, IndianRupee } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VrindavanFeatherIcon } from './CustomIcons';

export const LegalPoliciesModal = ({ initialTab = 'rental_terms', onClose }) => {
  const { legalConfig } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: 'rental_terms', label: 'Rental Terms', icon: FileText },
    { id: 'privacy_policy', label: 'Privacy Policy', icon: Lock },
    { id: 'cancellation_policy', label: 'Cancellation Policy', icon: Clock },
    { id: 'protection_insurance', label: 'Protection & Insurance', icon: ShieldCheck },
    { id: 'terms_conditions', label: 'Terms & Conditions (Payouts)', icon: Award }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 text-slate-900">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 px-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-lg font-extrabold text-white">Rent on Cent Legal & Policy Center</h2>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded border border-amber-400/30 flex items-center gap-1">
                  <VrindavanFeatherIcon className="w-3 h-3 text-amber-400" />
                  <span>Radhe Verified</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">Transparent guidelines for pilgrims, renters, and vehicle hosts in Vrindavan</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 flex overflow-x-auto gap-2 text-xs font-bold shrink-0 custom-scrollbar">
          {tabs.map((t) => {
            const IconComp = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`py-3.5 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === t.id
                    ? 'border-emerald-600 text-emerald-700 font-extrabold bg-white rounded-t-xl'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
              >
                <IconComp className={`w-4 h-4 ${activeTab === t.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-700 custom-scrollbar flex-1">
          {/* TAB 1: RENTAL TERMS */}
          {activeTab === 'rental_terms' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                <h3 className="font-heading font-extrabold text-emerald-950 text-base mb-1">
                  1. Vrindavan Rental Terms & Yatra Guidelines
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  These terms govern two-wheeler (scooter, motorcycle, electric vehicle, and bicycle) rentals operated through the Rent on Cent peer-to-peer marketplace.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Mandatory Driving Documents
                  </h4>
                  <ul className="space-y-1.5 text-slate-600">
                    <li>• <strong>Motorised Vehicles (Scooters & Motorcycles):</strong> Valid Indian or International Driving Licence (MCWG / LMV) and original Government Photo ID (Aadhaar or Passport).</li>
                    <li>• <strong>Bicycles & EV Pedal-Assists:</strong> No driving licence required! Government photo ID verification is required.</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Helmets & Safety Protocol
                  </h4>
                  <ul className="space-y-1.5 text-slate-600">
                    <li>• <strong>2 Sanitized Helmets Included:</strong> Every motorized rental includes two helmets (rider + pillion) featuring clean Tilak fabric liners.</li>
                    <li>• Helmets are mandatory under UP Traffic rules while riding in Vrindavan & Mathura.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Speed Limits & Temple Silence Zones</h4>
                <ul className="space-y-1.5 text-slate-600">
                  <li>• <strong>Speed Limit:</strong> Maximum speed inside Vrindavan temple galis, Parikrama Marg, and Prem Mandir Road is capped at <strong>30 km/h</strong>.</li>
                  <li>• <strong>No-Honking Zones:</strong> No aggressive honking near Prem Mandir, ISKCON, Nidhivan, and Bankey Bihari Temple zones.</li>
                  <li>• <strong>Fuel Policy:</strong> Petrol vehicles are handed over with a logged fuel percentage and must be returned at approximately the same level. EV vehicles are returned with a minimum of 20% battery charge.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY */}
          {activeTab === 'privacy_policy' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
                  <Lock className="w-5 h-5" />
                  <span>Privacy First Guarantee — We Protect Your Data</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  At Rent on Cent, your personal privacy and trust are paramount. We strictly enforce data protection policies to ensure a safe, spam-free experience for pilgrims and hosts.
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">1. We Do Not Share or Sell Your Details</h4>
                  <p className="text-slate-600 leading-relaxed">
                    We <strong>never sell, rent, monetize, or share your phone number, email address, or identity documents</strong> with third-party advertisers, telemarketers, or marketing agencies.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">2. Host Phone Number Shielding</h4>
                  <p className="text-slate-600 leading-relaxed">
                    To prevent harassment and unsolicited marketing calls, host personal phone numbers are hidden from public listings. All pre-booking communications are securely mediated through the official Rent on Cent WhatsApp channel (`{legalConfig.supportWhatsApp}`).
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">3. Minimal Identity Verification Storage</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Government photo ID (Aadhaar/Passport) and Driving Licence verification data are encrypted and used exclusively for identity validation and digital handover inspection protection. We do not store raw Aadhaar numbers on public databases.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CANCELLATION POLICY */}
          {activeTab === 'cancellation_policy' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-amber-50 border border-amber-300 p-5 rounded-2xl text-amber-950">
                <h3 className="font-heading font-extrabold text-lg mb-1 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-700" />
                  Flexible Customer-Centric Cancellation Policy
                </h3>
                <p className="text-amber-900 leading-relaxed">
                  We understand travel plans during yatra can shift. Our cancellation policy is designed around 100% customer convenience and peace of mind.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                  <span className="bg-emerald-100 text-emerald-950 font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full border border-emerald-300">
                    Up to 12 Hours Before Pickup
                  </span>
                  <h4 className="font-bold text-slate-900 text-base">Free Cancellation — 100% Refund</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Cancel anytime up to 12 hours prior to your scheduled pickup time with zero cancellation charges. Full refund is processed directly back to your original payment method or UPI within 24 hours.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                  <span className="bg-amber-100 text-amber-950 font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full border border-amber-300">
                    Within 12 Hours of Pickup
                  </span>
                  <h4 className="font-bold text-slate-900 text-base">100% Yatra Credit Voucher</h4>
                  <p className="text-slate-600 leading-relaxed">
                    For cancellations requested within 12 hours of pickup, you receive a <strong>100% rental credit voucher valid for 12 months</strong> to use on any vehicle for your next Vrindavan trip.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">How to request cancellation?</span>
                  <span className="text-slate-500">Simply send a message with your Booking ID to our WhatsApp support link.</span>
                </div>
                <a
                  href={`https://wa.me/${legalConfig.supportWhatsApp.replace(/[^0-9]/g, '')}?text=Hi%2C%20I%20want%20to%20cancel%20my%20booking.`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs"
                >
                  Cancel via WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* TAB 4: PROTECTION & INSURANCE */}
          {activeTab === 'protection_insurance' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-2">
                <h3 className="font-heading font-extrabold text-lg text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  🪶 Radhe Protection Plan (Sacred Yatra Shield)
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {legalConfig.protectionDisclaimer}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-emerald-800 text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    24/7 Roadside Assistance
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Includes emergency flat tyre assistance, battery jump-start, and breakdown towing across Vrindavan & Mathura city limits.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-purple-800 text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    Digital Inspection Audit Lock
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Our 6-angle photo inspection before key handover protects you from being charged for pre-existing scratches or dents.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-amber-800 text-sm flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Standard Exclusions
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Coverage does not extend to illegal driving, driving under influence, helmet rule violations, or unauthorized sub-letting.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TERMS & CONDITIONS (OWNER PAYOUTS) */}
          {activeTab === 'terms_conditions' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-800 space-y-2">
                <h3 className="font-heading font-extrabold text-lg text-emerald-400 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-emerald-400" />
                  Owner Payout Structure & Platform Mediation Terms
                </h3>
                <p className="text-emerald-100 leading-relaxed">
                  Clear, transparent rules governing vehicle host earnings, payouts, platform commission, and dispute resolution.
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">1. Host Earnings & 85% Net Payout</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Vehicle owners keep <strong>85% of gross rental earnings</strong>. Rent on Cent retains a modest 15% platform commission to cover payment gateway fees, digital inspection servers, customer support, and marketing yatra traffic.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">2. Daily Settlement Schedule</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Owner payouts are calculated automatically upon trip completion and transferred directly to the owner's registered UPI ID or Bank Account <strong>every day by 11:00 AM</strong>.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">3. Dispute Arbitration</h4>
                  <p className="text-slate-600 leading-relaxed">
                    In the event of damage or inspection disparity upon return, Rent on Cent Admin team conducts an independent audit using timestamped Before vs. After photos and videos to reach a fair settlement.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 font-medium">© 2026 Rent on Cent P2P Marketplace</span>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-sm"
          >
            Close Policy Center
          </button>
        </div>
      </div>
    </div>
  );
};
