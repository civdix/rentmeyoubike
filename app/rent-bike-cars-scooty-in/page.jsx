import React from 'react';
import Link from 'next/link';
import { ALL_LOCATIONS } from '../../src/data/locationSeoData';
import { MapPin, Bike, ArrowRight, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { VrindavanScooterIcon, VrindavanFeatherIcon } from '../../src/components/CustomIcons';

export const metadata = {
  title: 'Rental Pickup Locations in Vrindavan',
  description:
    'Find two-wheeler pickup points in Vrindavan and Mathura: Yamuna Expressway exits, Prem Mandir, Bankey Bihari, Chattikara & Mathura Junction.',
  alternates: {
    canonical: 'https://rentoncent.bond/rent-bike-cars-scooty-in'
  },
  openGraph: {
    title: 'Rental Pickup Locations in Vrindavan | Rent on Cent',
    description: 'Find two-wheeler pickup points across Mathura and Vrindavan.',
    url: 'https://rentoncent.bond/rent-bike-cars-scooty-in',
    siteName: 'Rent on Cent',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://rentoncent.bond/logo_square_share_area.png',
        secureUrl: 'https://rentoncent.bond/logo_square_share_area.png',
        width: 540,
        height: 540,
        type: 'image/png',
        alt: 'Rent on Cent - Vrindavan Bike & Scooty Rental'
      }
    ]
  },
  twitter: {
    card: 'summary',
    title: 'Rental Pickup Locations in Vrindavan | Rent on Cent',
    description: 'Find two-wheeler pickup points across Mathura and Vrindavan.',
    images: ['https://rentoncent.bond/logo_square_share_area.png']
  }
};

export default function LocationsHubPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <VrindavanFeatherIcon className="w-3.5 h-3.5 text-amber-500" />
            <span>Pickup Points &amp; Express Delivery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Bike &amp; Scooty Rental Locations in Vrindavan &amp; Mathura
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Whether arriving via Yamuna Expressway, stepping off a train at Mathura Junction, or staying near Prem Mandir, Rent on Cent provides prompt two-wheeler handovers and doorstep hotel delivery across the entire Braj region.
          </p>
        </div>

        {/* Location Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_LOCATIONS.map((loc) => (
            <div
              key={loc.slug}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 group-hover:scale-105 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    From ₹299/day
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-heading group-hover:text-emerald-700 transition-colors">
                    {loc.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {loc.subheadline}
                  </p>
                </div>

                <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="font-semibold text-slate-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Landmark: {loc.landmark}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/rent-bike-cars-scooty-in/${loc.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  <span>View Rates &amp; Details</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <span className="text-[11px] text-slate-400 font-medium">
                  {loc.postalCode}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Value Proposition Callout */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <VrindavanScooterIcon className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-bold text-white text-base">₹0 Cash Deposit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We trust pilgrims with simple digital KYC via DigiLocker. No original documents withheld.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-bold text-white text-base">Verified Hosts &amp; Fleet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mandatory commercial RC, PUC, comprehensive insurance, and physical brake/tire audits.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Clock className="w-5 h-5 text-teal-400" />
            </div>
            <h3 className="font-bold text-white text-base">15-Min Doorstep Handover</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Delivery to hotels in Rukmini Vihar, Chaitanya Vihar, Sunrakh Road, and Yamuna Expressway toll cuts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
