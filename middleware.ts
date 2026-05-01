import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''

  if (host.startsWith('talent.')) {
    const url = request.nextUrl.clone()
    const path = url.pathname
    // Rewrite talent.eevolvv.com/* → /talent/* (URL stays the same in browser)
    url.pathname = path === '/' ? '/talent' : `/talent${path}`
    return NextResponse.rewrite(url)
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
