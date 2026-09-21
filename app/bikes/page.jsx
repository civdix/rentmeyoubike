import BikesClient from './BikesClient';

export const metadata = {
  title: 'Bikes & Scooty on Rent in Vrindavan',
  description:
    'Compare bikes and scooty on rent in Vrindavan. Rent Honda Activa 6G, EV & Royal Enfield from ₹299/day with ₹0 deposit and doorstep delivery.',
  alternates: {
    canonical: 'https://rentoncent.bond/bikes'
  },
  openGraph: {
    title: 'Bikes & Scooty on Rent in Vrindavan | Rent on Cent',
    description: 'Compare Honda Activa 6G, EV & Royal Enfield on rent in Vrindavan from ₹299/day.',
    url: 'https://rentoncent.bond/bikes',
    siteName: 'Rent on Cent',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://rentoncent.bond/logo_square_share_area.png',
        secureUrl: 'https://rentoncent.bond/logo_square_share_area.png',
        width: 540,
        height: 540,
        type: 'image/png',
        alt: 'Rent on Cent - Bike on Rent in Vrindavan'
      }
    ]
  },
  twitter: {
    card: 'summary',
    title: 'Bikes & Scooty on Rent in Vrindavan | Rent on Cent',
    description: 'Rent Activa, EV & Enfield in Vrindavan from ₹299/day.',
    images: ['https://rentoncent.bond/logo_square_share_area.png']
  }
};

export default function BikesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hidden SSR Heading for SEO crawlers & AI bots */}
      <div className="sr-only">
        <h1>Bike on Rent in Vrindavan &mdash; All Verified Two-Wheelers &amp; Scooty Fleet</h1>
        <p>
          Compare verified two-wheelers including automatic gearless scooty on rent in Vrindavan (Honda Activa 6G, TVS Jupiter), commuter bikes, electric EV scooters, and Royal Enfield cruisers available for daily and weekly Vrindavan rental hire.
        </p>
      </div>

      <BikesClient />
    </div>
  );
}
