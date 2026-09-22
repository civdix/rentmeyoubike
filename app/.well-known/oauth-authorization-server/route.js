export const dynamic = 'force-static';
export const revalidate = 86400;

const oauthMetadata = {
  issuer: 'https://rentoncent.bond',
  authorization_endpoint: 'https://rentoncent.bond/api/oauth/authorize',
  token_endpoint: 'https://rentoncent.bond/api/oauth/token',
  jwks_uri: 'https://rentoncent.bond/.well-known/jwks.json',
  registration_endpoint: 'https://rentoncent.bond/api/agent/register',
  scopes_supported: [
    'read:fleet',
    'create:booking',
    'query:availability'
  ],
  response_types_supported: [
    'code',
    'token'
  ],
  grant_types_supported: [
    'authorization_code',
    'client_credentials',
    'urn:ietf:params:oauth:grant-type:token-exchange'
  ],
  token_endpoint_auth_methods_supported: [
    'client_secret_basic',
    'client_secret_post',
    'private_key_jwt'
  ],
  agent_auth: {
    skill: 'https://rentoncent.bond/.well-known/agent-skills/rentoncent-bike-booking/SKILL.md',
    register_uri: 'https://rentoncent.bond/api/agent/register',
    revocation_uri: 'https://rentoncent.bond/api/agent/revoke',
    identity_types_supported: [
      'identity_assertion',
      'anonymous'
    ],
    identity_assertion: {
      assertion_types_supported: [
        'urn:ietf:params:oauth:token-type:id-jag',
        'verified_email'
      ],
      credential_types: [
        'bearer_token',
        'jwk',
        'api_key'
      ],
      claim_uri: 'https://rentoncent.bond/api/agent/claim-email'
    },
    anonymous: {
      credential_types_supported: [
        'ephemeral_token'
      ],
      claim_uri: 'https://rentoncent.bond/api/agent/anonymous-claim'
    },
    events_supported: [
      'revocation'
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
  return new Response(JSON.stringify(oauthMetadata, null, 2), { status: 200, headers });
}

export async function HEAD() {
  return new Response(null, { status: 200, headers });
}
