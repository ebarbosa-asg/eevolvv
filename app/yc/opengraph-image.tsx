import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const alt = 'eevolvv — A service, not software.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/* volvv-e ghost pixel art — 19×18 grid, each cell = 18px */
const GHOST_GRID = [
  [0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [1,1,1,2,2,2,1,1,1,1,1,1,2,2,2,1,1,1,1],
  [1,1,1,2,2,2,1,1,1,1,1,1,2,2,2,1,1,1,1],
  [1,1,1,2,2,2,1,1,1,1,1,1,2,2,2,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,3,3,3,3,3,3,3,3,1,1,1,1,1,1],
  [1,1,1,1,1,1,3,3,3,3,3,3,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1],
  [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]

function GhostPixels({ x, y, cell, color }: { x: number; y: number; cell: number; color: string }) {
  if (cell === 0) return null
  const c = cell === 1 ? color : cell === 2 ? '#141413' : '#8B2A1A'
  return <rect x={x} y={y} width={18} height={18} fill={c} />
}

export default async function Image() {
  const fontBold = await readFile(join(process.cwd(), 'public/fonts/SpaceGrotesk-Bold.woff2'))

  const ghostColor = '#faf7f0'
  const ghostScale = 1.6
  const cellSize = 18 * ghostScale
  const ghostW = 19 * cellSize
  const ghostH = 18 * cellSize

  return new ImageResponse(
    (
      <div
        style={{
          background: '#141413',
          width: '100%',
          height: '100%',
          display: 'flex',
          fontFamily: 'Space Grotesk',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(to right, rgba(250,247,240,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(250,247,240,0.03) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Accent orb */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: 280,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(140,43,26,0.18) 0%, transparent 70%)',
          }}
        />

        {/* Left content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '56px 0 52px 72px',
            flex: 1,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Top: wordmark + tag */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  border: '2px solid rgba(250,247,240,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                  <path d="M6 20 L6 8 L14 8" stroke="#faf7f0" strokeWidth="2.2" strokeLinecap="square" />
                  <path d="M6 14 L12 14" stroke="#faf7f0" strokeWidth="2.2" strokeLinecap="square" />
                  <path d="M14 8 L22 20" stroke="#faf7f0" strokeWidth="2.2" strokeLinecap="square" />
                  <circle cx="22" cy="20" r="2.4" fill="#8B2A1A" />
                </svg>
              </div>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'rgba(250,247,240,0.9)',
                  letterSpacing: '0.1em',
                }}
              >
                EEVOLVV
              </span>
            </div>
            <span
              style={{
                fontSize: 11,
                color: '#8B2A1A',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                marginLeft: 2,
              }}
            >
              AI OPERATIONS · Q2 2026
            </span>
          </div>

          {/* Center: headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div
              style={{
                fontSize: 74,
                fontWeight: 700,
                color: '#faf7f0',
                lineHeight: 1.0,
                letterSpacing: '-0.03em',
                marginBottom: 20,
              }}
            >
              We don't sell<br />software.
            </div>
            <div
              style={{
                fontSize: 74,
                fontWeight: 700,
                color: '#8B2A1A',
                lineHeight: 1.0,
                letterSpacing: '-0.03em',
              }}
            >
              We become your<br />AI operations team.
            </div>
          </div>

          {/* Bottom: three proof points */}
          <div style={{ display: 'flex', gap: 32 }}>
            {[
              { label: 'Ghost Locker', sub: 'Agent manufacturing pipeline' },
              { label: 'Internal OS', sub: '11-route live ops dashboard' },
              { label: 'Diagnostic Engine', sub: 'AI-led · 14 industries' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#faf7f0',
                    letterSpacing: '0.04em',
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: 'rgba(250,247,240,0.38)',
                    letterSpacing: '0.08em',
                  }}
                >
                  {item.sub}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: ghost */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 420,
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <svg
            width={ghostW}
            height={ghostH}
            viewBox={`0 0 ${ghostW} ${ghostH}`}
            style={{ imageRendering: 'pixelated' }}
          >
            {GHOST_GRID.map((row, ri) =>
              row.map((cell, ci) =>
                cell > 0 ? (
                  <rect
                    key={`${ri}-${ci}`}
                    x={ci * cellSize}
                    y={ri * cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill={
                      cell === 1 ? ghostColor :
                      cell === 2 ? '#141413' :
                      '#8B2A1A'
                    }
                  />
                ) : null
              )
            )}
          </svg>

          {/* volvv-e label below ghost */}
          <div
            style={{
              position: 'absolute',
              bottom: 52,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(250,247,240,0.7)', letterSpacing: '0.14em' }}>
              VOLVV-E
            </span>
            <span style={{ fontSize: 10, color: 'rgba(250,247,240,0.3)', letterSpacing: '0.18em' }}>
              AI AGENT MASCOT
            </span>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: '#8B2A1A',
          }}
        />

        {/* Bottom right URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            right: 32,
            fontSize: 11,
            color: 'rgba(250,247,240,0.3)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          EEVOLVV.COM/YC
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Space Grotesk', data: fontBold, weight: 700, style: 'normal' }],
    }
  )
}
