import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'auth.md');
  const markdown = fs.readFileSync(filePath, 'utf-8');

  return new Response(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400'
    }
  });
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400'
    }
  });
}
