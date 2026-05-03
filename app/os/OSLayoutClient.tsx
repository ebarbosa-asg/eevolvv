'use client'

import { useState, useEffect } from 'react'
import OSSidebar from './OSSidebar'

const STORAGE_KEY = 'os-sidebar-collapsed'

export default function OSLayoutClient({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') setCollapsed(true)
    } catch {
      /* ignore */
    }
  }, [])

  const toggle = () => {
    setCollapsed((c) => {
      const next = !c
      try {
        localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      } catch {
        /* ignore */
      }
      return next
    })
  }

  return (
    <div className="os-layout">
      <div
        className="os-sidebar-space"
        style={{
          width: collapsed ? 0 : 220,
        }}
        aria-hidden
      />
      <OSSidebar collapsed={collapsed} onToggleCollapse={toggle} />
      <main className="os-main">{children}</main>
    </div>
  )
}
