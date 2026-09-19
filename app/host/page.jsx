import HostClient from './HostClient';

export const metadata = {
  title: 'List Your Bike & Earn Up to ₹15,000/Month | Host Portal',
  description:
    'Turn your idle scooter or motorcycle into steady monthly income in Vrindavan & Mathura. Zero listing fee, verified riders, 6-angle digital photo inspections, and prompt payouts.',
  alternates: {
    canonical: 'https://rentoncent.bond/host'
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
        url: 'https://rentoncent.bond/og-host.jpg',
        secureUrl: 'https://rentoncent.bond/og-host.jpg',
        width: 1200,
        height: 1200,
        type: 'image/jpeg',
        alt: 'Rent on Cent - Earn as a Vehicle Host in Vrindavan'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Earn as a Vehicle Host in Vrindavan | Rent on Cent',
    description: 'Host your Honda Activa, EV Scooty, or Bike in Vrindavan & Mathura. Earn up to ₹15,000/mo.',
    images: ['https://rentoncent.bond/og-host.jpg']
  }
};

export default function HostPage() {
  return <HostClient />;
}
