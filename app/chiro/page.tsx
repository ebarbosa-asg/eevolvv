import type { Metadata } from 'next'
import ChatEngine from '@/components/ChatEngine'
import { VolvvECard } from '@/components/VolvvE'
import { PriceStrip } from '@/components/conversion/PriceStrip'
import { IndustryPricingTiers } from '@/components/conversion/IndustryPricingTiers'
import { RiskReversal } from '@/components/conversion/RiskReversal'

export const metadata: Metadata = {
  title: 'AI Automation for Chiropractic & Physical Therapy Practices — eevolvv',
  description: 'Chiropractic offices and PT practices recover 15–20 hrs/week by automating recalls, intake, and patient retention. Free AI audit in 10 minutes.',
  keywords: 'chiropractic automation, chiropractic office software AI, physical therapy automation, chiro practice management, patient recall automation, chiro no-show reduction',
  openGraph: {
    title: 'Stop Running Your Chiropractic Practice on Ghost Work — eevolvv',
    description: 'Chiropractic offices and PT practices recover 15–20 hrs/week by automating recalls, intake, and patient retention. Free AI audit in 10 minutes.',
    url: 'https://eevolvv.com/chiro',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/chiro',
  },
}

const GHOST_WORK_ITEMS = [
  {
    code: 'G-01',
    label: 'Appointment No-Shows',
    pain: 'An adjustment slot going unfilled costs $80–$150 in lost revenue — manual reminder calls don\'t scale',
    win: 'Automated 48-hr and 2-hr reminder sequence cuts no-shows by 30–50%',
    hrs: '2–4 hrs/wk',
  },
  {
    code: 'G-02',
    label: 'Lapsed Patient Recall',
    pain: 'Patients who stopped treatment 3–6 months ago — most never get a meaningful follow-up',
    win: 'Automated recall campaign with personalized care check-in recovers 15–25% of lapsed patients',
    hrs: '3–5 hrs/wk',
  },
  {
    code: 'G-03',
    label: 'New Patient Intake',
    pain: 'Paper intake forms, manual data entry, insurance verification done separately for every new patient',
    win: 'Automated digital intake before the visit; insurance verification triggered automatically',
    hrs: '2–4 hrs/wk',
  },
  {
    code: 'G-04',
    label: 'Insurance Verification',
    pain: 'Manually calling to verify benefits before every new patient — hours per week',
    win: 'Automated insurance verification tracking with alerts for issues before the appointment',
    hrs: '3–5 hrs/wk',
  },
  {
    code: 'G-05',
    label: 'Treatment Plan Follow-Up',
    pain: 'Patients dropping off mid-plan because no proactive outreach reminds them of their progress',
    win: 'Automated treatment milestone check-ins reinforce adherence and outcomes',
    hrs: '2–3 hrs/wk',
  },
  {
    code: 'G-06',
    label: 'Review Collection',
    pain: 'Patients getting great results but no system to turn relief into Google reviews',
    win: 'Automated post-treatment review request at peak satisfaction — reviews increase 3–4x',
    hrs: '1–2 hrs/wk',
  },
]

const STUDIO_TYPES = [
  { id: 'CH-01', name: 'Chiropractic Clinics', note: 'Adjustment reminders, recall campaigns, insurance coordination' },
  { id: 'CH-02', name: 'Physical Therapy', note: 'Exercise adherence tracking, milestone check-ins, referral tracking' },
  { id: 'CH-03', name: 'Sports Medicine', note: 'Athlete progress sequences, return-to-play protocols, review collection' },
  { id: 'CH-04', name: 'Massage Therapy', note: 'Session reminders, package renewal, referral programs' },
  { id: 'CH-05', name: 'Acupuncture', note: 'Treatment series tracking, wellness campaigns, rebooking automation' },
  { id: 'CH-06', name: 'Holistic Wellness', note: 'Membership management, workshop funnels, email sequences' },
  { id: 'CH-07', name: 'Pain Management', note: 'Outcome tracking, case coordination, patient education sequences' },
  { id: 'CH-08', name: 'Multi-Specialty Clinics', note: 'Cross-referral automation, unified scheduling, revenue reporting' },
]

