export const dynamic = 'force-static';
export const revalidate = 86400;

const mcpServerCard = {
  serverInfo: {
    name: 'Rent on Cent MCP Server',
    version: '1.0.0',
    description: 'Model Context Protocol (MCP) server for discovering rental scooters, bikes, hourly rates, and booking vehicle delivery in Vrindavan and Mathura.'
  },
  endpoint: 'https://rentoncent.bond/mcp',
  transport: {
    type: 'http',
    url: 'https://rentoncent.bond/mcp'
  },
  capabilities: {
    tools: [
      {
        name: 'search_vehicles',
        description: 'Find available scooters, bikes, and EVs in Vrindavan with pricing and delivery hub options.',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              enum: ['scooter', 'bike', 'ev', 'all'],
              description: 'Vehicle category filter'
            },
            location: {
              type: 'string',
              description: 'Delivery landmark or hub (e.g., Prem Mandir, Chattikara, Mathura Junction)'
            }
          }
        }
      },
      {
        name: 'get_vehicle_pricing',
        description: 'Calculates rental charges based on rental duration (hourly, daily, weekly) and vehicle type.',
        inputSchema: {
          type: 'object',
          required: ['vehicleModel', 'durationDays'],
          properties: {
            vehicleModel: { type: 'string' },
            durationDays: { type: 'number' }
          }
        }
      },
      {
        name: 'find_rental_hub',
        description: 'Finds nearest pickup point or verifies doorstep delivery eligibility at hotels/ashrams.',
        inputSchema: {
          type: 'object',
          required: ['addressOrLandmark'],
          properties: {
            addressOrLandmark: { type: 'string' }
          }
        }
      }
    ],
    resources: [
      {
        uri: 'rentoncent://fleet/available',
        name: 'Live Rental Fleet',
        mimeType: 'application/json',
        description: 'Current real-time catalog of available two-wheelers in Vrindavan and Mathura'
      },
      {
        uri: 'rentoncent://tariffs/daily',
        name: 'Standard Tariff Sheet',
        mimeType: 'application/json',
        description: 'Official price table starting at ₹299/day with deposit terms and free helmet policies'
      }
    ],
    prompts: [
      {
        name: 'rent_scooter_in_vrindavan',
        description: 'Assists a user in selecting the ideal scooter or bike for visiting temples in Vrindavan',
        arguments: [
          {
            name: 'destination',
            description: 'Main temple or place to visit (e.g. Bankey Bihari, Govardhan)',
            required: false
          }
        ]
      }
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
  return new Response(JSON.stringify(mcpServerCard, null, 2), { status: 200, headers });
}

export async function HEAD() {
  return new Response(null, { status: 200, headers });
}
