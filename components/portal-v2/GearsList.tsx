'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { GearIcon, TargetIcon, MailIcon, ChatIcon, PhoneIcon, GlobeIcon, BoltIcon, ChevronDownIcon, ChevronUpIcon } from './icons'

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
  live:        { color: '#22c55e', label: 'Running' },
  building:    { color: '#eab308', label: 'Building' },
  planned:     { color: '#a1a1aa', label: 'Planned' },
  intake:      { color: '#a1a1aa', label: 'Review' },
  paid:        { color: '#22c55e', label: 'Paid' },
  recommended: { color: '#a1a1aa', label: 'Available' },
}

function gearIcon(title: string): ReactNode {
  const t = title.toLowerCase()
  if (t.includes('lead'))   return <TargetIcon size={16} />
  if (t.includes('follow') || t.includes('mail') || t.includes('email')) return <MailIcon size={16} />
  if (t.includes('chat') || t.includes('bot'))  return <ChatIcon size={16} />
  if (t.includes('call') || t.includes('phone')) return <PhoneIcon size={16} />
  if (t.includes('website') || t.includes('web')) return <GlobeIcon size={16} />
  if (t.includes('auto'))   return <GearIcon size={16} />
  return <BoltIcon size={16} />
}

export function GearsList({ gears }: Props) {
  if (gears.length === 0) {
    return (
      <div style={{ marginBottom: 24 }}>
        <SectionLabel label="YOUR GEARS" />
        <div style={{
          padding: '28px 0',
          textAlign: 'center',
          border: '1px dashed var(--rule)',
        }}>
          <GearIcon size={20} style={{ opacity: 0.2, marginBottom: 10 }} />
          <div className="mono" style={{ fontSize: 11, color: 'rgba(20,20,19,0.38)', letterSpacing: '0.12em' }}>
            NO GEARS RUNNING YET
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <SectionLabel label="YOUR GEARS" />
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
  const [hovered, setHovered] = useState(false)
  const d = DOT[gear.status] || { color: '#a1a1aa', label: gear.status }

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          border: 'none',
          borderBottom: last && !expanded ? 'none' : '1px solid var(--rule)',
          background: hovered ? 'rgba(20,20,19,0.03)' : 'transparent',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'var(--ink)',
          transition: 'background 0.12s',
        }}
      >
        <span style={{
          display: 'inline-block',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: d.color,
          boxShadow: gear.status === 'live' ? `0 0 6px ${d.color}99` : 'none',
          flexShrink: 0,
        }} />
        <span style={{ color: 'rgba(20,20,19,0.55)', flexShrink: 0 }}>
          {gearIcon(gear.title)}
        </span>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{gear.title}</span>
        <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: d.color }}>
          {gear.metric}
        </span>
        <span style={{ color: 'rgba(20,20,19,0.35)', flexShrink: 0 }}>
          {expanded ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
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
          {gear.eta && (
            <p className="mono" style={{ margin: 0, fontSize: 11, color: 'var(--accent)' }}>
              ETA: {gear.eta}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function SectionLabel({ label }: { label: string }) {
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
      <GearIcon size={12} />
      {label}
    </div>
  )
}
