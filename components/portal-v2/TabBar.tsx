'use client'

import { useState } from 'react'

export type TabDef = {
  id: string
  label: string
  badge?: number | null
}

type Props = {
  tabs: TabDef[]
  active: string
  onChange: (id: string) => void
}

export function TabBar({ tabs, active, onChange }: Props) {
  return (
    <div style={{
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
      scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'],
      msOverflowStyle: 'none' as React.CSSProperties['msOverflowStyle'],
      borderBottom: '1px solid var(--rule)',
      marginBottom: 24,
      display: 'flex',
      gap: 0,
    }}>
      {tabs.map(tab => (
        <TabItem key={tab.id} tab={tab} isActive={tab.id === active} onClick={() => onChange(tab.id)} />
      ))}
    </div>
  )
}

function TabItem({ tab, isActive, onClick }: { tab: TabDef; isActive: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        background: hovered && !isActive ? 'rgba(20,20,19,0.04)' : 'transparent',
        border: 'none',
        borderBottom: isActive ? '2px solid var(--ink)' : '2px solid transparent',
        marginBottom: -1,
        padding: '11px 18px',
        cursor: 'pointer',
        color: isActive ? 'var(--ink)' : 'rgba(20,20,19,0.45)',
        fontWeight: isActive ? 600 : 400,
        fontSize: 13,
        fontFamily: 'inherit',
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        transition: 'background 0.12s, color 0.12s',
        whiteSpace: 'nowrap',
      }}
    >
      {tab.label}
      {tab.badge != null && tab.badge > 0 && (
        <span
          className="mono"
          style={{
            fontSize: 9,
            letterSpacing: '0.04em',
            padding: '2px 6px',
            background: isActive ? 'var(--ink)' : 'rgba(20,20,19,0.1)',
            color: isActive ? 'var(--paper)' : 'rgba(20,20,19,0.5)',
            transition: 'background 0.12s, color 0.12s',
          }}
        >
          {tab.badge}
        </span>
      )}
    </button>
  )
}
