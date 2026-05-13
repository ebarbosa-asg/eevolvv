import { ImageResponse } from 'next/og'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'
export const alt = 'eevolvv Evolution Report'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface PageProps {
  params: { id: string }
}

export default async function Image({ params }: PageProps) {
  const { id } = params

  let businessName = 'Your Business'
  let tier: string | null = null

  if (supabase) {
    const { data: submission } = await supabase
      .from('submissions')
      .select('business_name, tier')
      .eq('id', id)
      .eq('status', 'completed')
      .maybeSingle()

    if (submission) {
      businessName = submission.business_name || 'Your Business'
      tier = submission.tier ?? null
    }
  }

  const tierLabel = tier
    ? tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase() + ' Tier'
    : null

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#faf7f0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 72px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(20,20,19,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(20,20,19,0.04) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Left accent bar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            background: '#8C2B1A',
          }}
        />

        {/* Top row: wordmark + label */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            position: 'relative',
          }}
        >
          {/* Wordmark */}
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: '-0.04em',
              color: '#141413',
            }}
          >
            eevolvv
          </div>

          {/* Free AI Business Diagnostic label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#141413',
              color: '#faf7f0',
              padding: '8px 16px',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.18em',
            }}
          >
            FREE AI BUSINESS DIAGNOSTIC
          </div>
        </div>

        {/* Center: main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            position: 'relative',
          }}
        >
          {/* Section marker */}
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.28em',
              color: '#8C2B1A',
            }}
          >
            → EVOLUTION REPORT
          </div>

          {/* Business name */}
          <div
            style={{
              fontSize: businessName.length > 30 ? 52 : 64,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#141413',
            }}
          >
            {businessName}
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 400,
              color: '#141413',
              opacity: 0.55,
              letterSpacing: '-0.01em',
            }}
          >
            Your AI-generated automation roadmap
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            {/* Status dot */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#4ade80',
                }}
              />
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  color: '#4ade80',
                }}
              >
                ARCHIVED
              </div>
            </div>

            {tierLabel && (
              <>
                <div
                  style={{
                    width: 1,
                    height: 16,
                    background: 'rgba(20,20,19,0.2)',
                  }}
                />
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    color: '#8C2B1A',
                  }}
                >
                  {tierLabel.toUpperCase()}
                </div>
              </>
            )}
          </div>

          {/* Domain */}
          <div
            style={{
              fontSize: 14,
              color: '#141413',
              opacity: 0.35,
              letterSpacing: '0.04em',
            }}
          >
            eevolvv.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
