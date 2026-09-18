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
  }
};

export default nextConfig;
