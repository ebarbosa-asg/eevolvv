'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

export type GhostState = 'idle' | 'thinking' | 'done' | 'error'

export interface VolvvEProps {
  state?: GhostState
  /** px per pixel — default 4 → 52×60px sprite */
  scale?: number
  /** show black background (for dark contexts) */
  showBg?: boolean
  className?: string
  style?: React.CSSProperties
}

// ── Pixel maps ────────────────────────────────────────────────────────
// 19 cols × 18 rows  |  0 = transparent  1 = body(red)  2 = white feature

const BODY: number[][] = [
  [0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0], //  0 head top
  [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0], //  1
  [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0], //  2
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0], //  3
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0], //  4
  [0,1,1,2,2,2,1,1,1,1,1,1,1,2,2,2,1,1,0], //  5 eyes
  [0,1,1,2,2,2,1,1,1,1,1,1,1,2,2,2,1,1,0], //  6 eyes
  [0,1,1,2,2,2,1,1,1,1,1,1,1,2,2,2,1,1,0], //  7 eyes
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0], //  8
  [0,1,1,1,1,1,1,2,2,2,2,2,1,1,1,1,1,1,0], //  9 smile (idle)
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0], // 10
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // 11 arms extend full width
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // 12
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0], // 13
  [0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0], // 14 tentacle base (6 pairs)
  [0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0], // 15
  [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0], // 16 tentacles narrow
  [0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0], // 17 tips (3 remain)
]

const COLS = 19
const ROWS = 18

// Feature pixel positions
const EYE_COLS_L = [3, 4, 5]
const EYE_COLS_R = [13, 14, 15]
const EYE_ROWS   = [5, 6, 7]
const SMILE_ROW  = 9
const SMILE_COLS = [7, 8, 9, 10, 11]         // 5-wide idle smile
const BIG_SMILE  = [5, 6, 7, 8, 9, 10, 11, 12, 13]  // 9-wide done smile
const FROWN_TOP  = [[8,7],[8,8],[8,9],[8,10],[8,11]]  // frown inner arch
const FROWN_BOT  = [[9,6],[9,12]]             // frown outer corners

const ACCENT = 'oklch(0.45 0.13 25)'        // matches var(--accent) for SVG fills

// ── Helper ────────────────────────────────────────────────────────────
function Pixel({ x, y, s, fill }: { x: number; y: number; s: number; fill: string }) {
  return <rect x={x * s} y={y * s} width={s} height={s} fill={fill} shapeRendering="crispEdges" />
}

