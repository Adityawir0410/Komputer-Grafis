import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if this is a tour route
  if (request.nextUrl.pathname.startsWith('/tour')) {
    // Get user cookie
    const userCookie = request.cookies.get('user');
    
    if (!userCookie) {
      // Redirect to home page if not authenticated
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      // Validate the user cookie
      const user = JSON.parse(userCookie.value);
      if (!user.nim || !user.fullName) {
        // Invalid user data, redirect to home
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // Invalid cookie format, redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/tour/:path*']
};
