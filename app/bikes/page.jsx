import BikesClient from './BikesClient';

export const metadata = {
  title: 'Bike on Rent in Vrindavan - Available Fleet & Scooty Rates | Rent on Cent',
  description:
    'Compare verified bike on rent in Vrindavan and scooty rental options. Honda Activa 6G, EV scooty & Royal Enfield from ₹299/day. Zero deposit & hotel delivery across Vrindavan rental hubs.',
  alternates: {
    canonical: 'https://rentoncent.bond/bikes'
  },
  openGraph: {
    title: 'Bike on Rent in Vrindavan - Available Fleet & Scooty Rates | Rent on Cent',
    description: 'Rent Honda Activa 6G, EV Scooters, and Cruisers from ₹299/day. Verified Vrindavan rental with zero deposit.',
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
    title: 'Bike on Rent in Vrindavan - Available Fleet & Scooty Rates | Rent on Cent',
    description: 'Rent Activa, EV Scooters, and Cruisers starting at ₹299/day in Vrindavan & Mathura.',
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
