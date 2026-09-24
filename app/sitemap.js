import { ALL_LOCATIONS } from '../src/data/locationSeoData';

export default function sitemap() {
  const baseUrl = 'https://rentoncent.bond';
  const currentDate = new Date().toISOString();

  const locationUrls = ALL_LOCATIONS.map((location) => ({
    url: `${baseUrl}/rent-bike-cars-scooty-in/${location.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85
  }));

  return [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/bikes`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95
    },
    {
      url: `${baseUrl}/rent-bike-cars-scooty-in`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9
    },
    ...locationUrls,
    {
      url: `${baseUrl}/reviews`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/jobs-in-vrindavan`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85
    },
    {
      url: `${baseUrl}/host`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5
    }
  ];
}
