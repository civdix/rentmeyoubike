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
  Briefcase,
  Zap,
  Phone,
  Camera,
  Compass,
  Key,
  ExternalLink
} from 'lucide-react';
import { VrindavanScooterIcon, VrindavanFeatherIcon, WhatsAppBrandIcon } from './CustomIcons';

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
        <div className="space-y-4 text-slate-200">
          <p className="text-xs text-slate-300">
            All rentals include 2 sanitized ISI helmets, phone mount holder, comprehensive insurance, and valid UP state pilgrimage route permits.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-950/70">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/90 text-slate-200 border-b border-slate-700 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3">Vehicle Model</th>
                  <th className="p-3">Hourly Rate</th>
                  <th className="p-3">24-Hr Daily Rate</th>
                  <th className="p-3">Weekly Package</th>
                  <th className="p-3">Deposit &amp; Inclusions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">Honda Activa 6G / 5G (110cc)</td>
                  <td className="p-3 text-emerald-400 font-mono font-bold">₹40 / hr</td>
                  <td className="p-3 text-emerald-400 font-mono font-bold">₹299 / day</td>
                  <td className="p-3 font-mono">₹1,899 / wk</td>
                  <td className="p-3 text-[11px]">₹0 Cash Deposit • 2 Helmets</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">Electric Scooter EV (100km Range)</td>
                  <td className="p-3 text-teal-400 font-mono font-bold">₹40 / hr</td>
                  <td className="p-3 text-teal-400 font-mono font-bold">₹299 / day</td>
                  <td className="p-3 font-mono">₹1,899 / wk</td>
                  <td className="p-3 text-[11px]">Free Home/Hotel Charger</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">TVS Jupiter / Hero Destini (125cc)</td>
                  <td className="p-3 text-amber-300 font-mono font-bold">₹45 / hr</td>
                  <td className="p-3 text-amber-300 font-mono font-bold">₹349 / day</td>
                  <td className="p-3 font-mono">₹2,199 / wk</td>
                  <td className="p-3 text-[11px]">33L Extra Boot Space</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">Royal Enfield Classic / Hunter 350</td>
                  <td className="p-3 text-purple-300 font-mono font-bold">₹150 / hr</td>
                  <td className="p-3 text-purple-300 font-mono font-bold">₹1,199 / day</td>
                  <td className="p-3 font-mono">₹7,499 / wk</td>
                  <td className="p-3 text-[11px]">Leg Guard • Highway Permit</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80 text-xs text-slate-300 space-y-1">
            <div className="font-bold text-white">Document Requirements:</div>
            <p>Original or DigiLocker Driving Licence + Aadhaar / Passport. 100% digital verification completed in under 2 minutes.</p>
          </div>
        </div>
      ),
      primaryAction: {
        text: 'Browse Verified Fleet',
        href: '/bikes'
      }
    });
  };

  const openRoutesModal = () => {
    openUniversalModal({
      title: 'Popular Vrindavan Temple Circuits & Transit Times',
      subtitle: 'Smart routes, travel durations, and hassle-free scooter parking tips.',
      badge: 'Temple Travel Guide',
      badgeColor: 'amber',
      image: '/images/prem-mandir-ride.webp',
      imageAlt: 'Prem Mandir Vrindavan Temple Route',
      size: 'lg',
      content: (
        <div className="space-y-4 text-xs text-slate-300">
          <p>
            Vrindavan municipality restricts 4-wheelers and large cabs inside inner parikrama corridors. Rented scooters have 100% unrestricted access to all major temples:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <div className="font-bold text-amber-300 text-sm">Shri Bankey Bihari Ji</div>
              <div className="text-[11px] text-slate-400 mt-0.5">8 Mins • 2.1 km from Raman Reti</div>
              <p className="mt-1.5 text-slate-300">Park easily at Vidyapeeth Chauraha or Harinikunj parking and take a 2-minute stroll to VIP or Gate 2/3.</p>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <div className="font-bold text-amber-300 text-sm">Prem Mandir &amp; ISKCON</div>
              <div className="text-[11px] text-slate-400 mt-0.5">3 Mins • 800m on Raman Reti Marg</div>
              <p className="mt-1.5 text-slate-300">Wide 4-lane avenue with dedicated municipal scooter parking bays. Ideal for evening lighting fountain.</p>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <div className="font-bold text-teal-300 text-sm">Govardhan 21 km Parikrama</div>
              <div className="text-[11px] text-slate-400 mt-0.5">35 Mins • 23 km via NH-509</div>
              <p className="mt-1.5 text-slate-300">Smooth tarred roads. Complete Dan Ghati, Radha Kund, and Mansi Ganga at your own peaceful spiritual pace.</p>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <div className="font-bold text-teal-300 text-sm">Barsana Shri Radha Rani</div>
              <div className="text-[11px] text-slate-400 mt-0.5">1 Hr 10 Mins • 42 km via Chhata</div>
              <p className="mt-1.5 text-slate-300">Scenic rural Braj highway. Scooters park right at the foot of Bhanugarh hill for ropeway / staircase.</p>
            </div>
          </div>
        </div>
      ),
      primaryAction: {
        text: 'View Pickup Locations',
        href: '/rent-bike-cars-scooty-in'
      }
    });
  };

  const openSafetyModal = () => {
    openUniversalModal({
      title: 'Digital Vehicle Inspection & Safety Standards',
      subtitle: 'Timestamped 6-angle mobile photo audit protecting both rider and bike host.',
      badge: 'Safety First',
      badgeColor: 'teal',
      image: '/images/bike-inspection-mobile.webp',
      imageAlt: 'Rent on Cent Bike Inspection Report',
      size: 'lg',
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <p>
            Every vehicle on Rent on Cent undergoes a strict 4-tier verification and digital inspection protocol:
          </p>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2 bg-slate-800/70 p-3 rounded-xl border border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">6-Angle Mobile Photo Audit:</strong> Front, rear, left, right, dashboard, and tyre photos are captured and time-stamped on WhatsApp so you are never held liable for pre-existing scratches.
              </div>
            </li>
            <li className="flex items-start gap-2 bg-slate-800/70 p-3 rounded-xl border border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Sanitized ISI Helmets &amp; Mount:</strong> 2 clean, sanitized ISI helmets are provided free with every ride, along with a secure smartphone handlebar holder for GPS navigation.
              </div>
            </li>
            <li className="flex items-start gap-2 bg-slate-800/70 p-3 rounded-xl border border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Verified UP-85 Registration &amp; Commercial Insurance:</strong> Valid RC, active insurance, and pollution certificates are checked and approved by admin before any bike goes live.
              </div>
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
    <section className="bg-gradient-to-b from-slate-100 via-[#f8fafc] to-amber-50/30 text-slate-900 py-20 px-3 sm:px-6 lg:px-8 border-t border-slate-200 relative overflow-hidden">
      {/* Ambient Apple-style subtle radiant blooms */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-amber-500/12 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/2 left-10 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Guide Main Header */}
        <div className="max-w-4xl mx-auto text-center space-y-3.5">
          <div className="inline-flex items-center gap-2 bg-emerald-100/90 border border-emerald-300/90 text-emerald-800 text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-2xs backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Braj Pilgrimage &amp; Two-Wheeler Mobility Guide (2026)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-heading tracking-tight leading-tight">
            Vrindavan Rental &amp; Two-Wheeler Hire &mdash; Bike on Rent in Vrindavan Guide
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Looking for a verified <strong>bike on rent in Vrindavan</strong> or the most reliable <strong>Vrindavan rental</strong> service? Rent on Cent (<a href="https://rentoncent.bond" className="text-emerald-700 font-bold underline">rentoncent.bond</a>) connects yatris directly with verified local two-wheeler hosts. Glide through heritage temple galis, bypass heavy traffic, and explore Bankey Bihari, Prem Mandir, and Govardhan at your own divine rhythm.
          </p>
        </div>

        {/* =========================================================================
            BENTO GRID (Apple-Inspired Luminous Glass Cards with Photos & Micro-Actions)
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* CARD 1: 2026 Fleet & Tariff Table Preview (Span 2) */}
          <div className="lg:col-span-2 apple-glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  Official 2026 Fleet &amp; Tariff
                </span>
                <span className="text-xs font-bold text-slate-600 font-mono bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                  ₹0 Cash Deposit • 2 Helmets Free
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                  Verified Fleet &amp; Transparent Daily Rates
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Choose from gearless scooters, quiet long-range EVs, or classic cruiser motorcycles.
                </p>
              </div>

              {/* Quick Fleet Pill Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-emerald-50/60 hover:bg-emerald-50/90 p-4 rounded-2xl border border-emerald-200/90 hover:border-emerald-400 transition-all shadow-2xs group">
                  <div className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider">Honda Activa 6G</div>
                  <div className="text-2xl font-black text-emerald-700 font-heading mt-1">₹299<span className="text-xs font-normal text-slate-600">/day</span></div>
                  <div className="text-[10px] text-slate-600 mt-1.5 font-medium">₹40/hr • 110cc Auto</div>
                </div>

                <div className="bg-teal-50/60 hover:bg-teal-50/90 p-4 rounded-2xl border border-teal-200/90 hover:border-teal-400 transition-all shadow-2xs group">
                  <div className="text-[11px] text-teal-800 font-bold uppercase tracking-wider">Electric Scooter (EV)</div>
                  <div className="text-2xl font-black text-teal-700 font-heading mt-1">₹299<span className="text-xs font-normal text-slate-600">/day</span></div>
                  <div className="text-[10px] text-slate-600 mt-1.5 font-medium">100 km Range • Silent</div>
                </div>

                <div className="bg-amber-50/60 hover:bg-amber-50/90 p-4 rounded-2xl border border-amber-200/90 hover:border-amber-400 transition-all shadow-2xs group">
                  <div className="text-[11px] text-amber-900 font-bold uppercase tracking-wider">TVS Jupiter 125</div>
                  <div className="text-2xl font-black text-amber-800 font-heading mt-1">₹349<span className="text-xs font-normal text-slate-600">/day</span></div>
                  <div className="text-[10px] text-slate-600 mt-1.5 font-medium">33L Boot for Prasad</div>
                </div>

                <div className="bg-purple-50/60 hover:bg-purple-50/90 p-4 rounded-2xl border border-purple-200/90 hover:border-purple-400 transition-all shadow-2xs group">
                  <div className="text-[11px] text-purple-900 font-bold uppercase tracking-wider">Royal Enfield 350</div>
                  <div className="text-2xl font-black text-purple-800 font-heading mt-1">₹1,199<span className="text-xs font-normal text-slate-600">/day</span></div>
                  <div className="text-[10px] text-slate-600 mt-1.5 font-medium">Cruiser • Parikrama</div>
                </div>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
              <span className="text-xs text-slate-600 font-medium">
                ✨ Free 2 sanitized ISI helmets, phone mount holder &amp; 24x7 roadside assist included.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openTariffModal}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <span>Full Tariff Breakdown</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <Link
                  href="/bikes"
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-300 transition-all"
                >
                  <span>Browse Fleet</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* CARD 2: Temple Routes Photo Bento Card (Span 1) */}
          <div className="apple-glass-photo-card group min-h-[340px] flex flex-col justify-between">
            {/* Background Photo */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/prem-mandir-ride.webp"
                alt="Prem Mandir Vrindavan Bike Ride"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-900/20" />
            </div>

            {/* Content overlay */}
            <div className="relative z-10 p-6 space-y-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full shadow-md">
                <MapPin className="w-3 h-3" />
                Temple Circuit Guide
              </span>
              <h3 className="text-xl font-black text-white font-heading leading-snug">
                Popular Temple Routes &amp; Travel Times
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bankey Bihari (8m), Prem Mandir (3m), Govardhan Parikrama (35m), Barsana (1h).
              </p>
            </div>

            <div className="relative z-10 p-6 pt-0">
              <button
                type="button"
                onClick={openRoutesModal}
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 px-4 py-2.5 rounded-xl transition-all shadow-lg cursor-pointer active:scale-98"
              >
                <span>Read Routes &amp; Parking Tips</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CARD 3: Hindi & Hinglish Pilgrimage Reviews (Span 2) */}
          <div className="lg:col-span-2 apple-glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                    Pilgrim Reviews &bull; {currentReview.lang}
                  </span>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-700">4.9 / 5 (1,240+ Yatris)</span>
                </div>

                {/* Review switch tabs */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                  {HINDI_HINGLISH_REVIEWS.map((rev, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveReviewIndex(idx)}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer text-xs ${
                        activeReviewIndex === idx
                          ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {rev.author.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Quote Highlight */}
              <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30 p-5 rounded-2xl border border-amber-200/90 shadow-2xs space-y-2.5">
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium italic">
                  &ldquo;{currentReview.quote}&rdquo;
                </p>

                <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-xs border-t border-amber-200/60 text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{currentReview.author}</span>
                    <span>&bull;</span>
                    <span>{currentReview.city}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      Verified Yatri
                    </span>
                  </div>
                  <span className="text-amber-800 font-bold font-mono">🏍️ {currentReview.vehicle}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
              <span className="text-xs text-slate-600 font-medium">
                1,240+ verified pilgrim ratings with 4.9★ satisfaction across Braj Bhoomi.
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
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-300 transition-all cursor-pointer shadow-2xs"
                >
                  <Info className="w-3.5 h-3.5 text-amber-600" />
                  <span>Read Full Experience</span>
                </button>
                <Link
                  href="/reviews"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors"
                >
                  <span>All 1,240+ Reviews</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* CARD 4: Expressway & Railway Station Doorstep Handover (Span 1) */}
          <div className="apple-glass-card rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-sky-900 bg-sky-100 border border-sky-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                <Clock className="w-3 h-3 text-sky-600" />
                Instant Handover Hubs
              </span>

              <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                Expressway &amp; Railway Handover
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                Skip crowded auto haggling. Step off your Delhi/Agra bus or train directly onto your pre-booked scooter.
              </p>

              <div className="space-y-2 pt-1">
                <div className="bg-sky-50/70 p-2.5 rounded-xl border border-sky-200/80 text-xs">
                  <div className="font-bold text-sky-950 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-sky-600" />
                    <span>Mathura Cut (Yamuna Exp.)</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">Toll plaza exit handover in 5 mins.</p>
                </div>

                <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/80 text-xs">
                  <div className="font-bold text-emerald-950 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mathura Junction (MTJ)</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">Platform 1 gate handover as train arrives.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={openExpresswayModal}
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <span>Expressway Cut Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <a
                href="https://wa.me/919720965985?text=Namaste%2C+I+need+scooter+handover+at+Yamuna+Expressway+or+Mathura+Junction"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] px-3.5 py-2 rounded-xl transition-all shadow-xs"
              >
                <WhatsAppBrandIcon className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp Booking</span>
              </a>
            </div>
          </div>

          {/* CARD 5: 13+ Pickup Locations & Expressway Cuts (Span 2) */}
          <div className="lg:col-span-2 apple-glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-900 bg-teal-100 border border-teal-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                  13+ Micro-Locations &amp; Doorstep Hubs
                </span>
                <Link
                  href="/rent-bike-cars-scooty-in"
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
                >
                  <span>View All 13+ Hubs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                  Doorstep Delivery Across Vrindavan &amp; Mathura
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Get your scooty delivered outside Mathura Junction (MTJ), Yamuna Expressway cuts, or directly to your ashram/hotel within 15 minutes.
                </p>
              </div>

              {/* Micro-Location Quick Cloud */}
              <div className="flex flex-wrap gap-2 pt-2">
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
                    className="bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>{loc.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
              <span className="text-xs text-slate-600 font-medium">
                15-Minute delivery window anywhere within Vrindavan municipality limits.
              </span>
              <Link
                href="/rent-bike-cars-scooty-in"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950 bg-teal-100 hover:bg-teal-200 border border-teal-300 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <span>Explore All 13+ Pickup Hubs &amp; Routes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* CARD 6: Jobs in Vrindavan - 10% Driver Commission Partner (Span 1) */}
          <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-white bg-white/20 backdrop-blur-md border border-white/30 px-2.5 py-0.5 rounded-full shadow-2xs">
                <Briefcase className="w-3 h-3" />
                Earn 10% Commission
              </span>

              <h3 className="text-xl font-black text-white font-heading">
                Jobs in Vrindavan &mdash; Driver &amp; Host Partner
              </h3>

              <p className="text-xs text-amber-50 leading-relaxed font-medium">
                Auto &amp; e-rickshaw drivers, tour guides, and ashram hosts: earn <strong>10% instant UPI commission</strong> every time a traveler rents a bike via your referral.
              </p>

              <div className="bg-slate-950/25 backdrop-blur-sm p-3.5 rounded-2xl border border-white/15 text-xs space-y-1.5">
                <div className="text-amber-200 font-bold">Daily Earnings Example:</div>
                <div className="text-white text-[11px]">• 1 Daily Rental (₹499) → <strong>₹50 instant payout</strong></div>
                <div className="text-white text-[11px]">• 3-Day Govardhan Booking → <strong>₹150 instant payout</strong></div>
                <div className="text-amber-200 text-[11px] font-bold">• Monthly Second Income: ₹15,000 to ₹35,000+</div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/jobs-in-vrindavan"
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-black text-slate-950 bg-white hover:bg-amber-50 px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-98"
              >
                <span>Apply as 10% Partner (Jobs)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* CARD 7: Digital Bike Inspection & Paperless Handover (Span 1) */}
          <div className="apple-glass-photo-card group min-h-[320px] flex flex-col justify-between">
            {/* Background Photo */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/bike-inspection-mobile.webp"
                alt="Rent on Cent Bike Digital Inspection"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-900/20" />
            </div>

            {/* Content overlay */}
            <div className="relative z-10 p-6 space-y-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-slate-950 bg-emerald-400 px-2.5 py-0.5 rounded-full shadow-md">
                <ShieldCheck className="w-3 h-3" />
                Paperless Security
              </span>
              <h3 className="text-xl font-black text-white font-heading leading-snug">
                6-Angle Inspection Lock &amp; ₹0 Deposit
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Timestamped mobile photos record pre-existing scratches before key handover so you never pay unfairly.
              </p>
            </div>

            <div className="relative z-10 p-6 pt-0">
              <button
                type="button"
                onClick={openSafetyModal}
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 px-4 py-2.5 rounded-xl transition-all shadow-lg cursor-pointer active:scale-98"
              >
                <span>Read Inspection Standards</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CARD 8: Interactive Apple-Style FAQ Accordion (Span 2) */}
          <div className="lg:col-span-2 apple-glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                  Help &amp; Answers
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-2">
                  Frequently Asked Questions &mdash; Two-Wheeler Rentals
                </h3>
              </div>
              <a
                href="https://wa.me/919720965985?text=Namaste%2C+I+have+a+question+about+bike+rentals"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 px-3.5 py-2 rounded-xl transition-all w-fit shadow-2xs"
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
                  className="bg-slate-50/90 hover:bg-slate-100/90 rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                        expandedFaq === faq.id ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-3 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
