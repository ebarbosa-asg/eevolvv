import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          padding: '80px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000',
            backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000 70%)',
          }}
        />
        
        {/* The Frame */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '60px 100px',
            position: 'relative',
          }}
        >
          {/* Corner accents */}
          <div style={{ position: 'absolute', top: -5, left: -5, width: 20, height: 1, backgroundColor: '#fbbf24' }} />
          <div style={{ position: 'absolute', top: -5, left: -5, width: 1, height: 20, backgroundColor: '#fbbf24' }} />
          
          <div
            style={{
              fontSize: 100,
              fontWeight: 900,
              letterSpacing: '-0.05em',
              color: '#fff',
              marginBottom: 10,
              display: 'flex',
            }}
          >
            eevolvv
          </div>
          
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.4em',
              color: '#fbbf24',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            § Autonomous Infrastructure
          </div>
        </div>

        {/* Global Footer Meta */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            padding: '0 80px',
            color: 'rgba(255, 255, 255, 0.2)',
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
          }}
        >
          <span>Instance: 2026.GLOBAL</span>
          <span>Status: ACTIVE</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
