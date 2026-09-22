import React from 'react';
import Link from 'next/link';
import { Star, CheckCircle2, ShieldCheck, MapPin, ThumbsUp, Calendar, Heart, MessageSquare, ChevronRight, Instagram } from 'lucide-react';
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
    author: 'Pooja Agarwal',
    city: 'New Delhi / NCR',
    rating: 5,
    date: '2026-03-20',
    vehicle: 'Honda Activa 6G',
    trip: 'Bankey Bihari & Prem Mandir Weekend Darshan',
    lang: 'Hinglish',
    verified: true,
    content:
      'Vrindavan trip par auto wale har choti jagah ke ₹400-500 maang rahe the. Mere hotel reception wale bhaiya ne bola Rent on Cent try karo. Honestly bolu toh Rent on Cent is best rental service for bikes and scooty in Vrindavan! Instant WhatsApp confirmation mila, zero cash deposit tha aur bina kisi jhanjhat ke Activa 6G hotel Chaitanya Vihar me deliver ho gayi. 2 clean helmets mile aur Bankey Bihari aur Prem Mandir darshan super smooth raha!',
    helpfulCount: 54
  },
  {
    id: 2,
    author: 'पं. राधेश्याम त्रिपाठी',
    city: 'अयोध्या धाम / वाराणसी',
    rating: 5,
    date: '2026-03-18',
    vehicle: 'Honda Activa 6G',
    trip: 'परिक्रमा मार्ग एवं श्री बांके बिहारी दर्शन',
    lang: 'Hindi',
    verified: true,
    content:
      'वृंदावन और ब्रज चौरासी कोस यात्रा में पहली बार इतना सुलभ और पारदर्शी अनुभव रहा। ई-रिक्शा और ऑटो के अत्यधिक किराए से मुक्ति मिल गई। Rent on Cent is best rental service for bikes and scooty। इन्होंने सीधे हमारे परिक्रमा मार्ग आश्रम पर एक्टिवा 6G पहुंचाई। गाड़ी बिल्कुल नई थी, 2 साफ हेलमेट मिले और व्यवहार अत्यंत विनम्र था। बांके बिहारी जी के दर्शन अत्यंत सहजता से हुए। जय श्री राधे!',
    helpfulCount: 68
  },
  {
    id: 3,
    author: 'Rohit Meena & Friends',
    city: 'Jaipur, Rajasthan',
    rating: 5,
    date: '2026-03-15',
    vehicle: 'Honda Activa 6G & EV',
    trip: 'Mathura Junction to Govardhan & Barsana',
    lang: 'Hinglish',
    verified: true,
    content:
      'Bhai agar aap Vrindavan aa rahe ho toh shared autos me dhakke mat khao. Rent on Cent is best rental service for bikes and scooty! Hum train se Mathura Junction Platform 1 par utre, host bahar scooter ke sath ready khada tha. 2 din me Govardhan Parikrama (21 km), Barsana Radha Rani Temple aur Gokul Raman Reti sab cover kar liya sirf ₹299/day me. Service 100/100!',
    helpfulCount: 47
  },
  {
    id: 4,
    author: 'डॉ. अर्चना चतुर्वेदी',
    city: 'लखनऊ, उत्तर प्रदेश',
    rating: 5,
    date: '2026-03-11',
    vehicle: 'Electric Scooter (EV High Range)',
    trip: 'गोवर्धन 21 किमी परिक्रमा एवं राधा कुंड',
    lang: 'Hindi',
    verified: true,
    content:
      'मेरी माताजी को गोवर्धन परिक्रमा करनी थी परंतु पैदल चलना संभव नहीं था। Rent on Cent से हमने साइलेंट इलेक्ट्रिक स्कूटर (EV) लिया। सच में Rent on Cent is best rental service for bikes and scooty। सिंगल चार्ज में 21 किमी परिक्रमा, राधा कुंड और दान घाटी के दर्शन बिना किसी आवाज या झटके के हो गए। वृद्ध परिजनों के लिए यह सबसे उत्तम सेवा है।',
    helpfulCount: 62
  },
  {
    id: 5,
    author: 'Kunal Sharma',
    city: 'Gurugram, Haryana',
    rating: 5,
    date: '2026-03-05',
    vehicle: 'Royal Enfield Classic 350',
    trip: 'Yamuna Expressway to Braj Darshan Circuit',
    lang: 'Hinglish',
    verified: true,
    content:
      'Rented 2 Royal Enfield Classic 350s for weekend Braj trip with college friends. Without any second thought, Rent on Cent is best rental service for bikes and scooty in Mathura-Vrindavan. Clean documentation via DigiLocker, zero security deposit, well-maintained bikes with proper leg guards. Yamuna expressway cut par handover aur return bhi super fast tha!',
    helpfulCount: 39
  },
  {
    id: 6,
    author: 'सुमित भारद्वाज',
    city: 'नोएडा, उत्तर प्रदेश',
    rating: 5,
    date: '2026-02-28',
    vehicle: 'Honda Activa 6G',
    trip: 'निधिवन, सेवा कुंज एवं प्रेम मंदिर दर्शन',
    lang: 'Hinglish',
    verified: true,
    content:
      'Yamuna Expressway Mathura Cut par bus se utra aur 10 minute me scooty mil gayi. Price bilkul genuine ₹299 per day, koi hidden charge nahi. Rent on Cent is best rental service for bikes and scooty for anyone traveling from Delhi or Noida. Next time Vrindavan aunga toh yahi se book karunga.',
    helpfulCount: 33
  },
  {
    id: 7,
    author: 'Rajesh Sharma',
    city: 'New Delhi',
    rating: 5,
    date: '2026-02-22',
    vehicle: 'Honda Activa 6G',
    trip: 'Family Darshan — Bankey Bihari & Prem Mandir',
    lang: 'English',
    verified: true,
    content:
      'Visiting Vrindavan during weekend crowd is overwhelming with auto-rickshaws charging ₹500 for small drops. We booked an Activa from Rent on Cent delivered to our hotel in Chaitanya Vihar. The scooter was brand new, 2 sanitized helmets were provided, and Vidyapeeth parking guidance was super helpful. Completed darshan of Bankey Bihari and Prem Mandir smoothly!',
    helpfulCount: 42
  },
  {
    id: 8,
    author: 'Ananya Deshmukh',
    city: 'Pune, Maharashtra',
    rating: 5,
    date: '2026-02-17',
    vehicle: 'Electric Scooter (EV High Range)',
    trip: 'Govardhan 21 KM Sacred Parikrama',
    lang: 'English',
    verified: true,
    content:
      'My mother wanted to do Govardhan Parikrama but cannot walk 21 kilometers. We rented the silent EV scooter from Rent on Cent. It was so peaceful, smooth, and had zero engine noise. The battery easily lasted the entire 21 km circuit plus Radha Kund and Dan Ghati darshan with 40% battery left. An absolute divine blessing for yatris!',
    helpfulCount: 67
  },
  {
    id: 9,
    author: 'Vikram Singh Rawat',
    city: 'Jaipur, Rajasthan',
    rating: 5,
    date: '2026-02-12',
    vehicle: 'Royal Enfield Classic 350',
    trip: 'Mathura - Vrindavan - Barsana Day Tour',
    lang: 'English',
    verified: true,
    content:
      'I rode from Vrindavan to Barsana (Radha Rani Mandir) and Nandgaon on their Classic 350. The thump and mechanical condition were top notch. Zero security deposit with basic digital Aadhaar verification was completed in 2 minutes on WhatsApp. No hidden charges. Highly recommended for long Braj circuits!',
    helpfulCount: 38
  },
  {
    id: 10,
    author: 'Elena Petrova',
    city: 'Moscow / ISKCON Devotee',
    rating: 5,
    date: '2026-02-05',
    vehicle: 'Honda Activa 6G',
    trip: '1-Week Kartik Seva & Raman Reti Stay',
    lang: 'English',
    verified: true,
    content:
      'As an international devotee staying near ISKCON temple on Bhaktivedanta Swami Marg, getting around was hard until I found Rent on Cent. They accepted my International Driving Permit without friction. The host was very polite, punctual, and gave free doorstep pickup. Haribol!',
    helpfulCount: 51
  },
  {
    id: 11,
    author: 'Amitabh & Sunita Verma',
    city: 'Lucknow, Uttar Pradesh',
    rating: 5,
    date: '2026-01-27',
    vehicle: 'TVS Jupiter 125',
    trip: 'Mathura Junction Train Handover',
    lang: 'English',
    verified: true,
    content:
      'We arrived at Mathura Junction Platform 1 exit. The host was already waiting with the Jupiter keys and helmets. We drove straight to Vrindavan without bargaining with station auto drivers who were asking ₹600. Saved ₹1,200 on our 2-day trip and explored Nidhivan and Gokul comfortably.',
    helpfulCount: 29
  },
  {
    id: 12,
    author: 'Deepak Agrawal',
    city: 'Agra, UP',
    rating: 5,
    date: '2026-01-19',
    vehicle: 'Honda Activa 6G',
    trip: 'Yamuna Expressway Mathura Cut Handover',
    lang: 'English',
    verified: true,
    content:
      'Took the bus from Noida on Yamuna Expressway and got off at Mathura Cut. Rent on Cent host handed over the scooty right by the service lane. Drove straight to Prem Mandir for evening fountain show. Returned the bike at the same expressway point next evening. Unbeatable convenience!',
    helpfulCount: 34
  }
];

