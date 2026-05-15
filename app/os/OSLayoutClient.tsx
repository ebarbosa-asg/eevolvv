'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import OSSidebar from './OSSidebar'

const STORAGE_KEY = 'os-sidebar-collapsed'

/** Sidebar rail width — keep in sync with OSSidebar transform math via prop */
export const OS_SIDEBAR_W = 240

export default function OSLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)
  const internalRoutes = new Set([
    '/os',
    '/os/feed',
    '/os/clients',
    '/os/builds',
    '/os/tasks',
    '/os/pipeline',
    '/os/finance',
    '/os/ghost-locker',
    '/os/links',
    '/os/investors',
  ])
  const isInternalRoute =
    internalRoutes.has(pathname) ||
    pathname.startsWith('/os/clients/') ||
    pathname.startsWith('/os/ghost-locker/')

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') setCollapsed(true)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)')
    const apply = () => setIsNarrow(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const setPersisted = useCallback((next: boolean) => {
    setCollapsed(next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [])

  const toggle = useCallback(() => {
    setCollapsed((c) => {
      const next = !c
      try {
        localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !collapsed) setPersisted(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [collapsed, setPersisted])

  const showOverlay = isInternalRoute && isNarrow && !collapsed

  if (!isInternalRoute) {
    return <main className="os-main">{children}</main>
  }

  return (
    <div className="os-layout bg-black">
      <style>{`
        @media (max-width: 1024px) {
          .os-sidebar-space { display: none !important; }
          .os-main { padding-bottom: 80px; width: 100%; }
        }
      `}</style>
      <div
        className="os-sidebar-space"
        style={{
          width: collapsed ? 0 : OS_SIDEBAR_W,
        }}
        aria-hidden
      />
      {showOverlay && (
        <button
          type="button"
          className="os-sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setPersisted(true)}
        />
      )}
      <OSSidebar collapsed={collapsed} onToggleCollapse={toggle} width={OS_SIDEBAR_W} />
      <main className="os-main">{children}</main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#0A0A09] border-t border-white/10 flex items-center justify-around px-6 lg:hidden z-[99]">
        <Link href="/os" className={`flex flex-col items-center gap-1 ${pathname === '/os' ? 'text-accent' : 'text-white/40'}`}>
          <div className={`w-3 h-3 border ${pathname === '/os' ? 'border-accent bg-accent' : 'border-white/20'}`} />
          <span className="mono text-[8px] uppercase tracking-tighter">Home</span>
        </Link>
        <Link href="/os/clients" className={`flex flex-col items-center gap-1 ${pathname.startsWith('/os/clients') ? 'text-accent' : 'text-white/40'}`}>
          <div className={`w-3 h-3 border ${pathname.startsWith('/os/clients') ? 'border-accent bg-accent' : 'border-white/20'}`} />
          <span className="mono text-[8px] uppercase tracking-tighter">Clients</span>
        </Link>
        <Link href="/os/sales" className={`flex flex-col items-center gap-1 ${pathname === '/os/sales' ? 'text-accent' : 'text-white/40'}`}>
          <div className={`w-3 h-3 border ${pathname === '/os/sales' ? 'border-accent bg-accent' : 'border-white/20'}`} />
          <span className="mono text-[8px] uppercase tracking-tighter">Sales</span>
        </Link>
        <Link href="/os/finance" className={`flex flex-col items-center gap-1 ${pathname === '/os/finance' ? 'text-accent' : 'text-white/40'}`}>
          <div className={`w-3 h-3 border ${pathname === '/os/finance' ? 'border-accent bg-accent' : 'border-white/20'}`} />
          <span className="mono text-[8px] uppercase tracking-tighter">Ops</span>
        </Link>
      </div>
    </div>
  )
}
