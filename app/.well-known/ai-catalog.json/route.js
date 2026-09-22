export const dynamic = 'force-static';
export const revalidate = 86400;

const ardManifest = {
  specVersion: '1.0',
  host: {
    domain: 'rentoncent.bond',
    name: 'Rent on Cent',
    displayName: 'Rent on Cent',
    identifier: 'urn:ai:rentoncent.bond',
    description: 'Peer-to-peer bike, scooty, and electric two-wheeler rental platform in Vrindavan and Mathura'
  },
  entries: [
    {
      identifier: 'urn:ai:rentoncent.bond:api:fleet',
      id: 'urn:ai:rentoncent.bond:api:fleet',
      displayName: 'Rent on Cent Fleet & Booking API',
      type: 'application/openapi+json',
      url: 'https://rentoncent.bond/openapi.json',
      description: 'Browse available scooters and bikes, check tariffs starting at ₹299/day, and reserve vehicles.',
      representativeQueries: [
        'Bike rental in Vrindavan',
        'Scooty on rent in Vrindavan',
        'Activa rental near Prem Mandir',
        'Mathura Junction bike delivery'
      ]
    },
    {
      identifier: 'urn:ai:rentoncent.bond:mcp:server',
      id: 'urn:ai:rentoncent.bond:mcp:server',
      displayName: 'Rent on Cent MCP Server',
      type: 'application/mcp-server+json',
      url: 'https://rentoncent.bond/.well-known/mcp/server-card.json',
      description: 'Model Context Protocol (MCP) server for querying rental fleet availability and booking tools.',
      representativeQueries: [
        'Query available rental scooters with AI agent',
        'Calculate bike rental charges for Vrindavan trip',
        'Find nearest scooter delivery hub'
      ]
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
  return new Response(JSON.stringify(ardManifest, null, 2), { status: 200, headers });
}

export async function HEAD() {
  return new Response(null, { status: 200, headers });
}
