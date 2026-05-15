import { VolvvECard } from '@/components/VolvvE'
import type { GrowthPage } from '@/lib/growth-pages'

export function GrowthLandingPage({ page }: { page: GrowthPage }) {
  return (
    <main style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <section style={{ padding: '88px 32px 72px', borderBottom: '1px solid var(--ink)' }}>
        <div className="site-rail mx-auto">
          <div className="growth-landing-hero">
            <div>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 700, marginBottom: 20 }}>
                § 01 · {page.marker}
              </div>
              <h1 style={{ fontSize: 'clamp(38px, 6vw, 76px)', lineHeight: 0.98, letterSpacing: '-0.035em', fontWeight: 700, margin: 0, maxWidth: 880 }}>
                {page.title}<br />
                <span style={{ color: 'var(--accent)' }}>{page.accent}</span>
              </h1>
              <p style={{ fontSize: 18, lineHeight: 1.65, opacity: 0.68, maxWidth: 650, margin: '28px 0 34px' }}>
                {page.description}
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <a href="/pricing" className="mono btn-gradient" style={{ padding: '16px 28px', fontSize: 12, letterSpacing: '0.18em', fontWeight: 700, textDecoration: 'none' }}>
                  START AN AGENT PAGE →
                </a>
                <a href="/#diagnostic" className="mono" style={{ padding: '15px 24px', fontSize: 11, letterSpacing: '0.16em', fontWeight: 700, textDecoration: 'none', color: 'var(--ink)', border: '1px solid var(--ink)' }}>
                  FREE ASSESSMENT
                </a>
              </div>
            </div>
            <div>
              <VolvvECard />
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--ink)', color: 'var(--paper)', borderBottom: '3px solid var(--accent)' }}>
        <div className="site-rail mx-auto growth-landing-stat">
          <div style={{ fontSize: 'clamp(44px, 7vw, 92px)', fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--accent)', lineHeight: 1 }}>
            {page.stat}
          </div>
          <div className="mono" style={{ fontSize: 12, letterSpacing: '0.16em', opacity: 0.68, lineHeight: 1.7, textTransform: 'uppercase' }}>
            {page.statLabel}
          </div>
        </div>
      </section>

      <section style={{ padding: '76px 32px', borderBottom: '1px solid var(--rule)' }}>
        <div className="site-rail mx-auto">
          <div className="growth-landing-three">
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 700, marginBottom: 14 }}>
                § 02 · GHOST WORK
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.05, letterSpacing: '-0.028em', fontWeight: 700, margin: 0 }}>
                What is leaking time and revenue.
              </h2>
            </div>
            {page.problems.map((problem, index) => (
              <div key={problem} className="growth-landing-cell">
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 12 }}>
                  G-0{index + 1}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.58, opacity: 0.7, margin: 0 }}>{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '76px 32px', borderBottom: '1px solid var(--ink)', background: 'rgba(20,20,19,0.02)' }}>
        <div className="site-rail mx-auto growth-landing-split">
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 700, marginBottom: 14 }}>
              § 03 · FIRST WORKFLOWS
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.05, letterSpacing: '-0.028em', fontWeight: 700, margin: 0 }}>
              What eevolvv builds first.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.65, opacity: 0.64, marginTop: 20, maxWidth: 520 }}>
              The diagnostic chooses the exact order. These are the common first moves for this workflow.
            </p>
          </div>
          <div style={{ border: '1px solid var(--ink)' }}>
            {page.workflows.map((workflow, index) => (
              <div key={workflow} style={{ display: 'grid', gridTemplateColumns: '72px 1fr', borderBottom: index < page.workflows.length - 1 ? '1px solid var(--rule)' : 'none' }}>
                <div className="mono" style={{ padding: '18px 16px', borderRight: '1px solid var(--rule)', color: 'var(--accent)', fontSize: 10, letterSpacing: '0.18em' }}>
                  W-0{index + 1}
                </div>
                <div style={{ padding: '18px 20px', fontSize: 15, lineHeight: 1.5 }}>{workflow}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '76px 32px', borderBottom: '1px solid var(--rule)' }}>
        <div className="site-rail mx-auto growth-landing-split">
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 700, marginBottom: 14 }}>
              § 04 · WHAT YOU GET
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.05, letterSpacing: '-0.028em', fontWeight: 700, margin: 0 }}>
              Tangible work, not vague consulting.
            </h2>
          </div>
          <div className="growth-landing-proof">
            {page.proof.map((item) => (
              <div key={item} style={{ padding: 22, border: '1px solid var(--ink)', background: 'rgba(20,20,19,0.018)' }}>
                <span style={{ color: 'var(--accent)' }}>→ </span>{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '70px 32px 84px' }}>
        <div className="site-rail mx-auto">
          <div className="growth-landing-cta">
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 700, marginBottom: 12 }}>
                § 05 · START HERE
              </div>
              <h2 style={{ fontSize: 'clamp(30px, 4vw, 54px)', lineHeight: 1.03, letterSpacing: '-0.03em', fontWeight: 700, margin: 0 }}>
                Choose the agent tier. Start the build map.
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.65, opacity: 0.66, marginTop: 18, maxWidth: 640 }}>
                {page.tierFit}
              </p>
            </div>
            <a href="/pricing" className="mono btn-gradient" style={{ padding: '18px 28px', fontSize: 12, letterSpacing: '0.18em', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              START AN AGENT PAGE →
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
