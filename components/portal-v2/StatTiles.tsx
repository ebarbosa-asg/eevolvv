'use client'

import type { ReactNode } from 'react'

type StatTile = {
  icon: ReactNode
  value: string | number
  label: string
  trend?: 'up' | 'down' | 'flat'
}

type Props = {
  tiles: StatTile[]
}

export function StatTiles({ tiles }: Props) {
  const visible = tiles.filter(t => {
    const v = typeof t.value === 'string' ? parseFloat(t.value) : t.value
    return !isNaN(v) && v > 0
  })

  if (visible.length === 0) return null

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${Math.min(visible.length, 4)}, 1fr)`,
      gap: 12,
      marginBottom: 24,
    }}>
      {visible.map(t => (
        <div
          key={t.label}
          style={{
            border: '1px solid var(--rule)',
            padding: '16px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <span style={{ color: 'var(--ink)', lineHeight: 1 }}>{t.icon}</span>
          <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>
            {t.value}
          </span>
          <span className="mono" style={{ fontSize: 9, letterSpacing: '0.12em', color: 'rgba(20,20,19,0.45)' }}>
            {t.label}
          </span>
        </div>
      ))}
    </div>
  )
}
