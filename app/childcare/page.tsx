import type { Metadata } from 'next'
import ChatEngine from '@/components/ChatEngine'

export const metadata: Metadata = {
  title: 'AI Automation for Childcare Centers & Daycares — eevolvv',
  description: 'Childcare centers and daycares recover 15–20 hrs/week by automating enrollment, billing, and parent communication. Free AI audit in 10 minutes.',
  keywords: 'childcare automation, daycare management software, childcare center AI, preschool enrollment automation, childcare billing automation, daycare parent communication',
  openGraph: {
    title: 'Stop Running Your Childcare Center on Ghost Work — eevolvv',
    description: 'Childcare centers and daycares recover 15–20 hrs/week by automating enrollment, billing, and parent communication. Free AI audit in 10 minutes.',
    url: 'https://eevolvv.com/childcare',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/childcare',
  },
}

const GHOST_WORK_ITEMS = [
  {
    code: 'G-01',
    label: 'Enrollment Applications',
    pain: 'Paper forms, emailed attachments, manual data entry for every new family',
    win: 'Automated digital enrollment portal with document collection, e-signature, and status tracking',
    hrs: '4–6 hrs/wk',
  },
  {
    code: 'G-02',
    label: 'Tuition Billing',
    pain: 'Manually generating invoices and chasing late payments one family at a time',
    win: 'Automated billing runs with 7/14/30-day reminder sequences — late payments drop 25–35%',
    hrs: '3–5 hrs/wk',
  },
  {
    code: 'G-03',
    label: 'Parent Communication',
    pain: 'Manually sending updates, incident reports, and activity summaries to each family',
    win: 'Automated daily photo/update digest and incident notification system — inbound calls drop 40–50%',
    hrs: '4–6 hrs/wk',
  },
  {
    code: 'G-04',
    label: 'Waitlist Management',
    pain: 'Manually tracking who\'s on the waitlist and forgetting to reach out when a spot opens',
    win: 'Automated waitlist notification system alerts families instantly and captures re-enrollment intent',
    hrs: '2–3 hrs/wk',
  },
  {
    code: 'G-05',
    label: 'Re-Enrollment Campaigns',
    pain: 'Sending re-enrollment paperwork manually each season — families lapse silently',
    win: 'Automated re-enrollment sequence 90/60/30 days before term end — retention improves 15–25%',
    hrs: '2–4 hrs/wk',
  },
  {
    code: 'G-06',
    label: 'Staff Scheduling',
    pain: 'Building the weekly schedule manually while balancing ratios, requests, and sick coverage',
    win: 'Automated scheduling with ratio compliance alerts and coverage request workflows',
    hrs: '2–4 hrs/wk',
  },
]

const STUDIO_TYPES = [
  { id: 'CC-01', name: 'Daycare Centers', note: 'Full-day enrollment, billing, attendance tracking, parent updates' },
  { id: 'CC-02', name: 'Preschools', note: 'Enrollment funnels, curriculum communication, tuition automation' },
  { id: 'CC-03', name: 'After-School Programs', note: 'Pickup coordination, activity scheduling, billing' },
  { id: 'CC-04', name: 'Summer Camps', note: 'Seasonal enrollment, activity waivers, payment plans' },
  { id: 'CC-05', name: 'Montessori Schools', note: 'Enrollment philosophy communication, observation sharing, billing' },
  { id: 'CC-06', name: 'Home Daycares', note: 'Solo operator CRM, billing, parent communication automation' },
  { id: 'CC-07', name: 'Learning Centers', note: 'Tutoring scheduling, progress reporting, package renewals' },
  { id: 'CC-08', name: 'Enrichment Programs', note: 'Class management, re-enrollment, parent communication' },
]

const STATS = [
  { value: '30–40%', label: 'faster enrollment processing with automated application workflows' },
  { value: '25–35%', label: 'fewer late tuition payments with automated billing reminders' },
  { value: '40–50%', label: 'fewer parent status calls with automated daily updates' },
  { value: '20%', label: 'faster staff scheduling with constraint-aware automation' },
]

export default function ChildcarePage() {
  return (
    <main style={{ background: 'var(--paper)' }}>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--ink)', padding: '80px 32px 72px' }}>
        <div className="site-rail mx-auto">
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 20, fontWeight: 600 }}>
            § 01 · CHILDCARE &amp; EARLY EDUCATION
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
            Your childcare center is running on<br />
            <span style={{ color: 'var(--accent)' }}>ghost work.</span>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.65, maxWidth: 560, marginBottom: 36 }}>
            Enrollment paperwork, tuition chasing, parent communication, waitlist management — childcare centers lose 15–20 hours every week to admin that should be automated. We find it, name it, and build the fix.
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
              GET FREE CENTER AUDIT →
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
                Ghost work hiding in every childcare center.
              </h2>
            </div>
            <div style={{ paddingBottom: 4 }}>
              <p style={{ fontSize: 15, lineHeight: 1.65, opacity: 0.6, margin: 0 }}>
                These aren&apos;t inefficiencies you can hustle through.
                They&apos;re structural drains that compound every month — losing you families,
                revenue, and the hours you should be spending with the children in your care.
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
            Total: 17–28 hours per week recovered across a typical childcare center.
          </div>
        </div>
      </section>

      {/* ── Childcare models ──────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 32px', background: 'var(--ink)', color: 'var(--paper)', borderBottom: '1px solid rgba(244,241,234,0.1)' }}>
        <div className="site-rail mx-auto">
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}>
            § 03 · WHO WE BUILD FOR
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 40, maxWidth: 600 }}>
            Every childcare model. One AI engine.
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
            {['Brightwheel', 'Procare', 'HiMama', 'Kangarootime', 'Stripe', 'Google Calendar', 'DocuSign', 'MailChimp', 'Remind'].map(tool => (
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
          {/* TODO: replace with real childcare client testimonials */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--ink)' }} className="fitness-testimonial-grid">
            {[
              {
                stat: '18 hrs/wk recovered',
                quote: 'Enrollment paperwork used to take two weeks of back-and-forth. The automated portal gets us a complete file in 3 days. It\'s completely changed how we open spots.',
                name: 'Marcus T.',
                biz: 'Daycare Center — Austin, TX',
              },
              {
                stat: '+30% on-time payments',
                quote: 'We had families 3–4 weeks late every month. The automated reminders are gentle but consistent. On-time payments went up 30% and awkward calls with parents dropped to zero.',
                name: 'Priya S.',
                biz: 'Preschool — Chicago, IL',
              },
              {
                stat: '50% fewer parent calls',
                quote: 'Parents used to call for updates constantly. The automated daily digest with photos completely changed the dynamic. We get thank-you messages instead of check-in calls now.',
                name: 'Jordan R.',
                biz: 'Montessori School — Miami, FL',
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
              Our AI maps your center&apos;s operation, identifies every automation opportunity, and
              delivers a custom Evolution Report with a 90-day build roadmap — specific to your
              program type, tools, and enrollment volume.
            </p>
          </div>

          <div style={{
            border: '1px solid rgba(244,241,234,0.15)',
            overflow: 'hidden',
          }}>
            <ChatEngine defaultTier="core" defaultIndustry="Childcare / Daycare" />
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
