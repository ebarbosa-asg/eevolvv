import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export default auth((req) => {
  const path = req.nextUrl.pathname

  // Protect /os — redirect unauthenticated users to sign-in
  if (path.startsWith('/os') && !req.auth) {
    const signInUrl = new URL('/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(signInUrl)
  }

  // Talent subdomain rewrite — talent.eevolvv.com/* → /talent/*
  const host = req.headers.get('host') || ''
  if (host.startsWith('talent.')) {
    const url = req.nextUrl.clone()
    const pathname = url.pathname
    url.pathname = pathname === '/' ? '/talent' : `/talent${pathname}`
    return NextResponse.rewrite(url)
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
