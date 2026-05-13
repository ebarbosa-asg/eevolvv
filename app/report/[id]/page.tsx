import { supabase } from '@/lib/supabase'
import { formatReport } from '@/lib/format-report'
import { TierCards } from '@/components/TierCards'
import { FitnessKPIPanels } from '@/components/report/FitnessKPIPanels'
import { DentalKPIPanels } from '@/components/report/DentalKPIPanels'
import { fitnessConfig, dentalConfig } from '@/lib/industries'
import type { Metadata } from 'next'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params

  let businessName = 'Your Business'
  if (supabase) {
    const { data: submission } = await supabase
      .from('submissions')
      .select('business_name')
      .eq('id', id)
      .eq('status', 'completed')
      .maybeSingle()
    if (submission?.business_name) businessName = submission.business_name
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'

  return {
    title: `${businessName} — Evolution Report | eevolvv`,
    description: `AI-generated business automation roadmap for ${businessName}. See the full diagnostic results and ranked automation opportunities.`,
    robots: 'noindex',
    openGraph: {
      title: `${businessName} — Evolution Report`,
      description: 'AI-generated business automation roadmap from eevolvv. Free AI Business Diagnostic.',
      url: `${baseUrl}/report/${id}`,
      siteName: 'eevolvv',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${businessName} — Evolution Report`,
      description: 'AI-generated business automation roadmap from eevolvv.',
    },
  }
}

export default async function ReportPermalinkPage({ params }: PageProps) {
  const { id } = params

  if (!supabase) {
    return <ErrorState message="Service temporarily unavailable." />
  }

  const { data: submission, error } = await supabase
    .from('submissions')
    .select('id, business_name, report, tier, email, created_at, industry')
    .eq('id', id)
    .eq('status', 'completed')
    .maybeSingle()

  if (error || !submission || !submission.report) {
    return <ErrorState message="Report not found. This link may have expired or the report ID is invalid." />
  }

  const reportHtml = formatReport(submission.report)
  const reportDate = new Date(submission.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
  const reportId = `R-${String(submission.id).slice(-5).toUpperCase()}`
  const businessName = submission.business_name || 'Your Business'

  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)' }}>

      {/* Document header */}
      <div style={{
        background: 'var(--ink)', color: 'var(--paper)',
        padding: '28px 32px',
        borderBottom: '3px solid var(--accent)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '24px 24px', pointerEvents: 'none',
        }} />
        <div className="site-rail mx-auto" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: '0.32em', color: 'var(--accent)', fontWeight: 700 }}>
              EEVOLVV DIAGNOSTIC REPORT
            </div>
            <div className="mono" style={{ fontSize: 9, letterSpacing: '0.18em', opacity: 0.35 }}>
              {reportId} · {reportDate}
            </div>
          </div>
          <div style={{ fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 12 }}>
            {businessName}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, opacity: 0.45 }}>AI-generated automation roadmap</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
              <span className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', color: '#4ade80' }}>ARCHIVED</span>
            </span>
          </div>
        </div>
      </div>

      {/* Report body */}
      <div className="site-rail mx-auto">
        {submission.industry === fitnessConfig.key && (
          <FitnessKPIPanels submission={submission} />
        )}
        {submission.industry === dentalConfig.key && (
          <DentalKPIPanels submission={submission} />
        )}
        <div
          className="report-content"
          style={{ padding: '40px 32px' }}
          dangerouslySetInnerHTML={{ __html: reportHtml }}
        />

        {/* Next-step banner */}
        <div style={{
          padding: '32px',
          borderTop: '3px solid var(--accent)',
          background: 'var(--ink)',
          color: 'var(--paper)',
        }}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: '0.28em', color: 'var(--accent)', marginBottom: 10, fontWeight: 700 }}>
            → NEXT STEP
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 8, lineHeight: 1.2 }}>
            Your roadmap is ready. Time to build it.
          </div>
          <p style={{ fontSize: 14, opacity: 0.55, margin: 0, lineHeight: 1.6 }}>
            Every automation above can be live within days. Choose your tier and we start immediately.
          </p>
        </div>

        {/* Payment wall */}
        <div style={{ padding: '32px', background: 'var(--paper)' }}>
          <TierCards email={submission.email} recommendedTier={submission.tier} />
        </div>
      </div>

    </main>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16 }}>● NOT FOUND</div>
        <p style={{ fontSize: 15, opacity: 0.7, marginBottom: 28, lineHeight: 1.6 }}>{message}</p>
        <a href="/" className="mono" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '14px 24px', textDecoration: 'none', fontSize: 11, letterSpacing: '0.18em', fontWeight: 600 }}>
          RUN NEW DIAGNOSTIC →
        </a>
      </div>
    </main>
  )
}
