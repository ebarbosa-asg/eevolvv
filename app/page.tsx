'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import ChatEngine from '@/components/ChatEngine'
import { VolvvE } from '@/components/VolvvE'

// ─── Data ─────────────────────────────────────────────────────────────────────

const HERO_PHRASES = [
  'CORNER STORE', 'GYM', 'RESTAURANT', 'LAW FIRM',
  'STARTUP', 'ENTERPRISE', 'BODEGA', 'CLINIC', 'LOGISTICS',
  'REAL ESTATE', 'AGENCY', 'FRANCHISE', 'MANUFACTURER',
] as const

/** Rotating hero strip — evolution-wordplay variants + rally cries + attributions. */
const HERO_TICKER_QUOTES = [
  `"Ghost work is everywhere in your business. You just can't see it yet." — eevolvv`,
  `"You hired great people. Right now, some of them are copying and pasting." — eevolvv`,
  `"Natural selection doesn't give warnings." — Charles Darwin`,
  `"The businesses that didn't eevolvv aren't struggling. They're gone." — eevolvv`,
  `"Day 1 we diagnose. Day 60 your operation looks nothing like it did." — eevolvv`,
  `"We don't sell software. We become your AI operations team." — eevolvv`,
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
      'English · Spanish · Portuguese — and more soon!',
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
  { day: 'Day 01', title: 'Diagnose',    desc: 'We map every workflow. Find every ghost. Every task that shouldn\'t exist gets named.' },
  { day: 'Day 07', title: 'The Report',  desc: 'Your Ghost Work Audit arrives. Every hour recovered, every dollar at stake, ranked by impact.' },
  { day: 'Day 14', title: 'First Win',   desc: 'First ghost eliminated. First automation live. You feel the difference immediately.' },
  { day: 'Day 45', title: 'Transformed', desc: 'Full build complete. The ghost work is gone. Your team does human work now.' },
  { day: 'Day 60', title: 'Locked In',   desc: 'Structured audit. Wins logged. The AI compounds from here — context builds every month.' },
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
  { code: 'I-01', type: 'Gym / Fitness', pain: 'Manual schedules & lost leads', win: 'Auto-booking + retention AI' },
  { code: 'I-02', type: 'Restaurant', pain: 'Order errors & no-shows', win: 'Smart reservations + waste alerts' },
  { code: 'I-03', type: 'Law Firm', pain: 'Intake noise & billing gaps', win: 'AI intake + tracked billing' },
  { code: 'I-04', type: 'Construction', pain: 'Quote lag & supplier chaos', win: 'Project AI + instant quotes' },
  { code: 'I-05', type: 'Medical Practice', pain: 'Front-desk load & no-shows', win: 'Scheduling + billing automation' },
  { code: 'I-06', type: 'Enterprise', pain: 'Siloed teams & report grind', win: 'Unified AI ops layer' },
  { code: 'I-07', type: 'Logistics / 3PL', pain: 'Dispatch drag & missed SLAs', win: 'AI routing + live visibility' },
  { code: 'I-08', type: 'Real Estate', pain: 'Cold leads & listing busywork', win: 'Nurture AI + CRM sync' },
  { code: 'I-09', type: 'E-Commerce', pain: 'Cart drop-off & stock misses', win: 'Recovery flows + inventory alerts' },
  { code: 'I-10', type: 'Marketing Agency', pain: 'Reporting & update treadmill', win: 'Auto reports + scope guardrails' },
  { code: 'I-11', type: 'Franchise', pain: 'Uneven ops across locations', win: 'One AI playbook + benchmarks' },
  { code: 'I-12', type: 'Manufacturing', pain: 'Downtime & QC blind spots', win: 'Predictive maintenance + AI QC' },
  { code: 'P-01', type: 'Quality Program', pain: 'QC sheets & audit scramble', win: 'Digital QC + audit-ready trails' },
  { code: 'P-02', type: 'Finance & FP&A', pain: 'Close crunch & stale forecasts', win: 'Faster close + live P&L signals' },
  { code: 'P-03', type: 'HR & People Ops', pain: 'Slow hire & onboarding loops', win: 'AI screening + guided onboarding' },
  { code: 'P-04', type: 'Procurement', pain: 'PO friction & spend blind spots', win: 'Auto POs + vendor intelligence' },
  { code: 'P-05', type: 'Compliance & Risk', pain: 'Evidence hunts & policy drift', win: 'Continuous checks + risk alerts' },
  { code: 'P-06', type: 'IT & Help Desk', pain: 'Ticket pile-ups & repeat fires', win: 'Smart routing + self-serve fixes' },
]

