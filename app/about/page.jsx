import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, Heart, CheckCircle2, Bike, Award, Sparkles, ExternalLink, ArrowRight, Mail, MessageSquare, Linkedin, Globe, Instagram, Github } from 'lucide-react';
import { VrindavanFeatherIcon, VrindavanScooterIcon, WhatsAppBrandIcon } from '../../src/components/CustomIcons';

export const metadata = {
  title: 'About Rent on Cent | Founder, Story & Vrindavan Fleet Operations',
  description:
    'Learn about Rent on Cent, founded by local Brajwasi engineer Shivam Dixit in Panighat, Vrindavan. Transparent peer-to-peer bike rentals protecting pilgrims from overcharging.',
  alternates: {
    canonical: 'https://rentoncent.bond/about'
  },
  openGraph: {
    title: 'About Rent on Cent | Founder & Vrindavan Operations',
    description:
      'Founded by Brajwasi engineer Shivam Dixit on Panighat Parikrama Marg. Connecting visiting pilgrims with verified local bike hosts from ₹299/day.',
    url: 'https://rentoncent.bond/about',
    siteName: 'Rent on Cent',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://rentoncent.bond/og-customer.jpg',
        width: 1200,
        height: 630,
        alt: 'Rent on Cent Founder and Vrindavan Two-Wheeler Fleet'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Rent on Cent | Vrindavan Bike & Scooter Rentals',
    description: 'Founded by Brajwasi engineer Shivam Dixit. Transparent, safe two-wheeler rentals in Mathura-Vrindavan.',
    images: ['https://rentoncent.bond/og-customer.jpg']
  }
};

