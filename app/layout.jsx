import './globals.css';
import { Providers } from './providers';

export const metadata = {
  metadataBase: new URL('https://rentoncent.bond'),
  title: {
    default: 'Rent on Cent | Electric Scooter & Bike Rentals in Vrindavan & Mathura',
    template: '%s | Rent on Cent'
  },
  description:
    'Affordable, peer-to-peer bike and scooty rentals in Vrindavan and Mathura. Rent Honda Activa, EV scooters, Royal Enfield starting at ₹40/hour or ₹299/day. Verified hosts, doorstep delivery, instant WhatsApp booking.',
  keywords: [
    'bike rental vrindavan',
    'scooty rental vrindavan',
    'rent bike in mathura',
    'vrindavan bike hire',
    'electric scooter rental vrindavan',
    'rentoncent',
    'rent on cent',
    'rent to cent',
    'two wheeler rental mathura',
    'prem mandir scooty rental',
    'iskcon vrindavan bike rental',
    'p2p bike sharing india',
    'govardhan parikrama scooty rent'
  ],
  authors: [{ name: 'Rent on Cent', url: 'https://rentoncent.bond' }],
  creator: 'Rent on Cent',
  publisher: 'Rent on Cent',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Rent on Cent | Electric Scooter & Bike Rentals in Vrindavan & Mathura',
    description:
      'Explore Vrindavan, Mathura, and Govardhan on verified bikes and scooters. Affordable daily & hourly rates, doorstep delivery, and sacred protection.',
    url: 'https://rentoncent.bond',
    siteName: 'Rent on Cent',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/logo_square_share_area.png',
        width: 1200,
        height: 630,
        alt: 'Rent on Cent - Vrindavan Bike & Scooty Rental'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rent on Cent | Bike & Scooter Rentals in Vrindavan',
    description: 'Rent Activa, Royal Enfield, and EV Scooters in Vrindavan starting ₹299/day.',
    images: ['/logo_square_share_area.png']
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-96x96.png',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

const autoRentalSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoRental',
  name: 'Rent on Cent',
  alternateName: 'Rent to Cent Vrindavan',
  url: 'https://rentoncent.bond',
  logo: 'https://rentoncent.bond/full_Logo_rentoncent.svg',
  image: 'https://rentoncent.bond/logo_square_share_area.png',
  description:
    'Peer-to-peer bike and electric scooty rental platform in Vrindavan & Mathura. Best rates for Honda Activa, Royal Enfield, EV Scooters with doorstep delivery and verified safety.',
  telephone: '+919837144520',
  email: 'support@rentoncent.bond',
  priceRange: '₹299 - ₹1200 / day',
  currenciesAccepted: 'INR',
  paymentAccepted: 'UPI, Cash, Debit Card, Credit Card',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Raman Reti Road, Near Prem Mandir',
    addressLocality: 'Vrindavan',
    addressRegion: 'Uttar Pradesh',
    postalCode: '281121',
    addressCountry: 'IN'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 27.5706,
    longitude: 77.6976
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '06:00',
      closes: '22:00'
    }
  ],
  areaServed: [
    { '@type': 'City', name: 'Vrindavan' },
    { '@type': 'City', name: 'Mathura' },
    { '@type': 'AdministrativeArea', name: 'Govardhan' },
    { '@type': 'AdministrativeArea', name: 'Barsana' },
    { '@type': 'AdministrativeArea', name: 'Braj' }
  ],
  sameAs: ['https://wa.me/919837144520']
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I rent a bike or scooty in Vrindavan with Rent on Cent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Select your preferred two-wheeler online at rentoncent.bond, choose rental dates, complete quick digital KYC (Aadhaar/Driving Licence), and confirm booking instantly via WhatsApp. Pickup at Prem Mandir or get doorstep delivery at your hotel.'
      }
    },
    {
      '@type': 'Question',
      name: 'What documents are required to rent a scooty in Mathura-Vrindavan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A valid Indian Driving Licence (DL) and Government Identity Proof (Aadhaar Card or Voter ID). International tourists can provide Passport with International Driving Permit.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is the starting price for scooty and bike rental?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prices start at ₹40/hour and ₹299/day for standard scooters like Honda Activa and TVS Jupiter. Electric Scooters and Royal Enfield Classic 350 are also available at competitive daily rates.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I host my bike on Rent on Cent to earn money?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Two-wheeler owners in Vrindavan and Mathura can switch to Host mode on Rent on Cent and list their vehicles with 0 upfront cost, earning up to ₹15,000 monthly with complete safety audits.'
      }
    }
  ]
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Rent on Cent',
  url: 'https://rentoncent.bond',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://rentoncent.bond/bikes?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(autoRentalSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
