export const dynamic = 'force-static';
export const revalidate = 86400;

const prm = {
  resource: 'https://rentoncent.bond',
  authorization_servers: [
    'https://rentoncent.bond'
  ],
  scopes_supported: [
    'read:fleet',
    'create:booking',
    'query:availability'
  ],
  bearer_methods_supported: [
    'header'
  ],
  resource_documentation: 'https://rentoncent.bond/auth.md'
};

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=3600, s-maxage=86400',
  'Link': '</.well-known/api-catalog>; rel="api-catalog"'
};

export async function GET() {
  return new Response(JSON.stringify(prm, null, 2), { status: 200, headers });
}

export async function HEAD() {
  return new Response(null, { status: 200, headers });
}
