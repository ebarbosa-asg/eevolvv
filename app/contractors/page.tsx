import type { Metadata } from 'next'
import ChatEngine from '@/components/ChatEngine'
import { VolvvECard } from '@/components/VolvvE'

export const metadata: Metadata = {
  title: 'AI Automation for Contractors & Trades — eevolvv',
  description: 'HVAC, plumbing, roofing, and general contractors recover 20–30 hrs/week by automating quoting, dispatch, and invoicing. Free AI audit in 10 minutes.',
  keywords: 'contractor automation, HVAC automation software, plumbing business automation, construction management AI, contractor scheduling software, trade business automation',
  openGraph: {
    title: 'Stop Running Your Contracting Business on Ghost Work — eevolvv',
    description: 'HVAC, plumbing, roofing, and general contractors recover 20–30 hrs/week by automating quoting, dispatch, and invoicing. Free AI audit in 10 minutes.',
    url: 'https://eevolvv.com/contractors',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/contractors',
  },
}

const GHOST_WORK_ITEMS = [
  {
    code: 'G-01',
    label: 'Quote Generation',
    pain: 'Building estimates from scratch for every job — same line items, same math, over and over',
    win: 'Automated estimate templates with job-type triggers generate quotes in minutes, not hours',
    hrs: '4–6 hrs/wk',
  },
  {
    code: 'G-02',
    label: 'Job Scheduling',
    pain: 'Manually juggling crew availability, job duration, and geographic routing every morning',
    win: 'Automated scheduling and dispatch with constraint-aware optimization and crew notifications',
    hrs: '3–5 hrs/wk',
  },
  {
    code: 'G-03',
    label: 'Client Status Calls',
    pain: 'Customers calling to ask "where\'s my crew?" because no update went out',
    win: 'Automated client update triggers at job start, mid-project, and completion — calls drop 60%',
    hrs: '2–4 hrs/wk',
  },
  {
    code: 'G-04',
    label: 'Invoice & Collections',
    pain: 'Generating invoices manually and then chasing payment via phone weeks later',
    win: 'Automated invoice generation at job completion + 7/14/30-day payment reminder sequences',
    hrs: '3–5 hrs/wk',
  },
  {
    code: 'G-05',
    label: 'Subcontractor Coordination',
    pain: 'Manually texting subs, confirming schedules, chasing completion photos',
    win: 'Automated sub communication hub: schedule confirmations, photo requests, and payment releases',
    hrs: '2–4 hrs/wk',
  },
  {
    code: 'G-06',
    label: 'Material Reordering',
    pain: 'Realizing mid-job that a material is out of stock — emergency orders at premium prices',
    win: 'Automated low-stock alerts and threshold-based PO generation from your supplier list',
    hrs: '2–3 hrs/wk',
  },
]

const STUDIO_TYPES = [
  { id: 'C-01', name: 'HVAC', note: 'Maintenance scheduling, seasonal campaigns, dispatch automation' },
  { id: 'C-02', name: 'Plumbing', note: 'Emergency dispatch, estimate automation, service agreements' },
  { id: 'C-03', name: 'Electrical', note: 'Permit tracking, inspection scheduling, project milestones' },
  { id: 'C-04', name: 'Roofing', note: 'Storm damage funnels, insurance claim coordination, material ordering' },
  { id: 'C-05', name: 'General Contractors', note: 'Subcontractor hub, draw schedule tracking, client portal' },
  { id: 'C-06', name: 'Painting', note: 'Quote automation, scheduling, color approval workflows' },
  { id: 'C-07', name: 'Landscaping', note: 'Recurring service scheduling, seasonal upsell, crew dispatch' },
  { id: 'C-08', name: 'Home Renovation', note: 'Design approval workflows, change order management, milestone billing' },
]

