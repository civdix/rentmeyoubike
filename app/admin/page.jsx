import AdminClient from './AdminClient';

export const metadata = {
  title: 'Admin Console',
  description: 'Administrative portal for Rent on Cent fleet verification, user management, and dispute resolution.',
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  return <AdminClient />;
}
