'use client'

import { signOut } from 'next-auth/react'

export function OSTopbar({ title }: { title: string }) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(20,20,19,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: '48px',
      }}
    >
      <span
        style={{
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'var(--paper)',
        }}
      >
        {title}
      </span>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        style={{
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'rgba(250,247,240,0.45)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        sign out
      </button>
    </div>
  )
}
