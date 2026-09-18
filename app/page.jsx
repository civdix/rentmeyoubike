import React from 'react';
import { CustomerView } from '../src/views/CustomerView';

export const metadata = {
  title: 'Rent on Cent | Electric Scooter & Bike Rental in Vrindavan & Mathura',
  description:
    'Affordable, peer-to-peer bike and scooty rentals in Vrindavan and Mathura. Rent Honda Activa, EV scooters, Royal Enfield starting at ₹40/hour or ₹299/day. Verified hosts, doorstep delivery, instant WhatsApp booking.',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Rent on Cent | Bike & Scooty Rental in Vrindavan',
    description: 'Rent Honda Activa, EV Scooters, and Royal Enfield in Vrindavan & Mathura starting ₹299/day.',
    url: 'https://rentoncent.bond'
  }
};

export default function HomePage() {
  return (
    <>
      {/* Primary Server-Side Rendered Customer & Home Experience */}
      <CustomerView />

      {/* Semantic Crawlable SEO Content for Search Engine Indexing */}
      <section className="bg-slate-900 text-slate-300 py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="border-b border-slate-800 pb-6">
            <h1 className="text-xl font-bold text-amber-400 font-heading">
              Rent on Cent — #1 Bike &amp; Scooty Rental in Vrindavan &amp; Mathura
            </h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Rent on Cent is Braj Bhoomi&apos;s leading peer-to-peer two-wheeler rental platform, offering verified Honda Activa, TVS Jupiter, Royal Enfield Classic, and high-efficiency electric scooters (EV) for devotees, tourists, and pilgrims visiting Vrindavan, Mathura, Govardhan, and Barsana. Experience peaceful parikramas and convenient temple darshan with transparent daily pricing starting at just ₹299/day and hourly rentals from ₹40/hour.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <h2 className="font-bold text-white text-sm mb-2">Popular Temple Routes by Two-Wheeler</h2>
              <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                <li>Prem Mandir &amp; ISKCON Temple Circuit (Raman Reti)</li>
                <li>Shri Bankey Bihari Ji Darshan &amp; Nidhivan Silence Zone</li>
                <li>Govardhan 21 km Sacred Parikrama on Activa / EV</li>
                <li>Mathura Janmabhoomi &amp; Dwarkadhish Temple Day Tour</li>
                <li>Barsana Radha Rani Mandir &amp; Nandgaon Heritage Trail</li>
              </ul>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <h2 className="font-bold text-white text-sm mb-2">Why Devotees Prefer Rent on Cent</h2>
              <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                <li><strong className="text-slate-200">100% Verified Fleet:</strong> Complete RC, PUC, and Insurance audits before every handover.</li>
                <li><strong className="text-slate-200">Zero Security Deposit Options:</strong> Transparent, upfront rates with no hidden fees.</li>
                <li><strong className="text-slate-200">Doorstep Delivery:</strong> Delivery available to your ashram, hotel, or Mathura Cantt / Junction.</li>
                <li><strong className="text-slate-200">Sacred Yatra Shield:</strong> Accidental protection &amp; 24x7 local roadside assistance.</li>
              </ul>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <h2 className="font-bold text-white text-sm mb-2">List Your Bike &amp; Earn in Vrindavan</h2>
              <p className="text-slate-400 leading-relaxed">
                Are you a local vehicle owner in Vrindavan or Mathura? Earn up to ₹15,000 every month by listing your idle two-wheeler on Rent on Cent. We manage digital KYC, verified customer agreements, and 6-angle handover inspections.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap gap-x-6 gap-y-2 justify-between">
            <span>Official Domain: <a href="https://rentoncent.bond" className="text-amber-400 hover:underline">rentoncent.bond</a></span>
            <span>Customer Support WhatsApp: <a href="https://wa.me/919837144520" className="text-emerald-400 hover:underline">+91 98371 44520</a></span>
            <span>Serving: Vrindavan • Mathura • Govardhan • Barsana • Braj Dham</span>
          </div>
        </div>
      </section>
    </>
  );
}
