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
    canonical: 'https://rentoncent.bond/locations'
  },
  openGraph: {
    title: 'Rental Pickup Locations in Vrindavan | Rent on Cent',
    description: 'Find two-wheeler pickup points across Mathura and Vrindavan.',
    url: 'https://rentoncent.bond/locations',
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
                  href={`/locations/${loc.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  <span>View Rates &amp; Details</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href={`https://wa.me/919720965985?text=Radhe%20Radhe!%20I%20want%20to%20rent%20a%20bike%20at%20${encodeURIComponent(loc.name)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-emerald-600 hover:underline"
                >
                  WhatsApp Booking
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Tourist Advantages Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-10 border border-slate-700 shadow-xl space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Smart Travel in Braj</span>
            <h3 className="text-2xl font-bold font-heading mt-1">Why Tourists Prefer Bikes Over Autos &amp; E-Rickshaws</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Auto-rickshaws and cabs face strict route bans, traffic bottlenecks, and inflated tourist pricing during weekends and temple festivals. Renting your own scooty gives you freedom to attend early morning Mangala Aarti, do Govardhan Parikrama, and reach narrow temple streets comfortably without bargaining.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <h4 className="font-bold text-amber-300 mb-1">Save ₹800–₹1,500 Daily</h4>
              <p className="text-slate-400">Fixed rate of ₹299/day versus paying ₹100-₹200 for every single auto ride.</p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <h4 className="font-bold text-emerald-400 mb-1">Zero Wait Time</h4>
              <p className="text-slate-400">No waiting in lines or bargaining at railway stations and expressway toll cuts.</p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <h4 className="font-bold text-teal-300 mb-1">Doorstep Hotel Return</h4>
              <p className="text-slate-400">Leave keys at your hotel reception when leaving Vrindavan or Mathura.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
