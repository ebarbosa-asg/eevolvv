import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth(function middleware(req) {
  // Talent subdomain rewrite — talent.eevolvv.com/* → /talent/*
  const host = req.headers.get('host') || ''
  if (host.startsWith('talent.')) {
    const url = req.nextUrl.clone()
    const pathname = url.pathname
    url.pathname = pathname === '/' ? '/talent' : `/talent${pathname}`
    return NextResponse.rewrite(url)
  }

  // Protect /os/** — redirect unauthenticated users to sign-in
  if (req.nextUrl.pathname.startsWith('/os')) {
    if (!req.auth) {
      const signInUrl = new URL('/signin', req.url)
      return NextResponse.redirect(signInUrl)
    }
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
