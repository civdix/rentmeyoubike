export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/']
      }
    ],
    sitemap: 'https://rentoncent.bond/sitemap.xml',
    host: 'https://rentoncent.bond'
  };
}
