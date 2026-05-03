'use client'

import { useState, useEffect, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PanelLeftClose, PanelLeft } from 'lucide-react'
import type { Client } from './HubClient'

const SECTIONS = [
  { n: '01', label: 'DIAGNOSTIC FEED', anchor: 'diagnostic-feed' },
  { n: '02', label: 'FUNNEL METRICS', anchor: 'funnel-metrics' },
  { n: '03', label: 'ACTIVE CLIENTS', anchor: 'active-clients' },
  { n: '04', label: 'AGENT REGISTRY', anchor: 'agent-registry' },
  { n: '05', label: 'PIPELINE', anchor: 'pipeline' },
  { n: '06', label: 'FINANCE', anchor: 'finance' },
  { n: '07', label: 'ENGINEERING', anchor: 'engineering' },
  { n: '08', label: 'INVESTOR', anchor: 'investor' },
  { n: '09', label: 'QUICK LINKS', anchor: 'quick-links' },
  { n: '10', label: 'INTERNAL DOCS', anchor: 'internal-docs' },
]

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
          textTransform: 'uppercase',
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
  const isOsRoot = pathname === '/os'
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    fetch('/api/os/clients')
      .then((r) => r.json())
      .then((d: Client[]) => setClients(d))
      .catch(() => {})
  }, [])

  const scrollTo = (anchor: string) => {
    if (!isOsRoot) return
    const el = document.getElementById(anchor)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
          background: 'linear-gradient(165deg, rgba(24,24,23,0.98) 0%, rgba(14,14,13,0.99) 48%, rgba(12,12,11,1) 100%)',
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
            background: 'linear-gradient(180deg, rgba(255,255,255,0.045) 0%, transparent 100%)',
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

        {isOsRoot && (
          <div style={{ padding: '20px 0 12px' }}>
            <SectionRule>Navigation</SectionRule>
            <nav aria-label="OS sections">
              {SECTIONS.map((s) => (
                <button
                  key={s.n}
                  type="button"
                  onClick={() => scrollTo(s.anchor)}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 10,
                    width: 'calc(100% - 20px)',
                    margin: '0 10px 3px',
                    textAlign: 'left',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid transparent',
                    borderRadius: 10,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    ...MONO,
                    fontSize: 10,
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'rgba(250,247,240,0.52)',
                    transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    const b = e.currentTarget
                    b.style.color = 'var(--paper)'
                    b.style.background = 'rgba(255,255,255,0.06)'
                    b.style.borderColor = 'rgba(255,255,255,0.06)'
                  }}
                  onMouseLeave={(e) => {
                    const b = e.currentTarget
                    b.style.color = 'rgba(250,247,240,0.52)'
                    b.style.background = 'rgba(255,255,255,0.02)'
                    b.style.borderColor = 'transparent'
                  }}
                >
                  <span style={{ color: 'var(--accent)', opacity: 0.95, fontVariantNumeric: 'tabular-nums' }}>§{s.n}</span>
                  <span style={{ letterSpacing: '0.08em' }}>{s.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}

        <div
          style={{
            padding: '18px 0 20px',
            marginTop: 'auto',
            borderTop: isOsRoot ? '1px solid rgba(255,255,255,0.06)' : undefined,
            background: isOsRoot ? 'linear-gradient(0deg, rgba(255,255,255,0.02) 0%, transparent 120px)' : undefined,
          }}
        >
          <SectionRule>Clients</SectionRule>
          {clients.length === 0 && (
            <div style={{ ...MONO, fontSize: 11, opacity: 0.28, padding: '6px 18px 10px', letterSpacing: '0.06em' }}>
              No active clients
            </div>
          )}
          {clients.map((c) => (
            <Link
              key={c.id}
              href={`/os/clients/${c.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                margin: '0 10px 4px',
                padding: '9px 14px',
                borderRadius: 10,
                textDecoration: 'none',
                ...MONO,
                fontSize: 11,
                letterSpacing: '0.04em',
                color: pathname === `/os/clients/${c.id}` ? 'var(--paper)' : 'rgba(250,247,240,0.55)',
                background:
                  pathname === `/os/clients/${c.id}` ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                border:
                  pathname === `/os/clients/${c.id}`
                    ? '1px solid rgba(255,255,255,0.08)'
                    : '1px solid transparent',
                borderLeft:
                  pathname === `/os/clients/${c.id}` ? '3px solid var(--accent)' : '3px solid transparent',
                transition: 'background 0.12s ease, color 0.12s ease, border-color 0.12s ease',
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background:
                    c.health === 'green' ? '#4ade80' : c.health === 'yellow' ? '#f59e0b' : 'var(--accent)',
                  flexShrink: 0,
                  boxShadow: '0 0 10px rgba(0,0,0,0.35)',
                }}
              />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.company}</span>
            </Link>
          ))}
          <Link
            href="/os"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              margin: '12px 18px 0',
              padding: '8px 0',
              ...MONO,
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              textDecoration: 'none',
              opacity: 0.85,
              gap: 6,
            }}
          >
            <span style={{ fontSize: 14, opacity: 0.9 }}>+</span> New client
          </Link>
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
