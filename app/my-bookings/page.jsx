import { MyBookingsView } from '../../src/views/MyBookingsView';

export const metadata = {
  title: 'My Bookings & Trip Timeline',
  description:
    'Track your active scooter and bike rentals, view digital inspection records, verify KYC, and manage your Vrindavan travel schedule.',
  alternates: {
    canonical: 'https://rentoncent.bond/my-bookings'
  },
  robots: {
    index: false,
    follow: true
  }
};

export default function MyBookingsPage() {
  return (
    <div className="min-h-[80vh] bg-slate-50">
      <MyBookingsView />
    </div>
  );
}
