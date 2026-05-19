'use client'

import { useState } from 'react'

type Gear = {
  title: string
  status: 'live' | 'building' | 'planned'
  metric: string
  detail?: string
  eta?: string
}

type Props = {
  gears: Gear[]
}

const DOT: Record<string, { color: string; label: string }> = {
  live: { color: '#22c55e', label: 'Running' },
  building: { color: '#eab308', label: 'Building' },
  planned: { color: '#a1a1aa', label: 'Planned' },
  intake: { color: '#a1a1aa', label: 'Review' },
  paid: { color: '#22c55e', label: 'Paid' },
  recommended: { color: '#a1a1aa', label: 'Available' },
}

const ICONS: Record<string, string> = {
  'Lead': '🎯',
  'Follow': '📬',
  'Chat': '💬',
  'Call': '📞',
  'Email': '✉️',
  'Website': '🌐',
  'Auto': '⚙️',
  'Default': '⚡',
}

function gearIcon(title: string): string {
  for (const [k, v] of Object.entries(ICONS)) {
    if (title.toLowerCase().includes(k.toLowerCase())) return v
  }
  return ICONS.Default
}

export function GearsList({ gears }: Props) {
  if (gears.length === 0) return null

  return (
    <div style={{ marginBottom: 24 }}>
      <SectionLabel icon="⚙️" label="YOUR GEARS" />
      <div style={{ border: '1px solid var(--rule)' }}>
        {gears.map((g, i) => (
          <GearRow key={g.title} gear={g} last={i === gears.length - 1} />
        ))}
      </div>
    </div>
  )
}

function GearRow({ gear, last }: { gear: Gear; last: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const d = DOT[gear.status] || { color: '#a1a1aa', label: gear.status }

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          border: 'none',
          borderBottom: last && !expanded ? 'none' : '1px solid var(--rule)',
          background: 'transparent',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'var(--ink)',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: d.color,
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 18, flexShrink: 0 }}>{gearIcon(gear.title)}</span>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{gear.title}</span>
        <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: d.color }}>
          {gear.metric}
        </span>
        <span className="mono" style={{ fontSize: 9, letterSpacing: '0.12em', color: 'rgba(20,20,19,0.38)' }}>
          {expanded ? '▲' : '▼'}
        </span>
      </button>
      {expanded && (
        <div style={{
          padding: '12px 16px 16px 50px',
          borderBottom: last ? 'none' : '1px solid var(--rule)',
          fontSize: 13,
          lineHeight: 1.6,
          color: 'rgba(20,20,19,0.65)',
        }}>
          {gear.detail && <p style={{ margin: '0 0 6px' }}>{gear.detail}</p>}
          {gear.eta && <p className="mono" style={{ margin: 0, fontSize: 11, color: 'var(--accent)' }}>ETA: {gear.eta}</p>}
        </div>
      )}
    </div>
  )
}

function SectionLabel({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="mono" style={{
      fontSize: 10,
      letterSpacing: '0.18em',
      color: 'rgba(20,20,19,0.42)',
      marginBottom: 10,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    }}>
      {icon} {label}
    </div>
  )
}