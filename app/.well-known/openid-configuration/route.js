export const dynamic = 'force-static';
export const revalidate = 86400;

const oidcConfig = {
  issuer: 'https://rentoncent.bond',
  authorization_endpoint: 'https://rentoncent.bond/api/oauth/authorize',
  token_endpoint: 'https://rentoncent.bond/api/oauth/token',
  userinfo_endpoint: 'https://rentoncent.bond/api/oauth/userinfo',
  jwks_uri: 'https://rentoncent.bond/.well-known/jwks.json',
  scopes_supported: [
    'openid',
    'profile',
    'email',
    'read:fleet',
    'create:booking'
  ],
  response_types_supported: [
    'code',
    'token',
    'id_token'
  ],
  subject_types_supported: [
    'public'
  ],
  id_token_signing_alg_values_supported: [
    'RS256',
    'EdDSA'
  ]
};

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=3600, s-maxage=86400',
  'Link': '</.well-known/api-catalog>; rel="api-catalog"'
};

export async function GET() {
  return new Response(JSON.stringify(oidcConfig, null, 2), { status: 200, headers });
}

export async function HEAD() {
  return new Response(null, { status: 200, headers });
}
