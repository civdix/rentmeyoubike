import BikeDetailClient from './BikeDetailClient';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id || '';

  return {
    title: 'Vehicle Rental in Mathura & Vrindavan',
    description: 'Rent verified scooter or bike in Mathura & Vrindavan. Best daily rates from ₹299/day, zero deposit options, and doorstep delivery across Mathura Junction, BSA College, and Prem Mandir.',
    alternates: {
      canonical: `https://rentoncent.bond/bikes/${encodeURIComponent(id)}`
    },
    openGraph: {
      title: `Bike & Scooty Rental in Mathura & Vrindavan | Rent on Cent`,
      description: `Affordable two-wheeler hire for temple darshan and commuting across Mathura and Vrindavan.`,
      url: `https://rentoncent.bond/bikes/${id}`,
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
          alt: 'Rent on Cent - Mathura & Vrindavan Bike & Scooty Rental'
        }
      ]
    },
    twitter: {
      card: 'summary',
      title: `Bike & Scooty Rental in Mathura & Vrindavan | Rent on Cent`,
      description: `Affordable two-wheeler hire for temple darshan and commuting across Mathura and Vrindavan.`,
      images: ['https://rentoncent.bond/logo_square_share_area.png']
    }
  };
}

export default async function BikeDetailPage({ params }) {
  const resolvedParams = await params;
  return <BikeDetailClient id={resolvedParams.id} />;
}