const PAIN_POINTS = [
  'Someone on your team copies data between systems. Every single day.',
  'Invoices re-keyed by hand because nobody set up the integration.',
  'Reports assembled manually every week that a machine could run in seconds.',
  'Follow-ups that fall through cracks because no one automated the sequence.',
  'Work that exists because it always has — never because it should.',
]

// ─── Brand mark (pixel mascot — same asset site-wide as `/mascot.png`) ───────────

const MASCOT_PX = { w: 338, h: 338 } as const

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
        src="/mascot.png"
        alt=""
        width={MASCOT_PX.w}
        height={MASCOT_PX.h}
        sizes={header ? '(max-width:767px) 160px, 180px' : size === 'sm' ? '104px' : '156px'}
        priority={header || size === 'md'}
        className="h-auto max-w-none"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────
//
// AGENTS (#agents) = §06 deployable AI agent catalog on this page (main nav still links here).


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
          className="site-header-toolbar keep-grid relative z-[50] mx-auto grid w-full max-w-[1280px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 px-4 py-1.5 sm:px-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-x-5 md:px-8 md:py-2 lg:gap-x-8"
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
                AI eevolvvtion is here...
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
            <a
              href="#how"
              className="mono header-cta-secondary inline-flex max-md:hidden"
              style={{ fontSize: 11, letterSpacing: '0.16em', padding: '6px 12px', border: '1px solid var(--rule)', color: 'var(--ink)', textDecoration: 'none', alignItems: 'center' }}
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
                width: 36,
                height: 36,
                padding: 0,
                border: '1px solid var(--rule)',
                background: 'var(--paper)',
                color: 'var(--ink)',
                cursor: 'pointer',
                fontSize: 16,
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
              style={{ fontSize: 11, letterSpacing: '0.16em', padding: '6px 11px' }}
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
                maxHeight: 'calc(100dvh - 54px)',
                overflowY: 'auto',
              }}
            >
              <div className="mono site-rail" style={{ paddingTop: 16, paddingBottom: 20, fontSize: 11, letterSpacing: '0.16em' }}>
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
          <div>
            <p style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 520, color: 'color-mix(in oklab, var(--ink) 78%, transparent)', margin: '0 0 24px' }}>
              We map your ghost work, project your ROI, and hand you a custom automation roadmap — free, in under 10 minutes.
            </p>
            <div className="mono" style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, opacity: 0.55, letterSpacing: '0.12em' }}>
              <div>→ AI WORKFLOW MAP</div>
              <div>→ ROI PROJECTION</div>
              <div>→ 90-DAY BUILD ROADMAP</div>
            </div>
          </div>
          <div className="flex items-end gap-3 hero-cta-row" style={{ alignSelf: 'end', justifySelf: 'end', flexWrap: 'wrap' }}>
            <button onClick={onCTA} className="btn-gradient" style={{ padding: '18px 32px', fontSize: 14, fontWeight: 600, letterSpacing: '0.04em' }}>GET FREE REPORT →</button>
            <a href="/pricing" style={{ background: 'transparent', color: 'var(--ink)', padding: '18px 28px', border: '1px solid var(--ink)', cursor: 'pointer', fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', textDecoration: 'none', opacity: 0.7 }}>VIEW PRICING</a>
          </div>
        </div>

        <div className="anim-fade-in" style={{ animationDelay: '1.2s', marginTop: 80 }}>
          <DimensionLine label="FIND THE GHOSTS · ELIMINATE THEM · COMPOUND FOREVER" />
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
      className="anchor-scroll"
      style={{ padding: '120px 0', borderBottom: '1px solid var(--rule)', background: 'rgba(20,20,19,0.02)' }}
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
      <div className="mx-auto site-rail">
        <SectionHeader number="02" eyebrow="THE GHOST WORK AUDIT" title="23 hours a week. Gone." note="DIAGNOSIS" />
        <div className="grid problem-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(340px, 1.22fr)', gap: 72, marginTop: 48, alignItems: 'stretch' }}>
          <div>
            <p style={{ fontSize: 16, lineHeight: 1.55, color: 'rgba(20,20,19,0.65)', marginBottom: 24 }}>
              Ghost work is invisible, habitual labor nobody questions. We find it, name it, and eliminate it.
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
                ghost_work_audit.log
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
                <span style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', fontWeight: 600 }}>eevolvv.com</span>
              </div>
            </div>
            <div style={{ padding: '32px 36px 36px', flexShrink: 0 }}>
              <div style={{ opacity: 0.5 }}>→ scanning for ghost work…</div>
              <div>→ <span style={{ color: 'var(--accent)' }}>GHOST:</span> manual invoicing <span style={{ color: 'var(--accent)' }}>[6 hrs/wk · $11,400/yr]</span></div>
              <div>→ <span style={{ color: 'var(--accent)' }}>GHOST:</span> data re-keyed between systems <span style={{ color: 'var(--accent)' }}>[4 hrs/wk]</span></div>
              <div>→ <span style={{ color: 'var(--accent)' }}>GHOST:</span> follow-ups done by hand <span style={{ color: 'var(--accent)' }}>[12 missed/mo]</span></div>
              <div>→ <span style={{ color: 'var(--accent)' }}>GHOST:</span> reports assembled manually <span style={{ color: 'var(--accent)' }}>[$3,200/mo labor]</span></div>
              <div>→ <span style={{ color: 'var(--accent)' }}>GHOST:</span> scheduling via email chains <span style={{ color: 'var(--accent)' }}>[5 hrs/wk]</span></div>
              <div style={{ marginTop: 22, paddingTop: 22, borderTop: '1px solid rgba(244,241,234,0.16)' }}>
                <div style={{ opacity: 0.5 }}>→ total ghost hours: <span style={{ color: 'var(--accent)', fontWeight: 600 }}>23 hrs/wk</span></div>
                <div style={{ marginTop: 6 }}><span style={{ opacity: 0.5 }}>→ annual cost of ghost work: </span><span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 18 }}>$87,400/yr</span></div>
              </div>
              <div style={{ opacity: 0.72, marginTop: 10, fontSize: 13 }}>→ exorcism readiness: ▓▓▓▓▓▓▓▓░░ <span style={{ color: 'var(--accent)' }}>READY</span></div>
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
    <section id="how" className="anchor-scroll" style={{ padding: '120px 0', borderBottom: '1px solid var(--rule)', background: 'rgba(20,20,19,0.02)' }}>
      <div className="mx-auto site-rail">
        <SectionHeader number="03" eyebrow="THE EXORCISM PROCESS" title="Day 1 we diagnose. Day 60 you look nothing like you did." note="N=5 STEPS" />
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

