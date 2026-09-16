import React from 'react';
import { Bike, ShieldCheck, MapPin, MessageSquare, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer = () => {
  const { setRole, legalConfig, setActiveLegalModal, openLoginModal } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-12 text-xs relative z-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Column 1 & 2: Brand Info */}
        <div className="col-span-2 space-y-3">
          <div className="flex items-center gap-3 text-white font-heading font-extrabold text-lg">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-amber-500 flex items-center justify-center text-white border border-amber-400/50 shadow-md">
              <Bike className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span>Vrindavan Rides</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
            "Verified bikes. Simple rentals. Explore Vrindavan." The premier peer-to-peer bike and scooter rental platform connecting local hosts with visiting pilgrims and tourists in Vrindavan & Mathura.
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
                onClick={() => openLoginModal('customer')}
                className="hover:text-white text-emerald-400 font-bold transition-colors"
              >
                Renter Login / Sign In
              </button>
            </li>
            <li>
              <button onClick={() => openLoginModal('owner')} className="hover:text-white text-amber-400 font-bold transition-colors">
                Host Login / List Bike
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  const hasAdminToken = typeof window !== 'undefined' && localStorage.getItem('vr_admin_token');
                  if (hasAdminToken) {
                    setRole('admin');
                  } else {
                    openLoginModal('admin');
                  }
                }}
                className="hover:text-white text-slate-400 hover:text-slate-300 transition-colors"
              >
                Admin Console Login
              </button>
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
          <a
            href={`https://wa.me/${legalConfig.supportWhatsApp.replace(/[^0-9]/g, '')}?text=Radhe%20Radhe!%20I%20need%20assistance.`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2.5 rounded-xl font-extrabold transition-transform active:scale-95 shadow-md border border-emerald-400/40"
          >
            <MessageSquare className="w-4 h-4 fill-white" strokeWidth={2.5} />
            <span>WhatsApp Support</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 Vrindavan Rides. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Built for Vrindavan Pilgrims & Local Vehicle Owners
        </p>
      </div>
    </footer>
  );
};
