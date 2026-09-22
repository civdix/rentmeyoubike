export const dynamic = 'force-static';
export const revalidate = 86400;

const jwks = {
  keys: [
    {
      kty: 'OKP',
      crv: 'Ed25519',
      kid: 'rentoncent-bot-key-2026',
      use: 'sig',
      x: '11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrGwOGP5726w',
      alg: 'EdDSA'
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
  return new Response(JSON.stringify(jwks, null, 2), { status: 200, headers });
}

export async function HEAD() {
  return new Response(null, { status: 200, headers });
}
