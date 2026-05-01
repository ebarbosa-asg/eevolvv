'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import ChatEngine from '@/components/ChatEngine'

// ─── Data ─────────────────────────────────────────────────────────────────────

const HERO_PHRASES = [
  'CORNER STORE', 'GYM', 'RESTAURANT', 'LAW FIRM',
  'STARTUP', 'ENTERPRISE', 'BODEGA', 'CLINIC', 'LOGISTICS',
  'REAL ESTATE', 'AGENCY', 'FRANCHISE', 'MANUFACTURER',
] as const

/** Rotating hero strip — evolution-wordplay variants + rally cries + attributions. */
const HERO_TICKER_QUOTES = [
  `"It is not the strongest of the species that survives, but the one most responsive to change." — Charles Darwin (on eevolvvtion)`,
  `"Nothing in biology makes sense except in the light of eevolvvtion." — Theodosius Dobzhansky`,
  `"Eevolvvtion is not a force but a process; not a cause but a law." — John Morley`,
  `"We are the product of 4.5 billion years of eevolvvtion's success." — Richard Dawkins`,
  `"Eevolvvtion is a fact, not a theory." — Richard Dawkins`,
  `"Eevolvvtion cares nothing for comfort." — Carl Sagan`,
  `"Eevolvvtion is written in the rocks underneath our feet." — Neil deGrasse Tyson`,
  `"The great secret of eevolvvtion is time." — Edward O. Wilson`,
  `"Eevolvvtion makes us all related." — Bill Nye`,
  `"To study eevolvvtion is to study the most profound question: where did we come from?" — Francisco Ayala`,
  `"Eevolvvtion is change, and change is life." — Anonymous`,
  `"Eevolvvtion produces beauty as a byproduct of survival." — Geoffrey Miller`,
  `"Natural selection is the mechanism; eevolvvtion is the result." — Ernst Mayr`,
  `"Humans are not the end of eevolvvtion — they are the middle." — Stewart Brand`,
  `"Eevolvvtion gives you a brain. Life requires you to use it." — Anonymous`,
  `"Eevolvvtion is not a ladder but a bushy tree." — Stephen Jay Gould`,
  `"The cornerstone of modern biology is eevolvvtion." — Ernst Mayr`,
  `"Eevolvvtion wrote the first code — DNA." — Anonymous`,
  `"Eevolvvtion doesn't optimize for happiness. It optimizes for survival." — Robert Wright`,
  `"Understanding eevolvvtion is understanding ourselves." — Carl Sagan`,
  `"We do not eevolvv alone — we eevolvv together." — Anonymous`,
  `"You have to eevolvv or you will be left behind." — Anonymous`,
  `"Either you eevolvv or you dissolve." — Tupac Shakur`,
  `"Species that cannot eevolvv go extinct. The same is true of ideas." — Anonymous`,
  `"To eevolvv is to survive; to stagnate is to die." — Anonymous`,
  `"We are wired to eevolvv — resistance is just friction." — Anonymous`,
  `"Life's only directive: eevolvv." — Anonymous`,
  `"Those who refuse to eevolvv hand their future to those who will." — Anonymous`,
  `"The universe demands that we eevolvv." — Neil deGrasse Tyson`,
  `"To eevolvv is not to abandon who you were — it is to honor what you can become." — Anonymous`,
  `"Adapt, eevolvv, overcome." — Anonymous`,
  `"Stars eevolvv. Galaxies eevolvv. Why would you be any different?" — Neil deGrasse Tyson`,
  `"The brave eevolvv. The fearful repeat." — Anonymous`,
  `"You cannot eevolvv by standing still." — Anonymous`,
  `"We eevolvv not by force, but by necessity." — Charles Darwin`,
  `"Every crisis is an invitation to eevolvv." — Anonymous`,
  `"The mind that will not eevolvv is its own prison." — Anonymous`,
  `"To eevolvv is to become more fully yourself." — Anonymous`,
  `"Nature does not rush, yet everything eevolvvs." — Lao Tzu (adapted)`,
  `"We eevolvv or we extinct — there is no third option." — Anonymous`,
] as const

const TIERS = [
  {
    id: 'micro',
    code: 'T-00',
    name: 'Micro',
    label: 'AI Starter',
    price: '$29–$49/mo',
    who: 'Corner stores · Bodegas · Solo operators',
    tagline: 'WhatsApp-native automations. Live in 48 hours.',
    features: [
      'AI business diagnostic',
      'Inventory reorder alerts',
      'Daily sales summary (WhatsApp)',
      'Supplier payment tracker',
      'New automation every 60 days',
      'English · Spanish · Portuguese',
    ],
    highlight: false,
  },
  {
    id: 'seed', code: 'T-01', name: 'Seed', label: 'AI Starter',
    price: '$500–$1,500', who: 'Gyms, restaurants, solo operators',
    tagline: 'Your first step into AI automation.',
    features: ['AI-powered business diagnostic', 'Custom automation roadmap', 'Top 3 quick-win automations', '30-min strategy call', 'DIY implementation guide'],
    highlight: false,
  },
  {
    id: 'grow', code: 'T-02', name: 'Grow', label: 'AI Essentials',
    price: '$3,500–$7,500', who: 'Small business · $500K–$5M revenue',
    tagline: 'Core automations, real ROI.',
    features: ['Full business diagnostic', 'Priority workflow automation', 'Tool integration setup', '3 core AI agents deployed', 'Structured day-60 review'],
    highlight: false,
  },
  {
    id: 'scale', code: 'T-03', name: 'Scale', label: 'AI Transformation',
    price: '$15,000–$75,000', who: 'SMB to mid-market',
    tagline: 'Full operational rebuild.',
    features: ['Complete CORE framework', 'All workflows automated', 'Custom AI agent stack', 'Team training included', 'Dedicated build team', 'Structured day-60 review'],
    highlight: true,
  },
  {
    id: 'enterprise', code: 'T-04', name: 'Enterprise', label: 'AI Operations',
    price: '$50,000–$250,000+', who: 'Multi-location · $10M+',
    tagline: 'Total organizational transformation.',
    features: ['Dedicated pod assigned', 'Department-by-department rebuild', 'Custom platform integrations', 'Executive reporting layer', 'Ongoing governance', 'Priority SLA'],
    highlight: false,
  },
]

const STATS = [
  { value: 23, suffix: 'hrs', label: 'wasted per week on automatable tasks (avg).' },
  { value: 270, suffix: '%', label: 'faster growth for AI-optimized businesses.' },
  { value: 80, suffix: '%', label: 'of manual workflows are automatable today.' },
  {
    value: 72,
    suffix: '%',
    label:
      'Organizations reporting AI use in at least one business function—McKinsey Global Survey on AI (early 2024; global respondents).',
  },
  {
    value: 50,
    suffix: '%',
    label:
      'Organizations reporting AI deployed across two or more business functions—same McKinsey survey cohort.',
  },
  {
    value: 109,
    suffix: 'B',
    label: 'U.S. private AI funding in 2024 (~$109.1B)—Stanford Institute for Human-Centered AI, AI Index Report 2025.',
  },
]

const PROCESS_STEPS = [
  { day: 'Day 01', title: 'Intake',     desc: 'You tell us how your business runs. Ten minutes, all questions.' },
  { day: 'Day 07', title: 'Your Report',desc: 'AI-generated eevolvv Report delivered. Every automation opportunity mapped.' },
  { day: 'Day 14', title: 'First Win',  desc: 'First automation goes live. You feel the difference immediately.' },
  { day: 'Day 45', title: 'Transformed',desc: 'Full build complete. Your business runs differently.' },
  { day: 'Day 60', title: '60-Day Audit', desc: 'Structured review of metrics vs. plan—wins logged and next priorities set.' },
]

const INDUSTRIES_LIST = [
  'Restaurant / Food & Beverage', 'Gym / Fitness / Wellness', 'Retail / E-commerce',
  'Legal / Law Firm', 'Medical / Healthcare', 'Real Estate',
  'Construction / Trades', 'Accounting / Finance', 'Marketing / Agency',
  'Manufacturing', 'Logistics / Supply Chain', 'Technology / SaaS',
  'Hospitality / Hotel', 'Education', 'Non-Profit',
  'Quality / QA Program', 'Finance & FP&A', 'HR & People Ops',
  'Procurement', 'Compliance & Risk', 'IT & Help Desk', 'Other',
]

