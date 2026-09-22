import JobsInVrindavanPage, { metadata as jobsMetadata } from '../jobs-in-vrindavan/page';

export const metadata = {
  ...jobsMetadata,
  title: 'Jobs in Vrindavan - Earn 10% Commission Partner',
  description:
    'Earn 10% commission per rental booking in Vrindavan. Flexible second income for auto drivers, guides, and locals. Daily UPI payouts.',
  alternates: {
    canonical: 'https://rentoncent.bond/jobs-in-vrindavan'
  }
};

export default function JobsPage() {
  return <JobsInVrindavanPage />;
}
