export const dynamic = 'force-static';
export const revalidate = 86400;

const ucp = {
  ucp: {
    version: '2026-04-08',
    services: {
      'dev.ucp.shopping': {
        version: '2026-04-08',
        rest: {
          endpoint: 'https://rentoncent.bond/api'
        }
      }
    },
    capabilities: [
      {
        version: '2026-04-08',
        spec: 'https://ucp.dev/2026-04-08/specification/shopping/checkout'
      }
    ]
  },
  protocol_version: '1.0.0',
  services: [
    {
      name: 'rental_service',
      version: '1.0.0',
      description: 'Rent on Cent Two-Wheeler & EV Rental Service in Vrindavan'
    }
  ],
  capabilities: [
    'vehicle_booking',
    'fleet_search',
    'delivery_coordination'
  ],
  endpoints: {
    vehicles: 'https://rentoncent.bond/api/vehicles',
    bookings: 'https://rentoncent.bond/api/bookings'
  }
};

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=3600, s-maxage=86400',
  'Link': '</.well-known/api-catalog>; rel="api-catalog"'
};

export async function GET() {
  return new Response(JSON.stringify(ucp, null, 2), { status: 200, headers });
}

export async function HEAD() {
  return new Response(null, { status: 200, headers });
}
