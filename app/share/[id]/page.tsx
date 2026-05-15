import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface ShareRow {
  business_name: string | null
  business_type: string
  industry: string | null
  lead_score: number | null
  recommended_tier: string | null
  hours_wasted_per_week: number | null
  missed_revenue_estimate: number | null
}

const TIER_LABEL: Record<string, string> = {
  agent_one: 'Agent One',
  agent_three: 'Agent Three',
  agent_five: 'Agent Five',
  enterprise: 'Enterprise',
}

async function loadRow(id: string): Promise<ShareRow | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('submissions')
    .select('business_name, business_type, industry, lead_score, recommended_tier, hours_wasted_per_week, missed_revenue_estimate')
    .eq('id', id)
    .maybeSingle()
  if (error || !data) return null
  return data as ShareRow
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const row = await loadRow(id)
  const business = row?.business_name || row?.business_type || 'a business'
  const score = row?.lead_score ?? null

  const title = score != null
    ? `${business} scored ${score}/100 on the eevolvv ghost work index`
    : `${business} ran the eevolvv diagnostic`
  const description = score != null
    ? `Map the ghost work in your business. Free, in under 10 minutes.`
    : `Find the ghost work in your business. Free, in under 10 minutes.`

  return {
    title,
    description,
    alternates: { canonical: `https://eevolvv.com/share/${id}` },
    openGraph: {
      title,
      description,
      url: `https://eevolvv.com/share/${id}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const row = await loadRow(id)
  if (!row) notFound()

  const score = row.lead_score ?? 0
  const bucket = score >= 70 ? 'HOT' : score >= 40 ? 'WARM' : 'NURTURE'
  const business = row.business_name || row.business_type
  const tier = row.recommended_tier ? TIER_LABEL[row.recommended_tier] ?? row.recommended_tier : null

  return (
    <main style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <section style={{ padding: '96px 32px 56px', borderBottom: '1px solid var(--ink)' }}>
        <div className="site-rail mx-auto" style={{ maxWidth: 920 }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 700, marginBottom: 20 }}>
            § EVOLUTION REPORT · {business.toUpperCase()}
          </div>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 76px)', lineHeight: 0.98, letterSpacing: '-0.035em', fontWeight: 700, margin: 0 }}>
            {business} scored
            <br />
            <span style={{ color: 'var(--accent)' }}>{score} / 100</span>
            <br />
            on the ghost work index.
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.65, opacity: 0.7, maxWidth: 640, margin: '28px 0 36px' }}>
            eevolvv maps the ghost work hiding in your operations, projects what it&rsquo;s costing you,
            and hands you a custom automation roadmap. Free, in under 10 minutes.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/#diagnostic" className="mono btn-gradient" style={{ padding: '16px 28px', fontSize: 12, letterSpacing: '0.18em', fontWeight: 700, textDecoration: 'none' }}>
              GET YOUR REPORT →
            </Link>
            <Link href="/pricing" className="mono" style={{ padding: '15px 24px', fontSize: 11, letterSpacing: '0.16em', fontWeight: 700, textDecoration: 'none', color: 'var(--ink)', border: '1px solid var(--ink)' }}>
              VIEW PRICING
            </Link>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--ink)', color: 'var(--paper)', borderBottom: '3px solid var(--accent)' }}>
        <div className="site-rail mx-auto" style={{ padding: '56px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
          <StatCell label="EVOLUTION SCORE" value={String(score)} suffix={`/100 · ${bucket}`} />
          {tier && <StatCell label="RECOMMENDED TIER" value={tier} />}
          {row.hours_wasted_per_week != null && <StatCell label="HOURS LOST / WEEK" value={`${row.hours_wasted_per_week} hrs`} />}
          {row.missed_revenue_estimate != null && <StatCell label="EST. MISSED REVENUE / MO" value={`$${row.missed_revenue_estimate.toLocaleString()}`} />}
        </div>
      </section>

      <section style={{ padding: '76px 32px' }}>
        <div className="site-rail mx-auto" style={{ maxWidth: 720, textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.05, letterSpacing: '-0.028em', fontWeight: 700, margin: 0 }}>
            What&rsquo;s your business hiding?
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, opacity: 0.66, margin: '20px auto 32px', maxWidth: 540 }}>
            The diagnostic runs across 12 nodes of your business. You&rsquo;ll get a ranked list of automation
            opportunities, an ROI projection, and a 90-day build roadmap.
          </p>
          <Link href="/#diagnostic" className="mono btn-gradient" style={{ display: 'inline-block', padding: '18px 32px', fontSize: 12, letterSpacing: '0.18em', fontWeight: 700, textDecoration: 'none' }}>
            RUN YOUR DIAGNOSTIC →
          </Link>
        </div>
      </section>
    </main>
  )
}

function StatCell({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 700, marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--paper)' }}>{value}</div>
      {suffix && <div className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', opacity: 0.55, marginTop: 6 }}>{suffix}</div>}
    </div>
  )
}
