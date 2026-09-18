import BikeDetailClient from './BikeDetailClient';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id || '';

  return {
    title: `Vehicle Rental in Vrindavan (${id})`,
    description: `Rent verified scooter or bike (${id}) in Vrindavan & Mathura. Best daily & hourly rates, doorstep delivery, and sacred protection.`,
    alternates: {
      canonical: `https://rentoncent.bond/bikes/${encodeURIComponent(id)}`
    },
    openGraph: {
      title: `Bike & Scooty Rental in Vrindavan | Rent on Cent`,
      description: `Affordable two-wheeler hire for temple darshan and parikrama in Vrindavan.`,
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
          alt: 'Rent on Cent - Vrindavan Bike & Scooty Rental'
        }
      ]
    },
    twitter: {
      card: 'summary',
      title: `Bike & Scooty Rental in Vrindavan | Rent on Cent`,
      description: `Affordable two-wheeler hire for temple darshan and parikrama in Vrindavan.`,
      images: ['https://rentoncent.bond/logo_square_share_area.png']
    }
  };
}

export default async function BikeDetailPage({ params }) {
  const resolvedParams = await params;
  return <BikeDetailClient id={resolvedParams.id} />;
}