const EXAMPLES = [
  { code: 'I-01', type: 'Gym / Fitness',      pain: 'Manual scheduling, member follow-ups, lost leads', win: 'Auto-booking, retention AI, revenue recovery' },
  { code: 'I-02', type: 'Restaurant',          pain: 'Order errors, no-shows, manual inventory', win: 'Automated ops, smart reservations, waste reduction' },
  { code: 'I-03', type: 'Law Firm',            pain: 'Admin overload, client intake, billing gaps', win: 'AI intake, automated billing, case tracking' },
  { code: 'I-04', type: 'Construction',        pain: 'Scheduling chaos, quote delays, supplier chaos', win: 'Project AI, instant quotes, supplier automation' },
  { code: 'I-05', type: 'Medical Practice',    pain: 'Patient admin, billing errors, no-show rate', win: 'AI scheduling, billing automation, reminders' },
  { code: 'I-06', type: 'Enterprise',          pain: 'Siloed teams, manual reporting, process debt', win: 'Full ops rebuild, AI layer, unified intelligence' },
  { code: 'I-07', type: 'Logistics / 3PL',     pain: 'Manual dispatch, route inefficiency, missed SLAs', win: 'AI routing, automated dispatch, real-time visibility' },
  { code: 'I-08', type: 'Real Estate',          pain: 'Lead rot, manual follow-up, listing admin', win: 'AI lead nurture, automated CRM, smart listing sync' },
  { code: 'I-09', type: 'E-Commerce',           pain: 'Cart abandonment, manual CS, inventory errors', win: 'Automated recovery, AI support, smart stock alerts' },
  { code: 'I-10', type: 'Marketing Agency',     pain: 'Reporting drag, client updates, scope creep', win: 'Auto-reporting, AI account mgmt, budget alerts' },
  { code: 'I-11', type: 'Franchise',            pain: 'Inconsistent ops, multi-location reporting gaps', win: 'Unified AI layer, location benchmarking, auto-QA' },
  { code: 'I-12', type: 'Manufacturing',        pain: 'Production bottlenecks, quality control gaps', win: 'Predictive maintenance, AI QC, supply chain sync' },
  { code: 'P-01', type: 'Quality Program',      pain: 'Manual QC tracking, audit prep, NCR backlogs', win: 'Automated QC workflows, AI audit prep, live dashboards' },
  { code: 'P-02', type: 'Finance & FP&A',       pain: 'Month-end grind, manual reporting, stale forecasts', win: 'Automated close, AI forecasting, real-time P&L' },
  { code: 'P-03', type: 'HR & People Ops',      pain: 'Manual hiring workflows, slow onboarding, compliance gaps', win: 'AI recruiting, automated onboarding, HR compliance AI' },
  { code: 'P-04', type: 'Procurement',          pain: 'PO bottlenecks, vendor sprawl, blind spend', win: 'Automated POs, AI vendor scoring, spend analytics' },
  { code: 'P-05', type: 'Compliance & Risk',    pain: 'Regulatory drift, manual evidence collection, audit exposure', win: 'Continuous monitoring, automated evidence, AI risk alerts' },
  { code: 'P-06', type: 'IT & Help Desk',       pain: 'Ticket backlogs, manual triage, repeated issues', win: 'AI ticket routing, self-service automation, proactive monitoring' },
]

const PAIN_POINTS = [
  'Manual data entry eating hours every week.',
  'Customer follow-ups falling through the cracks.',
  'Reports built by hand that should auto-generate.',
  'Scheduling chaos that tools can solve in seconds.',
  "Knowledge trapped in people's heads, not systems.",
]

const LOADING_NARRATIVE = [
  { label: 'SCANNING',  message: 'Reading your business intake…',          detail: 'Parsing operational data across all inputs.' },
  { label: 'MAPPING',   message: 'Mapping your workflow architecture…',    detail: 'Identifying process gaps and dependencies.' },
  { label: 'ANALYZING', message: 'Calculating automation opportunities…',  detail: 'Running ROI models against your revenue range.' },
  { label: 'BUILDING',  message: 'Generating your automation roadmap…',    detail: 'Sequencing by impact-to-effort ratio.' },
  { label: 'WRITING',   message: 'Compiling your eevolvv Report…',       detail: 'Formatting recommendations for your team.' },
]

// ─── Chat questions ───────────────────────────────────────────────────────────

type QType = 'text' | 'email' | 'textarea' | 'chips'
interface ChatQ {
  key: string
  ask: string | ((f: Record<string, string>) => string)
  type: QType
  options?: string[]
  placeholder?: string
  validate?: (v: string) => boolean
}

const CHAT_QUESTIONS: ChatQ[] = [
  { key: 'name',            type: 'text',     placeholder: 'Your name',          validate: v => v.trim().length > 0,
    ask: "Hi! I'm the eevolvv AI. I'll map your business and find every automation win inside it.\n\nWhat's your name?" },
  { key: 'email',           type: 'email',    placeholder: 'you@business.com',   validate: v => /\S+@\S+\.\S+/.test(v),
    ask: f => `Nice to meet you, ${f.name.split(' ')[0]}. What email should I send your report to?` },
  { key: 'businessName',    type: 'text',     placeholder: 'Business name',      validate: v => v.trim().length > 0,
    ask: "What's the name of your business?" },
  { key: 'businessType',    type: 'text',     placeholder: 'e.g. CrossFit gym, e-commerce brand, law firm…', validate: v => v.trim().length > 0,
    ask: 'How would you describe what your business does in one sentence?' },
  { key: 'industry',        type: 'chips',    options: INDUSTRIES_LIST,
    ask: 'Which industry are you in?' },
  { key: 'revenue',         type: 'chips',    options: ['Under $100K','$100K–$500K','$500K–$1M','$1M–$5M','$5M–$20M','$20M–$100M','$100M+'],
    ask: "What's your approximate annual revenue?" },
  { key: 'teamSize',        type: 'chips',    options: ['Solo (just me)','2–5','6–15','16–50','51–200','200+'],
    ask: 'How many people are on your team?' },
  { key: 'topPains',        type: 'textarea', placeholder: 'e.g. Manually entering customer data (3hrs), chasing unpaid invoices (2hrs)…', validate: v => v.trim().length > 5,
    ask: 'What are your top 3 most time-consuming manual tasks every week? Be specific — the more detail, the better your report.' },
  { key: 'tools',           type: 'text',     placeholder: 'e.g. QuickBooks, Google Sheets, Slack, Salesforce…', validate: v => v.trim().length > 0,
    ask: 'What tools and software does your business currently use?' },
  { key: 'errorPoints',     type: 'textarea', placeholder: 'e.g. Handoffs between sales and fulfillment cause double-bookings…', validate: v => v.trim().length > 5,
    ask: 'Where do errors or delays most often happen? What slows you down or breaks?' },
  { key: 'customerJourney', type: 'textarea', placeholder: 'e.g. Customer finds us on Instagram → messages us → we manually check availability…', validate: v => v.trim().length > 5,
    ask: 'Walk me through your customer journey — from first contact to completed sale.' },
  { key: 'hoursFreed',      type: 'textarea', placeholder: 'e.g. Land 3 more enterprise clients, actually take weekends off…', validate: v => v.trim().length > 5,
    ask: f => `Last one. If we freed up 20 hours a week for ${f.businessName || 'your business'}, what would you do with that time?` },
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormFields {
  name: string; email: string; businessName: string; businessType: string
  industry: string; revenue: string; teamSize: string; topPains: string
  tools: string; customerJourney: string; errorPoints: string; hoursFreed: string
  tier: string
}

// ─── Brand logo (evolution strip asset + theme wordmark) ────────────────────────

function BrandLogoFigures({ size = 'md', header }: { size?: 'sm' | 'md'; header?: boolean }) {
  const classes = [
    'brand-logo-figures',
    size === 'sm' ? 'brand-logo-figures--sm' : '',
    header ? 'brand-logo-figures--header' : '',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={classes} aria-hidden>
      <Image
        src="/brand-logo.png"
        alt=""
        width={695}
        height={359}
        sizes={header ? '(max-width:767px) 180px, 200px' : size === 'sm' ? '104px' : '156px'}
        priority={header || size === 'md'}
        className="h-auto max-w-none"
      />
    </div>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────
//
// AGENTS (#agents) = §05 deployable AI agent catalog on this page.
// TALENT = separate human network: in-page strip `#talent` (TalentNetworkBand, after diagnostic) + `talent/` app + footer URL.
// Header “AGENTS” scrolls to `#agents` only. Swap `public/talent-band.png` when final talent art is ready.

function Header({ onCTA }: { onCTA: () => void }) {
  const nav: [string, string][] = [['how','PROCESS'],['who','INDUSTRIES'],['pricing','TIERS'],['agents','AGENTS'],['diagnostic','GET REPORT']]
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b" style={{ borderColor: 'var(--rule)', background: 'rgba(250,247,240,0.88)', backdropFilter: 'blur(8px)' }}>
      <div className="relative">
        <div
          className="site-header-toolbar keep-grid relative z-[50] mx-auto grid w-full max-w-[1280px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 px-4 py-2 sm:px-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-x-5 md:py-2.5 lg:gap-x-8"
        >
          <a
            href="#top"
            onClick={closeMenu}
            className="site-header-brand flex min-w-0"
            style={{ textDecoration: 'none', color: 'var(--ink)' }}
          >
            <BrandLogoFigures header />
            <div className="site-header-brand-text">
              <span className="brand-wordmark">eevolvv</span>
              <span
                className="header-brand-sub mono hidden md:inline"
                style={{ fontSize: 10, letterSpacing: '0.12em', fontWeight: 600, color: 'var(--accent)', whiteSpace: 'nowrap' }}
              >
                AI Transformation
              </span>
            </div>
          </a>
          <nav
            className="site-header-nav mono flex max-md:hidden min-w-0 items-center justify-center justify-self-stretch gap-3 md:gap-4 lg:gap-6 xl:gap-8"
            style={{ fontSize: 11, letterSpacing: '0.14em' }}
          >
            {nav.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="link-rule shrink-0" style={{ color: 'var(--ink)', opacity: 0.65, textDecoration: 'none', whiteSpace: 'nowrap' }}>{label}</a>
            ))}
          </nav>
          <div className="site-header-actions flex shrink-0 items-center justify-end gap-1.5 sm:gap-2 md:justify-self-end md:gap-3">
            {/* In-page §05 agents catalog — not the external Talent network */}
            <a
              href="#agents"
              className="mono header-cta-secondary inline-flex max-md:hidden items-center gap-1.5"
              style={{ fontSize: 11, letterSpacing: '0.16em', padding: '7px 12px', border: '1px solid var(--rule)', color: 'var(--ink)', textDecoration: 'none' }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', flexShrink: 0 }} />
              AGENTS
            </a>
            <a
              href="#how"
              className="mono header-cta-secondary inline-flex max-md:hidden"
              style={{ fontSize: 11, letterSpacing: '0.16em', padding: '8px 14px', border: '1px solid var(--rule)', color: 'var(--ink)', textDecoration: 'none', alignItems: 'center' }}
            >
              SEE PROCESS
            </a>
            <button
              type="button"
              className="header-menu-toggle flex md:hidden shrink-0 items-center justify-center mono"
              aria-expanded={menuOpen}
              aria-controls="site-mobile-nav"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setMenuOpen(o => !o)}
              style={{
                width: 40,
                height: 40,
                padding: 0,
                border: '1px solid var(--rule)',
                background: 'var(--paper)',
                color: 'var(--ink)',
                cursor: 'pointer',
                fontSize: 17,
                lineHeight: 1,
              }}
            >
              <span aria-hidden>{menuOpen ? '×' : '☰'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                closeMenu()
                onCTA()
              }}
              className="mono header-cta-gradient whitespace-nowrap"
              style={{ fontSize: 11, letterSpacing: '0.16em', padding: '8px 12px' }}
            >
              EVOLVE NOW →
            </button>
          </div>
        </div>

        {menuOpen ? (
          <>
            <div
              role="presentation"
              className="fixed inset-0 z-[40] cursor-pointer md:hidden"
              style={{ background: 'rgba(20,20,19,0.28)' }}
              onClick={closeMenu}
              aria-hidden
            />
            <nav
              id="site-mobile-nav"
              role="navigation"
              aria-label="Primary sections"
              className="absolute left-0 right-0 top-full z-[45] md:hidden"
              style={{
                borderBottom: '1px solid var(--rule)',
                background: 'var(--paper)',
                boxShadow: '0 24px 40px rgba(20,20,19,0.12)',
                maxHeight: 'calc(100dvh - 68px)',
                overflowY: 'auto',
              }}
            >
              <div className="mono" style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 24px 20px', fontSize: 11, letterSpacing: '0.16em' }}>
                {nav.map(([id, label]) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="block py-3.5"
                    style={{
                      color: 'var(--ink)',
                      opacity: 0.85,
                      textDecoration: 'none',
                      borderBottom: '1px solid var(--rule)',
                    }}
                    onClick={closeMenu}
                  >
                    {label}
                  </a>
                ))}
                <a
                  href="#how"
                  className="block py-3.5"
                  style={{
                    color: 'var(--ink)',
                    opacity: 0.85,
                    textDecoration: 'none',
                    paddingBottom: 4,
                  }}
                  onClick={closeMenu}
                >
                  SEE PROCESS
                </a>
              </div>
            </nav>
          </>
        ) : null}
      </div>
    </header>
  )
}

