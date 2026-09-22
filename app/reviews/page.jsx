import React from 'react';
import Link from 'next/link';
import { Star, CheckCircle2, ShieldCheck, MapPin, ThumbsUp, Calendar, Heart, MessageSquare, ChevronRight } from 'lucide-react';
import { VrindavanScooterIcon, VrindavanFeatherIcon } from '../../src/components/CustomIcons';

export const metadata = {
  title: 'Vrindavan Bike Rental Reviews & Ratings',
  description:
    'Read 1,240+ verified customer reviews of bike & scooty on rent in Vrindavan. Real pilgrim experiences, temple ratings & tips starting ₹299/day.',
  alternates: {
    canonical: 'https://rentoncent.bond/reviews'
  },
  openGraph: {
    title: 'Vrindavan Bike Rental Reviews & Ratings | Rent on Cent',
    description: 'Read 1,240+ verified traveler & pilgrim reviews for scooty on rent in Vrindavan from ₹299/day.',
    url: 'https://rentoncent.bond/reviews',
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
        alt: 'Rent on Cent Customer Reviews & Pilgrimage Experiences'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vrindavan Bike Rental Reviews & Ratings | Rent on Cent',
    description: '1,240+ verified reviews for bike & scooty on rent in Vrindavan & Mathura.',
    images: ['https://rentoncent.bond/og-customer.jpg']
  }
};

const REVIEWS_DATA = [
  {
    id: 1,
    author: 'Rajesh Sharma',
    city: 'New Delhi',
    rating: 5,
    date: '2026-03-14',
    vehicle: 'Honda Activa 6G',
    trip: 'Family Darshan — Bankey Bihari & Prem Mandir',
    verified: true,
    content:
      'Visiting Vrindavan during weekend crowd is overwhelming with auto-rickshaws charging ₹500 for small drops. We booked an Activa from Rent on Cent delivered to our hotel in Chaitanya Vihar. The scooter was brand new, 2 sanitized helmets were provided, and Vidyapeeth parking guidance was super helpful. Completed darshan of Bankey Bihari and Prem Mandir smoothly!',
    helpfulCount: 42
  },
  {
    id: 2,
    author: 'Ananya Deshmukh',
    city: 'Pune, Maharashtra',
    rating: 5,
    date: '2026-03-08',
    vehicle: 'Electric Scooter (EV High Range)',
    trip: 'Govardhan 21 KM Sacred Parikrama',
    verified: true,
    content:
      'My mother wanted to do Govardhan Parikrama but cannot walk 21 kilometers. We rented the silent EV scooter from Rent on Cent. It was so peaceful, smooth, and had zero engine noise. The battery easily lasted the entire 21 km circuit plus Radha Kund and Dan Ghati darshan with 40% battery left. An absolute divine blessing for yatris!',
    helpfulCount: 67
  },
  {
    id: 3,
    author: 'Vikram Singh Rawat',
    city: 'Jaipur, Rajasthan',
    rating: 5,
    date: '2026-02-27',
    vehicle: 'Royal Enfield Classic 350',
    trip: 'Mathura - Vrindavan - Barsana Day Tour',
    verified: true,
    content:
      'I rode from Vrindavan to Barsana (Radha Rani Mandir) and Nandgaon on their Classic 350. The thump and mechanical condition were top notch. Zero security deposit with basic digital Aadhaar verification was completed in 2 minutes on WhatsApp. No hidden charges. Highly recommended for long Braj circuits!',
    helpfulCount: 38
  },
  {
    id: 4,
    author: 'Elena Petrova',
    city: 'Moscow / ISKCON Devotee',
    rating: 5,
    date: '2026-02-19',
    vehicle: 'Honda Activa 6G',
    trip: '1-Week Kartik Seva & Raman Reti Stay',
    verified: true,
    content:
      'As an international devotee staying near ISKCON temple on Bhaktivedanta Swami Marg, getting around was hard until I found Rent on Cent. They accepted my International Driving Permit without friction. The host was very polite, punctual, and gave free doorstep pickup. Haribol!',
    helpfulCount: 51
  },
  {
    id: 5,
    author: 'Amitabh & Sunita Verma',
    city: 'Lucknow, Uttar Pradesh',
    rating: 5,
    date: '2026-02-11',
    vehicle: 'TVS Jupiter 125',
    trip: 'Mathura Junction Train Handover',
    verified: true,
    content:
      'We arrived at Mathura Junction Platform 1 exit. The host was already waiting with the Jupiter keys and helmets. We drove straight to Vrindavan without bargaining with station auto drivers who were asking ₹600. Saved ₹1,200 on our 2-day trip and explored Nidhivan and Gokul comfortably.',
    helpfulCount: 29
  },
  {
    id: 6,
    author: 'Deepak Agrawal',
    city: 'Agra, UP',
    rating: 5,
    date: '2026-01-29',
    vehicle: 'Honda Activa 6G',
    trip: 'Yamuna Expressway Mathura Cut Handover',
    verified: true,
    content:
      'Took the bus from Noida on Yamuna Expressway and got off at Mathura Cut. Rent on Cent host handed over the scooty right by the service lane. Drove straight to Prem Mandir for evening fountain show. Returned the bike at the same expressway point next evening. Unbeatable convenience!',
    helpfulCount: 34
  }
];

