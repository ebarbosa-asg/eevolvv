'use client'

import { useState, useEffect, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

const MONO = { fontFamily: 'JetBrains Mono, monospace' } as const

const SIDEBAR_W = 220

const transition = 'transform 0.22s ease'

type OSSidebarProps = {
  collapsed: boolean
  onToggleCollapse: () => void
}

export default function OSSidebar({ collapsed, onToggleCollapse }: OSSidebarProps) {
  const pathname = usePathname()
  const isOsRoot = pathname === '/os'
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    fetch('/api/os/clients').then(r => r.json()).then((d: Client[]) => setClients(d)).catch(() => {})
  }, [])

  const scrollTo = (anchor: string) => {
    if (!isOsRoot) return
    const el = document.getElementById(anchor)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const tabStyle: CSSProperties = {
    position: 'fixed',
    top: 72,
    left: 0,
    zIndex: 91,
    width: 28,
    height: 44,
    padding: 0,
    margin: 0,
    border: 'none',
    borderRadius: '0 6px 6px 0',
    background: 'rgba(20,20,19,0.96)',
    borderWidth: '1px 1px 1px 0',
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.08)',
    color: 'var(--accent)',
    cursor: 'pointer',
    fontSize: 16,
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '2px 0 12px rgba(0,0,0,0.35)',
    transition,
  }

  return (
    <>
      <aside
        aria-hidden={collapsed}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: SIDEBAR_W,
          zIndex: 90,
          background: 'rgba(20,20,19,0.95)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflowY: 'auto',
          transform: collapsed ? `translateX(-${SIDEBAR_W}px)` : 'none',
          transition,
        }}
      >
      {/* Wordmark + collapse */}
      <div style={{ padding: '16px 12px 16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', height: '52px', display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
        <Link href="/os" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '18px', color: 'var(--paper)', textDecoration: 'none', letterSpacing: '-0.02em', flex: 1, minWidth: 0 }}>eevolvv</Link>
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-expanded={!collapsed}
          aria-label="Collapse sidebar"
          title="Hide sidebar"
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            padding: 0,
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 6,
            background: 'rgba(255,255,255,0.04)',
            color: 'var(--accent)',
            cursor: 'pointer',
            fontSize: 14,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ⟨
        </button>
      </div>

      {/* Section nav (only useful from /os root) */}
      {isOsRoot && (
        <div style={{ padding: '16px 0 8px' }}>
          <div style={{ ...MONO, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.3, padding: '0 20px', marginBottom: '6px' }}>SECTIONS</div>
          {SECTIONS.map(s => (
            <button key={s.n} onClick={() => scrollTo(s.anchor)}
              style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '5px 20px', cursor: 'pointer', ...MONO, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(250,247,240,0.45)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--paper)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(250,247,240,0.45)'; (e.currentTarget as HTMLButtonElement).style.background = 'none' }}>
              <span style={{ color: 'var(--accent)', marginRight: '6px' }}>§{s.n}</span>{s.label}
            </button>
          ))}
        </div>
      )}

      {/* Clients */}
      <div style={{ padding: '16px 0 8px', borderTop: isOsRoot ? '1px solid rgba(255,255,255,0.07)' : undefined, marginTop: 'auto' }}>
        <div style={{ ...MONO, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.3, padding: '0 20px', marginBottom: '6px' }}>CLIENTS</div>
        {clients.length === 0 && (
          <div style={{ ...MONO, fontSize: '10px', opacity: 0.25, padding: '4px 20px' }}>none yet</div>
        )}
        {clients.map(c => (
          <Link key={c.id} href={`/os/clients/${c.id}`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 20px', textDecoration: 'none', ...MONO, fontSize: '11px', color: pathname === `/os/clients/${c.id}` ? 'var(--paper)' : 'rgba(250,247,240,0.5)', background: pathname === `/os/clients/${c.id}` ? 'rgba(255,255,255,0.06)' : 'none', borderLeft: pathname === `/os/clients/${c.id}` ? '2px solid var(--accent)' : '2px solid transparent', transition: 'all 0.1s' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.health === 'green' ? '#4ade80' : c.health === 'yellow' ? '#f59e0b' : 'var(--accent)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.company}</span>
          </Link>
        ))}
        <Link href="/os" onClick={() => {}} style={{ display: 'block', padding: '5px 20px', ...MONO, fontSize: '10px', color: 'var(--accent)', textDecoration: 'none', opacity: 0.7, marginTop: '4px' }}>+ new client</Link>
      </div>
      </aside>
      {collapsed && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Expand sidebar"
          title="Show sidebar"
          style={tabStyle}
        >
          ⟩
        </button>
      )}
    </>
  )
}
