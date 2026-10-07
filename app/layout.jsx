import './globals.css';
import { Providers } from './providers';

export const metadata = {
  metadataBase: new URL('https://rentoncent.bond'),
  title: {
    default: 'Bike on Rent in Mathura & Vrindavan | Scooty Rental & Two-Wheeler Hire',
    template: '%s | Rent on Cent'
  },
  description:
    'Rent bike and scooty in Mathura & Vrindavan from ₹299/day (₹40/hr). Verified Activa 6G & EV with zero deposit, free helmets & doorstep delivery across Mathura Junction, BSA College, Dampier Nagar, Prem Mandir & hotels. Instant WhatsApp booking.',
  keywords: [
    'bike on rent in mathura',
    'scooty on rent in mathura',
    'bike on rent in vrindavan',
    'scooty on rent in vrindavan',
    'mathura rental',
    'vrindavan rental',
    'two wheeler rental mathura vrindavan',
    'bike rental mathura junction railway station',
    'scooty on rent near bsa college mathura',
    'mathura bus stand scooty rental',
    'dampier nagar bike rental',
    'bike on rent near krishna janmabhoomi',
    'activa on rent in mathura',
    'activa on rent in vrindavan',
    'honda activa on rent in vrindavan',
    'electric scooter rental mathura',
    'electric scooter rental vrindavan',
    'mathura bike rental price per day',
    'vrindavan bike rental price per day',
    'bike rental near mathura cantt',
    'scooty on rent near prem mandir vrindavan',
    'bike on rent near bankey bihari temple',
    'rentoncent',
    'rent on cent',
    'Rent on Cent',
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
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Bike on Rent in Mathura & Vrindavan | Scooty Rental & Two-Wheeler Hire',
    description:
      'Rent verified Honda Activa, EV scooters & bikes in Mathura & Vrindavan from ₹299/day. Free helmets and doorstep delivery to Mathura Junction, BSA College, Prem Mandir & hotels.',
    url: 'https://rentoncent.bond/',
    siteName: 'Rent on Cent - Mathura & Vrindavan Rental',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://rentoncent.bond/og-customer.jpg',
        secureUrl: 'https://rentoncent.bond/og-customer.jpg',
        width: 1200,
        height: 1200,
        type: 'image/jpeg',
        alt: 'Rent on Cent - Bike & Scooty on Rent in Mathura & Vrindavan'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bike on Rent in Mathura & Vrindavan | Scooty Rental & Two-Wheeler Hire',
    description: 'Rent Activa, Royal Enfield & EV in Mathura & Vrindavan from ₹299/day with free helmets.',
    images: ['https://rentoncent.bond/og-customer.jpg']
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48 32x32 16x16' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon-96x96.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
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
  '@id': 'https://rentoncent.bond/#autorental',
  name: 'Rent on Cent',
  alternateName: [
    'Mathura Vrindavan Rental',
    'Bike on Rent in Mathura',
    'Bike on Rent in Vrindavan',
    'Scooty on Rent in Mathura',
    'Rent on Cent Mathura',
    'Rent on Cent Vrindavan',
    'Rent on Cent',
    'Rentoncent'
  ],
  slogan: 'Rent Ride Explore — Best Bike & Scooty on Rent in Mathura & Vrindavan',
  url: 'https://rentoncent.bond',
  logo: 'https://rentoncent.bond/logo_square_share_area.png',
  image: 'https://rentoncent.bond/og-customer.jpg',
  description:
    'Premier Mathura and Vrindavan rental platform offering bike on rent in Mathura, bike on rent in Vrindavan, scooty on rent, and two-wheeler rentals. Rent verified Honda Activa 6G, EV electric scooters, and Royal Enfield Classic 350 starting at ₹40/hr and ₹299/day with doorstep delivery to Mathura Junction, Near BSA College, Mathura Bus Stand, Dampier Nagar, Prem Mandir, Bankey Bihari, and all hotels & ashrams.',
  telephone: '+919720965985',
  email: 'support@rentoncent.bond',
  priceRange: '₹299 - ₹1200 / day',
  currenciesAccepted: 'INR',
  paymentAccepted: 'UPI, Cash, Debit Card, Credit Card, Net Banking',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Raman Reti Road, Near Prem Mandir',
    addressLocality: 'Vrindavan & Mathura',
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
    'Bike on rent in Mathura',
    'Bike on rent in Vrindavan',
    'Scooty on rent in Mathura',
    'Scooty on rent in Vrindavan',
    'Bike rental near BSA College Mathura',
    'Mathura Bus Stand scooty hire',
    'Mathura Junction railway station bike rental',
    'Dampier Nagar Mathura bike rent',
    'Two wheeler rental Mathura Vrindavan',
    'Electric scooter rental Vrindavan',
    'Honda Activa rental Mathura',
    'Royal Enfield on rent in Vrindavan',
    'Govardhan Parikrama bike rent',
    'Doorstep hotel bike delivery Mathura Vrindavan'
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Vrindavan Bike & Scooty Rental Plans',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Honda Activa 6G Scooty on Rent in Vrindavan',
          serviceType: 'Two-Wheeler Rental',
          description: '110cc automatic scooter with 2 sanitized helmets and mobile holder included.',
          provider: {
            '@id': 'https://rentoncent.bond/#autorental'
          }
        },
        price: '299',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        validFrom: '2026-01-01'
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Electric Scooter (EV) on Rent in Vrindavan',
          serviceType: 'Electric Scooter Rental',
          description: 'High-range electric scooter with 80-100 km range per charge. Free charging cables included.',
          provider: {
            '@id': 'https://rentoncent.bond/#autorental'
          }
        },
        price: '349',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        validFrom: '2026-01-01'
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Royal Enfield Classic 350 on Rent in Vrindavan',
          serviceType: 'Cruiser Motorcycle Rental',
          description: '350cc cruiser bike perfect for Govardhan Parikrama and Mathura-Barsana circuits.',
          provider: {
            '@id': 'https://rentoncent.bond/#autorental'
          }
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
    { '@type': 'City', name: 'Mathura' },
    { '@type': 'City', name: 'Vrindavan' },
    { '@type': 'Place', name: 'Near BSA College of Engineering & Technology' },
    { '@type': 'Place', name: 'Mathura Bus Stand (ISBT)' },
    { '@type': 'Place', name: 'Mathura Junction Railway Station' },
    { '@type': 'Place', name: 'Dampier Nagar Mathura' },
    { '@type': 'Place', name: 'Shri Krishna Janmabhoomi Mathura' },
    { '@type': 'Place', name: 'Dwarkadhish Temple & Vishram Ghat' },
    { '@type': 'Place', name: 'Goverdhan Chauraha Mathura' },
    { '@type': 'Place', name: 'Yamuna Expressway Mathura Cut' },
    { '@type': 'Place', name: 'Chattikara Road' },
    { '@type': 'Place', name: 'Prem Mandir Raman Reti' },
    { '@type': 'Place', name: 'Bankey Bihari Temple Marg' },
    { '@type': 'AdministrativeArea', name: 'Govardhan' },
    { '@type': 'AdministrativeArea', name: 'Barsana' },
    { '@type': 'AdministrativeArea', name: 'Braj Dham' }
  ],
  sameAs: ['https://wa.me/919720965985', 'https://rentoncent.bond']
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I get a bike or scooty on rent in Mathura and Vrindavan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Select your preferred two-wheeler online at rentoncent.bond or via WhatsApp at +91 97209 65985. Complete quick 2-minute digital KYC (Aadhaar & Driving Licence), choose your pickup point (Mathura Junction, BSA College, Mathura Bus Stand, Dampier Nagar, Prem Mandir, or your hotel), and receive your vehicle with 2 free sanitized ISI helmets.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is the price of bike on rent in Mathura and Vrindavan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Bike and scooty on rent in Mathura and Vrindavan starts at ₹40/hour and ₹299/day for Honda Activa 6G and TVS Jupiter. High-range electric scooters (EV) are ₹349/day with free charging, and Royal Enfield Classic 350 cruisers are ₹899/day with zero cash deposit options.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I pick up a scooty at Mathura Junction or Mathura Bus Stand and return in Vrindavan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Rent on Cent supports flexible cross-city pickups and returns. You can receive your scooter at Mathura Junction Platform 1 or Mathura Bus Stand (ISBT) upon arrival and drop it off at your hotel in Vrindavan or vice versa.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you deliver near BSA College of Engineering and Dampier Nagar in Mathura?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We provide 10-15 minute doorstep vehicle handovers across Mathura city including BSA College Road, Dampier Nagar, Krishna Nagar, Goverdhan Chauraha, and all Mathura hotels & guest houses.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I rent a scooty near Prem Mandir or Bankey Bihari Temple in Vrindavan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Rent on Cent has its central hub on Raman Reti Road near Prem Mandir, and provides 10-minute doorstep vehicle handovers across Bankey Bihari Temple, ISKCON, Vidyapeeth Chauraha, and all Vrindavan hotels & ashrams.'
      }
    },
    {
      '@type': 'Question',
      name: 'What documents are required to take a bike or scooty on rent in Mathura & Vrindavan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A valid Indian Driving Licence (DL) and Government Identity Proof (Aadhaar Card, Student ID, or Passport). Verification is completed 100% digitally before vehicle handover.'
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
      name: 'Can I take a rented scooter for Govardhan Parikrama from Mathura or Vrindavan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! All Rent on Cent scooters and bikes are permitted and certified for the 21 km Govardhan Parikrama, Radha Kund, Shyam Kund, Barsana, and Mathura-Vrindavan circuits.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I host my bike on Rent on Cent in Mathura or Vrindavan to earn money?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Two-wheeler owners in Mathura and Vrindavan can switch to Host mode on Rent on Cent and list their vehicles with 0 upfront cost, earning up to ₹15,000 to ₹22,000 monthly with digital safety inspections and verified renter agreements.'
      }
    }
  ]
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Rent on Cent',
  alternateName: 'Mathura & Vrindavan Rental',
  url: 'https://rentoncent.bond',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://rentoncent.bond/bikes?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="ai-catalog" href="/.well-known/ai-catalog.json" />
        <link rel="api-catalog" href="/.well-known/api-catalog" />
        {/* Favicon & Search Engine Result Icons (Google Search Console & Bing Compliant) */}
        <link rel="icon" href="/favicon.ico" sizes="48x48 32x32 16x16" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/web-app-manifest-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/web-app-manifest-512x512.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon-96x96.png" />
        {/* Preload critical LCP Hero Image for Core Web Vitals */}
        <link
          rel="preload"
          as="image"
          href="/images/hero-rider-vrindavan.webp"
          type="image/webp"
          fetchPriority="high"
        />
        {/* WebMCP: Expose site tools to AI agents per WebMachineLearning spec */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'modelContext' in navigator) {
                try {
                  navigator.modelContext.registerTool({
                    name: 'search_rentoncent_bikes',
                    description: 'Search available rental scooters, bikes, and EVs in Vrindavan and Mathura with prices starting at ₹299/day.',
                    inputSchema: {
                      type: 'object',
                      properties: {
                        category: { type: 'string', description: 'scooter, bike, or ev' },
                        pickupLocation: { type: 'string', description: 'Location in Vrindavan/Mathura' }
                      }
                    },
                    execute: async (params) => {
                      const res = await fetch('/api/vehicles');
                      return await res.json();
                    }
                  });
                  navigator.modelContext.registerTool({
                    name: 'get_rental_rates',
                    description: 'Get verified rental tariffs for Honda Activa 6G, TVS Jupiter, EV scooters, and Royal Enfield cruisers.',
                    inputSchema: {
                      type: 'object',
                      properties: {
                        durationDays: { type: 'number', description: 'Rental duration in days' }
                      }
                    },
                    execute: async (params) => {
                      return {
                        activa6g: 299 * (params?.durationDays || 1),
                        jupiter125: 320 * (params?.durationDays || 1),
                        evScooter: 349 * (params?.durationDays || 1),
                        classic350: 899 * (params?.durationDays || 1),
                        currency: 'INR',
                        deposit: 0,
                        freeHelmets: 2
                      };
                    }
                  });
                } catch (e) {
                  console.debug('WebMCP init', e);
                }
              }
            `
          }}
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
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
