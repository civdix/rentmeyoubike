export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/admin', '/my-bookings']
      },
      {
        userAgent: [
          'OAI-SearchBot',
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'anthropic-ai',
          'Google-Extended',
          'Applebot-Extended'
        ],
        allow: ['/', '/llms.txt', '/llms-full.txt', '/bikes', '/locations', '/rent-bike-cars-scooty-in', '/reviews', '/jobs-in-vrindavan'],
        disallow: ['/api/', '/admin', '/my-bookings']
      }
    ],
    sitemap: 'https://rentoncent.bond/sitemap.xml',
    host: 'https://rentoncent.bond'
  };
}
