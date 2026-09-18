import HostClient from './HostClient';

export const metadata = {
  title: 'List Your Bike & Earn Up to ₹15,000/Month | Rent on Cent Host Portal',
  description:
    'Turn your idle scooter or motorcycle into steady monthly income in Vrindavan & Mathura. Zero listing fee, verified riders, 6-angle digital photo inspections, and prompt payouts.',
  alternates: {
    canonical: '/host'
  },
  openGraph: {
    title: 'Earn as a Vehicle Host in Vrindavan | Rent on Cent',
    description: 'Host your Honda Activa, EV Scooty, or Bike in Vrindavan & Mathura. Earn up to ₹15,000/mo.',
    url: 'https://rentoncent.bond/host',
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
    title: 'Earn as a Vehicle Host in Vrindavan | Rent on Cent',
    description: 'Host your Honda Activa, EV Scooty, or Bike in Vrindavan & Mathura. Earn up to ₹15,000/mo.',
    images: ['https://rentoncent.bond/logo_square_share_area.png']
  }
};

export default function HostPage() {
  return <HostClient />;
}