const STATS = [
  { value: '50–70%', label: 'faster quoting with automated estimate generation' },
  { value: '40%', label: 'fewer scheduling conflicts with automated dispatch' },
  { value: '25–40%', label: 'improvement in collections with automated invoice follow-up' },
  { value: '60%', label: 'fewer inbound status calls with automated client updates' },
]

export default function ContractorsPage() {
  return (
    <main style={{ background: 'var(--paper)' }}>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--ink)', padding: '80px 32px 72px' }}>
        <div className="site-rail mx-auto">
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 20, fontWeight: 600 }}>
            § 01 · CONTRACTORS &amp; TRADES
          </div>
          <h1 style={{
            fontSize: 'clamp(34px, 6vw, 64px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.0,
            color: 'var(--ink)',
            marginBottom: 24,
            maxWidth: 820,
          }}>
            Your contracting business is running on<br />
            <span style={{ color: 'var(--accent)' }}>ghost work.</span>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.65, maxWidth: 560, marginBottom: 36 }}>
            Quote delays, job scheduling chaos, manual invoicing, unpaid follow-up — contractors lose 20–30 hours every week to admin that should be automated. We find it, name it, and build the fix.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="#diagnostic"
              className="mono btn-gradient"
              style={{
                padding: '16px 28px',
                fontSize: 12,
                letterSpacing: '0.18em',
                fontWeight: 700,
                textDecoration: 'none',
                border: 'none',
                display: 'inline-block',
              }}
            >
              GET FREE CONTRACTOR AUDIT →
            </a>
            <span className="mono" style={{ fontSize: 11, opacity: 0.45, letterSpacing: '0.1em' }}>
              10 minutes · no signup · instant report
            </span>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--ink)', color: 'var(--paper)', borderBottom: '3px solid var(--accent)' }}>
        <div className="site-rail mx-auto">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0,
          }}
            className="fitness-stats-bar"
          >
            {STATS.map((s, i) => (
              <div key={i} style={{
                padding: '28px 24px',
                borderRight: i < STATS.length - 1 ? '1px solid rgba(244,241,234,0.1)' : 'none',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--accent)', marginBottom: 6 }}>
                  {s.value}
                </div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', opacity: 0.5, lineHeight: 1.5 }}>
                  {s.label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ghost Work Grid ───────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 32px', borderBottom: '1px solid var(--ink)' }}>
        <div className="site-rail mx-auto">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 64px', marginBottom: 16, alignItems: 'end' }}>
            <div>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}>
                § 02 · WHERE THE HOURS GO
              </div>
              <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, margin: 0 }}>
                Ghost work hiding in every contracting business.
              </h2>
            </div>
            <div style={{ paddingBottom: 4 }}>
              <p style={{ fontSize: 15, lineHeight: 1.65, opacity: 0.6, margin: 0 }}>
                These aren&apos;t inefficiencies you can hustle through.
                They&apos;re structural drains that compound every month — losing you jobs,
                revenue, and the hours you should be spending on your craft.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 48, border: '1px solid var(--ink)' }}>
            {GHOST_WORK_ITEMS.map((item, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 1fr auto',
                gap: 0,
                borderBottom: i < GHOST_WORK_ITEMS.length - 1 ? '1px solid var(--rule)' : 'none',
                alignItems: 'stretch',
              }}
                className="fitness-ghost-row"
              >
                <div className="mono" style={{
                  fontSize: 10, letterSpacing: '0.16em', color: 'var(--accent)',
                  padding: '20px 16px', borderRight: '1px solid var(--rule)',
                  display: 'flex', alignItems: 'center',
                }}>
                  {item.code}
                </div>
                <div style={{ padding: '20px 24px', borderRight: '1px solid var(--rule)' }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 13, opacity: 0.55, lineHeight: 1.55 }}>{item.pain}</div>
                </div>
                <div style={{ padding: '20px 24px', borderRight: '1px solid var(--rule)', background: 'rgba(20,20,19,0.02)' }}>
                  <div className="mono" style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--accent)', marginBottom: 6 }}>→ AFTER EEVOLVV</div>
                  <div style={{ fontSize: 13, lineHeight: 1.55, opacity: 0.78 }}>{item.win}</div>
                </div>
                <div className="mono" style={{
                  fontSize: 10, letterSpacing: '0.1em', opacity: 0.4,
                  padding: '20px 20px', display: 'flex', alignItems: 'center',
                  whiteSpace: 'nowrap',
                }}>
                  {item.hrs}
                </div>
              </div>
            ))}
          </div>

          <div className="mono" style={{ marginTop: 16, fontSize: 11, opacity: 0.4, letterSpacing: '0.08em' }}>
            Total: 16–27 hours per week recovered across a typical contracting business.
          </div>
        </div>
      </section>

      {/* ── Trade types ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 32px', background: 'var(--ink)', color: 'var(--paper)', borderBottom: '1px solid rgba(244,241,234,0.1)' }}>
        <div className="site-rail mx-auto">
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}>
            § 03 · WHO WE BUILD FOR
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 40, maxWidth: 600 }}>
            Every trade. One AI engine.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid rgba(244,241,234,0.1)' }} className="fitness-studio-grid">
            {STUDIO_TYPES.map((s, i) => (
              <div key={i} style={{
                padding: '24px 20px',
                borderRight: i % 4 < 3 ? '1px solid rgba(244,241,234,0.1)' : 'none',
                borderBottom: i < 4 ? '1px solid rgba(244,241,234,0.1)' : 'none',
              }}>
                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 8 }}>{s.id}</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontSize: 12, opacity: 0.45, lineHeight: 1.55 }}>{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 32px', borderBottom: '1px solid var(--ink)' }}>
        <div className="site-rail mx-auto">
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}>
            § 04 · THE PROCESS
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 48, maxWidth: 520 }}>
            Free audit. Custom report. Automations built for you.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--ink)' }} className="fitness-how-grid">
            {[
              {
                n: '01',
                title: 'AI Diagnostic',
                body: '10-minute AI conversation maps your operation — workflows, tools, pain points, team size, revenue. No forms. Just a conversation.',
                note: 'Free · No signup',
              },
              {
                n: '02',
                title: 'Evolution Report',
                body: 'Your custom report quantifies exactly how many hours you\'re losing, which automations will recover them first, and a 90-day build roadmap.',
                note: 'Delivered instantly',
              },
              {
                n: '03',
                title: 'We Build It',
                body: 'Choose your tier. We build every automation from the report — custom agents, integrations, and workflows — within days, not months.',
                note: 'Seed from $99/mo',
              },
            ].map((step, i) => (
              <div key={i} style={{
                padding: '36px 32px',
                borderRight: i < 2 ? '1px solid var(--ink)' : 'none',
              }}>
                <div className="mono" style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 16, opacity: 0.25 }}>
                  {step.n}
                </div>
                <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.01em', marginBottom: 12 }}>{step.title}</div>
                <p style={{ fontSize: 14, lineHeight: 1.65, opacity: 0.6, margin: '0 0 16px' }}>{step.body}</p>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--accent)' }}>→ {step.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools we integrate ────────────────────────────────────────────────── */}
      <section style={{ padding: '48px 32px', borderBottom: '1px solid var(--ink)', background: 'rgba(20,20,19,0.03)' }}>
        <div className="site-rail mx-auto" style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', opacity: 0.4, flexShrink: 0 }}>
            INTEGRATES WITH
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            {['Jobber', 'ServiceTitan', 'Buildertrend', 'Procore', 'Housecall Pro', 'CompanyCam', 'QuickBooks', 'Stripe', 'Google Calendar'].map(tool => (
              <span key={tool} className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', opacity: 0.45 }}>{tool}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 32px', borderBottom: '1px solid var(--ink)' }}>
        <div className="site-rail mx-auto">
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 40, fontWeight: 600 }}>
            § 05 · RESULTS
          </div>
          {/* TODO: replace with real contractor client testimonials */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--ink)' }} className="fitness-testimonial-grid">
            {[
              {
                stat: '24 hrs/wk recovered',
                quote: 'Quoting used to take us an hour each. Now it takes five minutes. We\'re doing twice the volume with the same team and I\'m not buried in paperwork at 10pm.',
                name: 'Marcus T.',
                biz: 'HVAC Company — Austin, TX',
              },
              {
                stat: '+35% collection rate',
                quote: 'The invoice automation alone recovered more in 90 days than the entire year\'s subscription. We had $40K sitting in unpaid invoices before eevolvv.',
                name: 'Priya S.',
                biz: 'General Contractor — Denver, CO',
              },
              {
                stat: '60% fewer status calls',
                quote: 'Customers used to call three times per job asking for updates. Now the automation handles it and my phone doesn\'t ring until the job is done.',
                name: 'Jordan R.',
                biz: 'Roofing Company — Miami, FL',
              },
            ].map(({ quote, name, biz, stat }, i) => (
              <div key={i} style={{
                padding: '36px 28px',
                borderRight: i < 2 ? '1px solid var(--ink)' : 'none',
                display: 'flex', flexDirection: 'column', gap: 20,
              }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.12em', fontWeight: 700 }}>
                  {stat}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.65, opacity: 0.78, margin: 0, fontStyle: 'italic' }}>
                  &ldquo;{quote}&rdquo;
                </p>
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{name}</div>
                  <div className="mono" style={{ fontSize: 10, opacity: 0.45, letterSpacing: '0.1em', marginTop: 2 }}>{biz}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Diagnostic CTA ────────────────────────────────────────────────────── */}
      <section id="diagnostic" style={{ padding: '80px 32px', background: 'var(--ink)', color: 'var(--paper)' }}>
        <div className="site-rail mx-auto">
          <div style={{ maxWidth: 640, marginBottom: 48 }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}>
              § 06 · FREE AUDIT
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 16 }}>
              Find your ghost work. Free, in 10 minutes.
            </h2>
            <p style={{ fontSize: 16, opacity: 0.55, lineHeight: 1.6, margin: 0 }}>
              Our AI maps your contracting business, identifies every automation opportunity, and
              delivers a custom Evolution Report with a 90-day build roadmap — specific to your
              trade, tools, and job volume.
            </p>
          </div>

          <div style={{
            border: '1px solid rgba(244,241,234,0.15)',
            overflow: 'hidden',
          }}>
            <ChatEngine defaultTier="core" defaultIndustry="Construction / Trades" />
          </div>

          <div className="mono" style={{ marginTop: 16, fontSize: 10, opacity: 0.3, letterSpacing: '0.1em' }}>
            FREE AUDIT · NO CREDIT CARD · REPORT DELIVERED INSTANTLY
          </div>
        </div>
      </section>

      {/* ── Bottom trust bar ──────────────────────────────────────────────────── */}
      <section style={{ padding: '40px 32px', borderTop: '1px solid var(--ink)' }}>
        <div className="site-rail mx-auto" style={{ display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Not ready to start yet?</div>
            <p style={{ fontSize: 14, opacity: 0.55, margin: 0 }}>See full pricing and what&apos;s included in each tier.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="/pricing" className="mono" style={{ padding: '12px 20px', border: '1px solid var(--ink)', fontSize: 11, letterSpacing: '0.16em', fontWeight: 600, textDecoration: 'none', color: 'var(--ink)' }}>
              VIEW PRICING →
            </a>
            <a href="https://calendly.com/hello-eevolvv" target="_blank" rel="noopener noreferrer" className="mono" style={{ padding: '12px 20px', background: 'var(--ink)', color: 'var(--paper)', fontSize: 11, letterSpacing: '0.16em', fontWeight: 600, textDecoration: 'none' }}>
              BOOK A CALL →
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}
