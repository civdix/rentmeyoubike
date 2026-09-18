import Link from 'next/link';

export const metadata = {
  title: 'Rental Terms & Conditions | Rent on Cent',
  description: 'Read the terms, eligibility requirements, security deposit policy, and cancellation rules for bike rentals in Vrindavan & Mathura.',
  alternates: {
    canonical: '/terms'
  }
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-800 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold font-heading text-slate-900">Rental Terms &amp; Policies</h1>
        <p className="text-sm text-slate-500 mt-2">Effective Date: January 2025 | Rent on Cent (rentoncent.bond)</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-slate-700">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. Rider Eligibility &amp; Mandatory Documents</h2>
          <p>
            Riders must be at least 18 years of age and possess an original, valid Indian Driving Licence (MCWG or LMV class) or International Driving Permit for foreign nationals. Digital Aadhaar Card or Passport verification is mandatory prior to key handover.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. Sacred Braj Silence Zones &amp; Temple Guidelines</h2>
          <p>
            Vrindavan is a holy pilgrimage city. Honking is strictly prohibited near Prem Mandir, Bankey Bihari Mandir, and the Nidhivan silent corridor. Riders are expected to observe speed limits not exceeding 40 km/h in temple gallis and wear safety helmets at all times.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. Digital Handover &amp; Inspection Audit</h2>
          <p>
            Both customer and host must record fuel level, odometer reading, and 6-angle photos through the Rent on Cent application before the rental begins. Return inspections will compare pre-existing scratches to protect both parties from unfair damage claims.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">4. Cancellation &amp; Refund Policy</h2>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li>Free cancellation up to 6 hours prior to the scheduled pickup time.</li>
            <li>50% refund for cancellations requested within 6 hours of pickup.</li>
            <li>Non-refundable once the vehicle has been handed over or trip has started.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">5. Sacred Yatra Shield Protection</h2>
          <p>
            Our community protection shield covers third-party liability and accidental damage subject to verified handover audits and valid licence verification. It does not cover negligent riding, drunk driving, or unauthorized pillion activities.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-slate-200">
        <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-bold text-sm">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
