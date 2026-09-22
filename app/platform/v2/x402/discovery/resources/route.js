export const dynamic = 'force-static';
export const revalidate = 86400;

const x402Resources = {
  resources: [
    {
      resource: 'https://rentoncent.bond/api/vehicles',
      price: '0.00',
      currency: 'INR',
      description: 'Vehicle fleet search is publicly accessible without micro-payment.'
    }
  ]
};

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=3600, s-maxage=86400',
  'Link': '</.well-known/api-catalog>; rel="api-catalog"'
};

export async function GET() {
  return new Response(JSON.stringify(x402Resources, null, 2), { status: 200, headers });
}

export async function HEAD() {
  return new Response(null, { status: 200, headers });
}
