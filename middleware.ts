import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { getClientAgentPageByPath } from '@/data/clientAgentPages'

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
const OWNER_EMAILS = ['hello@eevolvv.com', 'eduardocbarbosa1998@gmail.com']

function isInternalOsRoute(pathname: string) {
  return INTERNAL_OS_ROUTES.some(route => {
    if (route === '/os') return pathname === '/os'
    return pathname === route || pathname.startsWith(`${route}/`)
  })
}

function emailMatches(email: string | null | undefined, allowedEmails: string[]) {
  if (!email) return false
  const normalized = email.toLowerCase()
  return [...OWNER_EMAILS, ...allowedEmails].some(allowed => allowed.toLowerCase() === normalized)
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

  // Protect internal /os routes. Client agent pages have their own client email allowlist below.
  if (isInternalOsRoute(req.nextUrl.pathname)) {
    if (!req.auth) {
      const signInUrl = new URL('/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  const clientAgentPage = getClientAgentPageByPath(req.nextUrl.pathname)
  if (clientAgentPage) {
    if (!req.auth) {
      const signInUrl = new URL('/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
      return NextResponse.redirect(signInUrl)
    }

    if (!emailMatches(req.auth.user?.email, clientAgentPage.allowedEmails)) {
      const signInUrl = new URL('/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
      signInUrl.searchParams.set('error', 'AccessDenied')
      return NextResponse.redirect(signInUrl)
    }
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
