import React from 'react';
import { CustomerView } from '../src/views/CustomerView';
import { VrindavanBentoGuide } from '../src/components/VrindavanBentoGuide';

export const metadata = {
  title: {
    absolute: 'Bike on Rent in Mathura & Vrindavan | Scooty Rental & Two-Wheeler Hire'
  },
  description:
    'Rent bike and scooty in Mathura & Vrindavan from ₹299/day (₹40/hr). Verified Activa 6G & EV with zero deposit, free helmets & doorstep delivery across Mathura Junction, BSA College, Dampier Nagar & Prem Mandir. Instant WhatsApp booking.',
  alternates: {
    canonical: 'https://rentoncent.bond/'
  },
  openGraph: {
    title: 'Bike on Rent in Mathura & Vrindavan | Scooty Rental & Two-Wheeler Hire',
    description: 'Rent Activa 6G, EV & Royal Enfield in Mathura & Vrindavan from ₹299/day with zero deposit & doorstep delivery.',
    url: 'https://rentoncent.bond/',
    siteName: 'Rent on Cent',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://rentoncent.bond/og-customer.jpg',
        secureUrl: 'https://rentoncent.bond/og-customer.jpg',
        width: 1200,
        height: 1200,
        type: 'image/jpeg',
        alt: 'Rent on Cent - Bike on Rent in Mathura & Vrindavan'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bike on Rent in Mathura & Vrindavan | Scooty Rental & Two-Wheeler Hire',
    description: 'Rent Activa 6G & EV in Mathura & Vrindavan from ₹299/day with free helmets.',
    images: ['https://rentoncent.bond/og-customer.jpg']
  }
};

export default function HomePage() {
  return (
    <>
      {/* Primary Server-Side Rendered Customer & Home Experience */}
      <CustomerView />

      {/* Apple-Style Bento Grid Pilgrimage & Rental Guide with Floating Glass & Universal Modals */}
      <VrindavanBentoGuide />
    </>
  );
}
