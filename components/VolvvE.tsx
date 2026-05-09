'use client'

import { useEffect, useRef, useCallback } from 'react'

export type GhostState = 'idle' | 'thinking' | 'done' | 'error'

export interface VolvvEProps {
  state?: GhostState
  /** px per pixel — default 4 → ~76px sprite */
  scale?: number
  className?: string
  style?: React.CSSProperties
}

const ACCENT = 'oklch(0.45 0.13 25)'
const BASE_SIZE = 76 // px at scale=4

const STYLE_ID = 'volvve-styles'

// ── Component ─────────────────────────────────────────────────────────
export function VolvvE({ state = 'idle', scale = 4, className, style }: VolvvEProps) {
  const size = Math.round((scale / 4) * BASE_SIZE)

  const animClass: Record<GhostState, string> = {
    idle:     'volvve-float',
    thinking: 'volvve-sway',
    done:     'volvve-bounce',
    error:    'volvve-shake',
  }

  return (
    <>
      <style id={STYLE_ID} dangerouslySetInnerHTML={{ __html: `
        @keyframes volvve-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes volvve-sway {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          25%      { transform: translateX(-3px) rotate(-2deg); }
          75%      { transform: translateX(3px) rotate(2deg); }
        }
        @keyframes volvve-bounce {
          0%   { transform: translateY(0px) scale(1); }
          20%  { transform: translateY(-12px) scale(1.06); }
          40%  { transform: translateY(-4px) scale(0.97); }
          60%  { transform: translateY(-8px) scale(1.03); }
          80%  { transform: translateY(-2px) scale(0.99); }
          100% { transform: translateY(0px) scale(1); }
        }
        @keyframes volvve-shake {
          0%, 100% { transform: translateX(0px); }
          15%  { transform: translateX(-5px); }
          30%  { transform: translateX(5px); }
          45%  { transform: translateX(-5px); }
          60%  { transform: translateX(5px); }
          75%  { transform: translateX(-3px); }
          90%  { transform: translateX(3px); }
        }
        @keyframes volvve-think-pulse {
          0%, 100% { opacity: 0.6; }
          50%      { opacity: 1; }
        }
        .volvve-float   { animation: volvve-float   3s ease-in-out infinite; }
        .volvve-sway    { animation: volvve-sway    1.8s ease-in-out infinite; }
        .volvve-bounce  { animation: volvve-bounce  0.7s cubic-bezier(0.36,0.07,0.19,0.97) both; }
        .volvve-shake   { animation: volvve-shake   0.6s cubic-bezier(0.36,0.07,0.19,0.97) both; }
        .volvve-thinking { animation: volvve-think-pulse 1.2s ease-in-out infinite, volvve-sway 1.8s ease-in-out infinite; }
      ` }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/volvv-e.png"
        alt="volvv-e"
        width={size}
        height={size}
        className={state === 'thinking'
          ? `volvve-thinking${className ? ' ' + className : ''}`
          : `${animClass[state]}${className ? ' ' + className : ''}`
        }
        style={{
          imageRendering: 'pixelated',
          display: 'block',
          userSelect: 'none',
          ...style,
        }}
        aria-hidden="true"
      />
    </>
  )
}

// ── Preset wrappers ───────────────────────────────────────────────────

/** Inline ghost avatar (used inside chat bubbles) */
export function VolvvEAvatar({ state, scale = 4 }: { state?: GhostState; scale?: number }) {
  const size = Math.round((scale / 4) * BASE_SIZE)
  return (
    <div style={{ width: size, height: size, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <VolvvE state={state} scale={scale} />
    </div>
  )
}

/**
 * Feature introduction card — drop anywhere to introduce Volvv-E.
 * Dark or light variant.
 */
export function VolvvECard({ dark = false }: { dark?: boolean }) {
  const bg = dark ? 'var(--ink)' : 'rgba(20,20,19,0.04)'
  const fg = dark ? 'var(--paper)' : 'var(--ink)'
  const border = dark ? '1px solid rgba(244,241,234,0.1)' : '1px solid var(--rule)'
  return (
    <div style={{
      display: 'flex', gap: 24, alignItems: 'center',
      padding: '28px 32px',
      background: bg, border, color: fg,
      flexWrap: 'wrap',
    }}>
      <VolvvE state="idle" scale={6} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 9, letterSpacing: '0.22em',
          color: ACCENT, fontWeight: 600, marginBottom: 6,
          textTransform: 'uppercase',
        }}>
          Meet your AI agent
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
          Volvv-E
        </div>
        <div style={{ fontSize: 13, opacity: dark ? 0.5 : 0.55, lineHeight: 1.65, maxWidth: 440 }}>
          Part analyst, part strategist — your always-on AI staff member. I map operations, identify ghost work, and build your automation roadmap. Think of me as the intern who never sleeps, the front desk that never misses a lead, and the analyst who reads every line of your business.
        </div>
        <div style={{ display: 'flex', gap: 24, marginTop: 14, flexWrap: 'wrap' }}>
          {['Available 24/7', '1,200+ automation patterns', 'Report in 10 minutes'].map(f => (
            <span key={f} style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 9, letterSpacing: '0.14em',
              color: ACCENT, fontWeight: 600,
            }}>
              → {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Corner presence: floating volvv-e in a fixed corner of the screen */
export function VolvvECorner({ state = 'idle', side = 'right' }: { state?: GhostState; side?: 'left' | 'right' }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 28,
        [side]: 24,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <VolvvE state={state} scale={5} />
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: ACCENT,
        fontWeight: 600,
      }}>
        volvv-e
      </span>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 7,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: ACCENT,
        opacity: 0.45,
        marginTop: -3,
      }}>
        {state === 'idle'     ? '◈ online'   :
         state === 'thinking' ? '▷ working'  :
         state === 'done'     ? '★ done'     : '! error'}
      </span>
    </div>
  )
}
