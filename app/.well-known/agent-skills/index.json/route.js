export const dynamic = 'force-static';
export const revalidate = 86400;

const skillsIndex = {
  $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
  skills: [
    {
      name: 'rentoncent-bike-booking',
      type: 'skill-md',
      description: 'Autonomous agent skill for discovering rental scooters, bikes, pricing, and booking vehicle delivery in Vrindavan and Mathura.',
      url: 'https://rentoncent.bond/.well-known/agent-skills/rentoncent-bike-booking/SKILL.md',
      digest: 'sha256:e1ce76988c0b9393d1e8f510d25ec8f03aeb82a791de219d100f66b833bde039'
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
  return new Response(JSON.stringify(skillsIndex, null, 2), { status: 200, headers });
}

export async function HEAD() {
  return new Response(null, { status: 200, headers });
}
