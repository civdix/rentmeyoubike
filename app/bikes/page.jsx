import BikesClient from './BikesClient';

export const metadata = {
  title: 'Browse Scooters & Bikes for Rent in Vrindavan | Rent on Cent',
  description:
    'Search available Honda Activa, TVS Jupiter, Royal Enfield Classic 350, and EV scooters for rent in Vrindavan & Mathura. Best hourly & daily rates with verified hosts and doorstep delivery.',
  alternates: {
    canonical: '/bikes'
  },
  openGraph: {
    title: 'Browse Two-Wheelers for Rent in Vrindavan | Rent on Cent',
    description: 'Rent Activa, EV Scooters, and Cruisers starting at ₹299/day in Vrindavan & Mathura.',
    url: 'https://rentoncent.bond/bikes'
  }
};

export default function BikesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hidden SSR Heading for SEO crawlers */}
      <div className="sr-only">
        <h1>All Bikes and Scooters for Rent in Vrindavan &amp; Mathura</h1>
        <p>
          Compare verified two-wheelers including automatic gearless scooters, high-mileage commuter bikes, electric scooters, and royal cruisers available for daily and weekly hire in Vrindavan.
        </p>
      </div>

      <BikesClient />
    </div>
  );
}
