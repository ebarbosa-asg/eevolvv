'use client'

import Link from 'next/link'

type Crumb = { label: string; href?: string }

interface OSBreadcrumbProps {
  crumbs: Crumb[]
}

export function OSBreadcrumb({ crumbs }: OSBreadcrumbProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 24px',
        height: 48,
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}
    >
      {crumbs.map((crumb, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {i > 0 && (
            <span style={{ opacity: 0.25, userSelect: 'none' }}>/</span>
          )}
          {crumb.href ? (
            <Link
              href={crumb.href}
              style={{
                color: 'rgba(250,247,240,0.45)',
                textDecoration: 'none',
              }}
            >
              {crumb.label}
            </Link>
          ) : (
            <span style={{ color: 'var(--paper)' }}>{crumb.label}</span>
          )}
        </span>
      ))}
    </div>
  )
}
