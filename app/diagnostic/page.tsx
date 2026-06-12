import type { Metadata } from 'next'
import '../homepage-v3.css'
import DiagnosticClient from './DiagnosticClient'

export const metadata: Metadata = {
  title: 'Free Diagnostic Report — eevolvv',
  description: 'Get a free eevolvv diagnostic report that identifies ghost work, first automations, and whether a $97 roadmap upgrade makes sense.',
  openGraph: {
    title: 'Free Diagnostic Report — eevolvv',
    description: 'Find the ghost work first. Upgrade to the roadmap only if the signal is real.',
    url: 'https://eevolvv.com/diagnostic',
  },
}

export default function DiagnosticPage() {
  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* ── What happens next strip ───────────────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--rule)', paddingTop: '56px', paddingBottom: '48px' }}>
        <div className="site-rail">

          {/* Section marker */}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            fontWeight: 600,
            margin: '0 0 32px 0',
          }}>
            § 01 · WHAT HAPPENS NEXT
          </p>

          {/* Steps row */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: '0',
          }}
            className="diag-steps-row"
          >
            {/* Step 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto', maxWidth: '160px', textAlign: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'var(--ink)',
                color: 'var(--paper)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '13px',
                flexShrink: 0,
                marginBottom: '12px',
              }}>1</div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 6px 0', fontWeight: 600 }}>
                YOU ANSWER
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--ink)', opacity: 0.7, margin: 0, lineHeight: 1.5 }}>
                8 questions about your business — no jargon, no fluff
              </p>
            </div>

            {/* Connector */}
            <div style={{ flex: 1, height: '1px', background: 'var(--rule)', alignSelf: 'flex-start', marginTop: '16px', minWidth: '16px' }} className="diag-step-connector" />

            {/* Step 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto', maxWidth: '160px', textAlign: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'var(--ink)',
                color: 'var(--paper)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '13px',
                flexShrink: 0,
                marginBottom: '12px',
              }}>2</div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 6px 0', fontWeight: 600 }}>
                VOLVV-E ANALYZES
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--ink)', opacity: 0.7, margin: 0, lineHeight: 1.5 }}>
                AI maps your ops across 12 business health nodes
              </p>
            </div>

            {/* Connector */}
            <div style={{ flex: 1, height: '1px', background: 'var(--rule)', alignSelf: 'flex-start', marginTop: '16px', minWidth: '16px' }} className="diag-step-connector" />

            {/* Step 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto', maxWidth: '160px', textAlign: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'var(--ink)',
                color: 'var(--paper)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '13px',
                flexShrink: 0,
                marginBottom: '12px',
              }}>3</div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 6px 0', fontWeight: 600 }}>
                REPORT IN INBOX
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--ink)', opacity: 0.7, margin: 0, lineHeight: 1.5 }}>
                Your Evolution Report arrives in ~10 min — free
              </p>
            </div>

            {/* Connector */}
            <div style={{ flex: 1, height: '1px', background: 'var(--rule)', alignSelf: 'flex-start', marginTop: '16px', minWidth: '16px' }} className="diag-step-connector" />

            {/* Step 4 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto', maxWidth: '160px', textAlign: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'var(--ink)',
                color: 'var(--paper)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '13px',
                flexShrink: 0,
                marginBottom: '12px',
              }}>4</div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 6px 0', fontWeight: 600 }}>
                OPTIONAL UPGRADE
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--ink)', opacity: 0.7, margin: 0, lineHeight: 1.5 }}>
                Upgrade to the $97 full roadmap — only if the signal is real
              </p>
            </div>
          </div>

          {/* Privacy note */}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            opacity: 0.55,
            margin: '28px 0 0 0',
            lineHeight: 1.6,
          }}>
            → Your answers are never sold or shared. Delete your record anytime: hello@eevolvv.com
          </p>

        </div>
      </div>

      {/* ── Sample report preview strip ───────────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--rule)', paddingTop: '48px', paddingBottom: '48px' }}>
        <div className="site-rail">

          {/* Section marker */}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            fontWeight: 600,
            margin: '0 0 24px 0',
          }}>
            § SAMPLE REPORT PREVIEW · WHAT YOU&apos;LL RECEIVE
          </p>

          {/* 2×2 grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}
            className="diag-report-grid"
          >
            {/* Card 1 — READABLE */}
            <div style={{
              background: 'rgba(20,20,19,.055)',
              border: '1px solid var(--rule)',
              borderLeft: '3px solid var(--accent)',
              padding: '20px',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: 1.9,
            }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 14px 0', fontWeight: 600 }}>
                § GHOST WORK IDENTIFIED
              </p>
              <p style={{ margin: '0 0 2px 0', color: 'var(--ink)' }}>
                <span style={{ color: 'var(--accent)' }}>→</span> INTAKE DELAY
                {' '}<span style={{ opacity: 0.5 }}>↳</span>{' '}
                <span style={{ opacity: 0.7 }}>4.2 hrs/week · HIGH PRIORITY</span>
              </p>
              <p style={{ margin: '0 0 2px 0', color: 'var(--ink)' }}>
                <span style={{ color: 'var(--accent)' }}>→</span> MANUAL FOLLOW-UP
                {' '}<span style={{ opacity: 0.5 }}>↳</span>{' '}
                <span style={{ opacity: 0.7 }}>3.8 hrs/week · HIGH PRIORITY</span>
              </p>
              <p style={{ margin: '0 0 14px 0', color: 'var(--ink)' }}>
                <span style={{ color: 'var(--accent)' }}>→</span> UNBILLED REVIEW TIME
                {' '}<span style={{ opacity: 0.5 }}>↳</span>{' '}
                <span style={{ opacity: 0.7 }}>2.1 hrs/week · MEDIUM</span>
              </p>
              <p style={{ margin: 0, opacity: 0.3, fontSize: '12px' }}>
                {'//'} Total recoverable: ~10 hrs/week
              </p>
            </div>

            {/* Card 2 — BLURRED */}
            <div style={{ position: 'relative' }}>
              <div style={{
                background: 'rgba(20,20,19,.055)',
                border: '1px solid var(--rule)',
                borderLeft: '3px solid var(--accent)',
                padding: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                lineHeight: 1.9,
                filter: 'blur(4px)',
                userSelect: 'none',
                pointerEvents: 'none',
              }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 14px 0', fontWeight: 600 }}>
                  § AUTOMATION OPPORTUNITIES
                </p>
                <p style={{ margin: '0 0 2px 0' }}>→ BOOKING FLOW    ↳ Automate intake + confirmation</p>
                <p style={{ margin: '0 0 2px 0' }}>→ FOLLOW-UP SEQ  ↳ 5-touch drip, zero manual effort</p>
                <p style={{ margin: '0 0 14px 0' }}>→ INVOICE CYCLE  ↳ Auto-generate + send on trigger</p>
                <p style={{ margin: 0, opacity: 0.3, fontSize: '12px' }}>{'//'} Estimated setup: 2–3 weeks</p>
              </div>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  textAlign: 'center',
                  padding: '8px 12px',
                  background: 'rgba(250,247,240,0.9)',
                  border: '1px solid var(--rule)',
                  margin: 0,
                }}>
                  INCLUDED IN YOUR REPORT
                </p>
              </div>
            </div>

            {/* Card 3 — BLURRED */}
            <div style={{ position: 'relative' }}>
              <div style={{
                background: 'rgba(20,20,19,.055)',
                border: '1px solid var(--rule)',
                borderLeft: '3px solid var(--accent)',
                padding: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                lineHeight: 1.9,
                filter: 'blur(4px)',
                userSelect: 'none',
                pointerEvents: 'none',
              }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 14px 0', fontWeight: 600 }}>
                  § RECOMMENDED TOOLS
                </p>
                <p style={{ margin: '0 0 2px 0' }}>→ MAKE.COM         ↳ Workflow automation core</p>
                <p style={{ margin: '0 0 2px 0' }}>→ AIRTABLE         ↳ Ops database + CRM layer</p>
                <p style={{ margin: '0 0 14px 0' }}>→ TYPEFORM         ↳ Intake + client onboarding</p>
                <p style={{ margin: 0, opacity: 0.3, fontSize: '12px' }}>{'//'} All tools have free tiers</p>
              </div>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  textAlign: 'center',
                  padding: '8px 12px',
                  background: 'rgba(250,247,240,0.9)',
                  border: '1px solid var(--rule)',
                  margin: 0,
                }}>
                  INCLUDED IN YOUR REPORT
                </p>
              </div>
            </div>

            {/* Card 4 — BLURRED */}
            <div style={{ position: 'relative' }}>
              <div style={{
                background: 'rgba(20,20,19,.055)',
                border: '1px solid var(--rule)',
                borderLeft: '3px solid var(--accent)',
                padding: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                lineHeight: 1.9,
                filter: 'blur(4px)',
                userSelect: 'none',
                pointerEvents: 'none',
              }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 14px 0', fontWeight: 600 }}>
                  § IMPLEMENTATION ROADMAP
                </p>
                <p style={{ margin: '0 0 2px 0' }}>→ WEEK 1–2  ↳ Intake automation deployed</p>
                <p style={{ margin: '0 0 2px 0' }}>→ WEEK 3–4  ↳ Follow-up sequences live</p>
                <p style={{ margin: '0 0 14px 0' }}>→ WEEK 5–6  ↳ Reporting + review loop set</p>
                <p style={{ margin: 0, opacity: 0.3, fontSize: '12px' }}>{'//'} ROI positive by week 3</p>
              </div>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  textAlign: 'center',
                  padding: '8px 12px',
                  background: 'rgba(250,247,240,0.9)',
                  border: '1px solid var(--rule)',
                  margin: 0,
                }}>
                  INCLUDED IN YOUR REPORT
                </p>
              </div>
            </div>
          </div>

          {/* Below-grid note */}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            opacity: 0.55,
            margin: '20px 0 0 0',
          }}>
            → Full report delivered to your inbox · Free · No credit card required
          </p>

        </div>
      </div>

      {/* ── Responsive styles ─────────────────────────────────────── */}
      <style>{`
        @media (max-width: 700px) {
          .diag-steps-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 24px !important;
          }
          .diag-steps-row > div[style*="flex: 0 0 auto"] {
            align-items: flex-start !important;
            text-align: left !important;
            max-width: 100% !important;
          }
          .diag-step-connector {
            display: none !important;
          }
          .diag-report-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* ── ChatEngine ────────────────────────────────────────────── */}
      <div style={{ paddingTop: '48px' }}>
        <div className="site-rail">
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            fontWeight: 600,
            margin: '0 0 24px 0',
          }}>
            § 02 · START YOUR DIAGNOSTIC
          </p>
        </div>
        <DiagnosticClient />
      </div>

    </div>
  )
}
