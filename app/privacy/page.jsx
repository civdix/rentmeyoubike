import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Rent on Cent',
  description: 'How Rent on Cent securely handles customer KYC data, Aadhaar details, driving licence uploads, and rental transactions.',
  alternates: {
    canonical: '/privacy'
  }
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-800 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold font-heading text-slate-900">Privacy &amp; Data Security Policy</h1>
        <p className="text-sm text-slate-500 mt-2">Effective Date: January 2025 | Rent on Cent (rentoncent.bond)</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-slate-700">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            When you register or book a vehicle on Rent on Cent, we collect your name, WhatsApp phone number, email address, and essential KYC documents (Driving Licence image and masked Aadhaar/identity proof) solely to verify rider authenticity and prevent vehicle misappropriation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. Document Storage &amp; Encryption</h2>
          <p>
            All uploaded document photos are transmitted over encrypted HTTPS channels and stored in secure cloud vaults with restricted admin access. We never sell, rent, or distribute your identity documents to unauthorized third parties or marketing brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. Host and Renter Information Sharing</h2>
          <p>
            Only essential trip information (such as renter name, verified contact number, pickup location, and handover checklist) is shared between the confirmed customer and the vehicle host to coordinate key exchange.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">4. Contact &amp; Data Inquiries</h2>
          <p>
            For any queries regarding your stored data or to request account deletion, please contact our privacy desk at <a href="mailto:support@rentoncent.bond" className="text-emerald-600 font-bold hover:underline">support@rentoncent.bond</a> or reach our customer desk via WhatsApp at +91 98371 44520.
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
