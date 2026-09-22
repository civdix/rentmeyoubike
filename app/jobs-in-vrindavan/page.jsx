import React from 'react';
import Link from 'next/link';
import {
  Briefcase, IndianRupee, Users, CheckCircle2, TrendingUp, Sparkles,
  PhoneCall, MessageSquare, ArrowRight, ShieldCheck, Car, HelpCircle, Clock
} from 'lucide-react';
import { VrindavanScooterIcon, VrindavanFeatherIcon, WhatsAppBrandIcon } from '../../src/components/CustomIcons';

export const metadata = {
  title: 'Jobs in Vrindavan - Earn 10% Commission Partner',
  description:
    'Looking for jobs in Vrindavan or second income? Earn 10% commission per bike booking as a driver or referral partner. Daily UPI payouts.',
  alternates: {
    canonical: 'https://rentoncent.bond/jobs-in-vrindavan'
  },
  openGraph: {
    title: 'Jobs in Vrindavan - Earn 10% Commission Partner | Rent on Cent',
    description: 'Earn ₹15,000 - ₹35,000/month in Vrindavan as a driver or local referral partner. Flat 10% booking commission with daily UPI payouts.',
    url: 'https://rentoncent.bond/jobs-in-vrindavan',
    siteName: 'Rent on Cent',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://rentoncent.bond/og-host.jpg',
        secureUrl: 'https://rentoncent.bond/og-host.jpg',
        width: 1200,
        height: 1200,
        type: 'image/jpeg',
        alt: 'Jobs in Vrindavan - Rent on Cent Driver and Referral Partner'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jobs in Vrindavan - Earn 10% Commission Partner | Rent on Cent',
    description: 'Earn 10% commission per rental booking in Vrindavan. Flexible second income for drivers and locals.',
    images: ['https://rentoncent.bond/og-host.jpg']
  }
};

