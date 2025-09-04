// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // List of routes that require auth
  const protectedRoutes = ['/admin', '/admin/notes'];

  if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    /* const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.redirect(new URL('/login', request.url));
    } */
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // All dashboard routes
};


/* // middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Redirect authenticated users away from auth pages
  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/tasks', request.url));
  }

  // Protect task routes for unauthenticated users
  if (!token && pathname.startsWith('/tasks')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token for API routes
  if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth')) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      const response = NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      response.cookies.set('token', '', { maxAge: 0 });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/tasks/:path*',
    '/login',
    '/signup',
    '/api/:path*',
  ],
}; */