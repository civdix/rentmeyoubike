import { NextResponse } from 'next/server';

export function proxy(request) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';

  // Permanently 301 redirect any requests with www. prefix to apex canonical domain (rentoncent.bond)
  if (host.toLowerCase().startsWith('www.')) {
    const newHost = host.replace(/^www\./i, '');
    const search = request.nextUrl.search || '';
    const pathname = request.nextUrl.pathname || '/';
    return NextResponse.redirect(new URL(`${pathname}${search}`, `https://${newHost}`), 301);
  }

  const acceptHeader = request.headers.get('accept') || '';
  const pathname = request.nextUrl.pathname || '';

  // Handle Markdown content negotiation for AI agents (Accept: text/markdown)
  if (acceptHeader.includes('text/markdown') && !pathname.startsWith('/api') && !pathname.startsWith('/.') && !pathname.includes('.')) {
    const rewriteUrl = new URL('/llms.txt', request.url);
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set('Content-Type', 'text/markdown; charset=utf-8');
    response.headers.set('Vary', 'Accept');
    response.headers.set('Link', '</.well-known/api-catalog>; rel="api-catalog"');
    return response;
  }

  const response = NextResponse.next();
  response.headers.set('Link', '</.well-known/api-catalog>; rel="api-catalog"');
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for internal static assets:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     */
    '/((?!_next/static|_next/image).*)',
  ],
};
