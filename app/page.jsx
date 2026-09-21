import React from 'react';
import { CustomerView } from '../src/views/CustomerView';

export const metadata = {
  title: 'Bike on Rent in Vrindavan | Vrindavan Rental & Scooty from ₹299 - Rent on Cent',
  description:
    'Best bike on rent in Vrindavan & scooty rental from ₹299/day or ₹40/hr. Verified Honda Activa 6G, EV scooters & Royal Enfield with zero deposit, free helmets & hotel delivery. Instant WhatsApp booking: +91 97209 65985.',
  alternates: {
    canonical: 'https://rentoncent.bond'
  },
  openGraph: {
    title: 'Bike on Rent in Vrindavan | Vrindavan Rental & Scooty from ₹299 - Rent on Cent',
    description: 'Rent Honda Activa 6G, EV scooters & Royal Enfield in Vrindavan from ₹299/day. Zero deposit, 2 free helmets & doorstep hotel delivery.',
    url: 'https://rentoncent.bond',
    siteName: 'Rent on Cent',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://rentoncent.bond/og-customer.jpg',
        secureUrl: 'https://rentoncent.bond/og-customer.jpg',
        width: 1200,
        height: 1200,
        type: 'image/jpeg',
        alt: 'Rent on Cent - Bike on Rent in Vrindavan & Vrindavan Rental'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bike on Rent in Vrindavan | Vrindavan Rental & Scooty from ₹299 - Rent on Cent',
    description: 'Best bike on rent in Vrindavan from ₹299/day. Verified Activa 6G, EV scooters & doorstep hotel delivery.',
    images: ['https://rentoncent.bond/og-customer.jpg']
  }
};