// ── Component ─────────────────────────────────────────────────────────
export function VolvvE({ state = 'idle', scale = 4, showBg = false, className, style }: VolvvEProps) {
  const [blink, setBlink]       = useState(false)
  const [blinkHalf, setBlinkHalf] = useState(false)
  const blinkRef = useRef<ReturnType<typeof setTimeout>>()

  const scheduleBlink = useCallback(() => {
    blinkRef.current = setTimeout(() => {
      setBlink(true)
      setBlinkHalf(false)
      // half-blink after 60ms
      setTimeout(() => setBlinkHalf(true), 60)
      // open after 150ms
      setTimeout(() => {
        setBlink(false)
        setBlinkHalf(false)
        scheduleBlink()
      }, 150)
    }, 2800 + Math.random() * 2600)
  }, [])

  useEffect(() => {
    if (state === 'idle' || state === 'done') scheduleBlink()
    return () => clearTimeout(blinkRef.current)
  }, [state, scheduleBlink])

  const s = scale
  const W = COLS * s
  const H = (ROWS + 1) * s   // +1 row breathing room

  // ── Build pixel list ─────────────────────────────────────────────────
  const pixels: React.ReactNode[] = []
  const push = (r: number, c: number, fill: string, key: string) =>
    pixels.push(<Pixel key={key} x={c} y={r} s={s} fill={fill} />)

  BODY.forEach((row, ri) => {
    row.forEach((val, ci) => {
      const isEyeL = EYE_ROWS.includes(ri) && EYE_COLS_L.includes(ci)
      const isEyeR = EYE_ROWS.includes(ri) && EYE_COLS_R.includes(ci)
      const isEye  = isEyeL || isEyeR

      // ── Eyes ──
      if (isEye) {
        if (blink) {
          if (!blinkHalf) push(ri, ci, ACCENT, `e-${ri}-${ci}`)
          else if (ri === 7) push(ri, ci, '#ffffff', `e-${ri}-${ci}`) // half-blink: only bottom row shows
        } else if (state === 'thinking') {
          // squint: only bottom row of eye shows
          if (ri === 7) push(ri, ci, '#ffffff', `e-${ri}-${ci}`)
          else push(ri, ci, ACCENT, `e-${ri}-${ci}`)
        } else {
          push(ri, ci, '#ffffff', `e-${ri}-${ci}`)
        }
        return
      }

      // ── Mouth ──
      if (ri === SMILE_ROW && val === 2) {
        if (state === 'error') return // skip idle smile
        if (state === 'done') return  // replaced by big smile below
        push(ri, ci, '#ffffff', `m-${ri}-${ci}`)
        return
      }

      // ── Body ──
      if (val === 1) push(ri, ci, ACCENT, `b-${ri}-${ci}`)
    })
  })

  // ── State-specific overlays ──────────────────────────────────────────

  // DONE: big wide smile
  if (state === 'done') {
    BIG_SMILE.forEach(c => push(SMILE_ROW, c, '#ffffff', `ds-${c}`))
  }

  // ERROR: frown
  if (state === 'error') {
    FROWN_TOP.forEach(([r, c]) => push(r, c, '#ffffff', `ft-${r}-${c}`))
    FROWN_BOT.forEach(([r, c]) => push(r, c, '#ffffff', `fb-${r}-${c}`))
  }

  // THINKING: 3 dots above head (animated separately via CSS)
  const thinkDots = state === 'thinking'
    ? [0, 1, 2].map(i => (
        <rect
          key={`td-${i}`}
          x={(12 + i * 2) * s} y={(-3 + i * -1) * s + (i === 1 ? -s : 0)}
          width={s} height={s}
          fill={ACCENT}
          shapeRendering="crispEdges"
          style={{ animation: `volvve-dot-pulse 1.2s ease-in-out ${i * 0.18}s infinite` }}
        />
      ))
    : null

  // ── Animation class mapping ───────────────────────────────────────────
  const animClass: Record<GhostState, string> = {
    idle:     'volvve-float',
    thinking: 'volvve-sway',
    done:     'volvve-bounce',
    error:    'volvve-shake',
  }

  const STYLE_ID = 'volvve-styles'

  return (
    <>
      {/* Inject keyframes once */}
      <style id={STYLE_ID} dangerouslySetInnerHTML={{ __html: `
        @keyframes volvve-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes volvve-sway {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          25%      { transform: translateX(-2px) rotate(-2deg); }
          75%      { transform: translateX(2px) rotate(2deg); }
        }
        @keyframes volvve-bounce {
          0%   { transform: translateY(0px) scale(1); }
          20%  { transform: translateY(-10px) scale(1.05); }
          40%  { transform: translateY(-4px) scale(0.97); }
          60%  { transform: translateY(-7px) scale(1.02); }
          80%  { transform: translateY(-2px) scale(0.99); }
          100% { transform: translateY(0px) scale(1); }
        }
        @keyframes volvve-shake {
          0%, 100% { transform: translateX(0px); }
          15%  { transform: translateX(-4px); }
          30%  { transform: translateX(4px); }
          45%  { transform: translateX(-4px); }
          60%  { transform: translateX(4px); }
          75%  { transform: translateX(-2px); }
          90%  { transform: translateX(2px); }
        }
        @keyframes volvve-dot-pulse {
          0%, 100% { opacity: 0.25; transform: scaleY(1); }
          50%      { opacity: 1;    transform: scaleY(1.4); }
        }
        .volvve-float   { animation: volvve-float   3s ease-in-out infinite; }
        .volvve-sway    { animation: volvve-sway    1.8s ease-in-out infinite; }
        .volvve-bounce  { animation: volvve-bounce  0.7s cubic-bezier(0.36,0.07,0.19,0.97) both; }
        .volvve-shake   { animation: volvve-shake   0.6s cubic-bezier(0.36,0.07,0.19,0.97) both; }
      ` }} />

      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className={`${animClass[state]}${className ? ' ' + className : ''}`}
        style={{
          imageRendering: 'pixelated',
          display: 'block',
          overflow: 'visible',
          background: showBg ? '#000000' : 'transparent',
          ...style,
        }}
        aria-hidden="true"
      >
        {thinkDots}
        {pixels}
      </svg>
    </>
  )
}

// ── Preset wrappers ───────────────────────────────────────────────────

/** Inline ghost avatar (used inside chat bubbles) */
export function VolvvEAvatar({ state, scale = 4 }: { state?: GhostState; scale?: number }) {
  return (
    <div style={{ width: scale * COLS, height: scale * (ROWS + 1), flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <VolvvE state={state} scale={scale} />
    </div>
  )
}

/** Corner presence: floating ghost in a fixed corner of the screen */
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
        {state === 'idle'     ? '◈ online'    :
         state === 'thinking' ? '▷ working'   :
         state === 'done'     ? '★ done'      : '! error'}
      </span>
    </div>
  )
}
