'use client';

import React from 'react';
import { Bike, ShieldCheck, MapPin, MessageSquare, Heart, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer = () => {
  const { setRole, legalConfig, setActiveLegalModal, openLoginModal, openContactModal, currentUser, logoutUser, promptSwitchToHost } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-12 text-xs relative z-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Column 1 & 2: Brand Info */}
        <div className="col-span-2 space-y-3">
          <div className="flex items-center gap-3 text-white font-heading font-extrabold text-lg">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 border border-emerald-400/50 shadow-md">
              <img src="/logo_square_share_area.png" alt="Rent to Cent Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="block leading-tight">Rent to Cent</span>
              <span className="text-[11px] font-semibold text-emerald-400 font-sans tracking-wide">P2P Bike Sharing</span>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
            "Rent to Cent" — The premier peer-to-peer bike and scooter rental platform connecting local hosts with visiting pilgrims and tourists in Vrindavan & Mathura.
          </p>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/40">🪶 Radhe Radhe!</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-normal">Vrindavan Dham</span>
          </div>
        </div>

        {/* Column 3: Quick Navigation */}
        <div>
          <h4 className="text-white font-bold mb-3 uppercase text-[11px] tracking-wider">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => {
                  setRole('customer');
                  window.dispatchEvent(new CustomEvent('vr_navigate', { detail: 'browse' }));
                }}
                className="hover:text-white transition-colors"
              >
                Explore Bikes
              </button>
            </li>
            <li>
              <button
                onClick={promptSwitchToHost}
                className="hover:text-white text-amber-400 font-bold transition-colors cursor-pointer"
              >
                Host on Rent to Cent
              </button>
            </li>
            <li>
              {currentUser ? (
                <button
                  onClick={logoutUser}
                  className="hover:text-white text-slate-400 transition-colors cursor-pointer"
                >
                  Sign Out ({currentUser.name?.split(' ')[0] || 'User'})
                </button>
              ) : (
                <button
                  onClick={() => openLoginModal()}
                  className="hover:text-white text-emerald-400 font-bold transition-colors cursor-pointer"
                >
                  Log In / Sign Up
                </button>
              )}
            </li>
            <li>
              <a
                href={`https://wa.me/${legalConfig.supportWhatsApp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white text-emerald-400 font-bold transition-colors"
              >
                WhatsApp Support
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={() => openContactModal()}
                className="hover:text-white text-teal-400 font-bold transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Support Form</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Legal & Policies */}
        <div>
          <h4 className="text-white font-bold mb-3 uppercase text-[11px] tracking-wider">Legal & Policies</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => setActiveLegalModal({ tab: 'rental_terms' })} className="hover:text-white transition-colors text-left">
                Rental Terms
              </button>
            </li>
            <li>
              <button onClick={() => setActiveLegalModal({ tab: 'privacy_policy' })} className="hover:text-white transition-colors text-left">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => setActiveLegalModal({ tab: 'cancellation_policy' })} className="hover:text-white transition-colors text-left">
                Cancellation Policy
              </button>
            </li>
            <li>
              <button onClick={() => setActiveLegalModal({ tab: 'protection_insurance' })} className="hover:text-white transition-colors text-left">
                Protection / Insurance
              </button>
            </li>
            <li>
              <button onClick={() => setActiveLegalModal({ tab: 'terms_conditions' })} className="hover:text-white transition-colors text-left">
                Terms & Conditions
              </button>
            </li>
          </ul>
        </div>

        {/* Column 5: Contact & WhatsApp CTA */}
        <div>
          <h4 className="text-white font-bold mb-3 uppercase text-[11px] tracking-wider">Contact & Location</h4>
          <p className="mb-3 text-slate-400 leading-relaxed">
            Vrindavan Dham, Mathura Region, Uttar Pradesh
          </p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => openContactModal()}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl font-bold transition-transform active:scale-95 shadow-md border border-slate-700 text-xs"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Send Us a Message</span>
            </button>
            <a
              href={`https://wa.me/${legalConfig.supportWhatsApp.replace(/[^0-9]/g, '')}?text=Radhe%20Radhe!%20I%20need%20assistance.`}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2.5 rounded-xl font-extrabold transition-transform active:scale-95 shadow-md border border-emerald-400/40 text-xs"
            >
              <MessageSquare className="w-4 h-4 fill-white" strokeWidth={2.5} />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 Rent to Cent. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Built for Vrindavan Pilgrims & Local Vehicle Owners
        </p>
      </div>
    </footer>
  );
};
