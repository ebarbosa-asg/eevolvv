'use client'

import { useState } from 'react'
import { GlobeIcon, ChartIcon, GearIcon, MonitorIcon, PlusIcon, ArrowRightIcon } from './icons'
import type { ReactNode } from 'react'

type Product = {
  key: string
  icon: string
  name: string
  price: string
  description: string
}

type Props = {
  products: Product[]
}

function productIcon(key: string): ReactNode {
  if (key === 'website')          return <GlobeIcon size={20} />
  if (key === 'sco-management')   return <ChartIcon size={20} />
  if (key === 'extra-automation') return <GearIcon size={20} />
  if (key === 'custom-dashboard') return <MonitorIcon size={20} />
  return <PlusIcon size={20} />
}

export function AddMore({ products }: Props) {
  if (products.length === 0) return null

  return (
    <div style={{ marginBottom: 40 }}>
      <div className="mono" style={{
        fontSize: 10,
        letterSpacing: '0.18em',
        color: 'rgba(20,20,19,0.38)',
        marginBottom: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <PlusIcon size={12} />
        ADD MORE
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
        {products.map(p => (
          <AddOnCard key={p.key} product={p} />
        ))}
      </div>
    </div>
  )
}

function AddOnCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        border: '1px solid var(--rule)',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        background: hovered ? 'rgba(20,20,19,0.025)' : 'transparent',
        transition: 'background 0.12s',
      }}
    >
      <span style={{ color: 'rgba(20,20,19,0.55)' }}>{productIcon(product.key)}</span>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{product.name}</div>
      <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.08em' }}>
        {product.price}
      </div>
      <p style={{ fontSize: 12, lineHeight: 1.45, color: 'rgba(20,20,19,0.55)', margin: 0 }}>
        {product.description}
      </p>
      <a
        href={`/api/stripe/checkout?product=${product.key}&source=addon`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="mono"
        style={{
          marginTop: 'auto',
          padding: '10px 0',
          border: '1px solid var(--ink)',
          textAlign: 'center',
          textDecoration: 'none',
          color: 'var(--ink)',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.14em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        ADD <ArrowRightIcon size={10} />
      </a>
    </div>
  )
}