// ─── SectionHeader ────────────────────────────────────────────────────────────

function SectionHeader({ number, eyebrow, title, note }: { number: string; eyebrow: string; title: string; note: string }) {
  return (
    <div className="section-head" style={{ display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 24, alignItems: 'baseline', borderTop: '1px solid var(--ink)', paddingTop: 24 }}>
      <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 600 }}>§ {number}</div>
      <div>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.55, marginBottom: 12 }}>{eyebrow}</div>
        <div style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 500, letterSpacing: '-0.025em', lineHeight: 1 }}>{title}</div>
      </div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.55, alignSelf: 'start' }}>{note}</div>
    </div>
  )
}

// ─── DimensionLine ────────────────────────────────────────────────────────────

function DimensionLine({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 8, height: 8, transform: 'rotate(45deg)', background: 'var(--ink)' }} />
      <div style={{ flex: 1, height: 1, background: 'var(--ink)', opacity: 0.85 }} className="anim-draw-line" />
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.65, whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: 'var(--ink)', opacity: 0.85 }} className="anim-draw-line" />
      <div style={{ width: 8, height: 8, transform: 'rotate(45deg)', background: 'var(--ink)' }} />
    </div>
  )
}

// ─── useInView ────────────────────────────────────────────────────────────────

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── Counter ──────────────────────────────────────────────────────────────────

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const slots = Math.max(String(target).length, 1)
  const padN = (n: number) => n.toString().padStart(slots, ' ')
  const prevRef = useRef(0)
  const [curr, setCurr] = useState(0)
  const { ref, inView } = useInView()

  useEffect(() => {
    if (!inView) return
    let step = 0
    const steps = Math.min(56, Math.max(20, Math.ceil(target / 3)))
    let dur = Math.max(3200, Math.min(6200, 1100 + target * 15))
    const tick = dur / steps
    if (tick < 120) dur = steps * 120
    const id = setInterval(() => {
      step++
      const next = Math.min(target, Math.round((step / steps) * target))
      setCurr(c => {
        prevRef.current = c
        return next
      })
      if (next >= target) clearInterval(id)
    }, dur / steps)
    return () => clearInterval(id)
  }, [inView, target])

  const fromStr = padN(prevRef.current)
  const toStr = padN(curr)
  const fs = 'clamp(72px, 11vw, 132px)'

  return (
    <div
      ref={ref}
      aria-label={`${curr}${suffix}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        lineHeight: 1,
      }}
    >
      <span className="sr-only" aria-live="polite">{curr}{suffix}</span>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: '0.42em',
          flexWrap: 'nowrap',
        }}
      >
        <span className="counter-flap-stage flap-stage" style={{ fontSize: fs, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, letterSpacing: '-0.03em' }}>
          {Array.from({ length: slots }, (_, i) => (
            <FlapCell key={i} from={fromStr[i] ?? ' '} to={toStr[i] ?? ' '} delay={i * 38} />
          ))}
        </span>
        <span style={{ fontSize: fs, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--accent)', flexShrink: 0 }}>
          {suffix}
        </span>
      </div>
    </div>
  )
}

// ─── TypingStatLabel ──────────────────────────────────────────────────────────

function TypingStatLabel({ text, reducedMotion }: { text: string; reducedMotion: boolean }) {
  const [display, setDisplay] = useState('')
  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text)
      return
    }
    setDisplay('')
    let i = 0
    const ms = Math.max(11, Math.floor(4600 / Math.max(text.length, 24)))
    const id = setInterval(() => {
      i++
      setDisplay(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, ms)
    return () => clearInterval(id)
  }, [text, reducedMotion])
  const typing = !reducedMotion && display.length < text.length
  return (
    <p style={{ marginTop: 26, fontSize: 'clamp(16px, 1.85vw, 20px)', lineHeight: 1.55, color: 'rgba(20,20,19,0.78)', minHeight: '5em' }}>
      <span className="mono" style={{ opacity: 0.42, marginRight: 8 }}>{'> '}</span>
      {display}
      {typing ? (
        <span className="mono anim-blink" style={{ marginLeft: 2, opacity: 0.85 }}>
          ▍
        </span>
      ) : null}
    </p>
  )
}

// ─── FlapCell ─────────────────────────────────────────────────────────────────

function FlapCell({ from, to, delay = 0 }: { from: string; to: string; delay?: number }) {
  const [phase, setPhase] = useState<'idle' | 'flipping'>('idle')
  const [shown, setShown] = useState(from)

  useEffect(() => {
    if (from === to) { setShown(to); setPhase('idle'); return }
    const t1 = setTimeout(() => setPhase('flipping'), delay)
    const t2 = setTimeout(() => { setShown(to); setPhase('idle') }, delay + 640)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [from, to, delay])

  const G = ({ ch }: { ch: string }) => <i data-wide={/[MW]/.test(ch) ? '1' : '0'}>{ch}</i>
  const isBlank = shown === ' ' && phase === 'idle'
  const blankTop    = isBlank
    ? { background: 'transparent', borderBottomColor: 'transparent', transition: 'background 0.4s ease, border-color 0.4s ease' }
    : { transition: 'background 0.4s ease, border-color 0.4s ease' }
  const blankBottom = isBlank
    ? { background: 'transparent', borderTopColor: 'transparent', transition: 'background 0.4s ease, border-color 0.4s ease' }
    : { transition: 'background 0.4s ease, border-color 0.4s ease' }

  return (
    <span className="flap-cell" aria-hidden>
      <span className="flap-half top"    style={blankTop}><span><G ch={phase === 'flipping' ? to : shown} /></span></span>
      <span className="flap-half bottom" style={blankBottom}><span><G ch={phase === 'flipping' ? from : shown} /></span></span>
      {phase === 'flipping' && <>
        <span className="flap-half top flip-top"><span><G ch={from} /></span></span>
        <span className="flap-half bottom flip-bottom"><span><G ch={to} /></span></span>
      </>}
    </span>
  )
}

// ─── SplitFlap ────────────────────────────────────────────────────────────────

function SplitFlap({ word, length, fontSize, className }: { word: string; length: number; fontSize?: string; className?: string }) {
  const [prev, setPrev] = useState(word)
  useEffect(() => {
    const t = setTimeout(() => setPrev(word), 720)
    return () => clearTimeout(t)
  }, [word])
  const pad = (s: string | undefined) => (s ?? '').padEnd(length, ' ').slice(0, length)
  const a = pad(prev), b = pad(word)
  return (
    <span className={`flap-stage ${className ?? ''}`.trim()} style={{ ...(fontSize ? { fontSize } : {}), color: 'var(--paper)' }}>
      {Array.from({ length }).map((_, i) => <FlapCell key={i} from={a[i] || ' '} to={b[i] || ' '} delay={i * 55} />)}
    </span>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroQuoteTicker() {
  const [reduceMotion, setReduceMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const fn = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  const loop = reduceMotion ? [...HERO_TICKER_QUOTES] : [...HERO_TICKER_QUOTES, ...HERO_TICKER_QUOTES]
  return (
    <div
      className="hero-quote-ticker anim-fade-in"
      style={{ marginBottom: 56, width: '100%', overflow: 'hidden' }}
      role="presentation"
    >
      <div className={`hero-quote-track${reduceMotion ? ' hero-quote-track--static' : ''}`}>
        {loop.map((q, i) => (
          <span key={`${i}-${q.slice(0, 12)}`} className="hero-quote-segment">
            {q}
          </span>
        ))}
      </div>
    </div>
  )
}

function Hero({ onCTA }: { onCTA: () => void }) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setPhraseIndex(i => (i + 1) % HERO_PHRASES.length), 2600)
    return () => clearInterval(t)
  }, [])
  const word = HERO_PHRASES[phraseIndex]
  const maxLen = HERO_PHRASES.reduce((m, w) => Math.max(m, w.length), 0)

  return (
    <section id="top" className="relative" style={{ paddingTop: 56, paddingBottom: 96, overflow: 'hidden', minHeight: '92vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="absolute inset-0 grid-drift" style={{ opacity: 0.55, pointerEvents: 'none' }} />
      <div className="absolute" style={{ inset: 0, background: 'radial-gradient(ellipse at 70% 30%, color-mix(in oklab, var(--accent) 14%, transparent) 0%, transparent 55%)', pointerEvents: 'none' }} />

      <div className="mx-auto relative hero-shell" style={{ maxWidth: 1440, padding: '0 40px', width: '100%' }}>
        <HeroQuoteTicker />

        {/* "We evolve every" + rule */}
        <div className="anim-fade-up hero-tagline-row" style={{ marginBottom: 16, display: 'flex', alignItems: 'baseline', gap: 20 }}>
          <span
            className="serif hero-tagline-text"
            style={{ fontFamily: 'var(--font-serif)', fontStyle: 'normal', fontWeight: 400, fontSize: 'clamp(48px, 7.5vw, 132px)', lineHeight: 0.95, letterSpacing: '-0.025em', whiteSpace: 'nowrap', transform: 'skewX(12deg)', transformOrigin: 'left bottom', display: 'inline-block' }}
          >
            We evolve every
          </span>
          <span className="hero-tagline-rule" style={{ flex: 1, height: 1, background: 'var(--ink)', opacity: 0.4, transform: 'translateY(-0.35em)' }} />
        </div>

        {/* Split-flap word — font-size from .hero-flap-stage (viewport + longest phrase width) */}
        <div className="anim-fade-up hero-flap-shell" style={{ animationDelay: '0.1s', width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
          <SplitFlap word={word} length={maxLen} className="hero-flap-stage" />
        </div>

        {/* Editorial supporting line */}
        <h1 className="anim-fade-up hero-gradient-word serif" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(28px, 3.6vw, 56px)', lineHeight: 1, letterSpacing: '-0.02em', margin: '28px 0 0 0', animationDelay: '0.25s' }}>
          into the new era.
        </h1>

        <div className="grid mt-10 anim-fade-up hero-body-grid" style={{ gridTemplateColumns: '1.1fr 0.9fr', gap: 56, animationDelay: '0.4s', marginTop: 56, alignItems: 'end' }}>
          <p style={{ fontSize: 18, lineHeight: 1.55, maxWidth: 560, color: 'color-mix(in oklab, var(--ink) 78%, transparent)', margin: 0 }}>
            We don&apos;t sell software. We become your AI operations team — mapping your workflows, deploying automations, and rebuilding how your business runs.
            <span style={{ display: 'block', marginTop: 16, opacity: 0.6 }}>From your corner store to your enterprise. eevolvving forward, together.</span>
          </p>
          <div className="flex items-end gap-3 hero-cta-row" style={{ alignSelf: 'end', justifySelf: 'end', flexWrap: 'wrap' }}>
            <button onClick={onCTA} className="btn-gradient" style={{ padding: '18px 30px', fontSize: 14, fontWeight: 600, letterSpacing: '0.04em' }}>GET YOUR FREE AI AUDIT →</button>
            <a href="#how" style={{ background: 'transparent', color: 'var(--ink)', padding: '18px 30px', border: '1px solid var(--ink)', cursor: 'pointer', fontSize: 14, fontWeight: 600, letterSpacing: '0.04em', textDecoration: 'none' }}>SEE HOW IT WORKS</a>
          </div>
        </div>

        <div className="anim-fade-in" style={{ animationDelay: '1.2s', marginTop: 80 }}>
          <DimensionLine label="MEASURED TWICE · SHIPPED ONCE" />
        </div>
      </div>
    </section>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function Stats() {
  const { ref, inView } = useInView(0.22)
  const [idx, setIdx] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const fn = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  useEffect(() => {
    if (!inView || reducedMotion) return
    const t = setInterval(() => setIdx(i => (i + 1) % STATS.length), 6800)
    return () => clearInterval(t)
  }, [inView, reducedMotion])

  const s = STATS[idx]

  return (
    <section
      id="stats"
      style={{ padding: '120px 0', borderBottom: '1px solid var(--rule)', background: 'rgba(20,20,19,0.02)', scrollMarginTop: 96 }}
    >
      <div ref={ref} className="mx-auto" style={{ maxWidth: 720, padding: '0 32px' }}>
        <div
          style={{
            border: '1px solid var(--ink)',
            borderRadius: 12,
            overflow: 'hidden',
            background: 'rgba(250, 247, 240, 0.85)',
            boxShadow: '0 28px 52px rgba(20, 20, 19, 0.09)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
              padding: '12px 18px',
              borderBottom: '1px solid var(--rule)',
              background: 'rgba(20, 20, 19, 0.04)',
            }}
          >
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', opacity: 0.48 }}>
              KEY METRICS · LIVE ROTATION
            </span>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', opacity: 0.42 }}>
              N={STATS.length} · LIVE
            </span>
          </div>

          <div className="stats-panel-inner" style={{ padding: '40px 36px 36px' }}>
            <div style={{ minHeight: 120, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Counter key={`slide-${idx}-${s.value}-${s.suffix}`} target={s.value} suffix={s.suffix} />
            </div>

            <TypingStatLabel key={`lbl-${idx}`} text={s.label} reducedMotion={reducedMotion} />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Problem ──────────────────────────────────────────────────────────────────

function Problem() {
  return (
    <section style={{ padding: '120px 0', borderBottom: '1px solid var(--rule)' }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: '0 32px' }}>
        <SectionHeader number="01" eyebrow="THE PROBLEM" title="Your team is doing work AI should be doing." note="DIAGNOSIS" />
        <div className="grid mt-12 problem-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(340px, 1.22fr)', gap: 72, marginTop: 56, alignItems: 'stretch' }}>
          <div>
            <p style={{ fontSize: 18, lineHeight: 1.55, color: 'rgba(20,20,19,0.78)', marginBottom: 32 }}>
              Most businesses lose <strong>23 hours a week</strong> to tasks that AI can do faster, cheaper, and without errors. The damage is invisible until you measure it.
            </p>
            <div style={{ borderTop: '1px solid var(--ink)' }}>
              {PAIN_POINTS.map((p, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 20, padding: '20px 0', borderBottom: '1px solid var(--rule)' }}>
                  <div className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--accent)', fontWeight: 600 }}>0{i + 1}</div>
                  <div style={{ fontSize: 16, lineHeight: 1.5 }}>{p}</div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="problem-terminal"
            style={{
              border: '1px solid var(--ink)',
              borderRadius: 12,
              overflow: 'hidden',
              background: 'var(--ink)',
              color: 'var(--paper)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 14,
              lineHeight: 1.75,
              boxShadow: '0 28px 56px rgba(20, 20, 19, 0.14)',
              display: 'flex',
              flexDirection: 'column',
              alignSelf: 'start',
              width: '100%',
            }}
          >
            <div
              className="problem-terminal-titlebar"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                flexShrink: 0,
                padding: '14px 18px',
                borderBottom: '1px solid rgba(244, 241, 234, 0.12)',
                background: 'rgba(244, 241, 234, 0.045)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }} aria-hidden>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', opacity: 0.88 }} />
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e', opacity: 0.88 }} />
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', opacity: 0.88 }} />
              </div>
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: '0.22em',
                  opacity: 0.62,
                  flex: 1,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                business_audit.log
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 128, justifyContent: 'flex-end' }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    boxShadow: '0 0 12px color-mix(in oklab, var(--accent) 42%, transparent)',
                    flexShrink: 0,
                  }}
                  aria-hidden
                />
                <span style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', fontWeight: 600 }}>eevolvv.ai</span>
              </div>
            </div>
            <div style={{ padding: '32px 36px 36px', flexShrink: 0 }}>
              <div style={{ opacity: 0.5 }}>→ scanning workflows…</div>
              <div>→ manual invoicing detected <span style={{ color: 'var(--accent)' }}>[6hrs/wk]</span></div>
              <div>→ customer follow-up gaps <span style={{ color: 'var(--accent)' }}>[12 missed/mo]</span></div>
              <div>→ manual reporting found <span style={{ color: 'var(--accent)' }}>[$3,200/mo labor]</span></div>
              <div>→ scheduling inefficiency <span style={{ color: 'var(--accent)' }}>[8hrs/wk]</span></div>
              <div>→ no CRM automation <span style={{ color: 'var(--accent)' }}>[30% lead loss]</span></div>
              <div style={{ marginTop: 22, paddingTop: 22, borderTop: '1px solid rgba(244,241,234,0.16)' }}>
                <span style={{ opacity: 0.5 }}>→ total recoverable value: </span>
                <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 18 }}>$87,400/yr</span>
              </div>
              <div style={{ opacity: 0.72, marginTop: 10, fontSize: 13 }}>→ automation readiness: CRITICAL ▓▓▓▓▓▓▓▓░░ 80%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Process ──────────────────────────────────────────────────────────────────

function Process() {
  return (
    <section id="how" style={{ padding: '120px 0', borderBottom: '1px solid var(--rule)', background: 'rgba(20,20,19,0.02)' }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: '0 32px' }}>
        <SectionHeader number="02" eyebrow="THE PROCESS" title="From intake to transformed in 60 days." note="N=5 STEPS" />
        <div className="grid mt-14" style={{ gridTemplateColumns: 'repeat(5,1fr)', gap: 0, marginTop: 64, border: '1px solid var(--ink)' }}>
          {PROCESS_STEPS.map((step, i) => (
            <div key={i} className="status-cell" style={{ padding: 28, borderRight: i < PROCESS_STEPS.length - 1 ? '1px solid var(--ink)' : 'none' }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 600, marginBottom: 16 }}>{step.day}</div>
              <div style={{ width: 14, height: 14, border: '2px solid var(--ink)', background: 'var(--accent)', borderRadius: 999, marginBottom: 16 }} />
              <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', marginBottom: 8 }}>{step.title}</div>
              <p style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.7, margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="mono" style={{ marginTop: 18, fontSize: 10, letterSpacing: '0.22em', opacity: 0.5, textAlign: 'right' }}>
          ↳ CLOSE THE LOOP · AUDIT & NEXT ACTIONS
        </div>
      </div>
    </section>
  )
}

// ─── WhoItsFor ────────────────────────────────────────────────────────────────

function WhoItsFor() {
  return (
    <section id="who" style={{ padding: '120px 0', borderBottom: '1px solid var(--rule)' }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: '0 32px' }}>
        <SectionHeader number="03" eyebrow="WHO WE EVOLVE" title="Any business. Any program. Every industry." note={`N=${EXAMPLES.length}`} />
        <div className="grid mt-12" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: 0, marginTop: 56, border: '1px solid var(--ink)' }}>
          {EXAMPLES.map((ex, i) => (
            <div key={i} className="status-cell" style={{ padding: 28, borderRight: i % 3 < 2 ? '1px solid var(--ink)' : 'none', borderBottom: i < EXAMPLES.length - 3 ? '1px solid var(--ink)' : 'none' }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.55, marginBottom: 16 }}>{ex.code}</div>
              <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.015em', marginBottom: 20 }}>{ex.type}</div>
              <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 14 }}>
                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', opacity: 0.55, marginBottom: 6 }}>BEFORE</div>
                <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.75, marginBottom: 16 }}>{ex.pain}</div>
                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 6 }}>AFTER →</div>
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>{ex.win}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing({ onCTA }: { onCTA: (tier: string) => void }) {
  return (
    <section id="pricing" style={{ padding: '120px 0', borderBottom: '1px solid var(--rule)', background: 'rgba(20,20,19,0.02)' }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: '0 32px' }}>
        <SectionHeader number="04" eyebrow="PRICING" title="Every business has a starting point." note="FIVE TIERS" />
        <p style={{ fontSize: 16, lineHeight: 1.55, opacity: 0.7, maxWidth: 620, marginTop: 24 }}>
          All tiers include the eevolvv Report. Outcomes reviewed at day 60 post-deployment.
        </p>
        <div className="grid mt-12" style={{ gridTemplateColumns: 'repeat(5,1fr)', gap: 0, marginTop: 48, border: '1px solid var(--ink)' }}>
          {TIERS.map((tier, i) => (
            <div key={tier.id} className="status-cell" style={{ padding: 24, borderRight: i < TIERS.length - 1 ? '1px solid var(--ink)' : 'none', background: tier.highlight ? 'var(--ink)' : 'transparent', color: tier.highlight ? 'var(--paper)' : 'var(--ink)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {tier.highlight && (
                <div className="mono" style={{ position: 'absolute', top: -12, left: 24, background: 'var(--accent)', color: 'var(--paper)', padding: '4px 10px', fontSize: 9, letterSpacing: '0.22em', fontWeight: 600 }}>HIGH IMPACT/COST</div>
              )}
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.55, marginBottom: 12 }}>{tier.code}</div>
              <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em' }}>{tier.name}</div>
              <div className="serif" style={{ fontStyle: 'italic', fontSize: 16, color: 'var(--accent)', marginBottom: 8 }}>{tier.label}</div>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 20 }}>{tier.who}</div>
              <div style={{ borderTop: '1px solid', borderColor: tier.highlight ? 'rgba(244,241,234,0.18)' : 'var(--rule)', paddingTop: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.015em' }}>{tier.price}</div>
                <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>{tier.tagline}</div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1, marginBottom: 20 }}>
                {tier.features.map((f, j) => (
                  <li key={j} style={{ display: 'grid', gridTemplateColumns: '16px 1fr', gap: 8, padding: '6px 0', fontSize: 13, lineHeight: 1.5, opacity: 0.85 }}>
                    <span style={{ color: 'var(--accent)' }}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => onCTA(tier.id)} className="mono" style={{ width: '100%', padding: '14px 0', background: tier.highlight ? 'var(--accent)' : 'transparent', color: tier.highlight ? 'var(--paper)' : 'var(--ink)', border: tier.highlight ? '0' : '1px solid var(--ink)', fontSize: 11, letterSpacing: '0.18em', fontWeight: 600, cursor: 'pointer' }}>
                START WITH {tier.name.toUpperCase()} →
              </button>
            </div>
          ))}
        </div>
        {/* Retainer add-on */}
        <div className="pricing-retainer-band" style={{ marginTop: 32, border: '1px solid var(--ink)', padding: 28, display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}>
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 10, fontWeight: 600 }}>+ ADD-ON · EVOLVE RETAINER</div>
            <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em' }}>Keep evolving every month.</div>
            <p style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.7, margin: '6px 0 0', maxWidth: 520 }}>New automations built as your business grows. AI improves — so do you.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>$500–$25K</div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', opacity: 0.55 }}>/ MONTH</div>
            </div>
            <button onClick={() => onCTA('retainer')} className="mono" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '14px 22px', border: 0, cursor: 'pointer', fontSize: 11, letterSpacing: '0.18em', fontWeight: 600 }}>ADD RETAINER →</button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── LoadingNarrative ─────────────────────────────────────────────────────────

function LoadingNarrative({ step, elapsed }: { step: number; elapsed: number }) {
  const progress = Math.min((step + 1) / LOADING_NARRATIVE.length * 100, 100)
  const filled = Math.round(progress / 5)
  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ border: '1px solid var(--ink)', background: 'var(--ink)', color: 'var(--paper)', padding: 32, fontFamily: 'JetBrains Mono, monospace' }}>
        <div className="flex items-center justify-between" style={{ paddingBottom: 16, marginBottom: 24, borderBottom: '1px solid rgba(244,241,234,0.18)' }}>
          <div className="flex items-center gap-2">
            <div style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--accent)' }} className="anim-blink" />
            <span style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.6 }}>diagnostic_engine.run</span>
          </div>
          <span style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)' }}>{elapsed}s</span>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div className="flex items-center gap-3" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 600 }}>[{LOADING_NARRATIVE[step].label}]</span>
          </div>
          <div style={{ fontSize: 15, marginBottom: 4 }}>{LOADING_NARRATIVE[step].message}</div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>{LOADING_NARRATIVE[step].detail}</div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div className="flex items-center justify-between" style={{ fontSize: 10, letterSpacing: '0.18em', opacity: 0.55, marginBottom: 6 }}>
            <span>PROGRESS</span><span>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: 4, background: 'rgba(244,241,234,0.12)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent)', transition: 'width 1s ease-out' }} />
          </div>
          <div style={{ marginTop: 8, fontSize: 10, color: 'rgba(244,241,234,0.4)', letterSpacing: '0.05em' }}>
            {'▓'.repeat(filled)}{'░'.repeat(20 - filled)}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {LOADING_NARRATIVE.map((s, i) => {
            const done = i < step, active = i === step
            return (
              <div key={i} style={{ fontSize: 11, opacity: done ? 0.7 : active ? 1 : 0.3, color: done ? 'var(--accent)' : 'inherit', display: 'flex', gap: 8 }}>
                <span>{done ? '✓' : active ? '▶' : '○'}</span>
                <span>{s.label.toLowerCase()} {done ? 'complete' : active ? 'in progress…' : 'queued'}</span>
              </div>
            )
          })}
        </div>
        <p style={{ marginTop: 28, textAlign: 'center', fontSize: 10, letterSpacing: '0.22em', opacity: 0.4 }}>
          AI IS GENERATING YOUR REPORT · TYPICALLY 20–35 SECONDS
        </p>
      </div>
    </div>
  )
}

// ─── ChatMark ─────────────────────────────────────────────────────────────────

function ChatMark() {
  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        width: 28,
        height: 28,
        border: '1px solid var(--ink)',
        marginTop: 2,
        background: 'var(--paper)',
      }}
      aria-hidden
    >
      <Image
        src="/brand-logo.png"
        alt=""
        fill
        sizes="28px"
        className="object-cover"
        style={{ objectPosition: '48% 14%' }}
      />
    </div>
  )
}

// ─── DiagnosticForm ───────────────────────────────────────────────────────────

function DiagnosticForm({ defaultTier }: { defaultTier: string }) {
  const [form, setForm] = useState<FormFields>({
    name: '', email: '', businessName: '', businessType: '',
    industry: '', revenue: '', teamSize: '', topPains: '',
    tools: '', customerJourney: '', errorPoints: '', hoursFreed: '',
    tier: defaultTier || 'grow',
  })
  const [history, setHistory] = useState<{ role: 'ai' | 'user'; text: string }[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [input, setInput] = useState('')
  const [animKey, setAnimKey] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [report, setReport] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!loading) { setLoadingStep(0); setElapsed(0); return }
    const a = setInterval(() => setLoadingStep(p => Math.min(p + 1, LOADING_NARRATIVE.length - 1)), 5500)
    const b = setInterval(() => setElapsed(p => p + 1), 1000)
    return () => { clearInterval(a); clearInterval(b) }
  }, [loading])

  useEffect(() => { setForm(f => ({ ...f, tier: defaultTier || f.tier })) }, [defaultTier])

  const messagesRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = messagesRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [history, currentQ])

  useEffect(() => {
    if (!done) inputRef.current?.focus()
  }, [currentQ, done])

  const q = CHAT_QUESTIONS[currentQ]
  const aiText = typeof q.ask === 'function' ? q.ask(form as unknown as Record<string, string>) : q.ask
  const isValid = q.validate ? q.validate(input) : input.trim().length > 0

  const runSubmit = async (finalForm: FormFields) => {
    setLoading(true); setError(null)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 55_000)
    try {
      const res = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalForm),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      let data: Record<string, unknown> = {}
      try { data = await res.json() } catch { throw new Error('The server returned an unexpected response. Please try again.') }
      if (res.status === 429) throw new Error("You've generated 3 reports this hour — your limit resets in 60 minutes.")
      if (res.status === 400) throw new Error((data.error as string) || 'Please check your inputs and try again.')
      if (res.status === 502) throw new Error('The AI engine timed out. Please try again in 30 seconds.')
      if (!res.ok) throw new Error((data.error as string) || `Unexpected error (${res.status}).`)
      if (!data.success) throw new Error((data.error as string) || 'Something went wrong. Please try again.')
      setReport(data.report as string)
    } catch (err: unknown) {
      clearTimeout(timeout)
      if (err instanceof Error && err.name === 'AbortError') {
        setError('The request timed out — the AI is taking longer than expected. Please try again.')
      } else {
        setError(err instanceof Error ? err.message : 'Connection failed. Check your internet and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const advance = (value: string) => {
    if (!value.trim()) return
    const updatedForm = { ...form, [q.key]: value } as FormFields
    setForm(updatedForm)
    setHistory(h => [...h, { role: 'ai', text: aiText }, { role: 'user', text: value }])
    setInput('')
    setAnimKey(k => k + 1)
    if (currentQ < CHAT_QUESTIONS.length - 1) {
      setCurrentQ(c => c + 1)
    } else {
      setDone(true)
      runSubmit(updatedForm)
    }
  }

  const formatReport = (text: string) => {
    const sections = text.split(/(?=###\s)/).map(chunk => {
      const headingMatch = chunk.match(/^###\s+(.+?)\n([\s\S]*)$/)
      if (!headingMatch) return `<p>${chunk.trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />')}</p>`
      const [, heading, body] = headingMatch
      const formattedBody = body.trim()
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .split('\n\n')
        .map(para => {
          const lines = para.trim().split('\n')
          if (lines.every(l => l.trim().startsWith('- '))) {
            return `<ul>${lines.map(l => `<li>${l.replace(/^- /, '')}</li>`).join('')}</ul>`
          }
          return `<p>${lines.join('<br />')}</p>`
        })
        .join('')
      return `<h3>${heading}</h3>${formattedBody}`
    })
    return sections.join('')
  }

  if (report) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, border: '2px solid var(--ink)', background: 'var(--accent)', color: 'var(--paper)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 20 }}>✓</div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 10 }}>SHEET R-01 · EEVOLVV REPORT</div>
          <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em' }}>Your eevolvv Report</div>
          <p style={{ fontSize: 14, opacity: 0.65, marginTop: 8 }}>AI-generated diagnostic for {form.businessName || form.businessType}</p>
        </div>
        <div className="report-content" style={{ border: '1px solid var(--ink)', background: 'rgba(255,255,255,0.5)', padding: 32 }} dangerouslySetInnerHTML={{ __html: formatReport(report) }} />
        <div className="diagnostic-report-cta" style={{ marginTop: 24, border: '1px solid var(--ink)', padding: 24, display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 500 }}>Ready to make this real?</div>
            <p style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>Book your 30-min strategy call and let&apos;s build the roadmap together.</p>
          </div>
          <a href={process.env.NEXT_PUBLIC_CALENDLY_URL || 'mailto:hello@eevolvv.com?subject=eevolvv%20Strategy%20Call%20Request'} target="_blank" rel="noopener noreferrer" className="mono" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '14px 22px', textDecoration: 'none', fontSize: 11, letterSpacing: '0.18em', fontWeight: 600 }}>BOOK STRATEGY CALL →</a>
        </div>
      </div>
    )
  }

  if (loading) return <LoadingNarrative step={loadingStep} elapsed={elapsed} />

  const progress = ((currentQ + 1) / CHAT_QUESTIONS.length) * 100

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Progress bar */}
      <div style={{ height: 2, background: 'rgba(20,20,19,0.1)', marginBottom: 0, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent)', transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)' }} />
      </div>

      {/* Chat window */}
      <div style={{ border: '1px solid var(--ink)', borderTop: 'none', background: 'rgba(255,255,255,0.45)', overflow: 'hidden' }}>

        {/* Messages */}
        <div ref={messagesRef} className="chat-messages-panel" style={{ maxHeight: 420, overflowY: 'auto', padding: '32px 32px 8px' }}>
          {history.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 20 }}>
              {msg.role === 'ai' && (
                <div style={{ display: 'flex', gap: 14, maxWidth: '82%' }}>
                  <ChatMark />
                  <div style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink)', opacity: 0.6, whiteSpace: 'pre-line', paddingTop: 4 }}>{msg.text}</div>
                </div>
              )}
              {msg.role === 'user' && (
                <div style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '10px 18px', fontSize: 15, lineHeight: 1.5, maxWidth: '72%' }}>
                  {msg.text}
                </div>
              )}
            </div>
          ))}

          {/* Current AI question */}
          {!done && (
            <div key={animKey} className="anim-fade-up" style={{ display: 'flex', gap: 14, maxWidth: '82%', marginBottom: 28 }}>
              <ChatMark />
              <div style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink)', whiteSpace: 'pre-line', fontWeight: 500, paddingTop: 4 }}>{aiText}</div>
            </div>
          )}

        </div>

        {/* Chips */}
        {!done && q.type === 'chips' && (
          <div style={{ padding: '4px 32px 24px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {q.options!.map(opt => (
              <ChipButton key={opt} label={opt} onClick={() => advance(opt)} />
            ))}
          </div>
        )}

        {/* Text / textarea input */}
        {!done && q.type !== 'chips' && (
          <div style={{ borderTop: '1px solid rgba(20,20,19,0.12)', display: 'flex', alignItems: q.type === 'textarea' ? 'flex-end' : 'center' }}>
            {q.type === 'textarea' ? (
              <textarea
                ref={inputRef}
                rows={3}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={q.placeholder}
                style={{ flex: 1, padding: '18px 20px', border: 'none', background: 'transparent', fontSize: 15, resize: 'none', fontFamily: 'Space Grotesk, sans-serif', color: 'var(--ink)', lineHeight: 1.55 }}
              />
            ) : (
              <input
                ref={inputRef}
                type={q.type}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (isValid) advance(input) } }}
                placeholder={q.placeholder}
                style={{ flex: 1, padding: '18px 20px', border: 'none', background: 'transparent', fontSize: 15, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--ink)' }}
              />
            )}
            <button
              onClick={() => advance(input)}
              disabled={!isValid}
              style={{
                padding: '0 22px',
                alignSelf: 'stretch',
                background: isValid ? 'var(--ink)' : 'transparent',
                color: isValid ? 'var(--paper)' : 'var(--ink)',
                border: 'none',
                borderLeft: '1px solid rgba(20,20,19,0.12)',
                cursor: isValid ? 'pointer' : 'default',
                fontSize: 20,
                opacity: isValid ? 1 : 0.25,
                transition: 'background 0.2s, opacity 0.2s',
                display: 'flex',
                alignItems: 'center',
              }}
            >→</button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ borderTop: '1px solid var(--accent)', padding: '14px 32px', background: 'rgba(255,255,255,0.4)', display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 4 }}>※ ERROR</div>
              <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>{error}</p>
            </div>
            <button onClick={() => { setError(null); setDone(false); runSubmit(form) }} className="mono" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '10px 16px', border: 0, cursor: 'pointer', fontSize: 10, letterSpacing: '0.18em', flexShrink: 0 }}>RETRY →</button>
          </div>
        )}
      </div>

      {/* Step counter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', opacity: 0.4 }}>
          {q.type === 'text' || q.type === 'email' ? 'ENTER TO SEND' : ''}
        </span>
        <span className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', opacity: 0.4 }}>
          {currentQ + 1} / {CHAT_QUESTIONS.length}
        </span>
      </div>
    </div>
  )
}

function ChipButton({ label, onClick }: { label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '7px 14px',
        border: '1px solid var(--ink)',
        background: hovered ? 'var(--ink)' : 'transparent',
        color: hovered ? 'var(--paper)' : 'var(--ink)',
        cursor: 'pointer',
        fontSize: 13,
        fontFamily: 'Space Grotesk, sans-serif',
        transition: 'background 0.15s, color 0.15s',
        lineHeight: 1.4,
      }}
    >
      {label}
    </button>
  )
}

// ─── AgentsSection (§05) ───────────────────────────────────────────────────────
//
// This section *replaced* the old “EEVOLVV / TALENT / micro-contracting operators” block on the marketing page.
// Naming & anchor: `id="agents"` only. Human talent promo lives in `TalentNetworkBand` (`id="talent"`) after the diagnostic section.
//
// Talent split:
//   • Here: AI agents we build & integrate for clients (`AGENT_CARDS`, eyebrow EEVOLVV / AGENTS).
//   • Elsewhere: human talent network → `talent/` Next app + footer “Talent network” URL (new talent artwork belongs there).

const AGENT_CARDS = [
  { code: 'A-01', icon: '🎯', title: 'Intake & routing agent', desc: 'Qualifies leads, routes conversations, and keeps CRM fields honest.' },
  { code: 'A-02', icon: '🗺️', title: 'Workflow mapper agent', desc: 'Turns how your team actually works into a clear automation brief.' },
  { code: 'A-03', icon: '📅', title: 'Scheduler agent', desc: 'Handles reminders, no-shows, and calendar Tetris without the ping-pong.' },
  { code: 'A-04', icon: '💳', title: 'Billing pulse agent', desc: 'Chases invoices, flags overdue accounts, and surfaces cash-flow risks.' },
  { code: 'A-05', icon: '💬', title: 'Support desk agent', desc: 'Answers FAQs, drafts replies, and escalates only when a human should.' },
  { code: 'A-06', icon: '📦', title: 'Inventory signal agent', desc: 'Watches stock levels and reorder thresholds so you never wing it.' },
  { code: 'A-07', icon: '📈', title: 'Reporting agent', desc: 'Pulls spreadsheets and tools into live dashboards your team will open.' },
  { code: 'A-08', icon: '🧲', title: 'CRM hygiene agent', desc: 'Dedupes messy contacts and nudges stalled deals before they go cold.' },
  { code: 'A-09', icon: '📱', title: 'WhatsApp concierge agent', desc: 'Runs broadcasts, two-way flows, and fast replies where your customers already are.' },
  { code: 'A-10', icon: '📄', title: 'Docs & contracts agent', desc: 'Summaries, version trails, and gentle nudges until signatures land.' },
  { code: 'A-11', icon: '🪄', title: 'Hiring screen agent', desc: 'Scores applicants against your rubric so interviews start with the shortlist.' },
  { code: 'A-12', icon: '⚡', title: 'Ops pulse agent', desc: 'Monitors KPI drift and pings owners when the business slips off track.' },
]

function AgentsSection() {
  return (
    <section id="agents" style={{ padding: '120px 0', borderBottom: '1px solid var(--rule)', background: 'rgba(20,20,19,0.02)', scrollMarginTop: 72 }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: '0 32px' }}>
        <SectionHeader number="05" eyebrow="EEVOLVV / AGENTS" title="Agents we build to optimize how you operate." note="12 DEPLOYABLE" />
        <p style={{ fontSize: 16, lineHeight: 1.55, opacity: 0.7, maxWidth: 720, marginTop: 24 }}>
          These are the kinds of AI agents eevolvv can ship for your business — narrow, reliable automations that tighten ops, protect revenue, and free your team for judgment work. Pick what fits; we scope and integrate each one to your stack.
        </p>
        <div className="agents-grid mt-12" style={{ marginTop: 48 }}>
          {AGENT_CARDS.map(agent => (
            <div key={agent.code} className="agent-card-cell">
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '16px 18px' }}>
                <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }} aria-hidden>{agent.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', opacity: 0.45, marginBottom: 6 }}>{agent.code}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 6, lineHeight: 1.25 }}>{agent.title}</div>
                  <p style={{ fontSize: 12, lineHeight: 1.55, opacity: 0.62, margin: 0 }}>{agent.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 32, border: '1px solid var(--ink)', padding: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.01em' }}>Not sure which agents fit first?</div>
            <p style={{ fontSize: 14, opacity: 0.65, marginTop: 6, margin: '6px 0 0' }}>Tell our AI diagnostic what you run — it maps the highest-impact automations for your business.</p>
          </div>
          <a href="#diagnostic" className="mono" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '14px 24px', textDecoration: 'none', fontSize: 11, letterSpacing: '0.18em', fontWeight: 600, whiteSpace: 'nowrap' }}>FIND A SPECIALIST →</a>
        </div>
      </div>
    </section>
  )
}

// ─── DiagnosticSection ────────────────────────────────────────────────────────

function DiagnosticSection({ targetTier }: { targetTier: string }) {
  return (
    <section id="diagnostic" style={{ padding: '120px 0', borderBottom: '1px solid var(--rule)', position: 'relative', overflow: 'hidden', scrollMarginTop: 72 }}>
      <div className="absolute inset-0 blueprint-grid" style={{ opacity: 0.4, pointerEvents: 'none' }} />
      <div className="mx-auto relative" style={{ maxWidth: 1280, padding: '0 32px' }}>
        <SectionHeader number="06" eyebrow="FREE AI AUDIT" title="Get your eevolvv report. right now. Free." note="Valued ~$3k" />
        <p style={{ fontSize: 16, lineHeight: 1.55, opacity: 0.7, maxWidth: 620, marginTop: 24, marginBottom: 56 }}>
          Just talk to us. Our AI asks the right questions, maps your workflows, and delivers a custom automation roadmap — free.
        </p>
        <div style={{ border: '1px solid var(--ink)', background: 'var(--paper)', padding: '48px 32px' }}>
          <ChatEngine defaultTier={targetTier} />
        </div>
      </div>
    </section>
  )
}

// ─── TalentNetworkBand — replaces CTAClose ─────────────────────────────────────
//
// Full-width “talent tab”: human operator network (talent.eevolvv.com). Keeps the ink-band slot that used to be “Either you evolve…”.
// Audit/pricing urgency CTAs remain in Hero, Pricing tiers, and Diagnostic — not duplicated here.
// Hero image: `public/talent-band.png` (replace when final talent graphic ships).

const TALENT_SITE_URL = process.env.NEXT_PUBLIC_TALENT_URL?.trim() || 'https://talent.eevolvv.com'

function TalentNetworkBand() {
  return (
    <section id="talent" style={{ padding: '120px 0', background: 'var(--ink)', color: 'var(--paper)', borderBottom: '1px solid var(--rule)', scrollMarginTop: 72 }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: '0 32px' }}>
        <div
          className="talent-band-grid"
          style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(260px, 400px)', gap: 40, alignItems: 'center' }}
        >
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.55, marginBottom: 14 }}>EEVOLVV / TALENT</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(30px, 4.2vw, 48px)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.08, margin: 0 }}>
              Operators who build it with you — <em className="serif" style={{ fontStyle: 'italic', color: 'var(--accent)' }}>on demand.</em>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.72, marginTop: 18, maxWidth: 460 }}>
              Scoped specialists when you need hands on keyboard — not another hiring cycle. Paired with the AI agents above when both matter.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 28, flexWrap: 'wrap', alignItems: 'center' }}>
              <a
                href={TALENT_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient mono"
                style={{ padding: '16px 26px', fontSize: 11, letterSpacing: '0.16em', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
              >
                VISIT TALENT NETWORK →
              </a>
              <a href="#agents" style={{ color: 'var(--paper)', padding: '14px 22px', border: '1px solid rgba(255,255,255,0.35)', fontSize: 14, fontWeight: 600, textDecoration: 'none', opacity: 0.95 }}>
                Browse AI agents
              </a>
            </div>
          </div>
          <div style={{ position: 'relative', border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.03)' }}>
            <Image
              src="/talent-band.png"
              alt="eevolvv talent network"
              width={1024}
              height={675}
              sizes="(max-width:900px) 100vw, 400px"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── GlobalHorizon ────────────────────────────────────────────────────────────

const LAND: [number, number][] = [
  // North America
  [2,1],[3,1],[4,1],[5,1],
  [1,2],[2,2],[3,2],[4,2],[5,2],[6,2],
  [2,3],[3,3],[4,3],[5,3],[6,3],
  [3,4],[4,4],[5,4],
  [4,5],[5,5],
  // South America
  [5,6],[6,6],[7,6],
  [5,7],[6,7],[7,7],
  [6,8],[7,8],
  [6,9],
  // Europe
  [10,1],[11,1],
  [9,2],[10,2],[11,2],[12,2],
  [10,3],[11,3],
  // Africa
  [10,3],[11,3],[12,3],
  [9,4],[10,4],[11,4],[12,4],[13,4],
  [9,5],[10,5],[11,5],[12,5],[13,5],
  [10,6],[11,6],[12,6],
  [10,7],[11,7],[12,7],
  [11,8],[12,8],
  // Middle East
  [13,3],[14,3],[13,4],[14,4],
  // South / Central Asia
  [14,2],[15,2],[16,2],
  [14,3],[15,3],[16,3],
  [14,4],[15,4],[16,4],
  [14,5],[15,5],
  // East Asia
  [16,1],[17,1],[18,1],
  [15,2],[16,2],[17,2],[18,2],
  [16,3],[17,3],[18,3],
  [16,4],[17,4],
  // SE Asia
  [15,5],[16,5],[17,5],[18,5],
  [17,6],[18,6],
  // Japan
  [19,2],[19,3],
  // Australia
  [17,7],[18,7],[19,7],
  [17,8],[18,8],
]

// Dots that "glow" to show market potential — no labels, just signal
const SIGNAL_DOTS: { cx: number; cy: number; delay: number }[] = [
  // Americas cluster (current)
  { cx: 3,  cy: 3,  delay: 0    },
  { cx: 5,  cy: 3,  delay: 0.3  },
  { cx: 6,  cy: 6,  delay: 0.6  },
  { cx: 7,  cy: 7,  delay: 0.9  },
  // Europe
  { cx: 10, cy: 2,  delay: 1.4  },
  { cx: 11, cy: 2,  delay: 1.6  },
  // Africa
  { cx: 10, cy: 5,  delay: 2.2  },
  { cx: 12, cy: 6,  delay: 2.5  },
  { cx: 11, cy: 8,  delay: 2.8  },
  // South Asia
  { cx: 14, cy: 4,  delay: 3.2  },
  { cx: 15, cy: 5,  delay: 3.5  },
  // East Asia
  { cx: 17, cy: 3,  delay: 4.0  },
  { cx: 18, cy: 2,  delay: 4.3  },
  // SE Asia
  { cx: 17, cy: 5,  delay: 4.8  },
  { cx: 18, cy: 6,  delay: 5.1  },
  // Australia
  { cx: 18, cy: 8,  delay: 5.6  },
]

function WorldDotMap() {
  const COLS = 21
  const ROWS = 11
  const STEP = 5.5
  const R_LAND = 0.7
  const R_SIGNAL = 1.6
  const landSet = new Set(LAND.map(([c, r]) => `${c},${r}`))

  return (
    <svg
      viewBox={`0 0 ${(COLS - 1) * STEP + 2} ${(ROWS - 1) * STEP + 2}`}
      style={{ width: '100%', maxWidth: 520, display: 'block' }}
      aria-hidden
    >
      {/* All grid dots — ocean faint, land brighter */}
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const col = i % COLS
        const row = Math.floor(i / COLS)
        const isLand = landSet.has(`${col},${row}`)
        return (
          <circle
            key={i}
            cx={col * STEP + 1}
            cy={row * STEP + 1}
            r={isLand ? R_LAND : 0.3}
            fill="var(--paper)"
            opacity={isLand ? 0.28 : 0.06}
          />
        )
      })}

      {/* Signal dots — pulsing accent, staggered by continent */}
      {SIGNAL_DOTS.map((s, i) => (
        <g key={i}>
          {/* Outer glow ring */}
          <circle
            cx={s.cx * STEP + 1}
            cy={s.cy * STEP + 1}
            r={R_SIGNAL * 2.8}
            fill="var(--accent)"
            opacity={0}
          >
            <animate
              attributeName="opacity"
              values="0;0.18;0"
              dur="3s"
              begin={`${s.delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values={`${R_SIGNAL};${R_SIGNAL * 3.5};${R_SIGNAL * 3.5}`}
              dur="3s"
              begin={`${s.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
          {/* Core */}
          <circle
            cx={s.cx * STEP + 1}
            cy={s.cy * STEP + 1}
            r={R_SIGNAL}
            fill="var(--accent)"
            opacity={0}
          >
            <animate
              attributeName="opacity"
              values="0;0.9;0.9;0.15;0"
              keyTimes="0;0.1;0.5;0.85;1"
              dur="3s"
              begin={`${s.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </svg>
  )
}

function GlobalHorizon() {
  const stats = [
    { n: '500M+',   label: 'small businesses worldwide' },
    { n: '$4.5T',   label: 'informal retail market' },
    { n: '<1%',     label: 'AI adoption in emerging markets' },
    { n: '∞',       label: 'runway' },
  ]

  return (
    <section style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '80px 0 72px', overflow: 'hidden' }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: '0 40px' }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: '0.28em', color: 'var(--accent)', marginBottom: 48, opacity: 0.85 }}>
          LONG HORIZON · EEVOLVV GLOBAL · EST. 2026
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 64, alignItems: 'center' }}>
          {/* Dot world map */}
          <div style={{ position: 'relative' }}>
            <WorldDotMap />
            <div className="mono" style={{ marginTop: 14, fontSize: 9, letterSpacing: '0.18em', opacity: 0.3, textAlign: 'center' }}>
              SIGNAL STRENGTH: GROWING · MARKET: EARTH
            </div>
          </div>

          {/* Copy + stats */}
          <div>
            <h2 style={{ fontSize: 'clamp(26px, 3.8vw, 50px)', fontWeight: 500, letterSpacing: '-0.025em', lineHeight: 1.05, margin: '0 0 28px' }}>
              Every business on earth deserves this.
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.65, opacity: 0.55, margin: '0 0 40px', maxWidth: 380 }}>
              We&apos;re starting in the US. The model works everywhere humans run businesses — which is everywhere. The horizon is global. We&apos;re just warming up.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px 24px' }}>
              {stats.map(({ n, label }) => (
                <div key={n}>
                  <div style={{ fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--accent)', lineHeight: 1 }}>{n}</div>
                  <div className="mono" style={{ fontSize: 9, letterSpacing: '0.16em', opacity: 0.45, marginTop: 6, textTransform: 'uppercase' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  // ENGAGE: “Talent” → `#talent` (TalentNetworkBand). External talent URL is the primary CTA on that strip.
  const cols: [string, [string, string][]][] = [
    ['NAVIGATE', [['Process','#how'],['Industries','#who'],['Pricing','#pricing']]],
    ['ENGAGE',   [['Talent','#talent'],['AI agents','#agents'],['Free Audit','#diagnostic']]],
    ['LEGAL',    [['Privacy','#'],['Terms','#'],['Contact','mailto:hello@eevolvv.com']]],
  ]
  return (
    <footer style={{ borderTop: '1px solid var(--rule)', padding: '56px 0 40px' }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: '0 32px' }}>
        <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 48 }}>
          <div>
            <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
              <BrandLogoFigures size="sm" />
              <span className="brand-wordmark">eevolvv</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.55, opacity: 0.65, margin: 0, maxWidth: 320 }}>AI-native business transformation. Every business. Every size. Every industry.</p>
            <p className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.45, marginTop: 12 }}>eevolvv.com</p>
          </div>
          {cols.map(([title, links]) => (
            <div key={title}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.55, marginBottom: 16 }}>{title}</div>
              {links.map(([l, h]) => (
                <a key={l} href={h} className="link-rule" style={{ display: 'block', fontSize: 14, marginBottom: 10, color: 'var(--ink)', textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="mono flex items-center justify-between" style={{ marginTop: 56, paddingTop: 24, borderTop: '1px solid var(--rule)', fontSize: 10, letterSpacing: '0.22em', opacity: 0.5 }}>
          <span>© 2026 · EEVOLVV · ALL RIGHTS RESERVED</span>
          <span>eevolvving forward, together.</span>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [targetTier, setTargetTier] = useState('grow')

  const scrollToDiagnostic = (tier?: string) => {
    if (tier) setTargetTier(tier)
    document.getElementById('diagnostic')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main>
      <Header onCTA={() => scrollToDiagnostic()} />
      <Hero onCTA={() => scrollToDiagnostic()} />
      <Stats />
      <Problem />
      <Process />
      <WhoItsFor />
      <Pricing onCTA={tier => scrollToDiagnostic(tier)} />
      <AgentsSection />
      <DiagnosticSection targetTier={targetTier} />
      <TalentNetworkBand />
      <GlobalHorizon />
      <Footer />
    </main>
  )
}