export default function AboutPage() {
  const googleMapsUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL;
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/rentoncent.official/';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: 'Rent on Cent',
    url: 'https://rentoncent.bond',
    logo: 'https://rentoncent.bond/logo_square_share_area.png',
    telephone: '+919720965985',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Panighat Parikrama Marg, Near Prem Mandir Hub, Raman Reti',
      addressLocality: 'Vrindavan',
      addressRegion: 'Uttar Pradesh',
      postalCode: '281121',
      addressCountry: 'IN'
    },
    founder: {
      '@type': 'Person',
      name: 'Shivam Dixit',
      jobTitle: 'Founder & CEO',
      image: 'https://rentoncent.bond/data/profile-image/shivamdixit.png',
      url: 'https://shivamdixit.vercel.app',
      sameAs: [
        'https://linkedin.com/in/shivdix',
        'https://github.com/civdix',
        'https://shivamdixit.vercel.app',
        'https://www.instagram.com/rentoncent.official/'
      ]
    },
    sameAs: [
      instagramUrl,
      ...(googleMapsUrl ? [googleMapsUrl] : [])
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 text-white py-14 px-4 border-b border-teal-900/50">
        <div className="max-w-4xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold px-3.5 py-1.5 rounded-full">
            <VrindavanFeatherIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Built by Locals • Dedicated to Pilgrims</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight">
            Our Story, Team &amp; Mission in Vrindavan Dham
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminating pilgrimage touts and predatory transport fares through fair, transparent, and technology-backed two-wheeler rentals in Mathura-Vrindavan.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
            <Link
              href="/bikes"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <VrindavanScooterIcon className="w-3.5 h-3.5" />
              <span>Explore Rental Fleet</span>
            </Link>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-slate-900 hover:bg-slate-800 text-pink-300 font-bold px-4 py-2 rounded-xl border border-pink-500/30 transition-all flex items-center gap-1.5"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>@rentoncent.official</span>
            </a>

            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-900 hover:bg-slate-800 text-emerald-300 font-bold px-4 py-2 rounded-xl border border-emerald-500/30 transition-all flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified on Google Maps ↗</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* Founder & Leadership Spotlight */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Avatar & Badges */}
            <div className="flex flex-col items-center sm:items-start shrink-0 mx-auto sm:mx-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-xl border-2 border-emerald-400/50 bg-slate-900 relative group">
                <img
                  src="/data/profile-image/shivamdixit.png"
                  alt="Shivam Dixit - Founder & CEO, Rent on Cent"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  width={112}
                  height={112}
                  loading="lazy"
                />
              </div>

              <div className="mt-4 text-center sm:text-left space-y-1">
                <h2 className="text-xl font-extrabold text-slate-900 font-heading">
                  Shivam Dixit
                </h2>
                <p className="text-xs font-bold text-emerald-700">Founder &amp; CEO</p>
                <p className="text-[11px] text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Panighat, Vrindavan</span>
                </p>
              </div>

              {/* Founder Social Profile Links */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 w-full justify-center sm:justify-start">
                <a
                  href="https://linkedin.com/in/shivdix"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-sky-600 transition-colors"
                  title="Shivam Dixit LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://shivamdixit.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-emerald-700 transition-colors"
                  title="Portfolio & Engineering Background"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/civdix"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
                  title="Shivam Dixit GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Founder Story & Vision */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-900 font-bold text-xs px-3 py-1 rounded-full border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>The Story Behind Rent on Cent</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                &quot;Why I Built Rent on Cent in My Hometown Vrindavan&quot;
              </h3>

              <p>
                Growing up on <strong>Panighat Parikrama Marg in Vrindavan</strong>, I watched visiting yatris, families, and devotees face constant exploitation — from e-rickshaw drivers demanding ₹400 for a 1-kilometer drop, to unverified touts handing over breakdown-prone scooters with inflated cash security deposits that were never returned.
              </p>

              <p>
                As a software engineer who built distributed platforms and real-time systems at GeeksforGeeks and Surepass, I knew technology could fix this on-ground transport crisis.
              </p>

              <p>
                In 2026, I founded <strong>Rent on Cent</strong> with a single promise: <strong>complete transparency</strong>. We built a peer-to-peer sharing ecosystem that connects visiting yatris directly with verified local Brajwasi vehicle owners. Renters get clean, road-tested scooters starting at just <strong>₹299/day (₹40/hr)</strong> with digital KYC, 6-photo inspection locks, and 2 sanitized helmets, while local vehicle hosts earn steady daily income keeping 85% of every booking.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <div className="font-bold text-slate-900 font-heading">Local Roots</div>
                  <p className="text-slate-500 text-[11px] mt-0.5">Brajwasi native from Panighat Parikrama Marg, Vrindavan Dham.</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <div className="font-bold text-slate-900 font-heading">Tech-Driven Safety</div>
                  <p className="text-slate-500 text-[11px] mt-0.5">Automated Aadhaar/DL KYC and dual digital scratch inspection.</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <div className="font-bold text-slate-900 font-heading">Community First</div>
                  <p className="text-slate-500 text-[11px] mt-0.5">85% payouts directly to local vehicle owners within 24 hours.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our On-Ground Operations & Pillars */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">How We Operate</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading mt-1">
              On-Ground Fleet Operations &amp; Trust Pillars
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Dedicated staff and verified hosts positioned at all key pilgrimage transit points.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-2">
                <MapPin className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 font-heading">Prem Mandir &amp; Raman Reti Hub</h3>
              <p className="text-slate-500 leading-relaxed">
                Our primary handover station is located right along Raman Reti Road near Prem Mandir. Walk-in bookings and pre-booked online pickups are fulfilled in under 10 minutes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold mb-2">
                <Bike className="w-5 h-5 text-teal-700" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 font-heading">Mathura Jn (MTJ) Railway Hub</h3>
              <p className="text-slate-500 leading-relaxed">
                Arriving via train from Delhi, Mumbai, or Jaipur? Our station team delivers scooters right outside Platform 1 exit so you avoid aggressive auto touts and reach your ashram directly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-2">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 font-heading">Chattikara &amp; Expressway Cut</h3>
              <p className="text-slate-500 leading-relaxed">
                Traveling by bus or taxi on Yamuna Expressway or NH19? We provide curbside handover at Chattikara Flyover and Mathura Cut service roads with instant digital documentation.
              </p>
            </div>
          </div>
        </section>

        {/* Physical Office & Direct Contact Section */}
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full inline-block">
                Physical Presence &amp; Verification
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                Visit Us or Reach Out Directly
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We believe in 100% human accountability. When you book on Rent on Cent, you are backed by real people living in Vrindavan Dham.
              </p>

              <div className="space-y-2.5 text-xs text-slate-300 pt-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Registered Hub Address:</strong>
                    <p className="text-slate-400 text-[11px]">Panighat Parikrama Marg, Raman Reti, Vrindavan, Mathura District, Uttar Pradesh 281121</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <WhatsAppBrandIcon className="w-4 h-4 fill-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-white">Official WhatsApp Helpline:</strong>
                    <a href="https://wa.me/919720965985" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline ml-1">
                      +91 97209 65985
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                  <div>
                    <strong className="text-white">Direct Admin Email:</strong>
                    <a href="mailto:shivdixittt@gmail.com" className="text-teal-400 hover:underline ml-1">
                      shivdixittt@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-white font-heading">
                Follow Real Handover Reels &amp; Pilgrimage Updates
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Check our official Instagram for daily key handovers, Govardhan Parikrama stories, and real customer reels in Vrindavan.
              </p>

              <div className="space-y-2.5 pt-1">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:opacity-90 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Follow @rentoncent.official on Instagram</span>
                </a>

                <a
                  href="https://wa.me/919720965985?text=Radhe%20Radhe!%20I%20have%20an%20inquiry%20about%20Rent%20on%20Cent."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <WhatsAppBrandIcon className="w-4 h-4 fill-white" />
                  <span>Chat with Founder &amp; Support on WhatsApp</span>
                </a>

                {googleMapsUrl && (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-700"
                  >
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>Open in Google Maps Application</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
