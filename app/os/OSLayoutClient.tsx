'use client'

import { useState, useEffect, useCallback } from 'react'
import OSSidebar from './OSSidebar'

const STORAGE_KEY = 'os-sidebar-collapsed'

/** Sidebar rail width — keep in sync with OSSidebar transform math via prop */
export const OS_SIDEBAR_W = 240

export default function OSLayoutClient({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)

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

  const showOverlay = isNarrow && !collapsed

  return (
    <div className="os-layout">
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
    </div>
  )
}
