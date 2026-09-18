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

  return NextResponse.next();
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
