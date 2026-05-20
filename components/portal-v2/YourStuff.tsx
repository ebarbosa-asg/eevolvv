'use client'

import { useState } from 'react'
import { GlobeIcon, ChartIcon, BoxIcon } from './icons'
import type { ReactNode } from 'react'

type Asset = {
  type: 'website' | 'marketing' | 'product'
  icon: string
  name: string
  primary: string
  secondary?: string
  health: number
  detail?: string
}

type Props = {
  assets: Asset[]
}

function assetIcon(type: string): ReactNode {
  if (type === 'website')   return <GlobeIcon size={22} />
  if (type === 'marketing') return <ChartIcon size={22} />
  return <BoxIcon size={22} />
}

export function YourStuff({ assets }: Props) {
  if (assets.length === 0) return null

  return (
    <div style={{ marginBottom: 24 }}>
      <SectionLabel />
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
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: '1px solid var(--rule)',
        padding: 20,
        cursor: 'pointer',
        textAlign: 'left',
        background: hovered ? 'rgba(20,20,19,0.03)' : 'transparent',
        color: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        transition: 'background 0.12s',
      }}
    >
      <span style={{ color: 'rgba(20,20,19,0.6)' }}>{assetIcon(asset.type)}</span>
      <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }}>{asset.primary}</span>
      <span className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'rgba(20,20,19,0.5)' }}>
        {asset.name}
      </span>
      <HealthBar score={asset.health} />
      {asset.secondary && (
        <span style={{ fontSize: 12, color: 'rgba(20,20,19,0.55)' }}>{asset.secondary}</span>
      )}
      {expanded && asset.detail && (
        <p style={{
          fontSize: 12,
          lineHeight: 1.5,
          color: 'rgba(20,20,19,0.6)',
          margin: '4px 0 0',
          borderTop: '1px solid var(--rule)',
          paddingTop: 10,
          textAlign: 'left',
        }}>
          {asset.detail}
        </p>
      )}
    </button>
  )
}

function HealthBar({ score }: { score: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 4,
            background: i <= score ? '#22c55e' : 'rgba(20,20,19,0.1)',
          }}
        />
      ))}
    </div>
  )
}

function SectionLabel() {
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
      <BoxIcon size={12} />
      YOUR STUFF
    </div>
  )
}
