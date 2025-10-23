import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip middleware for API routes - they handle their own logic
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  const isAuthenticated = request.cookies.get('tom_authenticated')?.value === 'true';

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/modern', '/admin'];
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // If not authenticated and trying to access protected route
  if (!isPublicPath && !isAuthenticated) {
    // Redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If authenticated and trying to access login page
  if (isPublicPath && isAuthenticated && request.nextUrl.pathname.startsWith("/login")) {
    // Redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|medaskca-logo.png|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)',
  ],
};
