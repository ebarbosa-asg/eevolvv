import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const alt = 'eevolvv — AI Business Transformation'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const fontBold = await readFile(join(process.cwd(), 'public/fonts/SpaceGrotesk-Bold.woff2'))

  return new ImageResponse(
    (
      <div
        style={{
          background: '#faf7f0',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px 80px 0 80px',
          fontFamily: 'Space Grotesk',
          position: 'relative',
        }}
      >
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 56 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 40,
                height: 40,
                border: '2px solid #141413',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <path d="M6 20 L6 8 L14 8" stroke="#141413" strokeWidth="2.2" strokeLinecap="square" />
                <path d="M6 14 L12 14" stroke="#141413" strokeWidth="2.2" strokeLinecap="square" />
                <path d="M14 8 L22 20" stroke="#141413" strokeWidth="2.2" strokeLinecap="square" />
                <circle cx="22" cy="20" r="2.4" fill="#8B2A1A" />
              </svg>
            </div>
            <span style={{ fontSize: 24, fontWeight: 700, color: '#141413', letterSpacing: '0.06em' }}>
              EEVOLVV
            </span>
          </div>

          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#8B2A1A', letterSpacing: '0.12em' }}>
              AI BUSINESS TRANSFORMATION
            </span>
            <span style={{ fontSize: 13, color: '#999085', letterSpacing: '0.1em' }}>
              REV 2026.04
            </span>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 92,
            fontWeight: 700,
            color: '#141413',
            lineHeight: 1.0,
            letterSpacing: '-0.025em',
            marginBottom: 16,
          }}
        >
          We evolve every
        </div>

        {/* Flap board */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {['B','U','S','I','N','E','S','S'].map((ch, i) => (
            <div
              key={i}
              style={{
                background: '#141413',
                color: '#faf7f0',
                width: 74,
                height: 90,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 56,
                fontWeight: 700,
              }}
            >
              {ch}
            </div>
          ))}
          {[0,1,2,3].map(i => (
            <div
              key={i}
              style={{ background: '#e8e4dc', width: 74, height: 90 }}
            />
          ))}
        </div>

        {/* Subline */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: '#141413',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            flex: 1,
          }}
        >
          into the new era.
        </div>

        {/* Bottom rule + meta */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 22,
            paddingBottom: 22,
            borderTop: '1px solid #d8d4cc',
          }}
        >
          <span style={{ fontSize: 13, color: '#999085', letterSpacing: '0.1em' }}>
            60-DAY ROI GUARANTEE
          </span>
          <span style={{ fontSize: 13, color: '#999085', letterSpacing: '0.1em' }}>
            WORKFLOW AUTOMATION · AI AGENTS · OPERATIONS
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#8B2A1A', letterSpacing: '0.1em' }}>
            EEVOLVV.COM
          </span>
        </div>

        {/* Accent bar at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 7,
            background: '#8B2A1A',
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Space Grotesk', data: fontBold, weight: 700, style: 'normal' }],
    }
  )
}
