'use client';

import React from 'react';
import Link from 'next/link';
import { Bike, ShieldCheck, MapPin, MessageSquare, Heart, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer = () => {
  const { setRole, legalConfig, openLoginModal, openContactModal, currentUser, logoutUser, promptSwitchToHost } = useApp();

  const handleHostClick = () => {
    promptSwitchToHost();
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-12 text-xs relative z-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Column 1 & 2: Brand Info */}
        <div className="col-span-2 space-y-3">
          <Link href="/" aria-label="Rent on Cent - Vrindavan Bike Rentals Home" className="inline-flex items-center gap-3 text-white font-heading font-extrabold text-lg group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 border border-emerald-400/50 shadow-md group-hover:scale-105 transition-transform">
              <img src="/logo_square_share_area.png" alt="Rent to Cent Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="block leading-tight group-hover:text-emerald-400 transition-colors">Rent to Cent</span>
              <span className="text-[11px] font-semibold text-emerald-400 font-sans tracking-wide">Rent • Ride • Explore</span>
            </div>
          </Link>
          <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
            &quot;Rent to Cent&quot; — The premier peer-to-peer bike and scooter rental platform connecting local hosts with visiting pilgrims and tourists in Vrindavan &amp; Mathura.
          </p>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/40">🪶 Radhe Radhe!</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-normal">Vrindavan Dham</span>
          </div>
        </div>

        {/* Column 3: Quick Navigation */}
        <div>
          <p className="text-white font-bold mb-3 uppercase text-[11px] tracking-wider">Quick Links</p>
          <ul className="space-y-2">
            <li>
              <Link href="/locations" className="hover:text-white transition-colors">
                Pickup Locations (13+)
              </Link>
            </li>
            <li>
              <Link href="/bikes" className="hover:text-white transition-colors">
                Explore Bikes
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="hover:text-amber-400 font-semibold transition-colors flex items-center gap-1">
                <span>Customer Reviews (4.9★)</span>
              </Link>
            </li>
            <li>
              <Link href="/jobs-in-vrindavan" className="hover:text-amber-300 text-amber-400 font-bold transition-colors flex items-center gap-1">
                <span>Jobs in Vrindavan (Earn 10%)</span>
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={handleHostClick}
                className="hover:text-white text-emerald-400 font-bold transition-colors cursor-pointer text-left"
              >
                Host on Rent on Cent
              </button>
            </li>
            <li>
              {currentUser ? (
                <button
                  type="button"
                  onClick={logoutUser}
                  className="hover:text-white text-slate-400 transition-colors cursor-pointer text-left"
                >
                  Sign Out ({currentUser.name?.split(' ')[0] || 'User'})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openLoginModal()}
                  className="hover:text-white text-emerald-400 font-bold transition-colors cursor-pointer text-left"
                >
                  Log In / Sign Up
                </button>
              )}
            </li>
            <li>
              <a
                href={`https://wa.me/${(legalConfig?.supportWhatsApp || '+919720965985').replace(/[^0-9]/g, '')}?text=Radhe%20Radhe!%20I%20have%20an%20inquiry.`}
                target="_blank"
                rel="noreferrer"
                aria-label="Direct WhatsApp Inquiry for Bike Rentals"
                className="hover:text-white text-emerald-400 font-bold transition-colors"
              >
                WhatsApp Inquiry Desk
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={() => openContactModal()}
                className="hover:text-white text-teal-400 font-bold transition-colors flex items-center gap-1.5 cursor-pointer text-left"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Support Form</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Legal & Policies */}
        <div>
          <p className="text-white font-bold mb-3 uppercase text-[11px] tracking-wider">Legal &amp; Policies</p>
          <ul className="space-y-2">
            <li>
              <Link href="/terms" aria-label="Read Rent on Cent Rental Terms and Conditions" className="hover:text-white transition-colors block text-left">
                Rental Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy" aria-label="Read Rent on Cent Privacy and Data Security Policy" className="hover:text-white transition-colors block text-left">
                Privacy &amp; Data Policy
              </Link>
            </li>
            <li>
              <Link href="/terms#cancellation-refunds" aria-label="View Cancellation and Refund Rules" className="hover:text-white transition-colors block text-left">
                Cancellation &amp; Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/terms#security-inspection" aria-label="View Vehicle Protection and Damage Shield" className="hover:text-white transition-colors block text-left">
                Vehicle Protection Shield
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 5: Contact & WhatsApp CTA */}
        <div>
          <p className="text-white font-bold mb-3 uppercase text-[11px] tracking-wider">Contact &amp; Location</p>
          <p className="mb-3 text-slate-400 leading-relaxed">
            Vrindavan Dham, Mathura Region, Uttar Pradesh
          </p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => openContactModal()}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl font-bold transition-transform active:scale-95 shadow-md border border-slate-700 text-xs cursor-pointer"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Send Us a Message</span>
            </button>
            <a
              href={`https://wa.me/${(legalConfig?.supportWhatsApp || '+919720965985').replace(/[^0-9]/g, '')}?text=Radhe%20Radhe!%20I%20need%20assistance.`}
              target="_blank"
              rel="noreferrer"
              aria-label="24x7 Customer Support on WhatsApp"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2.5 rounded-xl font-extrabold transition-transform active:scale-95 shadow-md border border-emerald-400/40 text-xs"
            >
              <MessageSquare className="w-4 h-4 fill-white" strokeWidth={2.5} />
              <span>24x7 WhatsApp Helpdesk</span>
            </a>
          </div>
        </div>
      </div>

      {/* Micro-Location & Transit Hubs SEO Band */}
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <p className="text-white font-bold uppercase text-[11px] tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Popular Rental Pickup Hubs &amp; Expressway Cuts</span>
          </p>
          <Link href="/locations" aria-label="Explore all 13+ rental pickup locations in Mathura and Vrindavan" className="text-emerald-400 hover:underline text-[11px] font-semibold">
            View All 13+ Pickup Locations →
          </Link>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-slate-400">
          <Link href="/locations/mathura-cut-yamuna-expressway" className="hover:text-emerald-400 transition-colors">
            Mathura Cut (Yamuna Exp.)
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/locations/raya-cut-yamuna-expressway" className="hover:text-emerald-400 transition-colors">
            Raya Cut (Yamuna Exp.)
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/locations/chattikara-road" className="hover:text-emerald-400 transition-colors">
            Chattikara Road / NH19
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/locations/bankey-bihari-temple" className="hover:text-emerald-400 transition-colors">
            Bankey Bihari Temple Marg
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/locations/prem-mandir-raman-reti" className="hover:text-emerald-400 transition-colors">
            Prem Mandir &amp; Raman Reti
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/locations/iskcon-temple-vrindavan" className="hover:text-emerald-400 transition-colors">
            ISKCON Krishna Balaram Mandir
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/locations/nidhivan-seva-kunj" className="hover:text-emerald-400 transition-colors">
            Nidhivan &amp; Seva Kunj
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/locations/barsana-radha-rani-temple" className="hover:text-emerald-400 transition-colors">
            Barsana Shri Radha Rani Mandir
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/locations/mathura-krishna-janmabhoomi" className="hover:text-emerald-400 transition-colors">
            Krishna Janmabhoomi Mathura
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/locations/gokul-raman-reti" className="hover:text-emerald-400 transition-colors">
            Gokul Dham &amp; Brahmand Ghat
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/locations/mathura-junction-railway-station" className="hover:text-emerald-400 transition-colors">
            Mathura Jn Railway Station
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/locations/govardhan-parikrama" className="hover:text-emerald-400 transition-colors">
            Govardhan Parikrama Marg
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/locations/hotels-tourist-service" className="hover:text-emerald-400 transition-colors">
            Hotel &amp; Ashram Doorstep Handover
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 Rent on Cent. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Built for Vrindavan Pilgrims &amp; Local Vehicle Owners
        </p>
      </div>
    </footer>
  );
};
