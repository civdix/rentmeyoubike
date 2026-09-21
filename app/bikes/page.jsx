import BikesClient from './BikesClient';

export const metadata = {
  title: 'Bikes & Scooty on Rent in Vrindavan | Rent on Cent',
  description:
    'Search available Honda Activa, TVS Jupiter, Royal Enfield Classic 350, and EV scooty on rent in Vrindavan & Mathura. Best hourly & daily rates from ₹299/day with doorstep delivery.',
  alternates: {
    canonical: 'https://rentoncent.bond/bikes'
  },
  openGraph: {
    title: 'Bikes & Scooty on Rent in Vrindavan | Rent on Cent',
    description: 'Rent Activa, EV Scooters, and Cruisers starting at ₹299/day in Vrindavan & Mathura.',
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
        alt: 'Rent on Cent - Vrindavan Bike & Scooty Rental'
      }
    ]
  },
  twitter: {
    card: 'summary',
    title: 'Bikes & Scooty on Rent in Vrindavan | Rent on Cent',
    description: 'Rent Activa, EV Scooters, and Cruisers starting at ₹299/day in Vrindavan & Mathura.',
    images: ['https://rentoncent.bond/logo_square_share_area.png']
  }
};

export default function BikesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hidden SSR Heading for SEO crawlers */}
      <div className="sr-only">
        <h1>All Bikes and Scooty on Rent in Vrindavan &amp; Mathura</h1>
        <p>
          Compare verified two-wheelers including automatic gearless scooty on rent in Vrindavan (Honda Activa 6G, TVS Jupiter), commuter bikes, electric EV scooters, and Royal Enfield cruisers available for daily and weekly hire.
        </p>
      </div>

      <BikesClient />
    </div>
  );
}
