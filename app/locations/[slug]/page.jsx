import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LOCATION_SEO_DATA, ALL_LOCATIONS } from '../../../src/data/locationSeoData';
import { MapPin, Bike, ArrowRight, ShieldCheck, CheckCircle2, MessageSquare, Phone, HelpCircle, ChevronRight, Clock, Star, Key } from 'lucide-react';
import { VrindavanScooterIcon, VrindavanFeatherIcon, WhatsAppBrandIcon } from '../../../src/components/CustomIcons';

export async function generateStaticParams() {
  return ALL_LOCATIONS.map((loc) => ({
    slug: loc.slug
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const loc = LOCATION_SEO_DATA[resolvedParams?.slug];
  if (!loc) return {};

  return {
    title: loc.metaTitle,
    description: loc.metaDescription,
    keywords: loc.keywords,
    alternates: {
      canonical: `/locations/${loc.slug}`
    },
    openGraph: {
      title: loc.metaTitle,
      description: loc.metaDescription,
      url: `https://rentoncent.bond/locations/${loc.slug}`,
      siteName: 'Rent on Cent',
      images: [
        {
          url: 'https://rentoncent.bond/logo_square_share_area.png',
          secureUrl: 'https://rentoncent.bond/logo_square_share_area.png',
          width: 540,
          height: 540,
          type: 'image/png',
          alt: `Rent on Cent - ${loc.name} Bike Rental`
        }
      ]
    },
    twitter: {
      card: 'summary',
      title: loc.metaTitle,
      description: loc.metaDescription,
      images: ['https://rentoncent.bond/logo_square_share_area.png']
    }
  };
}

export default async function LocationPage({ params }) {
  const resolvedParams = await params;
  const loc = LOCATION_SEO_DATA[resolvedParams?.slug];
  if (!loc) notFound();

  // LocalBusiness & AutoRental Schema for this exact micro-location
  const locationSchema = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: `Rent on Cent — ${loc.name}`,
    description: loc.metaDescription,
    url: `https://rentoncent.bond/locations/${loc.slug}`,
    telephone: '+919837144520',
    email: 'support@rentoncent.bond',
    priceRange: '₹299 - ₹1200 / day',
    currenciesAccepted: 'INR',
    paymentAccepted: 'UPI, Cash, Debit Card, Credit Card',
    address: {
      '@type': 'PostalAddress',
      streetAddress: loc.landmark,
      addressLocality: loc.name.includes('Mathura') ? 'Mathura' : 'Vrindavan',
      addressRegion: 'Uttar Pradesh',
      postalCode: loc.postalCode,
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: loc.geo.latitude,
      longitude: loc.geo.longitude
    },
    areaServed: [
      { '@type': 'City', name: 'Vrindavan' },
      { '@type': 'City', name: 'Mathura' },
      { '@type': 'AdministrativeArea', name: 'Yamuna Expressway' }
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: loc.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a
      }
    }))
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://rentoncent.bond'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Locations',
        item: 'https://rentoncent.bond/locations'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: loc.name,
        item: `https://rentoncent.bond/locations/${loc.slug}`
      }
    ]
  };

  const waBookingUrl = `https://wa.me/919837144520?text=${encodeURIComponent(
    `Radhe Radhe! I would like to book a bike rental at ${loc.name}. Please confirm availability and rates.`
  )}`;

  const otherLocations = ALL_LOCATIONS.filter((l) => l.slug !== loc.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-emerald-700">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/locations" className="hover:text-emerald-700">Locations</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-semibold">{loc.shortName}</span>
        </nav>

        {/* Location Hero Header */}
        <header className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-teal-900/50 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <VrindavanFeatherIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Rent on Cent Pickup Point</span>
              </span>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/70 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                Landmark: {loc.landmark}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-heading leading-tight">
              {loc.headline}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {loc.subheadline}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={waBookingUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs sm:text-sm py-3 px-5 rounded-xl inline-flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <WhatsAppBrandIcon className="w-4 h-4 fill-white" />
                <span>Book on WhatsApp for {loc.shortName}</span>
              </a>

              <Link
                href="/bikes"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-xl inline-flex items-center gap-2 shadow-md transition-colors"
              >
                <VrindavanScooterIcon className="w-4 h-4 text-white" />
                <span>Browse All Fleet Models</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Information & Pricing */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pickup & Handover Guide */}
            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>Pickup &amp; Handover Details</span>
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {loc.pickupDescription}
              </p>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {loc.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Vehicle Rates & Models Table */}
            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-heading">
                    Available Two-Wheelers &amp; Rental Rates
                  </h2>
                  <p className="text-xs text-slate-500">Fixed, transparent pricing with no hidden tourist surcharges.</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Daily &amp; Hourly Available
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <th className="p-3">Vehicle Model</th>
                      <th className="p-3">24-Hour Rate</th>
                      <th className="p-3">Hourly Rate</th>
                      <th className="p-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loc.pricing.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                          <Bike className="w-4 h-4 text-emerald-600" />
                          <span>{item.model}</span>
                        </td>
                        <td className="p-3 font-extrabold text-emerald-700">{item.daily}</td>
                        <td className="p-3 text-slate-600">{item.hourly}</td>
                        <td className="p-3 text-slate-500">{item.deposit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Local Travel Tips */}
            <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 space-y-3">
              <h2 className="text-base font-bold text-amber-950 font-heading flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <span>Local Travel &amp; Temple Riding Tips for {loc.shortName}</span>
              </h2>
              <ul className="space-y-2 text-xs text-amber-900">
                {loc.travelTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Location FAQs */}
            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                <span>Frequently Asked Questions — {loc.name}</span>
              </h2>

              <div className="space-y-3">
                {loc.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">{faq.q}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Quick Booking Card & Other Locations */}
          <div className="space-y-6">
            {/* Direct Booking Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-5 sticky top-20">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Starting From</span>
                  <div className="text-2xl font-black text-slate-900">₹299 <span className="text-xs font-normal text-slate-500">/ day</span></div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Key className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Doorstep delivery available</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Complimentary ISI safety helmets</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sacred Yatra Shield protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Valid Driving Licence + Aadhaar</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href={waBookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                >
                  <WhatsAppBrandIcon className="w-4 h-4 fill-white" />
                  <span>Confirm Booking on WhatsApp</span>
                </a>

                <a
                  href="tel:+919837144520"
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Call Customer Desk (+91 98371 44520)</span>
                </a>
              </div>
            </div>

            {/* Other Nearby Locations */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Other Nearby Pickup Points</h3>
              <div className="space-y-2">
                {otherLocations.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/locations/${other.slug}`}
                    className="block p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                      <span>{other.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">{other.landmark}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
