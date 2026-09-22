export const dynamic = 'force-static';
export const revalidate = 86400;

const acp = {
  protocol: {
    name: 'acp',
    version: '1.0.0'
  },
  api_base_url: 'https://rentoncent.bond/api',
  transports: [
    'http',
    'sse'
  ],
  capabilities: {
    services: [
      'vehicle_reservation',
      'fleet_catalog_search',
      'doorstep_delivery_calculator'
    ]
  }
};

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=3600, s-maxage=86400',
  'Link': '</.well-known/api-catalog>; rel="api-catalog"'
};

export async function GET() {
  return new Response(JSON.stringify(acp, null, 2), { status: 200, headers });
}

export async function HEAD() {
  return new Response(null, { status: 200, headers });
}
