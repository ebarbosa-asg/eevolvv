'use client'

import { useState, useEffect, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PanelLeftClose, PanelLeft } from 'lucide-react'

const SECTIONS = [
  { n: '00', label: 'OVERVIEW', route: '/os' },
  { n: '01', label: 'TASKS', route: '/os/tasks' },
  { n: '02', label: 'FEED', route: '/os/feed' },
  { n: '03', label: 'CLIENTS', route: '/os/clients' },
  { n: '04', label: 'PIPELINE', route: '/os/pipeline' },
  { n: '05', label: 'FINANCE', route: '/os/finance' },
  { n: '06', label: 'INVESTORS', route: '/os/investors' },
  { n: '07', label: 'LINKS', route: '/os/links' },
  { n: '08', label: 'GHOST LOCKER', route: '/os/ghost-locker' },
  { n: '09', label: 'BUILDS', route: '/os/builds' },
] as const

const MONO = { fontFamily: 'JetBrains Mono, ui-monospace, monospace' } as const

const SHELL_EASE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
const transition = `transform 0.28s ${SHELL_EASE}, box-shadow 0.28s ${SHELL_EASE}`

type OSSidebarProps = {
  collapsed: boolean
  onToggleCollapse: () => void
  width: number
}

function SectionRule({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 18px',
        marginBottom: 12,
      }}
    >
      <div
        style={{
          ...MONO,
          fontSize: 10,
          letterSpacing: '0.22em',
          opacity: 0.38,
          textTransform: 'uppercase' as const,
          flexShrink: 0,
        }}
      >
        {children}
      </div>
      <div
        style={{
          flex: 1,
          height: 1,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 100%)',
          borderRadius: 1,
        }}
      />
    </div>
  )
}

export default function OSSidebar({ collapsed, onToggleCollapse, width: SIDEBAR_W }: OSSidebarProps) {
  const pathname = usePathname()

  const [taskCount, setTaskCount] = useState<number | null>(null)
  const [clientCount, setClientCount] = useState<number | null>(null)
  const [pipelineCount, setPipelineCount] = useState<number | null>(null)
  const [investorCount, setInvestorCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/os/company-tasks')
      .then((r) => r.json())
      .then((d: Array<{ status?: string }>) => {
        const open = d.filter((t) => t.status !== 'done').length
        setTaskCount(open)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch('/api/os/clients')
      .then((r) => r.json())
      .then((d: unknown[]) => setClientCount(d.length))
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch('/api/os/pipeline')
      .then((r) => r.json())
      .then((d: unknown[]) => setPipelineCount(d.length))
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch('/api/os/investors')
      .then((r) => r.json())
      .then((d: unknown[]) => setInvestorCount(d.length))
      .catch(() => {})
  }, [])

  function isActive(route: string): boolean {
    if (route === '/os') return pathname === '/os'
    return pathname === route || pathname.startsWith(route + '/')
  }

  function getBadge(route: string): number | null {
    switch (route) {
      case '/os/tasks': return taskCount
      case '/os/clients': return clientCount
      case '/os/pipeline': return pipelineCount
      case '/os/investors': return investorCount
      default: return null
    }
  }

  const railShadow = collapsed
    ? 'none'
    : `4px 0 40px rgba(0,0,0,0.18), inset -1px 0 0 rgba(255,255,255,0.06)`

  const expandTabStyle: CSSProperties = {
    position: 'fixed',
    top: 'max(24px, env(safe-area-inset-top))',
    left: 0,
    zIndex: 93,
    minWidth: 44,
    height: 48,
    padding: '0 14px 0 12px',
    margin: 0,
    border: 'none',
    borderRadius: '0 10px 10px 0',
    background: 'linear-gradient(180deg, rgba(28,28,27,0.98) 0%, rgba(18,18,17,0.98) 100%)',
    borderWidth: '1px 1px 1px 0',
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.1)',
    color: 'var(--accent)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '4px 4px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.2)',
    transition,
  }

  return (
    <>
      <aside
        id="os-sidebar-root"
        aria-hidden={collapsed}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: SIDEBAR_W,
          zIndex: 92,
          background:
            'linear-gradient(165deg, rgba(24,24,23,0.98) 0%, rgba(14,14,13,0.99) 48%, rgba(12,12,11,1) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(16px) saturate(1.1)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.1)',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          transform: collapsed ? `translateX(-${SIDEBAR_W}px)` : 'none',
          transition,
          boxShadow: railShadow,
        }}
      >
        {/* Brand row */}
        <div
          style={{
            padding: '14px 14px 14px 18px',
            minHeight: 56,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.045) 0%, transparent 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            position: 'relative',
          }}
        >
          <Link
            href="/os"
            style={{
              fontFamily: 'Space Grotesk, system-ui, sans-serif',
              fontWeight: 600,
              fontSize: 17,
              color: 'var(--paper)',
              textDecoration: 'none',
              letterSpacing: '-0.03em',
              flex: 1,
              minWidth: 0,
            }}
          >
            eevolvv
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleCollapse()
            }}
            aria-expanded={!collapsed}
            aria-label="Collapse navigation"
            title="Hide sidebar (Esc)"
            style={{
              flexShrink: 0,
              width: 40,
              height: 40,
              padding: 0,
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(250,247,240,0.85)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            }}
          >
            <PanelLeftClose size={20} strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        {/* Route-based navigation */}
        <div style={{ padding: '20px 0 12px', flex: 1 }}>
          <SectionRule>Navigation</SectionRule>
          <nav aria-label="OS sections">
            {SECTIONS.map((s) => {
              const active = isActive(s.route)
              const badge = getBadge(s.route)
              return (
                <Link
                  key={s.n}
                  href={s.route}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 10,
                    margin: '0 10px 3px',
                    padding: '10px 14px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    ...MONO,
                    fontSize: 10,
                    fontWeight: 500,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.1em',
                    color: active ? 'var(--paper)' : 'rgba(250,247,240,0.52)',
                    background: active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                    border: active
                      ? '1px solid rgba(255,255,255,0.08)'
                      : '1px solid transparent',
                    borderLeft: active
                      ? '3px solid var(--accent)'
                      : '3px solid transparent',
                    transition:
                      'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--accent)',
                      opacity: 0.95,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    §{s.n}
                  </span>
                  <span style={{ letterSpacing: '0.08em', flex: 1 }}>{s.label}</span>
                  {badge !== null && (
                    <span
                      style={{
                        ...MONO,
                        fontSize: 9,
                        color: active ? 'var(--accent)' : 'rgba(250,247,240,0.3)',
                        fontVariantNumeric: 'tabular-nums',
                        marginLeft: 'auto',
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {collapsed && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Expand navigation"
          title="Show sidebar"
          style={expandTabStyle}
        >
          <PanelLeft size={22} strokeWidth={1.75} aria-hidden />
          <span
            style={{
              ...MONO,
              fontSize: 9,
              letterSpacing: '0.2em',
              color: 'rgba(250,247,240,0.5)',
              textTransform: 'uppercase',
              display: 'inline',
            }}
          >
            Menu
          </span>
        </button>
      )}
    </>
  )
}
