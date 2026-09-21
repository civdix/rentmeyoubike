import './globals.css';
import { Providers } from './providers';

export const metadata = {
  metadataBase: new URL('https://rentoncent.bond'),
  title: {
    default: 'Bike on Rent in Vrindavan | Vrindavan Rental & Scooty from ₹299 - Rent on Cent',
    template: '%s | Rent on Cent'
  },
  description:
    'Best bike on rent in Vrindavan & Vrindavan rental portal starting ₹299/day or ₹40/hr. Rent verified Honda Activa 6G, EV scooters, Royal Enfield with free hotel delivery, 2 helmets & ₹0 deposit. WhatsApp: +91 97209 65985.',
  keywords: [
    'bike on rent in vrindavan',
    'vrindavan rental',
    'scooty on rent in vrindavan',
    'bike rental vrindavan',
    'scooty rental vrindavan',
    'two wheeler on rent in vrindavan',
    'activa on rent in vrindavan',
    'honda activa on rent in vrindavan',
    'electric scooter rental vrindavan',
    'vrindavan bike rental price per day',
    'bike rental in vrindavan near railway station',
    'scooty on rent near prem mandir vrindavan',
    'bike on rent near bankey bihari temple',
    'scooty on rent in mathura',
    'bike on rent in mathura',
    'two wheeler rental mathura',
    'rentoncent',
    'rent on cent',
    'rent to cent',
    'govardhan parikrama scooty rent',
    'bike on rent on mathura cut',
    'raya cut yamuna expressway bike rental',
    'bike rental service near chattikara',
    'mathura junction railway station bike rental',
    'vrindavan hotel bike delivery'
  ],
  authors: [{ name: 'Rent on Cent', url: 'https://rentoncent.bond' }],
  creator: 'Rent on Cent',
  publisher: 'Rent on Cent',
  openGraph: {
    title: 'Bike on Rent in Vrindavan | Vrindavan Rental & Scooty from ₹299 - Rent on Cent',
    description:
      'Rent verified Honda Activa, EV scooters & Royal Enfield in Vrindavan & Mathura from ₹299/day. Doorstep delivery to ashrams, hotels & railway station.',
    url: 'https://rentoncent.bond',
    siteName: 'Rent on Cent - Vrindavan Rental',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://rentoncent.bond/og-customer.jpg',
        secureUrl: 'https://rentoncent.bond/og-customer.jpg',
        width: 1200,
        height: 1200,
        type: 'image/jpeg',
        alt: 'Rent on Cent - Bike & Scooty on Rent in Vrindavan'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bike on Rent in Vrindavan | Vrindavan Rental from ₹299',
    description: 'Rent Activa, Royal Enfield, and EV Scooters in Vrindavan starting ₹299/day with free helmets.',
    images: ['https://rentoncent.bond/og-customer.jpg']
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
  },
  other: {
    image_src: 'https://rentoncent.bond/og-customer.jpg',
    'itemprop:image': 'https://rentoncent.bond/og-customer.jpg'
  }
};

const autoRentalSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoRental',
  name: 'Rent on Cent',
  alternateName: [
    'Vrindavan Rental',
    'Bike on Rent in Vrindavan',
    'Rent on Cent Vrindavan',
    'Rent to Cent',
    'Rentoncent'
  ],
  slogan: 'Rent Ride Explore — Best Bike & Scooty on Rent in Vrindavan',
  url: 'https://rentoncent.bond',
  logo: 'https://rentoncent.bond/full_Logo_rentoncent.svg',
  image: 'https://rentoncent.bond/og-customer.jpg',
  description:
    'Premier Vrindavan rental platform offering bike on rent in Vrindavan, scooty on rent in Vrindavan, and two wheeler rentals. Rent verified Honda Activa 6G, EV electric scooters, and Royal Enfield Classic 350 starting at ₹40/hr and ₹299/day with doorstep delivery to hotels, ashrams, and Mathura Junction.',
  telephone: '+919720965985',
  email: 'support@rentoncent.bond',
  priceRange: '₹299 - ₹1200 / day',
  currenciesAccepted: 'INR',
  paymentAccepted: 'UPI, Cash, Debit Card, Credit Card, Net Banking',
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
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    bestRating: '5',
    worstRating: '1',
    ratingCount: '1240'
  },
  knowsAbout: [
    'Bike on rent in Vrindavan',
    'Scooty on rent in Vrindavan',
    'Vrindavan rental',
    'Two wheeler rental Mathura',
    'Electric scooter rental Vrindavan',
    'Honda Activa rental Vrindavan',
    'Royal Enfield on rent in Vrindavan',
    'Govardhan Parikrama bike rent',
    'Prem Mandir bike hire',
    'Bankey Bihari temple scooter rental',
    'Doorstep hotel bike delivery Vrindavan'
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Vrindavan Bike & Scooty Rental Plans',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Vehicle',
          name: 'Honda Activa 6G Scooty on Rent in Vrindavan',
          description: '110cc automatic scooter with 2 sanitized helmets and mobile holder included.'
        },
        price: '299',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        validFrom: '2026-01-01'
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Vehicle',
          name: 'Electric Scooter (EV) on Rent in Vrindavan',
          description: 'High-range electric scooter with 80-100 km range per charge. Free charging cables included.'
        },
        price: '349',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        validFrom: '2026-01-01'
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Vehicle',
          name: 'Royal Enfield Classic 350 on Rent in Vrindavan',
          description: '350cc cruiser bike perfect for Govardhan Parikrama and Mathura-Barsana circuits.'
        },
        price: '899',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        validFrom: '2026-01-01'
      }
    ]
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
    { '@type': 'AdministrativeArea', name: 'Braj Dham' },
    { '@type': 'Place', name: 'Yamuna Expressway Mathura Cut' },
    { '@type': 'Place', name: 'Chattikara Road' },
    { '@type': 'Place', name: 'Prem Mandir Raman Reti' }
  ],
  sameAs: ['https://wa.me/919720965985', 'https://rentoncent.bond']
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I get a bike or scooty on rent in Vrindavan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Select your preferred two-wheeler online at rentoncent.bond or via WhatsApp at +91 97209 65985. Complete quick 2-minute digital KYC (Aadhaar & Driving Licence), choose your pickup point (Prem Mandir, Mathura Junction, or your hotel), and receive your vehicle with 2 free sanitized ISI helmets.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is the price of bike on rent in Vrindavan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Bike and scooty on rent in Vrindavan starts at ₹40/hour and ₹299/day for Honda Activa 6G and TVS Jupiter. High-range electric scooters (EV) are ₹349/day with free charging, and Royal Enfield Classic 350 cruisers are ₹899/day.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is Vrindavan rental service and how does it help pilgrims?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vrindavan rental by Rent on Cent provides verified peer-to-peer bikes and scooters to avoid expensive e-rickshaws and reach temples like Shri Bankey Bihari, Prem Mandir, Nidhivan, and Govardhan Parikrama independently at transparent fixed rates.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I rent a scooty near Prem Mandir or Bankey Bihari Temple?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Rent on Cent has its central hub on Raman Reti Road near Prem Mandir, and provides 10-minute doorstep vehicle handovers across Bankey Bihari Temple, ISKCON, Vidyapeeth Chauraha, and all Vrindavan hotels & ashrams.'
      }
    },
    {
      '@type': 'Question',
      name: 'What documents are required to take a bike or scooty on rent in Vrindavan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A valid Indian Driving Licence (DL) and Government Identity Proof (Aadhaar Card or Passport). Verification is completed 100% digitally before vehicle handover.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is security cash deposit required for bike rentals?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rent on Cent offers zero cash deposit options with digital KYC verification. You only pay the transparent daily or hourly rental fee.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I take a rented scooter for Govardhan Parikrama?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! All Rent on Cent scooters and bikes are permitted and certified for the 21 km Govardhan Parikrama, Radha Kund, Shyam Kund, Barsana, and Mathura circuits.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I host my bike on Rent on Cent to earn money?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Two-wheeler owners in Vrindavan and Mathura can switch to Host mode on Rent on Cent and list their vehicles with 0 upfront cost, earning up to ₹15,000 to ₹22,000 monthly with digital safety inspections and verified renter agreements.'
      }
    }
  ]
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Rent on Cent',
  alternateName: 'Vrindavan Rental',
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
