export const dynamic = 'force-static';
export const revalidate = 86400;

const agentCard = {
  name: 'Rent on Cent Vrindavan Bike & Scooter Rental Agent',
  version: '1.0.0',
  description: 'Autonomous AI Agent for discovering rental fleet inventory, checking tariffs, and reserving bikes and scooters with doorstep delivery in Vrindavan and Mathura.',
  provider: {
    name: 'Rent on Cent',
    url: 'https://rentoncent.bond'
  },
  supportedInterfaces: [
    {
      url: 'https://rentoncent.bond/a2a',
      serviceUrl: 'https://rentoncent.bond/a2a',
      protocolBinding: 'HTTP+JSON',
      transport: 'https'
    },
    {
      url: 'https://rentoncent.bond/api/vehicles',
      serviceUrl: 'https://rentoncent.bond/api/vehicles',
      protocolBinding: 'HTTP+JSON',
      transport: 'http'
    }
  ],
  capabilities: {
    streaming: false,
    tools: true,
    pushNotifications: false,
    extensions: [
      {
        uri: 'https://github.com/google-agentic-commerce/ap2/tree/v0.1',
        required: false,
        role: 'credentials-provider',
        description: 'Google Agent Payments Protocol (AP2) credentials and transaction authorization.'
      },
      {
        uri: 'https://github.com/google-agentic-commerce/ap2',
        required: false,
        role: 'credentials-provider',
        description: 'Google Agent Payments Protocol (AP2) payment verification.'
      },
      {
        uri: 'https://ap2-protocol.org/',
        required: false,
        role: 'credentials-provider',
        description: 'AP2 agent payments and credentials verification protocol.'
      }
    ]
  },
  skills: [
    {
      id: 'browse-fleet',
      name: 'Browse Rental Fleet',
      description: 'Fetches verified scooters (Activa 6G, Jupiter), EV bikes, and Royal Enfield cruisers available in Vrindavan.'
    },
    {
      id: 'book-vehicle',
      name: 'Book Scooter / Bike Rental',
      description: 'Creates a rental booking reservation with doorstep hotel, ashram, or railway station delivery.'
    },
    {
      id: 'locate-hubs',
      name: 'Locate Delivery Hubs',
      description: 'Identifies nearby pickup hubs including Prem Mandir, Chattikara Road, Mathura Junction, and Yamuna Expressway cuts.'
    }
  ],
  extensions: [
    {
      uri: 'https://github.com/google-agentic-commerce/ap2/tree/v0.1',
      required: false,
      role: 'credentials-provider',
      description: 'Google Agent Payments Protocol (AP2) credentials and transaction authorization.'
    },
    {
      uri: 'https://github.com/google-agentic-commerce/ap2',
      required: false,
      role: 'credentials-provider',
      description: 'Google Agent Payments Protocol (AP2) payment verification.'
    },
    {
      uri: 'https://ap2-protocol.org/',
      required: false,
      role: 'credentials-provider',
      description: 'AP2 agent payments and credentials verification protocol.'
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
  return new Response(JSON.stringify(agentCard, null, 2), { status: 200, headers });
}

export async function HEAD() {
  return new Response(null, { status: 200, headers });
}
