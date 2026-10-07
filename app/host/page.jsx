import HostClient from './HostClient';

export const metadata = {
  title: 'List Your Bike & Earn in Mathura & Vrindavan',
  description:
    'Earn up to ₹15,000 - ₹22,000/month by hosting your scooty or bike in Mathura & Vrindavan. Zero listing fees, verified riders, 6-angle digital photo audit, and daily payouts.',
  alternates: {
    canonical: 'https://rentoncent.bond/host'
  },
  openGraph: {
    title: 'Earn as a Vehicle Host in Mathura & Vrindavan | Rent on Cent',
    description: 'Host your scooty or bike in Mathura & Vrindavan and earn up to ₹22,000/month with zero listing fees.',
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
        alt: 'Rent on Cent - Earn as a Vehicle Host in Mathura & Vrindavan'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Earn as a Vehicle Host in Mathura & Vrindavan | Rent on Cent',
    description: 'Host your scooty or bike in Mathura & Vrindavan & earn up to ₹22,000/month.',
    images: ['https://rentoncent.bond/og-host.jpg']
  }
};

export default function HostPage() {
  return <HostClient />;
}
