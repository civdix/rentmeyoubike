/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' }
    ]
  },
  async redirects() {
    return [
      {
        source: '/locations',
        destination: '/rent-bike-cars-scooty-in',
        permanent: true
      },
      {
        source: '/locations/:slug',
        destination: '/rent-bike-cars-scooty-in/:slug',
        permanent: true
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.rentoncent.bond'
          }
        ],
        destination: 'https://rentoncent.bond/:path*',
        permanent: true
      }
    ];
  },
  async rewrites() {
    const rawUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://rentmeyoubikebackend.onrender.com';
    const cleanHost = String(rawUrl).trim().replace(/\/+$/, '').replace(/\/api$/, '');
    return [
      {
        source: '/api/:path*',
        destination: `${cleanHost}/api/:path*`
      },
      {
        source: '/uploads/:path*',
        destination: `${cleanHost}/uploads/:path*`
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/.well-known/api-catalog',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/linkset+json'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          }
        ]
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Link',
            value: '</.well-known/api-catalog>; rel="api-catalog"'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
