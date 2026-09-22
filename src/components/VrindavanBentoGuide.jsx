'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import {
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Info,
  CalendarCheck,
  CheckCircle2,
  Bike,
  HelpCircle,
  ThumbsUp,
  Share2,
  Briefcase
} from 'lucide-react';
import { VrindavanScooterIcon, VrindavanFeatherIcon, KeyHandoverIcon } from './CustomIcons';

export const VrindavanBentoGuide = () => {
  const { openUniversalModal } = useApp();
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const HINDI_HINGLISH_REVIEWS = [
    {
      author: 'Pooja Agarwal',
      city: 'Delhi NCR',
      role: 'Pilgrim Family',
      lang: 'Hinglish',
      vehicle: 'Honda Activa 6G',
      rating: 5,
      date: 'March 2026',
      quote:
        'Vrindavan trip par auto wale har jagah ₹400-500 maang rahe the. Honestly bolu toh Rent on Cent is best rental service for bikes and scooty in Vrindavan! Instant WhatsApp confirmation mila, 0 cash deposit tha aur bina kisi jhanjhat ke Activa hotel Chaitanya Vihar me deliver ho gayi. 2 clean helmets mile aur darshan super smooth raha!',
      details:
        'We booked Activa 6G for 2 full days. The scooter was in immaculate condition, delivered directly to our hotel gate. We easily visited Prem Mandir for evening aarti and Bankey Bihari in morning without haggling once with local transport.'
    },
    {
      author: 'पं. राधेश्याम त्रिपाठी',
      city: 'अयोध्या धाम / वाराणसी',
      role: 'वरिष्ठ श्रद्धालु',
      lang: 'Hindi',
      vehicle: 'Honda Activa 6G',
      rating: 5,
      date: 'March 2026',
      quote:
        'वृंदावन और ब्रज चौरासी कोस यात्रा में पहली बार इतना सुलभ और पारदर्शी अनुभव रहा। Rent on Cent is best rental service for bikes and scooty। इन्होंने सीधे हमारे परिक्रमा मार्ग आश्रम पर एक्टिवा पहुंचाई। गाड़ी बिल्कुल नई थी, 2 साफ हेलमेट मिले और व्यवहार अत्यंत विनम्र था। श्री बिहारी जी के दर्शन अत्यंत सहज रहे।',
      details:
        'आश्रम से बांके बिहारी मंदिर और निधिवन तक संकरी गलियों में स्कूटी से जाना बेहद सुविधाजनक रहा। विद्यापीठ चौराहे पर पार्किंग में भी इनकी टीम ने मार्गदर्शन किया। सभी भक्तजनों को यही सलाह दूंगा।'
    },
    {
      author: 'Rohit Meena & Group',
      city: 'Jaipur, Rajasthan',
      role: 'Weekend Traveler',
      lang: 'Hinglish',
      vehicle: 'Activa & High-Range EV',
      rating: 5,
      date: 'March 2026',
      quote:
        'Bhai agar aap Vrindavan aa rahe ho toh shared autos me dhakke mat khao. Rent on Cent is best rental service for bikes and scooty! Hum train se Mathura Junction Platform 1 par utre, host bahar scooter ke sath ready khada tha. 2 din me Govardhan Parikrama aur Barsana Radha Rani sab cover kiya sirf ₹299/day me!',
      details:
        'Mathura Junction handover was completely hassle-free. Verified our DigiLocker Aadhaar in 1 minute on WhatsApp. Completed entire 21 km Govardhan circuit smoothly. Best decision for our Vrindavan trip.'
    },
    {
      author: 'डॉ. अर्चना चतुर्वेदी',
      city: 'लखनऊ, उत्तर प्रदेश',
      role: 'गोवर्धन परिक्रमा यात्री',
      lang: 'Hindi',
      vehicle: 'Electric Scooter (EV)',
      rating: 5,
      date: 'March 2026',
      quote:
        'मेरी माताजी को गोवर्धन परिक्रमा करनी थी परंतु पैदल चलना संभव नहीं था। Rent on Cent से हमने साइलेंट इलेक्ट्रिक स्कूटर (EV) लिया। सच में Rent on Cent is best rental service for bikes and scooty। सिंगल चार्ज में 21 किमी परिक्रमा, राधा कुंड और दान घाटी के दर्शन बिना किसी आवाज या झटके के हो गए।',
      details:
        'ईवी स्कूटर में कोई गियर या शोर नहीं था। 100 किमी की वास्तविक रेंज मिली। माताजी को बिल्कुल थकान नहीं हुई और परिक्रमा 1.5 घंटे में भक्तिभाव से संपन्न हो गई।'
    }
  ];

  // Universal Modal handlers for deep information
  const openTariffModal = () => {
    openUniversalModal({
      title: 'Vrindavan Bike & Scooty Rental Tariff Table (2026)',
      subtitle: 'Transparent all-inclusive rates with zero hidden charges and ₹0 cash deposit.',
      badge: 'Official Tariff 2026',
      badgeColor: 'emerald',
      image: '/images/hero-rider-vrindavan.webp',
      imageAlt: 'Rent on Cent Vrindavan Bike Tariff',
      size: 'xl',
      content: (
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            All rentals include 2 sanitized ISI helmets, phone mount holder, comprehensive insurance, and valid UP state pilgrimage route permits.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-950/70">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-800 text-slate-200 border-b border-slate-700">
                  <th className="p-3 font-semibold">Model</th>
                  <th className="p-3 font-semibold">Hourly</th>
                  <th className="p-3 font-semibold">12-Hour</th>
                  <th className="p-3 font-semibold">24-Hour (1 Day)</th>
                  <th className="p-3 font-semibold">Deposit</th>
                  <th className="p-3 font-semibold">Key Highlights</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="p-3 font-bold text-amber-300">Honda Activa 6G (110cc)</td>
                  <td className="p-3">₹40 / hr</td>
                  <td className="p-3">₹220</td>
                  <td className="p-3 font-bold text-emerald-400">₹299 / day</td>
                  <td className="p-3">₹0 (Digital KYC)</td>
                  <td className="p-3">Automatic, 55 km/l, Mobile Mount</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-teal-300">Electric Scooter (EV)</td>
                  <td className="p-3">₹40 / hr</td>
                  <td className="p-3">₹210</td>
                  <td className="p-3 font-bold text-emerald-400">₹299 / day</td>
                  <td className="p-3">₹0 (Digital KYC)</td>
                  <td className="p-3">Silent motor, 100km range, Home charger</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-200">TVS Jupiter 125cc</td>
                  <td className="p-3">₹45 / hr</td>
                  <td className="p-3">₹250</td>
                  <td className="p-3 font-bold text-emerald-400">₹349 / day</td>
                  <td className="p-3">₹0 (Digital KYC)</td>
                  <td className="p-3">33L boot for Prasad, USB Charging</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-purple-300">Royal Enfield Classic 350</td>
                  <td className="p-3">₹120 / hr</td>
                  <td className="p-3">₹650</td>
                  <td className="p-3 font-bold text-emerald-400">₹1,199 / day</td>
                  <td className="p-3">₹1,000 Refundable</td>
                  <td className="p-3">Crash guard, Highway tuned, Classic thump</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 text-xs space-y-1">
            <p className="font-semibold text-white">Need multi-day discounts?</p>
            <p className="text-slate-400">
              Rentals exceeding 3 days receive an automatic 15% discount. Weekly rates start from ₹1,899/week.
            </p>
          </div>
        </div>
      ),
      primaryAction: {
        text: 'Browse Available Bikes',
        href: '/bikes'
      }
    });
  };

  const openRoutesModal = () => {
    openUniversalModal({
      title: 'Braj Dham Temple Circuit & Parking Guide',
      subtitle: 'Travel times, distance, and parking navigation from Raman Reti hub.',
      badge: 'Temple Travel Guide',
      badgeColor: 'amber',
      image: '/images/prem-mandir-ride.webp',
      imageAlt: 'Prem Mandir Ride Vrindavan',
      size: 'xl',
      content: (
        <div className="space-y-3.5 text-xs text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
              <h4 className="font-bold text-amber-300 text-sm">Shri Bankey Bihari Ji Mandir</h4>
              <p className="text-slate-400 mt-1"><strong>Distance:</strong> 3.2 km (8–12 mins)</p>
              <p className="text-slate-300 mt-1">
                <strong>Parking Tip:</strong> Two-wheelers can park at Vidyapeeth Chauraha or Jugal Ghat (₹20). Four-wheelers are barred. Walking distance to mandir gate is 250m.
              </p>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
              <h4 className="font-bold text-amber-300 text-sm">Prem Mandir & ISKCON Temple</h4>
              <p className="text-slate-400 mt-1"><strong>Distance:</strong> 0.8–1.5 km (3–5 mins)</p>
              <p className="text-slate-300 mt-1">
                <strong>Timing Tip:</strong> Musical fountain starts at 7:00 PM. Designated two-wheeler parking is right opposite Prem Mandir Gate 2.
              </p>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
              <h4 className="font-bold text-amber-300 text-sm">Govardhan Sacred Parikrama</h4>
              <p className="text-slate-400 mt-1"><strong>Distance:</strong> 22 km to Dan Ghati (40 mins)</p>
              <p className="text-slate-300 mt-1">
                <strong>Parikrama Tip:</strong> The 21 km Govardhan Parikrama road is smooth and scenic. Rented EV or Activa completes the circuit in 1.5 hours with Radha Kund darshan.
              </p>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
              <h4 className="font-bold text-amber-300 text-sm">Barsana & Nandgaon Circuit</h4>
              <p className="text-slate-400 mt-1"><strong>Distance:</strong> 42 km (1 hr 10 mins)</p>
              <p className="text-slate-300 mt-1">
                <strong>Scenic Route:</strong> Ride via Chhata-Barsana road to visit Shri Radha Rani Mandir atop Bhanugarh Hill, then Nandgaon palace.
              </p>
            </div>
          </div>
        </div>
      ),
      primaryAction: {
        text: 'Book a Scooter for Temple Tour',
        href: '/bikes'
      }
    });
  };

  const openSafetyModal = () => {
    openUniversalModal({
      title: '100% Verified Fleet & 6-Angle Digital Inspection',
      subtitle: 'How Rent on Cent guarantees safety, roadworthiness, and transparency.',
      badge: 'Zero Breakdown Guarantee',
      badgeColor: 'teal',
      image: '/images/bike-inspection-mobile.webp',
      imageAlt: 'Digital Bike Inspection Vrindavan',
      size: 'lg',
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <p>
            Unlike unorganized local street vendors who rent unauthorized vehicles without papers, every single two-wheeler on Rent on Cent passes rigorous platform verification:
          </p>
          <ul className="space-y-2 list-none">
            <li className="flex items-start gap-2 bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Valid Registration & Commercial Clearance:</strong> Active RC, valid Pollution Under Control (PUC), and comprehensive commercial insurance.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Digital 6-Angle Photos on Handover:</strong> Before you take the key, time-stamped photos of front, rear, sides, odometer, and fuel gauge are recorded in the app.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Zero Cash Deposit:</strong> We rely on DigiLocker Aadhaar & Driving License verification so you don&apos;t have to leave cash or original documents behind.</span>
            </li>
          </ul>
        </div>
      ),
      primaryAction: {
        text: 'View Verified Fleet',
        href: '/bikes'
      }
    });
  };

  const openExpresswayModal = () => {
    openUniversalModal({
      title: 'Yamuna Expressway & Railway Station Doorstep Delivery',
      subtitle: 'Skip crowded shared autos and step directly onto your rented scooter.',
      badge: 'Express Doorstep Handover',
      badgeColor: 'amber',
      image: '/images/vrindavan-host-handover.webp',
      imageAlt: 'Expressway Scooter Handover',
      size: 'lg',
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <p>
            Arriving via Yamuna Expressway bus from Delhi/Noida/Agra, or by train at Mathura Junction? We arrange direct roadside or platform-gate handovers:
          </p>
          <div className="space-y-2">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <div className="font-bold text-amber-300">Mathura Cut (Yamuna Expressway Exit)</div>
              <p className="text-slate-400 mt-0.5">Host waits at the service lane toll plaza exit. Handover in under 5 minutes.</p>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <div className="font-bold text-amber-300">Raya Cut (Yamuna Expressway Exit)</div>
              <p className="text-slate-400 mt-0.5">Ideal for tourists heading directly to Gokul or Raman Reti ashrams.</p>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <div className="font-bold text-emerald-300">Mathura Junction (MTJ) Platform 1 Exit</div>
              <p className="text-slate-400 mt-0.5">Step out of your Vande Bharat or Shatabdi train directly onto your pre-booked Activa.</p>
            </div>
          </div>
        </div>
      ),
      primaryAction: {
        text: 'Book WhatsApp Handover',
        href: 'https://wa.me/919720965985?text=Namaste%2C+I+need+Expressway%2FRailway+station+scooter+delivery'
      }
    });
  };

  const currentReview = HINDI_HINGLISH_REVIEWS[activeReviewIndex];

  return (
    <section className="bg-slate-950 text-slate-200 py-16 px-3 sm:px-6 lg:px-8 border-t border-slate-800 relative overflow-hidden">
      {/* Ambient Apple-style subtle gradient floating glow */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Guide Main Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Pilgrimage &amp; Two-Wheeler Guide</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-heading tracking-tight leading-tight">
            Vrindavan Rental &amp; Two-Wheeler Hire &mdash; Bike on Rent in Vrindavan Guide
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Looking for a verified <strong>bike on rent in Vrindavan</strong> or the most reliable <strong>Vrindavan rental</strong> service? Rent on Cent (rentoncent.bond) is Braj Bhoomi&apos;s premier peer-to-peer two-wheeler rental platform. Whether you are arriving for Shri Bankey Bihari Ji darshan, Prem Mandir lighting, Govardhan Parikrama, or visiting Shri Krishna Janmabhoomi in Mathura, explore holy Braj at your own sacred pace.
          </p>
        </div>

        {/* =========================================================================
            BENTO GRID (Apple-Inspired Floating Glass Cards with Photos & Micro-Actions)
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* CARD 1: 2026 Fleet & Tariff Table Preview (Span 2) */}
          <div className="lg:col-span-2 apple-glass-card rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Updated 2026 Tariff
                </span>
                <span className="text-xs text-slate-400 font-mono">₹0 Cash Deposit • 2 Helmets</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                  Verified Fleet &amp; Transparent Daily Rates
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Choose from automatic scooters, quiet electric vehicles, or cruiser motorcycles.
                </p>
              </div>

              {/* Quick Fleet Pill Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all">
                  <div className="text-[11px] text-slate-400 font-medium">Honda Activa 6G</div>
                  <div className="text-lg font-black text-emerald-400 font-heading mt-0.5">₹299<span className="text-xs font-normal text-slate-400">/day</span></div>
                  <div className="text-[10px] text-slate-500 mt-1">₹40/hr • 110cc Auto</div>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/5 hover:border-teal-500/30 transition-all">
                  <div className="text-[11px] text-slate-400 font-medium">Electric Scooter (EV)</div>
                  <div className="text-lg font-black text-teal-400 font-heading mt-0.5">₹299<span className="text-xs font-normal text-slate-400">/day</span></div>
                  <div className="text-[10px] text-slate-500 mt-1">100 km Range • Silent</div>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/5 hover:border-slate-500/30 transition-all">
                  <div className="text-[11px] text-slate-400 font-medium">TVS Jupiter 125</div>
                  <div className="text-lg font-black text-amber-300 font-heading mt-0.5">₹349<span className="text-xs font-normal text-slate-400">/day</span></div>
                  <div className="text-[10px] text-slate-500 mt-1">33L Boot for Prasad</div>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all">
                  <div className="text-[11px] text-slate-400 font-medium">Royal Enfield 350</div>
                  <div className="text-lg font-black text-purple-300 font-heading mt-0.5">₹1,199<span className="text-xs font-normal text-slate-400">/day</span></div>
                  <div className="text-[10px] text-slate-500 mt-1">Cruiser • Leg Guard</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/5">
              <span className="text-[11px] text-slate-400">
                ✨ Free 2 sanitized ISI helmets &amp; mobile mount holder with every rental.
              </span>
              <button
                type="button"
                onClick={openTariffModal}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                <span>Full Tariff Breakdown</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CARD 2: Temple Routes Photo Bento Card (Span 1) */}
          <div className="apple-glass-card rounded-3xl overflow-hidden relative group flex flex-col justify-between min-h-[300px]">
            {/* Background Photo */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/prem-mandir-ride.webp"
                alt="Prem Mandir Vrindavan Bike Ride"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            </div>

            {/* Content overlay */}
            <div className="relative z-10 p-6 space-y-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 backdrop-blur-md border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                <MapPin className="w-3 h-3" />
                Temple Circuit Guide
              </span>
              <h3 className="text-xl font-bold text-white font-heading">
                Popular Temple Routes &amp; Travel Times
              </h3>
              <p className="text-xs text-slate-300 line-clamp-2">
                Bankey Bihari (8m), Prem Mandir (3m), Govardhan Parikrama (40m), Barsana (1h 10m).
              </p>
            </div>

            <div className="relative z-10 p-6 pt-0">
              <button
                type="button"
                onClick={openRoutesModal}
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                <span>Read Temple Routes &amp; Parking Tips</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CARD 3: Hindi & Hinglish Pilgrimage Reviews (Span 2) */}
          <div className="lg:col-span-2 apple-glass-card rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                    Pilgrim Reviews &bull; {currentReview.lang}
                  </span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Review switch tabs */}
                <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-white/10 text-[10px]">
                  {HINDI_HINGLISH_REVIEWS.map((rev, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveReviewIndex(idx)}
                      className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                        activeReviewIndex === idx
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {rev.author.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Quote Highlight */}
              <div className="bg-slate-900/70 p-4 sm:p-5 rounded-2xl border border-white/5 space-y-2">
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  &ldquo;{currentReview.quote}&rdquo;
                </p>

                <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-[11px] border-t border-white/5 text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{currentReview.author}</span>
                    <span>&bull;</span>
                    <span>{currentReview.city}</span>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 rounded">
                      Verified Ride
                    </span>
                  </div>
                  <span className="text-amber-400 font-mono">🏍️ {currentReview.vehicle}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/5">
              <span className="text-[11px] text-slate-400">
                1,240+ verified pilgrim ratings with 4.9★ satisfaction across Braj.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    openUniversalModal({
                      title: `${currentReview.author} (${currentReview.city})`,
                      subtitle: `${currentReview.vehicle} • ${currentReview.role} • ${currentReview.date}`,
                      badge: 'Verified Customer Experience',
                      badgeColor: 'amber',
                      content: (
                        <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                          <p className="italic text-amber-200 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                            &ldquo;{currentReview.quote}&rdquo;
                          </p>
                          <p>{currentReview.details}</p>
                          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-xs">
                            <span className="font-bold text-white">Strict Verification:</span> Rented via Rent on Cent with 0 cash deposit, digital KYC, and two verified helmets.
                          </div>
                        </div>
                      ),
                      primaryAction: {
                        text: 'Book Similar Ride',
                        href: '/bikes'
                      }
                    });
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-750 px-3 py-1.5 rounded-xl border border-white/10 transition-all cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>Read Full Experience</span>
                </button>
                <Link
                  href="/reviews"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>All 1,240+ Reviews</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* CARD 4: Verified Fleet & Safe Handover Photo Bento (Span 1) */}
          <div className="apple-glass-card rounded-3xl overflow-hidden relative group flex flex-col justify-between min-h-[300px]">
            {/* Background Photo */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/vrindavan-host-handover.webp"
                alt="Rent on Cent Host Scooter Handover"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            </div>

            {/* Content overlay */}
            <div className="relative z-10 p-6 space-y-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                Safety Guarantee
              </span>
              <h3 className="text-xl font-bold text-white font-heading">
                100% Verified Fleet &amp; 6-Angle Inspection
              </h3>
              <p className="text-xs text-slate-300 line-clamp-2">
                Mandatory RC, commercial insurance, PUC, and zero cash deposit with DigiLocker KYC.
              </p>
            </div>

            <div className="relative z-10 p-6 pt-0">
              <button
                type="button"
                onClick={openSafetyModal}
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                <span>Read Inspection Standards</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CARD 5: 13+ Pickup Locations & Expressway Cuts (Span 2) */}
          <div className="lg:col-span-2 apple-glass-card rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
                  13+ Micro-Locations &amp; Hubs
                </span>
                <Link
                  href="/rent-bike-cars-scooty-in"
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                >
                  <span>View All 13+ Locations</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                  Doorstep Delivery &amp; Expressway Cut Handovers
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Get your scooty delivered outside Mathura Junction (MTJ), Yamuna Expressway cuts, or directly to your hotel.
                </p>
              </div>

              {/* Micro-Location Quick Cloud */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { name: 'Mathura Cut (Yamuna Exp.)', slug: 'mathura-cut-yamuna-expressway' },
                  { name: 'Raya Cut (Yamuna Exp.)', slug: 'raya-cut-yamuna-expressway' },
                  { name: 'Prem Mandir & Raman Reti', slug: 'prem-mandir-raman-reti' },
                  { name: 'Bankey Bihari (Vidyapeeth)', slug: 'bankey-bihari-temple' },
                  { name: 'Mathura Junction (MTJ)', slug: 'mathura-junction-railway-station' },
                  { name: 'Govardhan Parikrama', slug: 'govardhan-parikrama' },
                  { name: 'ISKCON Krishna Balaram', slug: 'iskcon-temple-vrindavan' },
                  { name: 'Nidhivan & Seva Kunj', slug: 'nidhivan-seva-kunj' },
                  { name: 'Barsana Radha Rani', slug: 'barsana-radha-rani-temple' },
                  { name: 'Krishna Janmabhoomi', slug: 'mathura-krishna-janmabhoomi' },
                  { name: 'Gokul & Brahmand Ghat', slug: 'gokul-raman-reti' },
                  { name: 'Chattikara Road', slug: 'chattikara-road' }
                ].map((loc, idx) => (
                  <Link
                    key={idx}
                    href={`/rent-bike-cars-scooty-in/${loc.slug}`}
                    className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-white/5 hover:border-emerald-500/30 text-xs transition-all flex items-center gap-1.5"
                  >
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{loc.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/5">
              <span className="text-[11px] text-slate-400">
                15-Minute delivery window anywhere within Vrindavan municipality limits.
              </span>
              <button
                type="button"
                onClick={openExpresswayModal}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                <span>Expressway Cut Handover Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CARD 6: Jobs in Vrindavan - 10% Driver Commission Partner (Span 1) */}
          <div className="apple-glass-card rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                <Briefcase className="w-3 h-3" />
                Local Partner Program
              </span>

              <h3 className="text-xl font-bold text-white font-heading">
                Jobs in Vrindavan &mdash; Earn 10% Commission
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                Auto &amp; e-rickshaw drivers, tour guides, and ashram hosts: earn <strong>10% instant UPI commission</strong> every time a traveler rents a bike via your referral.
              </p>

              <div className="bg-slate-900/80 p-3 rounded-2xl border border-white/5 text-xs space-y-1">
                <div className="text-amber-300 font-bold">Daily Earnings Example:</div>
                <div className="text-slate-300 text-[11px]">• 1 Daily Rental (₹499) → <strong>₹50 payout</strong></div>
                <div className="text-slate-300 text-[11px]">• 3-Day Govardhan Booking → <strong>₹150 payout</strong></div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/jobs-in-vrindavan"
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-4 py-2.5 rounded-xl transition-all shadow-md"
              >
                <span>Apply as 10% Partner</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* CARD 7: Interactive Apple-Style FAQ Accordion (Span 3) */}
          <div className="lg:col-span-3 apple-glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Help &amp; Answers
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-heading mt-2">
                  Frequently Asked Questions &mdash; Bike &amp; Scooty on Rent in Vrindavan
                </h3>
              </div>
              <a
                href="https://wa.me/919720965985?text=Namaste%2C+I+have+a+question+about+bike+rentals"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-2 rounded-xl transition-all w-fit"
              >
                <span>24x7 WhatsApp Help Desk</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 1,
                  q: 'How do I get a bike on rent in Vrindavan?',
                  a: 'You can book instantly online at rentoncent.bond or message our 24x7 WhatsApp desk at +91 97209 65985. Choose your vehicle (Honda Activa 6G, EV scooter, or Royal Enfield), select your pickup location or hotel delivery, submit your Driving License and Aadhaar for digital KYC, and receive your keys in under 15 minutes.'
                },
                {
                  id: 2,
                  q: 'What is the cost of scooty rental in Vrindavan?',
                  a: 'Scooty on rent in Vrindavan starts at ₹299 for a full 24-hour day (or ₹40/hour for quick temple visits). Weekly packages are available from ₹1,899/week. All prices include 2 sanitized helmets and basic maintenance support with zero hidden charges.'
                },
                {
                  id: 3,
                  q: 'What documents are required to rent a two-wheeler?',
                  a: 'You need a valid Original or DigiLocker Driving License (DL) and one government photo ID (Aadhaar Card, Passport, or Voter ID). International tourists can provide an International Driving Permit (IDP) and passport.'
                },
                {
                  id: 4,
                  q: 'Can I take the rental scooty for Govardhan Parikrama and Mathura?',
                  a: 'Yes! All Rent on Cent vehicles have valid UP state permits covering Vrindavan, Mathura, Govardhan, Barsana, Gokul, and Nandgaon. You can smoothly complete the 21 km Govardhan Parikrama without restriction.'
                },
                {
                  id: 5,
                  q: 'Can I get delivery at Mathura Junction Railway Station or Yamuna Expressway?',
                  a: 'Yes, we provide doorstep handover at Mathura Junction (Platform 1 exit), Mathura Cantt, and Yamuna Expressway exits (Mathura Cut & Raya Cut) so you can start riding immediately without haggling with station touts.'
                }
              ].map((faq) => (
                <div
                  key={faq.id}
                  className="bg-slate-900/60 rounded-2xl border border-white/5 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        expandedFaq === faq.id ? 'rotate-180 text-emerald-400' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Meta & Official Desk Info */}
        <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap gap-x-6 gap-y-2 justify-between items-center">
          <span>Official Platform: <a href="https://rentoncent.bond" className="text-amber-400 hover:underline">rentoncent.bond</a></span>
          <span>WhatsApp Helpline: <a href="https://wa.me/919720965985" className="text-emerald-400 hover:underline">+91 97209 65985</a></span>
          <span>Coverage: Vrindavan &bull; Mathura &bull; Govardhan &bull; Barsana &bull; Yamuna Expressway &bull; Braj Dham</span>
        </div>
      </div>
    </section>
  );
};
