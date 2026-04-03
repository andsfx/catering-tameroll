import { NextResponse, type NextRequest } from 'next/server'

const adminSessionCookieName = 'tameroll_admin_session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  const hasSession = Boolean(request.cookies.get(adminSessionCookieName)?.value)

  if (!hasSession) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
