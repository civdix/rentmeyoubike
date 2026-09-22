export const dynamic = 'force-static';
export const revalidate = 86400;

const catalog = {
  linkset: [
    {
      anchor: 'https://rentoncent.bond/api',
      'service-desc': [
        {
          href: 'https://rentoncent.bond/openapi.json',
          type: 'application/json'
        }
      ],
      'service-doc': [
        {
          href: 'https://rentoncent.bond/terms',
          type: 'text/html'
        }
      ],
      status: [
        {
          href: 'https://rentoncent.bond/api/health',
          type: 'application/json'
        }
      ]
    },
    {
      anchor: 'https://rentoncent.bond/api/vehicles',
      'service-desc': [
        {
          href: 'https://rentoncent.bond/openapi.json',
          type: 'application/json'
        }
      ],
      'service-doc': [
        {
          href: 'https://rentoncent.bond/bikes',
          type: 'text/html'
        }
      ]
    }
  ]
};

const headers = {
  'Content-Type': 'application/linkset+json',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=3600, s-maxage=86400',
  'Link': '</.well-known/api-catalog>; rel="api-catalog"'
};

export async function GET() {
  return new Response(JSON.stringify(catalog, null, 2), {
    status: 200,
    headers
  });
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers
  });
}