export default function ReviewsPage() {
  const reviewsSchema = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: 'Rent on Cent - Vrindavan Bike & Scooty Rental',
    url: 'https://rentoncent.bond',
    telephone: '+919720965985',
    priceRange: '₹299 - ₹1200 / day',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '1240',
      reviewCount: '1240'
    },
    review: REVIEWS_DATA.map((r) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.author
      },
      datePublished: r.date,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating.toString(),
        bestRating: '5',
        worstRating: '1'
      },
      reviewBody: r.content
    }))
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      {/* Schema.org AggregateRating & Reviews JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 text-white py-12 px-4 border-b border-teal-900/50">
        <div className="max-w-6xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold px-3.5 py-1.5 rounded-full">
            <VrindavanFeatherIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>1,240+ Verified Pilgrims &amp; Yatris Served</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading">
            Vrindavan Bike Rental Reviews &amp; Experiences
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Real stories, authentic feedback, and travel insights from devotees who explored Bankey Bihari, Prem Mandir, and Govardhan Parikrama with Rent on Cent.
          </p>

          {/* Rating Summary Metric Card */}
          <div className="pt-4 max-w-3xl mx-auto">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="border-r border-slate-800 last:border-0">
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-heading">4.9 / 5</div>
                <div className="flex justify-center text-amber-400 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <div className="text-[11px] text-slate-400">1,240+ Ratings</div>
              </div>

              <div className="border-r border-slate-800 last:border-0">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-heading">100%</div>
                <div className="text-[11px] text-slate-400 mt-2">Verified Two-Wheelers</div>
              </div>

              <div className="border-r border-slate-800 last:border-0">
                <div className="text-2xl sm:text-3xl font-black text-teal-400 font-heading">₹0</div>
                <div className="text-[11px] text-slate-400 mt-2">Deposit Option</div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-amber-300 font-heading">15 Min</div>
                <div className="text-[11px] text-slate-400 mt-2">Doorstep Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Reviews Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              Customer Pilgrimage Reviews &amp; Testimonials
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Read transparent experiences from devotees traveling across Mathura and Vrindavan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/bikes"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <VrindavanScooterIcon className="w-3.5 h-3.5" />
              <span>Book Your Bike from ₹299</span>
            </Link>
          </div>
        </div>

        {/* Reviews Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS_DATA.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{r.author}</h3>
                      {r.verified && (
                        <span className="inline-flex items-center gap-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified Devotee</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{r.city}</span>
                      <span>•</span>
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{r.date}</span>
                    </p>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-xs text-slate-700 flex flex-wrap gap-x-4 gap-y-1">
                  <div>
                    <span className="text-slate-400">Vehicle:</span>{' '}
                    <strong className="text-emerald-700">{r.vehicle}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Route:</span>{' '}
                    <strong className="text-slate-800">{r.trip}</strong>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;{r.content}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-500">
                  <ThumbsUp className="w-3 h-3 text-emerald-600" />
                  <span>{r.helpfulCount} yatris found this helpful</span>
                </span>
                <span className="text-emerald-600 font-medium">Rent on Cent Verified</span>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section for Reviews & Trust */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg sm:text-xl font-bold text-amber-400 font-heading">
              Why Devotees Rate Rent on Cent #1 in Vrindavan
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Read how our peer-to-peer verification and temple-centric service gives pilgrims peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-white text-sm">₹0 Security Deposit</h4>
              <p className="text-slate-400 leading-relaxed">
                No high cash deposits locked up. Simple digital Aadhaar and DL verification before key handover.
              </p>
            </div>

            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-white text-sm">2 Clean ISI Helmets</h4>
              <p className="text-slate-400 leading-relaxed">
                Sanitized helmets for both rider and pillion included with every scooter, plus mobile mount for map navigation.
              </p>
            </div>

            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-white text-sm">Prompt Doorstep Drop</h4>
              <p className="text-slate-400 leading-relaxed">
                Direct handover to your hotel, ashram, Mathura Junction station exit, or Yamuna Expressway cuts.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <a
              href="https://wa.me/919720965985?text=Radhe%20Radhe!%20I%20would%20like%20to%20book%20a%20bike%20or%20leave%20a%20review."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Leave Your Vrindavan Experience on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
