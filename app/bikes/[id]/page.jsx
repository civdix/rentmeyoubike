import BikeDetailClient from './BikeDetailClient';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id || '';

  return {
    title: `Vehicle Rental in Vrindavan (${id}) | Rent on Cent`,
    description: `Rent verified scooter or bike (${id}) in Vrindavan & Mathura. Best daily & hourly rates, doorstep delivery, and sacred protection.`,
    alternates: {
      canonical: `/bikes/${id}`
    },
    openGraph: {
      title: `Bike & Scooty Rental in Vrindavan | Rent on Cent`,
      description: `Affordable two-wheeler hire for temple darshan and parikrama in Vrindavan.`,
      url: `https://rentoncent.bond/bikes/${id}`
    }
  };
}

export default async function BikeDetailPage({ params }) {
  const resolvedParams = await params;
  return <BikeDetailClient id={resolvedParams.id} />;
}
