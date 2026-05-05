import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const alt = 'eevolvv — A service, not software.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/* volvv-e ghost pixel art — 19×18 grid
   0 = transparent  1 = paper  2 = ink (eyes)  3 = accent (smile) */
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

const CELL = 26 // px per pixel cell
const GHOST_W = 19 * CELL
const GHOST_H = 18 * CELL

export default async function Image() {
  const fontBold = await readFile(join(process.cwd(), 'public/fonts/SpaceGrotesk-Bold.woff2'))

  /* Flatten nested row→col map so satori gets a single array of rects */
  const ghostRects = GHOST_GRID.flatMap((row, ri) =>
    row.flatMap((cell, ci) => {
      if (cell === 0) return []
      const fill = cell === 1 ? '#faf7f0' : cell === 2 ? '#141413' : '#8B2A1A'
      return [{ x: ci * CELL, y: ri * CELL, fill }]
    })
  )

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
        }}
      >
        {/* Left content column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '56px 0 52px 72px',
            flex: 1,
          }}
        >
          {/* Wordmark row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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
            <span style={{ fontSize: 17, fontWeight: 700, color: 'rgba(250,247,240,0.9)', letterSpacing: '0.1em' }}>
              EEVOLVV
            </span>
            <span style={{ fontSize: 11, color: '#8B2A1A', letterSpacing: '0.2em' }}>
              AI OPERATIONS · Q2 2026
            </span>
          </div>

          {/* Headline — no <br />, use flex-column spans instead */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }}>
              <span style={{ fontSize: 72, fontWeight: 700, color: '#faf7f0', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
                We don't sell
              </span>
              <span style={{ fontSize: 72, fontWeight: 700, color: '#faf7f0', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
                software.
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 72, fontWeight: 700, color: '#8B2A1A', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
                We become your
              </span>
              <span style={{ fontSize: 72, fontWeight: 700, color: '#8B2A1A', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
                AI operations team.
              </span>
            </div>
          </div>

          {/* Proof-point chips */}
          <div style={{ display: 'flex', gap: 28 }}>
            {[
              { label: 'Ghost Locker', sub: 'Agent manufacturing pipeline' },
              { label: 'Internal OS', sub: '11-route live ops dashboard' },
              { label: 'Diagnostic Engine', sub: 'AI-led · 14 industries' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#faf7f0', letterSpacing: '0.04em' }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 11, color: 'rgba(250,247,240,0.38)', letterSpacing: '0.08em' }}>
                  {item.sub}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: volvv-e ghost */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 380,
            flexShrink: 0,
            gap: 16,
          }}
        >
          <svg width={GHOST_W} height={GHOST_H} viewBox={`0 0 ${GHOST_W} ${GHOST_H}`}>
            {ghostRects.map((r, i) => (
              <rect key={i} x={r.x} y={r.y} width={CELL} height={CELL} fill={r.fill} />
            ))}
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(250,247,240,0.6)', letterSpacing: '0.16em' }}>
              VOLVV-E
            </span>
            <span style={{ fontSize: 10, color: 'rgba(250,247,240,0.28)', letterSpacing: '0.18em' }}>
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
            display: 'flex',
          }}
        />

        {/* URL watermark */}
        <span
          style={{
            position: 'absolute',
            bottom: 20,
            right: 28,
            fontSize: 11,
            color: 'rgba(250,247,240,0.28)',
            letterSpacing: '0.14em',
          }}
        >
          EEVOLVV.COM/YC
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Space Grotesk', data: fontBold, weight: 700, style: 'normal' }],
    }
  )
}
