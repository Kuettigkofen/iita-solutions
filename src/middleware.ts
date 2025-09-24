import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Skip middleware for API routes and static files
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.includes('.') ||
    request.nextUrl.pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Check for authentication
  const basicAuth = request.headers.get('authorization')

  if (basicAuth) {
    try {
      const authValue = basicAuth.split(' ')[1]
      if (authValue) {
        const [user, pwd] = Buffer.from(authValue, 'base64').toString().split(':')

        // Fixed credentials for testing
        const validUser = 'iita_admin'
        const validPassword = 'ClimateSmartAg2024!'

        if (user === validUser && pwd === validPassword) {
          return NextResponse.next()
        }
      }
    } catch (error) {
      // Invalid auth header format
    }
  }

  // Return authentication challenge
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="IITA Solutions - Protected Area"',
    },
  })
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}