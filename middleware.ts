import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const INTERNAL_OS_ROUTES = [
  '/os',
  '/os/feed',
  '/os/tasks',
  '/os/builds',
  '/os/pipeline',
  '/os/clients',
  '/os/ghost-locker',
  '/os/finance',
  '/os/investors',
  '/os/links',
]

function isInternalOsRoute(pathname: string) {
  return INTERNAL_OS_ROUTES.some(route => {
    if (route === '/os') return pathname === '/os'
    return pathname === route || pathname.startsWith(`${route}/`)
  })
}

export default auth(function middleware(req) {
  // Talent subdomain rewrite — talent.eevolvv.com/* → /talent/*
  const host = req.headers.get('host') || ''
  if (host.startsWith('talent.')) {
    const url = req.nextUrl.clone()
    const pathname = url.pathname
    url.pathname = pathname === '/' ? '/talent' : `/talent${pathname}`
    return NextResponse.rewrite(url)
  }

  // Protect internal /os routes. Public client agent pages live at /os/[client-slug].
  if (isInternalOsRoute(req.nextUrl.pathname)) {
    if (!req.auth) {
      const signInUrl = new URL('/signin', req.url)
      return NextResponse.redirect(signInUrl)
    }
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
