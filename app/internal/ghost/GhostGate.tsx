'use client'

import { useState, useEffect, useRef } from 'react'

const PASSWORD = process.env.NEXT_PUBLIC_GHOST_PASSWORD ?? 'ghost:unlock'
const SESSION_KEY = 'gl_auth'

export function GhostGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked]   = useState(false)
  const [input,    setInput]      = useState('')
  const [error,    setError]      = useState(false)
  const [booting,  setBooting]    = useState(true)
  const [lines,    setLines]      = useState<string[]>([])
  const inputRef                  = useRef<HTMLInputElement>(null)

  // Boot sequence lines
  const BOOT = [
    '> GHOST LOCKER v1.0',
    '> SYSTEM: eevolvv internal ops',
    '> AGENT MANUFACTURING PIPELINE',
    '> INITIALIZING...',
    '> ...',
    '> AUTHENTICATION REQUIRED',
  ]

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY)
    if (stored === 'true') { setUnlocked(true); setBooting(false); return }

    let i = 0
    const id = setInterval(() => {
      if (i < BOOT.length) {
        setLines(prev => [...prev, BOOT[i]])
        i++
      } else {
        clearInterval(id)
        setBooting(false)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }, 200)
    return () => clearInterval(id)
  }, [])

  const attempt = () => {
    if (input === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setUnlocked(true)
    } else {
      setError(true)
      setInput('')
      setTimeout(() => setError(false), 1500)
    }
  }

  if (unlocked) return <>{children}</>

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--ink)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      gap: 0, padding: '32px',
    }}>
      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(to right, rgba(250,247,240,0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(250,247,240,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '480px' }}>
        {/* Wordmark */}
        <div style={{
          color: 'var(--accent)',
          fontSize: '11px', letterSpacing: '0.25em',
          textTransform: 'uppercase', marginBottom: '32px',
          opacity: 0.7,
        }}>
          eevolvv · internal ops
        </div>

        {/* Boot log */}
        <div style={{ marginBottom: '24px', minHeight: '120px' }}>
          {lines.map((line, i) => (
            <div key={i} style={{
              color: i === lines.length - 1 ? 'var(--paper)' : 'rgba(250,247,240,0.4)',
              fontSize: '13px', lineHeight: '1.8',
              transition: 'color 0.3s',
            }}>
              {line}
            </div>
          ))}
          {booting && (
            <span style={{ color: 'var(--accent)', animation: 'blink 1s steps(1) infinite' }}>▋</span>
          )}
        </div>

        {/* Auth input */}
        {!booting && (
          <div>
            <div style={{
              color: 'rgba(250,247,240,0.5)', fontSize: '11px',
              letterSpacing: '0.15em', marginBottom: '8px', textTransform: 'uppercase',
            }}>
              ENTER ACCESS CODE
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ color: 'var(--accent)', fontSize: '13px' }}>›</span>
              <input
                ref={inputRef}
                type="password"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && attempt()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `1px solid ${error ? '#ef4444' : 'rgba(250,247,240,0.2)'}`,
                  color: error ? '#ef4444' : 'var(--paper)',
                  fontSize: '14px',
                  padding: '4px 0',
                  width: '280px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  letterSpacing: '0.1em',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                placeholder="_ _ _ _ _ _ _ _ _"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                onClick={attempt}
                style={{
                  background: 'none', border: 'none',
                  color: 'var(--accent)', cursor: 'pointer',
                  fontSize: '16px', padding: '0 4px',
                  opacity: input.length ? 1 : 0.3,
                  transition: 'opacity 0.2s',
                }}
              >
                →
              </button>
            </div>
            {error && (
              <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '8px', letterSpacing: '0.1em' }}>
                ACCESS DENIED
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  )
}