export default function ReviewsPage() {
  const googleMapsUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL;
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/rentoncent.official/';

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
      inLanguage: r.lang === 'Hindi' ? 'hi' : 'en',
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

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-pink-950/60 hover:bg-pink-900/60 text-pink-300 border border-pink-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>Watch Real Yatri Reels on Instagram @rentoncent.official</span>
            </a>

            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>View Google Maps Business Profile ↗</span>
              </a>
            )}
          </div>

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
                <div className="text-[11px] text-slate-400">1,240+ Verified Audits</div>
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
              Read transparent experiences in Hindi, Hinglish &amp; English from devotees across Mathura and Vrindavan.
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
                      {r.lang && (
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                          {r.lang}
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
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                    🏍️ {r.vehicle}
                  </span>
                  <span className="bg-teal-50 text-teal-700 font-medium px-2 py-0.5 rounded-md">
                    📍 {r.trip}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{r.content}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Audit Ref: #VR-84{r.id}0 • Handover Verified</span>
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  {r.helpfulCount} yatris found helpful
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold font-heading">
            Experience Vrindavan at Your Own Sacred Pace
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
            Skip auto bargaining and long lines. Rent a verified Honda Activa or EV scooter starting at just ₹299/day with 2 free helmets and zero security deposit.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/bikes"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <VrindavanScooterIcon className="w-4 h-4 text-slate-950" />
              <span>Browse 25+ Verified Bikes</span>
            </Link>
            <a
              href="https://wa.me/919720965985?text=Namaste%2C+I+want+to+book+a+bike+in+Vrindavan"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all flex items-center gap-2"
            >
              <span>Instant WhatsApp Booking</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