export default function HomePage() {
  return (
    <>
      {/* Primary Server-Side Rendered Customer & Home Experience */}
      <CustomerView />

      {/* Semantic Crawlable SEO & AI Knowledge Base Content */}
      <section className="bg-slate-900 text-slate-300 py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Main SEO Header */}
          <div className="border-b border-slate-800 pb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-amber-400 font-heading">
              Vrindavan Rental &amp; Two-Wheeler Hire &mdash; Bike on Rent in Vrindavan Guide
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              Looking for a verified <strong>bike on rent in Vrindavan</strong> or the most reliable <strong>Vrindavan rental</strong> service? Rent on Cent (rentoncent.bond) is Braj Bhoomi&apos;s premier peer-to-peer two-wheeler rental platform. Whether you are arriving for Shri Bankey Bihari Ji darshan, Prem Mandir lighting, Govardhan Parikrama, or visiting Shri Krishna Janmabhoomi in Mathura, our fleet of verified Honda Activa 6G, TVS Jupiter, Royal Enfield Classic 350, and eco-friendly electric scooters (EV) gives you the freedom to explore holy Braj at your own pace without bargaining with local e-rickshaws or auto drivers.
            </p>
          </div>

          {/* Pricing & Fleet Comparison Table for Search Engines & AI LLMs */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Vrindavan Bike &amp; Scooty Rental Tariff Table (2026 Updated Rates)
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse bg-slate-950/60">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-200 border-b border-slate-700">
                    <th className="p-3 font-semibold">Vehicle Model</th>
                    <th className="p-3 font-semibold">Category</th>
                    <th className="p-3 font-semibold">Hourly Rate</th>
                    <th className="p-3 font-semibold">12-Hour Rate</th>
                    <th className="p-3 font-semibold">24-Hour (1 Day)</th>
                    <th className="p-3 font-semibold">Security Deposit</th>
                    <th className="p-3 font-semibold">Included Perks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-medium text-amber-300">Honda Activa 6G (110cc)</td>
                    <td className="p-3">Automatic Scooty</td>
                    <td className="p-3">₹40 / hr</td>
                    <td className="p-3">₹220</td>
                    <td className="p-3 font-bold text-emerald-400">₹299 / day</td>
                    <td className="p-3">₹0 Cash Deposit</td>
                    <td className="p-3">2 Sanitized Helmets + Mobile Mount</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-medium text-teal-300">Electric Scooter (EV)</td>
                    <td className="p-3">Green Eco-Scooter</td>
                    <td className="p-3">₹40 / hr</td>
                    <td className="p-3">₹210</td>
                    <td className="p-3 font-bold text-emerald-400">₹299 / day</td>
                    <td className="p-3">₹0 Cash Deposit</td>
                    <td className="p-3">Home Charger + 100 km Range</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-medium text-slate-200">TVS Jupiter 125cc</td>
                    <td className="p-3">Comfort Scooter</td>
                    <td className="p-3">₹45 / hr</td>
                    <td className="p-3">₹250</td>
                    <td className="p-3 font-bold text-emerald-400">₹349 / day</td>
                    <td className="p-3">₹0 Cash Deposit</td>
                    <td className="p-3">33L Prasad Boot Storage + 2 Helmets</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-medium text-purple-300">Royal Enfield Classic 350</td>
                    <td className="p-3">Cruiser Motorcycle</td>
                    <td className="p-3">₹120 / hr</td>
                    <td className="p-3">₹650</td>
                    <td className="p-3 font-bold text-emerald-400">₹1,199 / day</td>
                    <td className="p-3">₹1,000 Refundable</td>
                    <td className="p-3">Highway Leg Guard + Crash Protection</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Temple Circuit Distance & Travel Guide */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Popular Temple Routes &amp; Travel Time from Vrindavan Hub (Raman Reti)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
                <h4 className="font-bold text-amber-300 text-sm">Prem Mandir &amp; ISKCON</h4>
                <p className="text-slate-400 mt-1"><strong>Distance:</strong> 0.5 &ndash; 1.5 km (2&ndash;5 mins)</p>
                <p className="text-slate-400"><strong>Best Mode:</strong> Honda Activa / Walking</p>
                <p className="text-slate-400"><strong>Tip:</strong> Evening fountain show 7:00 PM; easy scooty parking outside gates.</p>
              </div>
              <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
                <h4 className="font-bold text-amber-300 text-sm">Shri Bankey Bihari Ji</h4>
                <p className="text-slate-400 mt-1"><strong>Distance:</strong> 3.2 km (8&ndash;12 mins)</p>
                <p className="text-slate-400"><strong>Best Mode:</strong> Scooty (Cars strictly restricted)</p>
                <p className="text-slate-400"><strong>Tip:</strong> Park at Vidyapeeth Chauraha two-wheeler stand (₹20) and walk 250m.</p>
              </div>
              <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
                <h4 className="font-bold text-amber-300 text-sm">Govardhan Sacred Parikrama</h4>
                <p className="text-slate-400 mt-1"><strong>Distance:</strong> 22 km to Dan Ghati (40 mins)</p>
                <p className="text-slate-400"><strong>Best Mode:</strong> Activa 6G / Classic 350</p>
                <p className="text-slate-400"><strong>Tip:</strong> Complete the 21 km Govardhan Parikrama smoothly on a rented scooty in 1.5 hrs.</p>
              </div>
              <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
                <h4 className="font-bold text-amber-300 text-sm">Mathura Janmabhoomi &amp; Dwarkadhish</h4>
                <p className="text-slate-400 mt-1"><strong>Distance:</strong> 11.5 km (20&ndash;25 mins)</p>
                <p className="text-slate-400"><strong>Best Mode:</strong> Any 2-Wheeler via Vrindavan-Mathura Marg</p>
                <p className="text-slate-400"><strong>Tip:</strong> Direct access without waiting for overcrowded shared autos.</p>
              </div>
              <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
                <h4 className="font-bold text-amber-300 text-sm">Barsana Shri Radha Rani Mandir</h4>
                <p className="text-slate-400 mt-1"><strong>Distance:</strong> 42 km (1 hr 10 mins)</p>
                <p className="text-slate-400"><strong>Best Mode:</strong> Royal Enfield / Activa 6G</p>
                <p className="text-slate-400"><strong>Tip:</strong> Scenic countryside highway route passing through Nandgaon.</p>
              </div>
              <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-850">
                <h4 className="font-bold text-amber-300 text-sm">Yamuna Expressway Delivery Cuts</h4>
                <p className="text-slate-400 mt-1"><strong>Distance:</strong> Mathura Cut (14 km) / Raya Cut (18 km)</p>
                <p className="text-slate-400"><strong>Best Mode:</strong> Pre-booked Doorstep Handover</p>
                <p className="text-slate-400"><strong>Tip:</strong> Step out of your Agra/Noida bus directly onto your rented scooty.</p>
              </div>
            </div>
          </div>

          {/* Why Devotees Choose Rent on Cent */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <h3 className="font-bold text-white text-sm mb-2">100% Verified Two-Wheeler Fleet</h3>
              <p className="text-slate-400 leading-relaxed">
                Every bike and scooty listed on Rent on Cent undergoes mandatory RC, PUC, comprehensive insurance, and physical brake/tire inspections. No breakdowns, no unauthorized vehicles.
              </p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <h3 className="font-bold text-white text-sm mb-2">Zero Cash Deposit &amp; 2 Helmets</h3>
              <p className="text-slate-400 leading-relaxed">
                We believe in trusting pilgrims and travelers. Enjoy zero security deposit options with basic digital KYC verification. Every rental includes 2 ISI-certified sanitized helmets.
              </p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <h3 className="font-bold text-white text-sm mb-2">Doorstep Delivery Across Vrindavan</h3>
              <p className="text-slate-400 leading-relaxed">
                Get your scooty delivered directly to your ashram, hotel (Rukmini Vihar, Chaitanya Vihar, Sunrakh Road), or Mathura Junction Railway Station Platform 1 exit.
              </p>
            </div>
          </div>

          {/* Micro-Location Quick Navigation Grid */}
          <div className="pt-6 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Popular Pickup Points &amp; Expressway Cut Handover Locations
              </h3>
              <a href="/locations" aria-label="Explore all pickup locations in Vrindavan and Mathura" className="text-xs text-amber-400 hover:underline font-semibold">
                View All Locations &rarr;
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <a
                href="/locations/mathura-cut-yamuna-expressway"
                className="bg-slate-800/80 hover:bg-slate-750 p-2.5 rounded-xl border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
              >
                <div className="font-bold text-amber-300 truncate">Mathura Cut (Yamuna Exp.)</div>
                <div className="text-[11px] text-slate-400">Expressway Exit Handover</div>
              </a>
              <a
                href="/locations/raya-cut-yamuna-expressway"
                className="bg-slate-800/80 hover:bg-slate-750 p-2.5 rounded-xl border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
              >
                <div className="font-bold text-amber-300 truncate">Raya Cut (Yamuna Exp.)</div>
                <div className="text-[11px] text-slate-400">Gokul &amp; Vrindavan Gateway</div>
              </a>
              <a
                href="/locations/chattikara-road"
                className="bg-slate-800/80 hover:bg-slate-750 p-2.5 rounded-xl border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
              >
                <div className="font-bold text-emerald-300 truncate">Chattikara Road</div>
                <div className="text-[11px] text-slate-400">Vaishno Devi &amp; Rukmini Vihar</div>
              </a>
              <a
                href="/locations/bankey-bihari-temple"
                className="bg-slate-800/80 hover:bg-slate-750 p-2.5 rounded-xl border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
              >
                <div className="font-bold text-emerald-300 truncate">Bankey Bihari Ji</div>
                <div className="text-[11px] text-slate-400">Vidyapeeth Chauraha Parking</div>
              </a>
              <a
                href="/locations/prem-mandir-raman-reti"
                className="bg-slate-800/80 hover:bg-slate-750 p-2.5 rounded-xl border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
              >
                <div className="font-bold text-teal-300 truncate">Prem Mandir &amp; ISKCON</div>
                <div className="text-[11px] text-slate-400">Raman Reti Hub</div>
              </a>
              <a
                href="/locations/mathura-junction-railway-station"
                className="bg-slate-800/80 hover:bg-slate-750 p-2.5 rounded-xl border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
              >
                <div className="font-bold text-teal-300 truncate">Mathura Junction (MTJ)</div>
                <div className="text-[11px] text-slate-400">Platform 1 Exit Delivery</div>
              </a>
              <a
                href="/locations/govardhan-parikrama"
                className="bg-slate-800/80 hover:bg-slate-750 p-2.5 rounded-xl border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
              >
                <div className="font-bold text-amber-300 truncate">Govardhan Parikrama</div>
                <div className="text-[11px] text-slate-400">21 KM Sacred Route &amp; EV</div>
              </a>
              <a
                href="/locations/hotels-tourist-service"
                className="bg-slate-800/80 hover:bg-slate-750 p-2.5 rounded-xl border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
              >
                <div className="font-bold text-emerald-300 truncate">Hotels &amp; Ashrams</div>
                <div className="text-[11px] text-slate-400">Doorstep Delivery (Auto Alt.)</div>
              </a>
            </div>
          </div>

          {/* High-Intent FAQ for Devotees, Search Engines & AI Assistants */}
          <div className="pt-6 border-t border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">
              Frequently Asked Questions &mdash; Bike &amp; Scooty on Rent in Vrindavan
            </h3>
            <div className="space-y-3 text-xs">
              <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                <h4 className="font-semibold text-slate-200">How do I get a bike on rent in Vrindavan?</h4>
                <p className="text-slate-400 mt-1 leading-relaxed">
                  You can book instantly online at <a href="https://rentoncent.bond" className="text-amber-400 hover:underline">rentoncent.bond</a> or message our 24x7 WhatsApp desk at <a href="https://wa.me/919720965985" className="text-emerald-400 hover:underline">+91 97209 65985</a>. Choose your vehicle (Honda Activa 6G, EV scooter, or Royal Enfield), select your pickup location or hotel delivery, submit your Driving License and Aadhaar for digital KYC, and receive your keys in under 15 minutes.
                </p>
              </div>

              <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                <h4 className="font-semibold text-slate-200">What is the cost of scooty rental in Vrindavan?</h4>
                <p className="text-slate-400 mt-1 leading-relaxed">
                  Scooty on rent in Vrindavan starts at ₹299 for a full 24-hour day (or ₹40/hour for quick temple visits). Weekly packages are available from ₹1,899/week. All prices include 2 helmets and basic maintenance support with zero hidden charges.
                </p>
              </div>

              <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                <h4 className="font-semibold text-slate-200">What documents are required to rent a two-wheeler?</h4>
                <p className="text-slate-400 mt-1 leading-relaxed">
                  You need a valid Original or DigiLocker Driving License (DL) and one government photo ID (Aadhaar Card, Passport, or Voter ID). International tourists can provide an International Driving Permit (IDP) and passport.
                </p>
              </div>

              <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                <h4 className="font-semibold text-slate-200">Can I take the rental scooty for Govardhan Parikrama and Mathura?</h4>
                <p className="text-slate-400 mt-1 leading-relaxed">
                  Yes! All Rent on Cent vehicles have valid UP state permits covering Vrindavan, Mathura, Govardhan, Barsana, Gokul, and Nandgaon. You can smoothly complete the 21 km Govardhan Parikrama without restriction.
                </p>
              </div>

              <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                <h4 className="font-semibold text-slate-200">Can I get delivery at Mathura Junction Railway Station or Yamuna Expressway?</h4>
                <p className="text-slate-400 mt-1 leading-relaxed">
                  Yes, we provide doorstep handover at Mathura Junction (Platform 1 exit), Mathura Cantt, and Yamuna Expressway exits (Mathura Cut &amp; Raya Cut) so you can start riding immediately without haggling with station touts.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Meta Details */}
          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap gap-x-6 gap-y-2 justify-between">
            <span>Official Platform: <a href="https://rentoncent.bond" className="text-amber-400 hover:underline">rentoncent.bond</a></span>
            <span>Support Helpline: <a href="https://wa.me/919720965985" className="text-emerald-400 hover:underline">+91 97209 65985</a></span>
            <span>Coverage: Vrindavan &bull; Mathura &bull; Govardhan &bull; Barsana &bull; Yamuna Expressway &bull; Braj Dham</span>
          </div>
        </div>
      </section>
    </>
  );
}
