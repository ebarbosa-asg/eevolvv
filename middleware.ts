import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Talent subdomain rewrite — talent.eevolvv.com/* → /talent/*
  const host = request.headers.get('host') || ''
  if (host.startsWith('talent.')) {
    const url = request.nextUrl.clone()
    const pathname = url.pathname
    url.pathname = pathname === '/' ? '/talent' : `/talent${pathname}`
    return NextResponse.rewrite(url)
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