/** §04 industry grid: 3-across on wide screens; 2 on tablet; 1 on narrow viewports. */
function useWhoEvolveCols() {
  const [cols, setCols] = useState(3)
  useEffect(() => {
    const apply = () => {
      const w = window.innerWidth
      if (w < 520) setCols(1)
      else if (w < 1180) setCols(2)
      else setCols(3)
    }
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [])
  return cols
}

function whoEvolveCellBorders(index: number, total: number, cols: number) {
  const rows = Math.ceil(total / cols)
  const row = Math.floor(index / cols)
  const hasRight =
    index + 1 < total && Math.floor(index / cols) === Math.floor((index + 1) / cols)
  const hasBottom = row < rows - 1
  return {
    borderRight: hasRight ? '1px solid var(--ink)' : 'none',
    borderBottom: hasBottom ? '1px solid var(--ink)' : 'none',
  }
}

// ─── WhoItsFor ────────────────────────────────────────────────────────────────

function WhoItsFor() {
  const cols = useWhoEvolveCols()
  const featuredExamples = EXAMPLES.slice(0, 6)
  const n = featuredExamples.length
  return (
    <section id="who" className="anchor-scroll" style={{ padding: '80px 0', borderBottom: '1px solid var(--rule)' }}>
      <div className="mx-auto site-rail">
        <div className="who-evolve-compact-head">
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 600 }}>§ 04</div>
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.55, marginBottom: 10 }}>WHO WE EVOLVE</div>
            <div className="who-evolve-compact-title">Start where the ghost work is loudest.</div>
          </div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.55, alignSelf: 'start' }}>SAMPLE SET</div>
        </div>
        <p className="who-evolve-compact-note">
          The diagnostic adapts to the business. These are just the common starting points.
        </p>
        <div
          className="who-we-evolve-grid grid mt-12"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gap: 0,
            marginTop: 34,
            border: '1px solid var(--ink)',
          }}
        >
          {featuredExamples.map((ex, i) => {
            const compact = cols >= 4
            const pad = compact ? '9px 10px' : cols === 2 ? '12px 14px' : '16px 18px'
            return (
              <div
                key={i}
                className="status-cell who-evolve-card"
                style={{
                  padding: pad,
                  ...whoEvolveCellBorders(i, n, cols),
                }}
              >
                <div className="mono" style={{ fontSize: compact ? 7 : 8, letterSpacing: '0.16em', opacity: 0.48, marginBottom: compact ? 5 : 7 }}>
                  {ex.code}
                </div>
                <div
                  className="who-evolve-card-title"
                  style={{
                    fontSize: compact ? 'clamp(12px, 1vw, 14px)' : 'clamp(13px, 1.2vw, 16px)',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                    marginBottom: compact ? 6 : 8,
                  }}
                >
                  {ex.type}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 3 : 5 }}>
                  <p className="who-evolve-card-line who-evolve-card-line--pain">{ex.pain}</p>
                  <p className="who-evolve-card-line who-evolve-card-line--win">→ {ex.win}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing({ onCTA }: { onCTA: (tier: string) => void }) {
  const [showMonthly, setShowMonthly] = useState(false)

  const tiers = [
    {
      id: 'seed',
      code: 'T-01',
      name: 'Seed',
      label: 'Foundation',
      who: 'Solopreneur or small local business',
      price: showMonthly ? '$99' : '$950',
      period: showMonthly ? '/month' : '/year',
      saving: showMonthly ? null : 'Save $238 vs monthly',
      highlight: false,
      features: [
        'Landing page + 1 automation workflow',
        '24-hour build SLA',
        'Hosting + uptime monitoring',
        '1 content update / month',
      ],
    },
    {
      id: 'core',
      code: 'T-02',
      name: 'Core',
      label: 'AI-Powered',
      who: 'Growing business ready for automation',
      price: showMonthly ? '$499' : '$4,790',
      period: showMonthly ? '/month' : '/year',
      saving: showMonthly ? null : 'Save $1,198 vs monthly',
      highlight: true,
      features: [
        'Web app + 3–5 AI agents',
        '3–5 day build SLA',
        'CRM + integration connections',
        '2 agent updates / month',
        'Monthly performance report',
      ],
    },
    {
      id: 'evolve',
      code: 'T-03',
      name: 'Evolve',
      label: 'Full-Stack',
      who: 'Established business, complex operations',
      price: showMonthly ? '$1,999' : '$19,190',
      period: showMonthly ? '/month' : '/year',
      saving: showMonthly ? null : 'Save $4,798 vs monthly',
      highlight: false,
      features: [
        'Full-stack build + CRM/ERP',
        '7–10 day build SLA',
        'Custom dashboards + pipelines',
        'Full managed service',
        'Quarterly re-calibration',
      ],
    },
  ]

  return (
    <section id="pricing" className="anchor-scroll" style={{ padding: '120px 0', borderBottom: '1px solid var(--rule)', background: 'rgba(20,20,19,0.02)' }}>
      <div className="mx-auto site-rail">
        <SectionHeader number="05" eyebrow="PRICING" title="A service, not software." note="THREE TIERS" />
        <p style={{ fontSize: 16, lineHeight: 1.55, opacity: 0.7, maxWidth: 580, marginTop: 24 }}>
          We build it, host it, maintain it, and evolve it — every month. Choose your starting point.
        </p>

        {/* Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 32, marginBottom: 40 }}>
          <button
            onClick={() => setShowMonthly(false)}
            className="mono"
            style={{
              padding: '6px 14px', fontSize: 10, letterSpacing: '0.16em', fontWeight: 600,
              background: !showMonthly ? 'var(--ink)' : 'transparent',
              color: !showMonthly ? 'var(--paper)' : 'var(--ink)',
              border: '1px solid var(--ink)', cursor: 'pointer',
            }}
          >
            ANNUAL
          </button>
          <button
            onClick={() => setShowMonthly(true)}
            className="mono"
            style={{
              padding: '6px 14px', fontSize: 10, letterSpacing: '0.16em', fontWeight: 600,
              background: showMonthly ? 'var(--ink)' : 'transparent',
              color: showMonthly ? 'var(--paper)' : 'var(--ink)',
              border: '1px solid var(--ink)', cursor: 'pointer',
            }}
          >
            MONTHLY
          </button>
          {!showMonthly && (
            <span className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em' }}>2 MONTHS FREE</span>
          )}
        </div>

        <div className="pricing-tier-grid">
          {tiers.map((tier, i) => (
            <div key={tier.id} style={{
              padding: 28, borderRight: i < tiers.length - 1 ? '1px solid var(--ink)' : 'none',
              background: tier.highlight ? 'var(--ink)' : 'transparent',
              color: tier.highlight ? 'var(--paper)' : 'var(--ink)',
              position: 'relative', display: 'flex', flexDirection: 'column',
            }}>
              {tier.highlight && (
                <div className="mono" style={{ position: 'absolute', top: -12, left: 24, background: 'var(--accent)', color: 'var(--paper)', padding: '4px 10px', fontSize: 9, letterSpacing: '0.22em', fontWeight: 600 }}>MOST POPULAR</div>
              )}
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.55, marginBottom: 12 }}>{tier.code}</div>
              <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>{tier.name}</div>
              <div className="serif" style={{ fontStyle: 'italic', fontSize: 15, color: 'var(--accent)', marginBottom: 6 }}>{tier.label}</div>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 20 }}>{tier.who}</div>
              <div style={{ borderTop: '1px solid', borderColor: tier.highlight ? 'rgba(244,241,234,0.18)' : 'var(--rule)', paddingTop: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.015em' }}>{tier.price}</div>
                <div style={{ fontSize: 11, opacity: 0.55, marginTop: 4 }}>{tier.period}</div>
                {tier.saving && (
                  <div className="mono" style={{ fontSize: 9, color: 'var(--accent)', marginTop: 6, letterSpacing: '0.1em' }}>{tier.saving.toUpperCase()}</div>
                )}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1, marginBottom: 20 }}>
                {tier.features.map((f, j) => (
                  <li key={j} style={{ display: 'grid', gridTemplateColumns: '16px 1fr', gap: 8, padding: '6px 0', fontSize: 13, lineHeight: 1.5, opacity: 0.85 }}>
                    <span style={{ color: 'var(--accent)' }}>→</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/pricing"
                className="mono"
                style={{
                  display: 'block', textAlign: 'center', width: '100%', padding: '14px 0',
                  background: tier.highlight ? 'var(--accent)' : 'transparent',
                  color: tier.highlight ? 'var(--paper)' : 'var(--ink)',
                  border: tier.highlight ? 'none' : '1px solid var(--ink)',
                  fontSize: 11, letterSpacing: '0.18em', fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                START WITH {tier.name.toUpperCase()} →
              </a>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, border: '1px solid rgba(20,20,19,0.14)', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 14, opacity: 0.6, lineHeight: 1.5 }}>
            Not sure which tier fits?{' '}
            <button onClick={() => onCTA('seed')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 14, textDecoration: 'underline', padding: 0 }}>
              Run the free diagnostic first →
            </button>
          </div>
          <a href="/pricing" className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--ink)', opacity: 0.55, textDecoration: 'underline', whiteSpace: 'nowrap' }}>
            FULL PRICING DETAILS
          </a>
        </div>
      </div>
    </section>
  )
}


// ─── AgentsSection (§06) ───────────────────────────────────────────────────────

/** Mascot-aligned pixel palette: terracotta body + ink outline + red accent “eye” pixels. */
const AGENT_PIXEL_PALETTE: Record<string, string> = {
  '.': 'transparent',
  x: '#161514',
  m: '#bf604f',
  d: '#8c4337',
  l: '#e8c4b8',
  r: '#e03d2f',
}

function normalizePixelRows(rows: readonly string[]): string[] {
  const w = Math.max(1, ...rows.map((r) => r.length))
  return rows.map((r) => r.padEnd(w, '.'))
}

function AgentPixelIcon({ rows }: { rows: readonly string[] }) {
  const grid = normalizePixelRows(rows)
  const gw = grid[0]!.length
  const gh = grid.length
  const rects: JSX.Element[] = []
  grid.forEach((row, y) => {
    Array.from(row).forEach((ch, x) => {
      const fill = AGENT_PIXEL_PALETTE[ch]
      if (!fill || fill === 'transparent') return
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />)
    })
  })
  return (
    <span className="agent-pixel-icon" aria-hidden>
      <svg viewBox={`0 0 ${gw} ${gh}`} xmlns="http://www.w3.org/2000/svg">
        {rects}
      </svg>
    </span>
  )
}

const AGENT_PIXEL_GRIDS = {
  // Funnel: wide top narrows to stem at bottom
  intake: [
    'xxxxxxxxxxxx',
    'xmmmmmmmmmmx',
    '.xmmmmmmmmx.',
    '..xmmmrmmx..',
    '...xmrrmx...',
    '....xrrx....',
    '....xrrx....',
    '.....xrx....',
    '.....xrx....',
    '.....xrx....',
  ],
  // Map pin: circle with red center + pointed tip
  workflow: [
    '....xxxx....',
    '...xmmmmx...',
    '..xmmrrmmx..',
    '..xmmrrmmx..',
    '...xmmmmx...',
    '....xxxx....',
    '.....xx.....',
  ],
  // Calendar: red header + 2-week date grid
  scheduler: [
    '.xxxxxxxxxx.',
    '.xrrrrrrrrx.',
    '.xxxxxxxxxx.',
    '.xmm.mm.mmx.',
    '.xmm.mm.mmx.',
    '.xxxxxxxxxx.',
    '.xmm.mm.mmx.',
    '.xmm.mm.mmx.',
    '.xmm.mm.mmx.',
    '.xxxxxxxxxx.',
  ],
  // Credit card: red magnetic stripe + dark chip
  billing: [
    'xxxxxxxxxxxx',
    'xrrrrrrrrrrx',
    'xxxxxxxxxxxx',
    'xmdxmmmmmmmx',
    'xmdxmmmmmmmx',
    'xmmmmmmmmmmx',
    'xxxxxxxxxxxx',
  ],
  // Chat bubble: 3 dots inside + tail
  support: [
    '.xxxxxxxxxx.',
    'xmmmmmmmmmmx',
    'xm.mm.mm.mmx',
    'xmmmmmmmmmmx',
    '.xxxxxxxxxx.',
    '....xxx.....',
    '.....x......',
  ],
  // Storage box: terracotta fill with red level indicator
  inventory: [
    'xxxxxxxxxxxx',
    'xmmmmmmmmmmx',
    'xmmmmmmmmmmx',
    'xrrrrrrrrrrx',
    'xmmmmmmmmmmx',
    'xmmmmmmmmmmx',
    'xxxxxxxxxxxx',
  ],
  // Bar chart: 3 ascending bars, rightmost red
  reporting: [
    '............',
    '.........rr.',
    '.........rr.',
    '.....mm..rr.',
    '.....mm..rr.',
    '.mm..mm..rr.',
    '.mm..mm..rr.',
    'xxxxxxxxxxxx',
  ],
  // Person: filled head circle + torso
  crm: [
    '....xxxx....',
    '...xmmmmx...',
    '...xmmmmx...',
    '....xxxx....',
    '..xxxxxxxx..',
    '.xmmmmmmmmx.',
    '.xxxxxxxxxx.',
  ],
  // Smartphone: screen with centered red message
  whatsapp: [
    '..xxxxxxxx..',
    '..xmmmmmmx..',
    '..xmrrrrmx..',
    '..xmrrrrmx..',
    '..xmmmmmmx..',
    '..xmmmmmmx..',
    '..xmmmmmmx..',
    '..xxxxxxxx..',
  ],
  // Folder: tab at top-left + open body
  docs: [
    '.xxxx.......',
    'xxxxxxxxxxxx',
    'xmmmmmmmmmmx',
    'xmmmmmmmmmmx',
    'xmmmmmmmmmmx',
    'xmmmmmmmmmmx',
    'xxxxxxxxxxxx',
  ],
  // Magnifying glass: circle lens + diagonal handle
  hiring: [
    '..xxxxxx....',
    '.xmmmmmmx...',
    'xmmm..mmmx..',
    'xmm....mmx..',
    'xmmm..mmmx..',
    '.xmmmmmmx...',
    '..xxxxxxxx..',
    '.........xx.',
    '..........xx',
  ],
  // EKG pulse: dark baseline + red triangular spike
  ops: [
    '............',
    '.......r....',
    '......r.r...',
    '.....r...r..',
    'xxxx.....xxx',
    '............',
    '............',
  ],
} as const

type AgentPixelId = keyof typeof AGENT_PIXEL_GRIDS

const AGENT_CARDS: Array<{
  code: string
  pixelId: AgentPixelId
  title: string
  desc: string
}> = [
  { code: 'A-01', pixelId: 'intake', title: 'Intake & routing agent', desc: 'Qualifies leads, routes conversations, and keeps CRM fields honest.' },
  { code: 'A-02', pixelId: 'workflow', title: 'Workflow mapper agent', desc: 'Turns how your team actually works into a clear automation brief.' },
  { code: 'A-03', pixelId: 'scheduler', title: 'Scheduler agent', desc: 'Handles reminders, no-shows, and calendar Tetris without the ping-pong.' },
  { code: 'A-04', pixelId: 'billing', title: 'Billing pulse agent', desc: 'Chases invoices, flags overdue accounts, and surfaces cash-flow risks.' },
  { code: 'A-05', pixelId: 'support', title: 'Support desk agent', desc: 'Answers FAQs, drafts replies, and escalates only when a human should.' },
  { code: 'A-06', pixelId: 'inventory', title: 'Inventory signal agent', desc: 'Watches stock levels and reorder thresholds so you never wing it.' },
  { code: 'A-07', pixelId: 'reporting', title: 'Reporting agent', desc: 'Pulls spreadsheets and tools into live dashboards your team will open.' },
  { code: 'A-08', pixelId: 'crm', title: 'CRM hygiene agent', desc: 'Dedupes messy contacts and nudges stalled deals before they go cold.' },
  { code: 'A-09', pixelId: 'whatsapp', title: 'WhatsApp concierge agent', desc: 'Runs broadcasts, two-way flows, and fast replies where your customers already are.' },
  { code: 'A-10', pixelId: 'docs', title: 'Docs & contracts agent', desc: 'Summaries, version trails, and gentle nudges until signatures land.' },
  { code: 'A-11', pixelId: 'hiring', title: 'Hiring screen agent', desc: 'Scores applicants against your rubric so interviews start with the shortlist.' },
  { code: 'A-12', pixelId: 'ops', title: 'Ops pulse agent', desc: 'Monitors KPI drift and pings owners when the business slips off track.' },
]

function AgentsSection() {
  return (
    <section id="agents" className="anchor-scroll" style={{ padding: '120px 0', borderBottom: '1px solid var(--rule)', background: 'rgba(20,20,19,0.02)' }}>
      <div className="mx-auto site-rail">
        <SectionHeader number="06" eyebrow="EEVOLVV / AGENTS" title="Agents we build to optimize how you operate." note="12 DEPLOYABLE" />
        {/* volvv-e hero intro */}
        <div className="agents-volvve-intro" style={{ display: 'flex', alignItems: 'center', gap: 48, marginTop: 56, marginBottom: 0, padding: '40px 48px', background: 'var(--ink)', color: 'var(--paper)', borderLeft: '4px solid var(--accent)' }}>
          <VolvvE state="idle" scale={7} style={{ flexShrink: 0 }} />
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 10 }}>MEET VOLVV-E</div>
            <h3 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 14px', color: 'var(--paper)' }}>
              The agent that ties<br />them all together.
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.7, maxWidth: 540, margin: 0, color: 'var(--paper)' }}>
              volvv-e is eevolvv's AI operations character — deployed inside your business to orchestrate the agents below, watch for drift, and surface what your team shouldn't have to chase. Every eevolvv client gets one.
            </p>
          </div>
        </div>

        <p style={{ fontSize: 16, lineHeight: 1.55, opacity: 0.7, maxWidth: 720, marginTop: 40 }}>
          These are the kinds of AI agents eevolvv can ship for your business — narrow, reliable automations that tighten ops, protect revenue, and free your team for judgment work. Pick what fits; we scope and integrate each one to your stack.
        </p>
        <div className="agents-grid mt-12" style={{ marginTop: 48 }}>
          {AGENT_CARDS.map(agent => (
            <div key={agent.code} className="agent-card-cell">
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '16px 18px' }}>
                <AgentPixelIcon rows={AGENT_PIXEL_GRIDS[agent.pixelId]} />
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
    <section id="diagnostic" className="anchor-scroll" style={{ padding: '120px 0', borderBottom: '1px solid var(--rule)', position: 'relative', overflow: 'hidden' }}>
      <div className="absolute inset-0 blueprint-grid" style={{ opacity: 0.4, pointerEvents: 'none' }} />

      {/* Ghost watermark */}
      <div className="mono" style={{
        position: 'absolute', right: -16, top: '50%', transform: 'translateY(-50%)',
        fontSize: 'clamp(180px, 26vw, 360px)', fontWeight: 700,
        color: 'var(--ink)', opacity: 0.022, lineHeight: 1,
        pointerEvents: 'none', userSelect: 'none', zIndex: 0,
      }}>01</div>

      <div className="mx-auto site-rail" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader number="01" eyebrow="FREE AI AUDIT" title="Get your eevolvv report. Free." note="" />

        <div style={{ marginTop: 12, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div className="diagnostic-value-badge mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 700 }}>
            ★&nbsp;&nbsp;VALUED ~$3K — YOURS FREE
          </div>
          <span style={{ fontSize: 15, opacity: 0.65 }}>10 minutes. No signup required.</span>
        </div>

        {/* What's in your report */}
        <div style={{ border: '1px solid var(--ink)', marginBottom: 32 }}>
          <div className="mono" style={{ padding: '14px 24px', borderBottom: '1px solid var(--ink)', fontSize: 9, letterSpacing: '0.28em', fontWeight: 700, background: 'var(--ink)', color: 'var(--paper)' }}>
            WHAT&apos;S IN YOUR REPORT
          </div>
          <div className="what-in-report-grid">
            {([
              { num: '01', icon: '◈', label: 'GHOST WORK AUDIT', desc: 'Every bottleneck mapped. Hours wasted per week calculated.' },
              { num: '02', icon: '◎', label: 'ROI PROJECTION', desc: 'Exact annual savings for your specific operation.' },
              { num: '03', icon: '▷', label: '90-DAY ROADMAP', desc: 'First 3 automations ranked by impact. Ready to build.' },
            ] as const).map((card, i) => (
              <div
                key={i}
                className="anim-fade-up"
                style={{
                  padding: '24px 20px',
                  borderRight: i < 2 ? '1px solid var(--ink)' : 'none',
                  background: i === 1 ? 'rgba(20,20,19,0.03)' : 'var(--paper)',
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <span className="mono" style={{ fontSize: 20, color: 'var(--accent)', lineHeight: 1 }}>{card.icon}</span>
                  <span className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', opacity: 0.35 }}>{card.num}</span>
                </div>
                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', opacity: 0.55, marginBottom: 8 }}>{card.label}</div>
                <div style={{ fontSize: 13, opacity: 0.65, lineHeight: 1.55 }}>{card.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat container */}
        <div style={{ border: '1px solid var(--ink)', overflow: 'hidden' }}>
          <ChatEngine defaultTier={targetTier} />
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
      className="horizon-dot-map-svg"
      viewBox={`0 0 ${(COLS - 1) * STEP + 2} ${(ROWS - 1) * STEP + 2}`}
      style={{ width: '100%', maxWidth: 430, display: 'block', margin: '0 auto' }}
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
    <section
      className="horizon-section relative z-[1]"
      style={{ background: 'transparent', color: 'var(--paper)', padding: '80px 0 72px', overflow: 'hidden' }}
    >
      <div className="mx-auto site-rail">
        <div style={{ marginBottom: 48 }}>
          <span
            className="mono horizon-frost-inline horizon-frost-inline--tight"
            style={{ fontSize: 9, letterSpacing: '0.28em', color: 'var(--accent)' }}
          >
            LONG HORIZON · EEVOLVV GLOBAL · EST. 2026
          </span>
        </div>

        <div className="horizon-grid">
          {/* Dot world map — frosted panel */}
          <div className="horizon-frost-panel horizon-frost-panel--graphic">
            <WorldDotMap />
            <div style={{ marginTop: 10, textAlign: 'center' }}>
              <span className="mono horizon-frost-inline horizon-frost-inline--tight" style={{ fontSize: 9, letterSpacing: '0.18em', opacity: 0.72 }}>
                SIGNAL STRENGTH: GROWING · MARKET: EARTH
              </span>
            </div>
          </div>

          {/* Copy + stats */}
          <div>
            <h2
              style={{
                fontSize: 'clamp(26px, 3.8vw, 50px)',
                fontWeight: 500,
                letterSpacing: '-0.025em',
                lineHeight: 1.12,
                margin: '0 0 28px',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)',
              }}
            >
              <span className="horizon-frost-inline">Every business on earth deserves this.</span>
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.65, opacity: 0.72, margin: '0 0 40px', maxWidth: 400, textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
              <span className="horizon-frost-inline horizon-frost-inline--body">
                We&apos;re starting in the US. The model works everywhere humans run businesses — which is everywhere. The horizon is global.
                We&apos;re just warming up.
              </span>
            </p>

            <div className="horizon-stats-grid">
              {stats.map(({ n, label }) => (
                <div key={n} className="horizon-stat-chip">
                  <div style={{ fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--accent)', lineHeight: 1 }}>{n}</div>
                  <div className="mono" style={{ fontSize: 9, letterSpacing: '0.16em', opacity: 0.62, marginTop: 8, textTransform: 'uppercase' }}>
                    {label}
                  </div>
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
  const cols: [string, [string, string][]][] = [
    ['NAVIGATE', [['Process','#how'],['Industries','#who'],['Pricing','#pricing']]],
    ['ENGAGE',   [['AI agents','#agents'],['Free Audit','#diagnostic']]],
    ['LEGAL',    [['Privacy','/privacy'],['Terms','/terms'],['Contact','mailto:hello@eevolvv.com']]],
  ]
  return (
    <footer className="site-footer">
      <div className="mx-auto site-rail">
        <div className="grid site-footer-grid" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 48 }}>
          <div>
            <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
              <BrandLogoFigures size="sm" />
              <span className="brand-wordmark site-footer-wordmark">eevolvv</span>
            </div>
            <p className="site-footer-desc" style={{ fontSize: 13, lineHeight: 1.55, margin: 0, maxWidth: 320 }}>
              AI-native business transformation. Every business. Every size. Every industry.
            </p>
            <p className="mono site-footer-domain" style={{ fontSize: 10, letterSpacing: '0.22em', marginTop: 12 }}>
              eevolvv.com
            </p>
          </div>
          {cols.map(([title, links]) => (
            <div key={title}>
              <div className="mono site-footer-col-title" style={{ fontSize: 10, letterSpacing: '0.22em', marginBottom: 16 }}>
                {title}
              </div>
              {links.map(([l, h]) => (
                <a key={l} href={h} className="link-rule site-footer-link" style={{ display: 'block', fontSize: 14, marginBottom: 10, textDecoration: 'none' }}>
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div
          className="mono site-footer-bottom flex items-center justify-between"
          style={{ marginTop: 56, paddingTop: 24, borderTop: '1px solid rgba(255, 255, 255, 0.12)', fontSize: 10, letterSpacing: '0.22em' }}
        >
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
      <DiagnosticSection targetTier={targetTier} />
      <Problem />
      <Process />
      <WhoItsFor />
      <Pricing onCTA={tier => scrollToDiagnostic(tier)} />
      <AgentsSection />
      <Footer />
    </main>
  )
}
