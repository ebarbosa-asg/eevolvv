import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import {
  CLIENT_AGENT_PAGES,
  canAccessClientAgentPage,
  getClientAgentPageForEmail,
  isOwnerEmail,
  normalizeEmail,
} from '@/lib/client-agent-pages'

const CLIENT_PAGE_PATHS = new Map(CLIENT_AGENT_PAGES.map((page) => [`/os/${page.slug}`, page.slug]))

// ── Permanent redirects (301) — deleted or renamed routes ──
const REDIRECTS: Record<string, string> = {
  '/recovery': '/',
  '/marketing/vision': '/',
  '/marketing': '/pricing',
  '/legal': '/law-firms',
}

export default auth(function middleware(req) {
  // 301 redirects for deleted/renamed routes
  const pathname = req.nextUrl.pathname
  if (REDIRECTS[pathname]) {
    const url = req.nextUrl.clone()
    url.pathname = REDIRECTS[pathname]
    return NextResponse.redirect(url, { status: 301 })
  }

  // Talent subdomain rewrite — talent.eevolvv.com/* → /talent/*
  const host = req.headers.get('host') || ''
  if (host.startsWith('talent.')) {
    const url = req.nextUrl.clone()
    const subPath = url.pathname
    url.pathname = subPath === '/' ? '/talent' : `/talent${subPath}`
    return NextResponse.rewrite(url)
  }

  // Protect /os/** — redirect unauthenticated users to sign-in
  if (req.nextUrl.pathname.startsWith('/os')) {
    if (!req.auth) {
      const signInUrl = new URL('/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
      return NextResponse.redirect(signInUrl)
    }

    const email = normalizeEmail(req.auth.user?.email)
    const currentClientSlug = CLIENT_PAGE_PATHS.get(req.nextUrl.pathname)

    if (isOwnerEmail(email)) {
      return undefined
    }

    if (currentClientSlug && canAccessClientAgentPage(email, currentClientSlug)) {
      return undefined
    }

    {
      const ownedPage = getClientAgentPageForEmail(email)
      const url = req.nextUrl.clone()
      url.pathname = ownedPage ? `/os/${ownedPage.slug}` : '/signin'
      if (!ownedPage) url.searchParams.set('error', 'AccessDenied')
      return NextResponse.redirect(url)
    }
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}