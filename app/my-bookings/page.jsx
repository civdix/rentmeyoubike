import { MyBookingsView } from '../../src/views/MyBookingsView';

export const metadata = {
  title: 'My Bookings & Trip Timeline | Rent on Cent',
  description:
    'Track your active scooter and bike rentals, view digital inspection records, verify KYC, and manage your Vrindavan travel schedule.',
  alternates: {
    canonical: '/my-bookings'
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
