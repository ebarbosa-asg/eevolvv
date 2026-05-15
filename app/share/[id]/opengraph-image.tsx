import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { supabase } from '@/lib/supabase'

export const alt = 'eevolvv — Evolution Score'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Force dynamic so each share has a fresh card
export const dynamic = 'force-dynamic'

interface ShareCardData {
  businessName: string
  industry: string | null
  score: number | null
  bucket: 'hot' | 'warm' | 'nurture' | null
  recommendedTier: string | null
  hoursWasted: number | null
  missedRevenue: number | null
  topFindings: string[]
}

const TIER_LABEL: Record<string, string> = {
  agent_one: 'Agent One',
  agent_three: 'Agent Three',
  agent_five: 'Agent Five',
  enterprise: 'Enterprise',
}

async function loadCardData(id: string): Promise<ShareCardData | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('submissions')
    .select(
      'business_name, business_type, industry, report, lead_score, recommended_tier, hours_wasted_per_week, missed_revenue_estimate'
    )
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null

  const score = typeof data.lead_score === 'number' ? data.lead_score : null
  const bucket: ShareCardData['bucket'] = score == null ? null : score >= 70 ? 'hot' : score >= 40 ? 'warm' : 'nurture'

  // Extract top 3 finding headlines from the report markdown.
  const report = (data.report as string) || ''
  const findings = extractTopFindings(report).slice(0, 3)

  return {
    businessName: (data.business_name as string) || (data.business_type as string) || 'Your Business',
    industry: (data.industry as string) || null,
    score,
    bucket,
    recommendedTier: (data.recommended_tier as string) || null,
    hoursWasted: (data.hours_wasted_per_week as number | null) ?? null,
    missedRevenue: (data.missed_revenue_estimate as number | null) ?? null,
    topFindings: findings,
  }
}

function extractTopFindings(report: string): string[] {
  // Look for the TOP AUTOMATION OPPORTUNITIES section and pull numbered/bulleted items
  const match = report.match(/(?:TOP AUTOMATION OPPORTUNITIES|TOP OPPORTUNITIES|GHOST WORK FINDINGS)[\s\S]*?(?=\n###|\n##|$)/i)
  const section = match?.[0] ?? report
  const lines = section.split('\n')
  const findings: string[] = []
  for (const line of lines) {
    const m = line.match(/^\s*(?:[-*•]|\d+\.|\d+\))\s+(?:\*\*)?([^*\n]{8,140})/)
    if (m) {
      const cleaned = m[1].replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim()
      if (cleaned && !findings.includes(cleaned)) findings.push(cleaned)
      if (findings.length >= 5) break
    }
  }
  return findings
}

const PAPER = '#faf7f0'
const INK = '#141413'
const ACCENT = '#8C2B1A'

export default async function ShareCard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const fontBold = await readFile(join(process.cwd(), 'public/fonts/SpaceGrotesk-Bold.woff2'))
  const data = await loadCardData(id)

  const score = data?.score ?? 0
  const scoreLabel = data?.bucket ? data.bucket.toUpperCase() : 'PENDING'
  const tierLabel = data?.recommendedTier ? TIER_LABEL[data.recommendedTier] ?? data.recommendedTier : '—'

  return new ImageResponse(
    (
      <div
        style={{
          background: PAPER,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 72px',
          fontFamily: 'Space Grotesk',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 36, height: 36, border: `2px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 16, height: 16, background: ACCENT }} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: INK, letterSpacing: '-0.03em' }}>eevolvv</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.22em', color: ACCENT, fontWeight: 700 }}>§ EVOLUTION REPORT</div>
          </div>
        </div>

        {/* Score block */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 56, marginBottom: 36 }}>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 320 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.22em', color: ACCENT, fontWeight: 700, marginBottom: 8 }}>EVOLUTION SCORE</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
              <div style={{ fontSize: 180, fontWeight: 700, color: INK, letterSpacing: '-0.05em', lineHeight: 0.9 }}>{score}</div>
              <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 18 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: ACCENT, letterSpacing: '-0.02em' }}>/100</div>
                <div style={{ fontSize: 13, letterSpacing: '0.2em', color: INK, opacity: 0.7, marginTop: 6 }}>{scoreLabel}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, paddingTop: 18 }}>
            <Row label="BUSINESS" value={data?.businessName ?? 'Your Business'} />
            {data?.industry && <Row label="INDUSTRY" value={data.industry} />}
            <Row label="RECOMMENDED TIER" value={tierLabel} />
            {data?.hoursWasted != null && <Row label="HOURS LOST / WEEK" value={`${data.hoursWasted} hrs`} />}
            {data?.missedRevenue != null && <Row label="EST. MISSED REVENUE / MO" value={`$${data.missedRevenue.toLocaleString()}`} />}
          </div>
        </div>

        {/* Top findings */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginTop: 8 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.22em', color: ACCENT, fontWeight: 700, marginBottom: 16 }}>TOP GHOST WORK FINDINGS</div>
          {(data?.topFindings.length ? data.topFindings : ['Map your ghost work at eevolvv.com.']).map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, padding: '10px 0', borderTop: i === 0 ? `1px solid ${INK}` : '1px solid rgba(20,20,19,0.14)' }}>
              <div style={{ fontSize: 12, letterSpacing: '0.18em', color: ACCENT, fontWeight: 700, minWidth: 36 }}>G-0{i + 1}</div>
              <div style={{ fontSize: 19, color: INK, lineHeight: 1.32, fontWeight: 500, flex: 1 }}>{truncate(f, 110)}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, paddingTop: 18, borderTop: `1px solid ${INK}` }}>
          <div style={{ fontSize: 13, letterSpacing: '0.18em', color: INK, fontWeight: 600 }}>Get yours at eevolvv.com</div>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', color: INK, opacity: 0.55 }}>FIND THE GHOSTS · ELIMINATE THEM · COMPOUND FOREVER</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Space Grotesk',
          data: fontBold,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, borderBottom: '1px solid rgba(20,20,19,0.14)', paddingBottom: 10 }}>
      <div style={{ fontSize: 11, letterSpacing: '0.2em', color: INK, opacity: 0.55, minWidth: 220 }}>{label}</div>
      <div style={{ fontSize: 17, color: INK, fontWeight: 600 }}>{truncate(value, 60)}</div>
    </div>
  )
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s
  return s.slice(0, max - 1).trimEnd() + '…'
}
