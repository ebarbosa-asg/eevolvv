'use client'

import { useEffect, useState } from 'react'

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

const VOLVVE_MODES = [
  {
    code: '01',
    name: 'Scanner',
    label: 'finds hidden work',
    state: 'thinking' as GhostState,
    animClass: 'volvve-mode-scan',
    description: 'Scans your workflow for repeated admin, missed follow-ups, and invisible revenue leaks.',
  },
  {
    code: '02',
    name: 'Mapper',
    label: 'draws the route',
    state: 'idle' as GhostState,
    animClass: 'volvve-mode-map',
    description: 'Turns messy operations into a clear automation map your team can actually act on.',
  },
  {
    code: '03',
    name: 'Builder',
    label: 'ships the fix',
    state: 'done' as GhostState,
    animClass: 'volvve-mode-build',
    description: 'Converts the report into task agents, integrations, and working business systems.',
  },
  {
    code: '04',
    name: 'Watcher',
    label: 'keeps watch',
    state: 'idle' as GhostState,
    animClass: 'volvve-mode-watch',
    description: 'Monitors drift, stale tasks, stuck leads, and the small breakdowns teams stop noticing.',
  },
  {
    code: '05',
    name: 'Reporter',
    label: 'explains the signal',
    state: 'thinking' as GhostState,
    animClass: 'volvve-mode-report',
    description: 'Summarizes what changed, what worked, and where the next automation should go.',
  },
  {
    code: '06',
    name: 'Operator',
    label: 'runs the loop',
    state: 'idle' as GhostState,
    animClass: 'volvve-mode-operate',
    description: 'Keeps the system improving month after month as eevolvv learns the business.',
  },
]

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
        @keyframes volvve-scan {
          0%, 100% { transform: translateY(0) scale(1); filter: drop-shadow(0 0 0 rgba(140,43,26,0)); }
          45%      { transform: translateY(-8px) scale(1.08); filter: drop-shadow(0 10px 0 rgba(140,43,26,0.18)); }
          70%      { transform: translateY(2px) scale(0.98); }
        }
        @keyframes volvve-map {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          25%      { transform: translate(8px,-5px) rotate(2deg); }
          50%      { transform: translate(-3px,-9px) rotate(-1deg); }
          75%      { transform: translate(-8px,-3px) rotate(-2deg); }
        }
        @keyframes volvve-build {
          0%, 100% { transform: translateY(0) scale(1); }
          15%      { transform: translateY(-14px) scale(1.08); }
          30%      { transform: translateY(0) scale(0.96); }
          48%      { transform: translateY(-8px) scale(1.04); }
          64%      { transform: translateY(0) scale(1); }
        }
        @keyframes volvve-watch {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          20%      { transform: translateX(-5px) rotate(-4deg); }
          40%      { transform: translateX(5px) rotate(4deg); }
          60%      { transform: translateX(-2px) rotate(-2deg); }
          80%      { transform: translateX(2px) rotate(2deg); }
        }
        @keyframes volvve-report {
          0%, 100% { transform: translateY(0); opacity: 0.92; }
          50%      { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes volvve-operate {
          0%       { transform: translateY(0) rotate(0deg); }
          30%      { transform: translateY(-6px) rotate(-3deg); }
          60%      { transform: translateY(-2px) rotate(3deg); }
          100%     { transform: translateY(0) rotate(0deg); }
        }
        .volvve-float   { animation: volvve-float   3s ease-in-out infinite; }
        .volvve-sway    { animation: volvve-sway    1.8s ease-in-out infinite; }
        .volvve-bounce  { animation: volvve-bounce  0.7s cubic-bezier(0.36,0.07,0.19,0.97) both; }
        .volvve-shake   { animation: volvve-shake   0.6s cubic-bezier(0.36,0.07,0.19,0.97) both; }
        .volvve-thinking { animation: volvve-think-pulse 1.2s ease-in-out infinite, volvve-sway 1.8s ease-in-out infinite; }
        .volvve-mode-sprite.volvve-mode-scan    { animation: volvve-scan 1.8s ease-in-out infinite; }
        .volvve-mode-sprite.volvve-mode-map     { animation: volvve-map 2.8s ease-in-out infinite; }
        .volvve-mode-sprite.volvve-mode-build   { animation: volvve-build 1.45s cubic-bezier(0.36,0.07,0.19,0.97) infinite; }
        .volvve-mode-sprite.volvve-mode-watch   { animation: volvve-watch 2.2s ease-in-out infinite; }
        .volvve-mode-sprite.volvve-mode-report  { animation: volvve-report 1.6s ease-in-out infinite; }
        .volvve-mode-sprite.volvve-mode-operate { animation: volvve-operate 2.4s ease-in-out infinite; }
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
  const [modeIndex, setModeIndex] = useState(0)
  const mode = VOLVVE_MODES[modeIndex]
  const bg = dark ? 'var(--ink)' : 'rgba(20,20,19,0.04)'
  const fg = dark ? 'var(--paper)' : 'var(--ink)'
  const border = dark ? '1px solid rgba(244,241,234,0.1)' : '1px solid var(--rule)'

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      setModeIndex(i => (i + 1) % VOLVVE_MODES.length)
    }, 3400)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="volvve-card" style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(132px, 180px) minmax(0, 1fr)',
      gap: 28,
      alignItems: 'center',
      padding: '32px',
      background: bg, border, color: fg,
      overflow: 'hidden',
      transition: 'background 0.7s cubic-bezier(0.2,0.8,0.2,1), border-color 0.7s cubic-bezier(0.2,0.8,0.2,1), color 0.7s cubic-bezier(0.2,0.8,0.2,1)',
    }}>
      <div style={{
        minHeight: 172,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        borderRight: dark ? '1px solid rgba(244,241,234,0.08)' : '1px solid var(--rule)',
        paddingRight: 24,
      }}>
        <div key={mode.code} className="volvve-mode-stage">
          <VolvvE
            state={mode.state}
            scale={9}
            className={`volvve-mode-sprite ${mode.animClass}`}
            style={{ flexShrink: 0 }}
          />
        </div>
        <div className="mono" style={{ fontSize: 9, letterSpacing: '0.16em', color: ACCENT, fontWeight: 700 }}>
          MODE {mode.code}
        </div>
      </div>

      <div style={{ minWidth: 0 }}>
        <div key={mode.code} className="volvve-mode-copy">
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9, letterSpacing: '0.22em',
            color: ACCENT, fontWeight: 600, marginBottom: 6,
            textTransform: 'uppercase',
          }}>
            Meet your AI agent
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Volvv-E / {mode.name}
          </div>
          <div style={{ fontSize: 13, opacity: dark ? 0.58 : 0.62, lineHeight: 1.65, maxWidth: 520 }}>
            {mode.description}
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 8,
          marginTop: 18,
        }}>
          {VOLVVE_MODES.map((m, i) => (
            <button
              key={m.code}
              type="button"
              className="volvve-mode-tab"
              onClick={() => setModeIndex(i)}
              aria-pressed={i === modeIndex}
              style={{
                background: i === modeIndex ? ACCENT : 'transparent',
                color: i === modeIndex ? 'var(--paper)' : fg,
                border: i === modeIndex ? `1px solid ${ACCENT}` : dark ? '1px solid rgba(244,241,234,0.12)' : '1px solid var(--rule)',
                padding: '9px 10px',
                textAlign: 'left',
                cursor: 'pointer',
                minHeight: 54,
                transition: 'background 0.55s cubic-bezier(0.2,0.8,0.2,1), color 0.55s cubic-bezier(0.2,0.8,0.2,1), border-color 0.55s cubic-bezier(0.2,0.8,0.2,1), transform 0.55s cubic-bezier(0.2,0.8,0.2,1)',
              }}
            >
              <span style={{
                display: 'block',
              fontFamily: 'JetBrains Mono, monospace',
                fontSize: 8,
                letterSpacing: '0.14em',
                opacity: i === modeIndex ? 0.75 : 0.45,
                marginBottom: 4,
              }}>
                {m.code}
              </span>
              <span style={{ display: 'block', fontSize: 12, fontWeight: 700, lineHeight: 1.1 }}>
                {m.name}
              </span>
              <span style={{
                display: 'block',
                marginTop: 3,
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 7,
                letterSpacing: '0.08em',
                opacity: i === modeIndex ? 0.72 : 0.45,
                textTransform: 'uppercase',
                lineHeight: 1.35,
              }}>
                {m.label}
              </span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 14, flexWrap: 'wrap' }}>
          {['Available 24/7', '1,200+ patterns', '10-min report'].map(f => (
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