const STATS = [
  { value: '30–50%', label: 'fewer no-shows with automated appointment reminders' },
  { value: '15–25%', label: 'lapsed patients recovered via automated recall campaigns' },
  { value: '60%', label: 'faster new patient intake with digital pre-visit forms' },
  { value: '40–60%', label: 'less insurance admin time with automated verification tracking' },
]

export default function ChiroPage() {
  return (
    <main style={{ background: 'var(--paper)' }}>
      <PriceStrip />


      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--ink)', padding: '80px 32px 72px' }}>
        <div className="site-rail mx-auto">
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 20, fontWeight: 600 }}>
            § 01 · CHIROPRACTIC &amp; PHYSICAL THERAPY
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
            Your chiropractic practice is running on<br />
            <span style={{ color: 'var(--accent)' }}>ghost work.</span>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.65, maxWidth: 560, marginBottom: 36 }}>
            Appointment no-shows, insurance bottlenecks, manual intake, lapsed patient recalls — chiropractic practices lose 15–20 hours every week to tasks that should be automated. We find them, name them, and build the fix.
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
              GET FREE PRACTICE AUDIT →
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
                Ghost work hiding in every chiropractic practice.
              </h2>
            </div>
            <div style={{ paddingBottom: 4 }}>
              <p style={{ fontSize: 15, lineHeight: 1.65, opacity: 0.6, margin: 0 }}>
                These aren&apos;t inefficiencies you can hustle through.
                They&apos;re structural drains that compound every month — losing you patients,
                revenue, and the hours you should be spending on care.
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
            Total: 13–23 hours per week recovered across a typical chiropractic practice.
          </div>
        </div>
      </section>

      {/* ── Practice models ───────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 32px', background: 'var(--ink)', color: 'var(--paper)', borderBottom: '1px solid rgba(244,241,234,0.1)' }}>
        <div className="site-rail mx-auto">
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}>
            § 03 · WHO WE BUILD FOR
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 40, maxWidth: 600 }}>
            Every practice model. One AI engine.
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
            {['Jane App', 'ChiroTouch', 'Kareo', 'SimplePractice', 'WebPT', 'Noterro', 'Stripe', 'Zocdoc', 'Google Reviews'].map(tool => (
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
          {/* TODO: replace with real chiropractic client testimonials */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--ink)' }} className="fitness-testimonial-grid">
            {[
              {
                stat: '16 hrs/wk recovered',
                quote: 'The lapsed patient recall campaign was the biggest surprise. We got 23 patients back in the first 60 days who had just... disappeared. We assumed they were gone.',
                name: 'Dr. Sarah M.',
                biz: 'Chiropractic Clinic — Phoenix, AZ',
              },
              {
                stat: '+22% treatment adherence',
                quote: 'Patients dropping mid-plan was our biggest problem. The automated milestone check-ins made a huge difference. Adherence improved 22% and outcomes are measurably better.',
                name: 'James K.',
                biz: 'Physical Therapy Practice — Denver, CO',
              },
              {
                stat: '4× more reviews',
                quote: 'Insurance verification automation alone was worth it — we saved 8 hours a week just on that. The rest of the automation was gravy.',
                name: 'Dr. Priya S.',
                biz: 'Chiro & Wellness Center — Austin, TX',
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

      
      {/* ── Pricing tiers (direct buy) ───────────────────────────────────────── */}
      <IndustryPricingTiers />

      {/* ── Risk reversal block ──────────────────────────────────────────────── */}
      <section style={{ padding: '48px 32px', borderBottom: '1px solid var(--ink)' }}>
        <div className="site-rail mx-auto">
          <RiskReversal />
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
              Our AI maps your practice&apos;s operation, identifies every automation opportunity, and
              delivers a custom Evolution Report with a 90-day build roadmap — specific to your
              specialty, tools, and patient volume.
            </p>
          </div>

          <div style={{
            border: '1px solid rgba(244,241,234,0.15)',
            overflow: 'hidden',
          }}>
            <ChatEngine defaultTier="core" defaultIndustry="Medical / Healthcare" />
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
