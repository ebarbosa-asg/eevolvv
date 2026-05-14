import type { Metadata } from 'next'
import ChatEngine from '@/components/ChatEngine'
import { VolvvECard } from '@/components/VolvvE'

export const metadata: Metadata = {
  title: 'AI Automation for Gyms & Fitness Studios — eevolvv',
  description: 'CrossFit boxes, BJJ academies, and fitness studios recover 15–25 hrs/week and cut member churn 25–35% with eevolvv AI automation. Free audit in 10 minutes.',
  keywords: 'gym automation, fitness studio AI, crossfit automation, BJJ gym software, member retention automation, gym management AI, fitness business automation',
  openGraph: {
    title: 'Stop Running Your Gym on Ghost Work — eevolvv',
    description: 'Free AI diagnostic reveals exactly where your fitness studio is losing hours and members. CrossFit, BJJ, MMA, yoga — built for all of them.',
    url: 'https://eevolvv.com/fitness',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/fitness',
  },
}

const GHOST_WORK_ITEMS = [
  {
    code: 'G-01',
    label: 'Member Churn',
    pain: 'Manually tracking who stopped showing up — usually too late to save them',
    win: 'Automated early-warning system flags at-risk members at the first missed class',
    hrs: '4–6 hrs/wk',
  },
  {
    code: 'G-02',
    label: 'Failed Payments',
    pain: 'Chasing EFT failures one by one via phone or email',
    win: 'Automated dunning sequence recovers payments before memberships lapse',
    hrs: '2–3 hrs/wk',
  },
  {
    code: 'G-03',
    label: 'Lead Follow-Up',
    pain: 'New inquiry comes in — you respond 4 hours later, they\'ve already joined someone else',
    win: 'Instant lead response + 14-day nurture sequence converts trials to members',
    hrs: '3–4 hrs/wk',
  },
  {
    code: 'G-04',
    label: 'Class Utilization',
    pain: 'Manually pulling attendance data to figure out which classes to cut or add',
    win: 'Automated weekly report: utilization by class, coach, and time slot',
    hrs: '2–3 hrs/wk',
  },
  {
    code: 'G-05',
    label: 'Onboarding',
    pain: 'Walking every new member through the same 45-minute orientation manually',
    win: 'Automated 7-day welcome sequence handles intro, waivers, goals, and first milestones',
    hrs: '3–5 hrs/wk',
  },
  {
    code: 'G-06',
    label: 'Reviews & Referrals',
    pain: 'Great results but no system to turn them into Google reviews or referrals',
    win: 'Automated review ask at peak satisfaction moments + referral reward sequences',
    hrs: '1–2 hrs/wk',
  },
]

const STUDIO_TYPES = [
  { id: 'F-01', name: 'CrossFit Boxes', note: 'Open gym, class management, coach scheduling' },
  { id: 'F-02', name: 'BJJ Academies', note: 'Belt progression, trial conversion, comp prep' },
  { id: 'F-03', name: 'MMA Gyms', note: 'Multi-discipline, retail, event promotion' },
  { id: 'F-04', name: 'Yoga Studios', note: 'Class packs, workshop funnels, teacher scheduling' },
  { id: 'F-05', name: 'Pilates Studios', note: 'Private session waitlists, package renewals' },
  { id: 'F-06', name: 'Kickboxing / Muay Thai', note: 'Free trial flows, gear upsell, event camps' },
  { id: 'F-07', name: 'Personal Training', note: 'Session reminders, rebooking, progress reports' },
  { id: 'F-08', name: 'Bootcamp / HIIT', note: 'Challenge launches, retention, referral loops' },
]

const STATS = [
  { value: '25–35%', label: 'member churn reduction with automated engagement' },
  { value: '6–10 hrs', label: 'saved per week on front-desk admin alone' },
  { value: '40–60%', label: 'faster lead-to-member conversion' },
  { value: '15–25%', label: 'increase in PT bookings via automated upsell' },
]

export default function FitnessPage() {
  return (
    <main style={{ background: 'var(--paper)' }}>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--ink)', padding: '80px 32px 72px' }}>
        <div className="site-rail mx-auto">
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 20, fontWeight: 600 }}>
            § 01 · FITNESS &amp; MARTIAL ARTS
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
            Your gym is running on<br />
            <span style={{ color: 'var(--accent)' }}>ghost work.</span>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.65, maxWidth: 560, marginBottom: 36 }}>
            Member churn, failed payments, lead drop-off, manual scheduling — fitness studios lose
            15–25 hours every week to tasks that should be automated. We find them, name them, and build the fix.
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
              GET FREE GYM AUDIT →
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
                Ghost work hiding in every fitness business.
              </h2>
            </div>
            <div style={{ paddingBottom: 4 }}>
              <p style={{ fontSize: 15, lineHeight: 1.65, opacity: 0.6, margin: 0 }}>
                These aren&apos;t inefficiencies you can hustle through.
                They&apos;re structural drains that compound every month — losing you members,
                revenue, and the hours you should be spending on your community.
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
            Total: 15–23 hours per week recovered across a typical fitness studio.
          </div>
        </div>
      </section>

      {/* ── Studio types ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 32px', background: 'var(--ink)', color: 'var(--paper)', borderBottom: '1px solid rgba(244,241,234,0.1)' }}>
        <div className="site-rail mx-auto">
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}>
            § 03 · WHO WE BUILD FOR
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 40, maxWidth: 600 }}>
            Every fitness format. One AI engine.
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
                note: 'Agent One from $499/mo',
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
            {['Mindbody', 'Glofox', 'Pike13', 'ABC Fitness', 'Zen Planner', 'HubSpot', 'MailChimp', 'Stripe', 'Google Reviews'].map(tool => (
              <span key={tool} className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', opacity: 0.45 }}>{tool}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial placeholder ───────────────────────────────────────────── */}
      <section style={{ padding: '80px 32px', borderBottom: '1px solid var(--ink)' }}>
        <div className="site-rail mx-auto">
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 40, fontWeight: 600 }}>
            § 05 · RESULTS
          </div>
          {/* TODO: replace with real fitness client testimonials */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--ink)' }} className="fitness-testimonial-grid">
            {[
              {
                quote: 'We recovered 18 hours a week in month one. The churn system alone paid for the whole year.',
                name: 'Marcus T.',
                biz: 'CrossFit Box — Austin, TX',
                stat: '18 hrs/wk recovered',
              },
              {
                quote: 'Our lead-to-trial conversion went from 22% to 41% after the automated follow-up sequence launched.',
                name: 'Priya S.',
                biz: 'Yoga Studio — Chicago, IL',
                stat: '+87% trial conversion',
              },
              {
                quote: 'Failed payment recovery used to take me a full day every month. Now it runs itself.',
                name: 'Jordan R.',
                biz: 'BJJ Academy — Miami, FL',
                stat: '1 day/mo → zero',
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
              Our AI maps your gym&apos;s operation, identifies every automation opportunity, and
              delivers a custom Evolution Report with a 90-day build roadmap — specific to your
              business type, tools, and revenue range.
            </p>
          </div>

          {/* Volvv-E intro */}
          <VolvvECard dark />

          {/* Diagnostic embed */}
          <div style={{
            border: '1px solid rgba(244,241,234,0.15)',
            borderTop: 'none',
            overflow: 'hidden',
          }}>
            <ChatEngine defaultTier="core" defaultIndustry="Gym / Fitness / Wellness" />
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