export default function JobsInVrindavanPage() {
  const jobSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: 'Driver & Tourism Referral Partner — 10% Booking Commission',
    description:
      'Rent on Cent offers high-paying part-time and second-income opportunities in Vrindavan and Mathura. Local drivers, e-rickshaw operators, hotel receptionists, and residents earn a flat 10% cash commission on every successful bike or scooty rental booking they refer or drive to Rent on Cent.',
    identifier: {
      '@type': 'PropertyValue',
      name: 'Rent on Cent',
      value: 'ROC-JOB-VRN-01'
    },
    datePosted: '2026-03-01',
    validThrough: '2027-12-31',
    employmentType: ['PART_TIME', 'CONTRACTOR'],
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Rent on Cent',
      sameAs: 'https://rentoncent.bond',
      logo: 'https://rentoncent.bond/full_Logo_rentoncent.svg'
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Raman Reti Road, Near Prem Mandir',
        addressLocality: 'Vrindavan',
        addressRegion: 'Uttar Pradesh',
        postalCode: '281121',
        addressCountry: 'IN'
      }
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: {
        '@type': 'QuantitativeValue',
        minValue: 15000,
        maxValue: 40000,
        unitText: 'MONTH'
      }
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do jobs in Vrindavan with Rent on Cent work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Whenever you drive or refer a tourist/pilgrim to Rent on Cent who successfully completes a bike or scooty rental booking, you receive an instant 10% commission based on the total booking amount.'
        }
      },
      {
        '@type': 'Question',
        name: 'Who is eligible for this second hand income in Vrindavan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Auto-rickshaw drivers, e-rickshaw drivers, taxi drivers, hotel desk staff, ashram volunteers, tour guides, and local residents in Vrindavan and Mathura can join with zero upfront fees.'
        }
      },
      {
        '@type': 'Question',
        name: 'When and how is the 10% commission paid?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Commissions are credited directly via UPI (PhonePe, Google Pay, Paytm) immediately after the customer completes digital KYC and takes vehicle handover.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do I need my own bike or vehicle to join?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No vehicle ownership or financial investment is required. You only connect pilgrims looking for two-wheeler rentals to Rent on Cent.'
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      {/* Schema.org JobPosting and FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 text-white py-12 sm:py-16 px-4 border-b border-teal-900/50">
        <div className="max-w-5xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold px-3.5 py-1.5 rounded-full">
            <VrindavanFeatherIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Jobs in Vrindavan • Second Income Partner Program</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading leading-tight">
            Jobs in Vrindavan &mdash; Earn 10% Commission on Every Booking
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Are you an auto-rickshaw driver, e-rickshaw driver, tour guide, hotel receptionist, or local resident in Vrindavan? Earn a guaranteed <strong>10% instant commission</strong> on every pilgrim or tourist you refer or drive to Rent on Cent.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/919720965985?text=Hello%20Rent%20on%20Cent,%20I%20want%20to%20join%20the%2010%%20Commission%20Partner%20Program%20in%20Vrindavan."
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              <WhatsAppBrandIcon className="w-4 h-4 fill-white" />
              <span>Join Now on WhatsApp (Instant Approval)</span>
            </a>

            <a
              href="#how-it-works"
              className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all"
            >
              See Earning Breakdown &darr;
            </a>
          </div>
        </div>
      </section>

      {/* Highlights / Metric Cards */}
      <section className="max-w-5xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="border-b sm:border-b-0 sm:border-r border-slate-100 pb-4 sm:pb-0">
            <div className="text-3xl font-black text-emerald-600 font-heading">Flat 10%</div>
            <div className="text-xs text-slate-500 mt-1">Instant Cash Commission per Rental</div>
          </div>

          <div className="border-b sm:border-b-0 sm:border-r border-slate-100 pb-4 sm:pb-0">
            <div className="text-3xl font-black text-amber-500 font-heading">₹15K &ndash; ₹35K</div>
            <div className="text-xs text-slate-500 mt-1">Monthly Second Hand Income Potential</div>
          </div>

          <div>
            <div className="text-3xl font-black text-teal-600 font-heading">Instant UPI</div>
            <div className="text-xs text-slate-500 mt-1">Direct to Google Pay, PhonePe, Paytm</div>
          </div>
        </div>
      </section>

      {/* Main Value Proposition & Who It Is For */}
      <section className="max-w-5xl mx-auto px-4 py-14 space-y-12" id="how-it-works">
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
            Earn in Braj Dham
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            How the Rent on Cent 10% Partner Program Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Thousands of yatris land in Mathura and Vrindavan daily looking for comfortable two-wheelers to visit Bankey Bihari, Prem Mandir, and Govardhan. You help them rent, and we reward you with an immediate 10% payout.
          </p>
        </div>

        {/* 3 Step Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Register via WhatsApp</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Send your name, phone number, and UPI ID to our dedicated partner onboarding desk (+91 97209 65985). Zero registration fee.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Drive or Refer Yatris</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              When yatris arrive at your auto stand, railway platform, hotel lobby, or ashram, share our link or drive them to our Raman Reti hub.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Get Paid 10% Immediately</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              As soon as the booking is confirmed and keys are handed over, your 10% commission is transferred to your PhonePe / Google Pay.
            </p>
          </div>
        </div>

        {/* Real Example Earnings Table */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 font-heading">
            Example Second Hand Income Calculation
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
            <table className="w-full text-left text-xs border-collapse bg-white">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-200">
                  <th className="p-3 font-bold">Referral Type</th>
                  <th className="p-3 font-bold">Customer Booking</th>
                  <th className="p-3 font-bold">Booking Value</th>
                  <th className="p-3 font-bold text-emerald-700">Your 10% Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Single Pilgrim</td>
                  <td className="p-3">Honda Activa 6G (1 Day)</td>
                  <td className="p-3">₹299</td>
                  <td className="p-3 font-bold text-emerald-600">₹30 instant UPI</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Couple Pilgrimage</td>
                  <td className="p-3">Activa 6G (3 Days Weekend)</td>
                  <td className="p-3">₹897</td>
                  <td className="p-3 font-bold text-emerald-600">₹90 instant UPI</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Family / Group</td>
                  <td className="p-3">2 EV Scooters (2 Days Govardhan)</td>
                  <td className="p-3">₹1,396</td>
                  <td className="p-3 font-bold text-emerald-600">₹140 instant UPI</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Biker Tourist</td>
                  <td className="p-3">Royal Enfield Classic (3 Days)</td>
                  <td className="p-3">₹2,697</td>
                  <td className="p-3 font-bold text-emerald-600">₹270 instant UPI</td>
                </tr>
                <tr className="bg-emerald-50/60 font-semibold text-slate-900">
                  <td className="p-3">Daily Average (4-5 Referrals)</td>
                  <td className="p-3">Mix of Scooters &amp; Cruisers</td>
                  <td className="p-3">₹7,000 / day</td>
                  <td className="p-3 font-bold text-emerald-700">₹700 / day (₹21,000 / mo)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Who Should Apply Card Grid */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-heading">
            Who Can Earn Second Hand Income in Vrindavan?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <Car className="w-5 h-5 text-emerald-600 mb-1" />
              <h4 className="font-bold text-slate-800">Auto &amp; E-Rickshaw Drivers</h4>
              <p className="text-slate-500 leading-relaxed">
                When tourists want full-day self-drive independence, drive them to Rent on Cent and earn 10% instead of losing the fare.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <Briefcase className="w-5 h-5 text-teal-600 mb-1" />
              <h4 className="font-bold text-slate-800">Hotel &amp; Ashram Staff</h4>
              <p className="text-slate-500 leading-relaxed">
                Recommend Rent on Cent to guests checking in at reception and earn a 10% bonus on every rental booking.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <Users className="w-5 h-5 text-amber-600 mb-1" />
              <h4 className="font-bold text-slate-800">Temple Guides &amp; Pandas</h4>
              <p className="text-slate-500 leading-relaxed">
                Help devotees doing parikrama or multi-temple circuits get verified scooters and earn guaranteed commission.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <TrendingUp className="w-5 h-5 text-purple-600 mb-1" />
              <h4 className="font-bold text-slate-800">Students &amp; Local Youths</h4>
              <p className="text-slate-500 leading-relaxed">
                Earn flexible part-time income in Vrindavan by sharing referral links on WhatsApp status and local social groups.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-heading">
            Frequently Asked Questions &mdash; Jobs in Vrindavan &amp; Second Income
          </h3>
          <div className="space-y-3 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 space-y-1">
              <h4 className="font-semibold text-slate-800">How do I register as a 10% commission partner?</h4>
              <p className="text-slate-500 leading-relaxed">
                Simply send a message to our official WhatsApp line (+91 97209 65985). Share your name and UPI number. There are no fees or joining charges.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 space-y-1">
              <h4 className="font-semibold text-slate-800">How does Rent on Cent know that a customer came through me?</h4>
              <p className="text-slate-500 leading-relaxed">
                You can accompany the customer directly to our Raman Reti handover hub, or the customer can quote your registered phone number / partner code during booking.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 space-y-1">
              <h4 className="font-semibold text-slate-800">When is the commission transferred?</h4>
              <p className="text-slate-500 leading-relaxed">
                Payouts are processed instantly via UPI as soon as the customer completes KYC and key handover is finalized.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 space-y-1">
              <h4 className="font-semibold text-slate-800">Is there any limit to how much I can earn?</h4>
              <p className="text-slate-500 leading-relaxed">
                No limit! Many active partners in Vrindavan and Mathura earn over ₹25,000 to ₹40,000 per month during festival and weekend seasons.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-bold font-heading">
            Ready to Start Earning Today in Vrindavan?
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
            Connect with our partner team on WhatsApp and start earning 10% commission on every vehicle rental from your very first customer!
          </p>
          <a
            href="https://wa.me/919720965985?text=Hello%20Rent%20on%20Cent,%20I%20want%20to%20apply%20for%20the%2010%%20Commission%20Partner%20Program%20in%20Vrindavan."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-md"
          >
            <WhatsAppBrandIcon className="w-4 h-4 fill-slate-950" />
            <span>Apply Now &mdash; WhatsApp +91 97209 65985</span>
          </a>
        </div>
      </section>
    </div>
  );
}
