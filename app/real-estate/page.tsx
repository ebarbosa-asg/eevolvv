import type { Metadata } from 'next'
import ChatEngine from '@/components/ChatEngine'
import { VolvvECard } from '@/components/VolvvE'

export const metadata: Metadata = {
  title: 'AI Automation for Real Estate Agents & Brokerages — eevolvv',
  description: 'Real estate agents and brokerages recover 15–25 hrs/week and convert 9x more leads by automating follow-up and transaction coordination. Free AI audit in 10 minutes.',
  keywords: 'real estate automation, real estate AI, agent CRM automation, real estate lead follow-up, transaction coordination automation, brokerage management software',
  openGraph: {
    title: 'Stop Running Your Real Estate Business on Ghost Work — eevolvv',
    description: 'Real estate agents and brokerages recover 15–25 hrs/week and convert 9x more leads by automating follow-up and transaction coordination. Free AI audit in 10 minutes.',
    url: 'https://eevolvv.com/real-estate',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/real-estate',
  },
}

const GHOST_WORK_ITEMS = [
  {
    code: 'G-01',
    label: 'Lead Response Delay',
    pain: 'A new inquiry comes in at 8pm — you respond the next morning. They\'ve already signed with someone else',
    win: 'Automated instant lead response + 14-day nurture sequence converts leads before they go cold',
    hrs: '3–5 hrs/wk',
  },
  {
    code: 'G-02',
    label: 'CRM Hygiene',
    pain: 'Contact records going stale, notes missing, follow-up tasks falling through the cracks',
    win: 'Automated CRM update triggers after every showing, call, and offer — database stays clean',
    hrs: '3–4 hrs/wk',
  },
  {
    code: 'G-03',
    label: 'Showing Coordination',
    pain: 'Going back and forth with buyers, sellers, and agents to schedule showings manually',
    win: 'Automated showing scheduling with instant confirmation and 24-hr reminders for all parties',
    hrs: '2–4 hrs/wk',
  },
  {
    code: 'G-04',
    label: 'Transaction Milestones',
    pain: 'Manually tracking inspection deadlines, contingency dates, and closing tasks across every deal',
    win: 'Automated transaction timeline with milestone alerts to clients, agents, and TCs',
    hrs: '3–5 hrs/wk',
  },
  {
    code: 'G-05',
    label: 'Post-Close Follow-Up',
    pain: 'Closing the deal and then going silent — missing the best window for referrals and reviews',
    win: 'Automated 12-month post-close sequence: anniversary messages, market updates, referral asks',
    hrs: '2–3 hrs/wk',
  },
  {
    code: 'G-06',
    label: 'Market Report Distribution',
    pain: 'Manually compiling and emailing market reports to your sphere every month',
    win: 'Automated monthly market update delivery to your full contact database, personalized by area',
    hrs: '2–4 hrs/wk',
  },
]

const STUDIO_TYPES = [
  { id: 'RE-01', name: 'Residential Agents', note: 'Lead nurture, showing automation, post-close sequences' },
  { id: 'RE-02', name: 'Luxury Agents', note: 'High-touch follow-up, private listing alerts, concierge sequences' },
  { id: 'RE-03', name: 'Commercial Brokers', note: 'Deal pipeline tracking, LOI coordination, market reporting' },
  { id: 'RE-04', name: 'Property Managers', note: 'Lease renewal campaigns, maintenance coordination, tenant comms' },
  { id: 'RE-05', name: 'Buyer\'s Agents', note: 'Search alerts, offer tracking, pre-approval follow-up sequences' },
  { id: 'RE-06', name: 'Listing Specialists', note: 'Seller lead nurture, market valuation sequences, offer management' },
  { id: 'RE-07', name: 'Real Estate Teams', note: 'Lead routing, team reporting, agent accountability dashboards' },
  { id: 'RE-08', name: 'Brokerages', note: 'Recruiting automation, agent onboarding, production reporting' },
]

const STATS = [
  { value: '9×', label: 'more leads converted when response happens within 5 minutes' },
  { value: '5–8 hrs', label: 'saved per transaction via automated coordination workflows' },
  { value: '30–40%', label: 'of top agent revenue comes from automated referral campaigns' },
  { value: '40%', label: 'reduction in per-agent admin time with CRM automation' },
]

export default function RealEstatePage() {
  return (
    <main style={{ background: 'var(--paper)' }}>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--ink)', padding: '80px 32px 72px' }}>
        <div className="site-rail mx-auto">
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 20, fontWeight: 600 }}>
            § 01 · REAL ESTATE
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
            Your real estate business is running on<br />
            <span style={{ color: 'var(--accent)' }}>ghost work.</span>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.65, maxWidth: 560, marginBottom: 36 }}>
            Lead follow-up delays, CRM decay, manual transaction coordination — agents and brokerages lose deals every week to work that should be automated. We find it, name it, and build the fix.
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
              GET FREE AGENT AUDIT →
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
                Ghost work hiding in every real estate business.
              </h2>
            </div>
            <div style={{ paddingBottom: 4 }}>
              <p style={{ fontSize: 15, lineHeight: 1.65, opacity: 0.6, margin: 0 }}>
                These aren&apos;t inefficiencies you can hustle through.
                They&apos;re structural drains that compound every month — losing you leads,
                deals, and the hours you should be spending with clients.
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
            Total: 15–25 hours per week recovered across a typical real estate business.
          </div>
        </div>
      </section>

      {/* ── Real estate models ────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 32px', background: 'var(--ink)', color: 'var(--paper)', borderBottom: '1px solid rgba(244,241,234,0.1)' }}>
        <div className="site-rail mx-auto">
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}>
            § 03 · WHO WE BUILD FOR
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 40, maxWidth: 600 }}>
            Every real estate model. One AI engine.
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
            {['Follow Up Boss', 'KvCORE', 'Dotloop', 'DocuSign', 'Zillow', 'BombBomb', 'Salesforce', 'Chime', 'Google Calendar'].map(tool => (
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
          {/* TODO: replace with real real estate client testimonials */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--ink)' }} className="fitness-testimonial-grid">
            {[
              {
                stat: '9× lead conversion',
                quote: 'Before eevolvv, a lead that came in at night was basically gone by morning. Now our response is instant and the nurture runs itself. Conversion went from 8% to 31%.',
                name: 'Marcus T.',
                biz: 'Residential Agent — Austin, TX',
              },
              {
                stat: '8 hrs saved per deal',
                quote: 'Transaction coordination was eating me alive. Automated milestone tracking means I\'m not manually chasing every contingency date across 12 active listings.',
                name: 'Priya S.',
                biz: 'Listing Specialist — Chicago, IL',
              },
              {
                stat: '+38% referral revenue',
                quote: 'We added the post-close automation and referrals went up 38% in 90 days. The deal that pays is often the one from 18 months ago that you stayed in touch with.',
                name: 'Jordan R.',
                biz: 'Real Estate Team — Miami, FL',
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
              Our AI maps your real estate business, identifies every automation opportunity, and
              delivers a custom Evolution Report with a 90-day build roadmap — specific to your
              model, tools, and production volume.
            </p>
          </div>

          <div style={{
            border: '1px solid rgba(244,241,234,0.15)',
            overflow: 'hidden',
          }}>
            <ChatEngine defaultTier="core" defaultIndustry="Real Estate" />
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
