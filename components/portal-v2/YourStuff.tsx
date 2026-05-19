'use client'

import { useState } from 'react'

type Asset = {
  type: 'website' | 'marketing' | 'product'
  icon: string
  name: string
  primary: string
  secondary?: string
  health: number // 0-5
  detail?: string
}

type Props = {
  assets: Asset[]
}

export function YourStuff({ assets }: Props) {
  if (assets.length === 0) return null

  return (
    <div style={{ marginBottom: 24 }}>
      <SectionLabel icon="📦" label="YOUR STUFF" />
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(assets.length, 3)}, 1fr)`, gap: 12 }}>
        {assets.map(a => (
          <AssetCard key={a.name} asset={a} />
        ))}
      </div>
    </div>
  )
}

function AssetCard({ asset }: { asset: Asset }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      style={{
        border: '1px solid var(--rule)',
        padding: 20,
        cursor: 'pointer',
        textAlign: 'left',
        background: 'transparent',
        color: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <span style={{ fontSize: 28 }}>{asset.icon}</span>
      <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }}>{asset.primary}</span>
      <span className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'rgba(20,20,19,0.5)' }}>
        {asset.name}
      </span>
      <HealthBar score={asset.health} />
      {asset.secondary && (
        <span style={{ fontSize: 12, color: 'rgba(20,20,19,0.55)' }}>{asset.secondary}</span>
      )}
      {expanded && asset.detail && (
        <p style={{ fontSize: 12, lineHeight: 1.5, color: 'rgba(20,20,19,0.6)', margin: '4px 0 0', borderTop: '1px solid var(--rule)', paddingTop: 10 }}>
          {asset.detail}
        </p>
      )}
    </button>
  )
}

function HealthBar({ score }: { score: number }) {
  const pct = (score / 5) * 100
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 4,
            background: i <= score ? '#22c55e' : 'rgba(20,20,19,0.1)',
            borderRadius: 0,
          }}
        />
      ))}
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