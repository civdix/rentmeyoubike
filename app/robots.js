export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin', '/my-bookings']
      }
    ],
    sitemap: 'https://rentoncent.bond/sitemap.xml',
    host: 'https://rentoncent.bond'
  };
}
