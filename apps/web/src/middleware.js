import { NextResponse } from 'next/server';

function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1];
    const json = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  const protectedPaths = ['/dashboard', '/problems'];
  const adminPaths = ['/admin'];

  const isProtected = protectedPaths.some(p => pathname.startsWith(p));
  const isAdmin = adminPaths.some(p => pathname.startsWith(p));

  if (isProtected || isAdmin) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = decodeJwtPayload(token);
    if (!payload || payload.exp * 1000 < Date.now()) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('access_token');
      return response;
    }

    if (isAdmin && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/problems/:path*', '/admin/:path*']
};
