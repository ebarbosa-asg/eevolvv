'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────
interface FormData {
  name: string
  email: string
  businessName: string
  businessType: string
  industry: string
  revenue: string
  teamSize: string
  topPains: string
  tools: string
  customerJourney: string
  errorPoints: string
  hoursFreed: string
  tier: string
}

// ─── Constants ────────────────────────────────────────────────────────────────
const TIERS = [
  {
    id: 'seed',
    name: 'Seed',
    emoji: '🟢',
    label: 'AI Starter',
    price: '$500–$1,500',
    who: 'Gyms, restaurants, solo operators',
    tagline: 'Your first step into AI automation',
    features: ['AI-powered business diagnostic', 'Custom automation roadmap', 'Top 3 quick-win automations', '30-min strategy call', 'DIY implementation guide'],
    highlight: false,
  },
  {
    id: 'grow',
    name: 'Grow',
    emoji: '🔵',
    label: 'AI Essentials',
    price: '$3,500–$7,500',
    who: 'Small business $500K–$5M revenue',
    tagline: 'Core automations, real ROI',
    features: ['Full business diagnostic', 'Priority workflow automation', 'Tool integration setup', '3 core AI agents deployed', '60-day ROI guarantee'],
    highlight: false,
  },
  {
    id: 'scale',
    name: 'Scale',
    emoji: '🟣',
    label: 'AI Transformation',
    price: '$15,000–$75,000',
    who: 'SMB to mid-market',
    tagline: 'Full operational rebuild',
    features: ['Complete CORE framework', 'All workflows automated', 'Custom AI agent stack', 'Team training included', 'Dedicated build team', '60-day ROI guarantee'],
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    emoji: '⚫',
    label: 'AI Operations',
    price: '$50,000–$250,000+',
    who: 'Multi-location, $10M+',
    tagline: 'Total organizational evolution',
    features: ['Dedicated pod assigned', 'Department-by-department rebuild', 'Custom platform integrations', 'Executive reporting layer', 'Ongoing governance', 'Priority SLA'],
    highlight: false,
  },
]

const STATS = [
  { value: 23, suffix: 'hrs', label: 'wasted per week on automatable tasks (avg)' },
  { value: 270, suffix: '%', label: 'faster growth for AI-optimized businesses' },
  { value: 80, suffix: '%', label: 'of manual workflows are automatable today' },
]

const PROCESS_STEPS = [
  { day: 'Day 1', title: 'Intake', desc: 'You tell us how your business runs. 10 minutes, all questions.' },
  { day: 'Day 7', title: 'Your Report', desc: 'AI-generated Evolution Report delivered. Every automation opportunity mapped.' },
  { day: 'Day 14', title: 'First Win', desc: 'First automation goes live. You feel the difference immediately.' },
  { day: 'Day 45', title: 'Transformed', desc: 'Full build complete. Your business runs differently.' },
  { day: 'Day 60', title: 'ROI Positive', desc: 'Guaranteed. Or we work free until you are.' },
]

const INDUSTRIES = [
  'Restaurant / Food & Beverage', 'Gym / Fitness / Wellness', 'Retail / E-commerce',
  'Legal / Law Firm', 'Medical / Healthcare', 'Real Estate',
  'Construction / Trades', 'Accounting / Finance', 'Marketing / Agency',
  'Manufacturing', 'Logistics / Supply Chain', 'Technology / SaaS',
  'Hospitality / Hotel', 'Education', 'Non-Profit', 'Other',
]

// ─── Utility: Intersection Observer Hook ─────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView()

  useEffect(() => {
    if (!inView) return
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <div ref={ref} className="counter-num text-5xl md:text-7xl font-display font-800 text-signal glow-text">
      {count}{suffix}
    </div>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ onCTA }: { onCTA: () => void }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-void/90 backdrop-blur-lg border-b border-white/5' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-signal rounded-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)' }} />
          <span className="font-display font-700 text-pure tracking-tight text-lg">THE EVOLUTION</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-mist font-mono">
          <a href="#how-it-works" className="hover:text-signal transition-colors">Process</a>
          <a href="#pricing" className="hover:text-signal transition-colors">Tiers</a>
          <a href="#diagnostic" className="hover:text-signal transition-colors">Get Report</a>
        </div>
        <button onClick={onCTA} className="btn-primary px-5 py-2.5 rounded-sm text-sm font-700 tracking-wide">
          Evolve Now →
        </button>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onCTA }: { onCTA: () => void }) {
  const [typed, setTyped] = useState('')
  const phrases = ['gym.', 'restaurant.', 'law firm.', 'startup.', 'enterprise.', 'business.']
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[phraseIndex]
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIndex < current.length) {
          setTyped(current.slice(0, charIndex + 1))
          setCharIndex(c => c + 1)
        } else {
          setTimeout(() => setDeleting(true), 1800)
        }
      } else {
        if (charIndex > 0) {
          setTyped(current.slice(0, charIndex - 1))
          setCharIndex(c => c - 1)
        } else {
          setDeleting(false)
          setPhraseIndex(i => (i + 1) % phrases.length)
        }
      }
    }, deleting ? 60 : 100)
    return () => clearTimeout(timeout)
  }, [charIndex, deleting, phraseIndex, phrases])

  return (
    <section className="relative min-h-screen grid-bg scan-container flex items-center justify-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-signal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-electric/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-signal/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-signal/3 rounded-full" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto pt-24">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 mb-8 tag bg-signal/10 text-signal border border-signal/20">
          <span className="w-1.5 h-1.5 bg-signal rounded-full animate-pulse" />
          AI BUSINESS TRANSFORMATION
        </div>

        {/* Headline */}
        <h1 className="font-display font-800 leading-[0.92] tracking-tight mb-8">
          <div className="text-5xl md:text-8xl lg:text-[7rem] text-pure">
            We evolve every
          </div>
          <div className="text-5xl md:text-8xl lg:text-[7rem] text-signal glow-text">
            <span className="cursor-blink">{typed || '\u00A0'}</span>
          </div>
        </h1>

        {/* Sub */}
        <p className="text-mist text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-body">
          From the corner gym to the Fortune 500 — we map your workflows, 
          deploy AI automation, and permanently rebuild how your business operates.
          <br />
          <span className="text-ghost">No software to learn. No consultants with decks. Just results.</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onCTA}
            className="btn-primary px-10 py-4 rounded-sm text-base font-700 tracking-wide w-full sm:w-auto"
          >
            Get Your Free AI Audit →
          </button>
          <a
            href="#how-it-works"
            className="px-10 py-4 border border-white/10 text-ghost hover:border-signal/30 hover:text-signal transition-all rounded-sm text-base font-600 tracking-wide w-full sm:w-auto text-center"
          >
            See How It Works
          </a>
        </div>

        {/* Trust line */}
        <p className="mt-8 text-mist/60 font-mono text-xs tracking-widest uppercase">
          60-Day ROI Guarantee &nbsp;·&nbsp; Any Industry &nbsp;·&nbsp; Any Size
        </p>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="font-mono text-xs text-mist tracking-widest">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-mist to-transparent" />
        </div>
      </div>
    </section>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  return (
    <section className="py-24 border-y border-white/5 bg-carbon">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="mt-3 text-mist text-sm leading-relaxed max-w-xs mx-auto">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Problem ─────────────────────────────────────────────────────────────────
function Problem() {
  const { ref, inView } = useInView()

  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="tag bg-pulse/10 text-pulse border border-pulse/20 mb-6 inline-block">THE PROBLEM</span>
            <h2 className={`font-display font-800 text-4xl md:text-6xl leading-tight text-pure mb-8 fade-up ${inView ? 'visible' : ''}`}>
              Your team is doing work<br />
              <span className="text-pulse glow-pulse-text">AI should be doing.</span>
            </h2>
            <div className="space-y-5">
              {[
                'Manual data entry eating hours every week',
                'Customer follow-ups falling through the cracks',
                'Reports built by hand that should auto-generate',
                'Scheduling chaos that tools can solve in seconds',
                'Knowledge trapped in people\'s heads, not systems',
              ].map((pain, i) => (
                <div key={i} className={`flex items-start gap-3 fade-up delay-${(i + 1) * 100} ${inView ? 'visible' : ''}`}>
                  <span className="text-pulse mt-1 text-lg leading-none">×</span>
                  <span className="text-ghost">{pain}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`fade-up delay-300 ${inView ? 'visible' : ''}`}>
            <div className="bg-graphite border border-white/8 rounded-sm p-8 font-mono text-sm space-y-3">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-signal rounded-full" />
                <span className="text-mist/50 text-xs ml-2">business_audit.log</span>
              </div>
              <div className="text-mist/50">→ scanning workflows...</div>
              <div className="text-ghost">→ manual invoicing detected <span className="text-pulse">[6hrs/week]</span></div>
              <div className="text-ghost">→ customer follow-up gaps <span className="text-pulse">[12 missed/mo]</span></div>
              <div className="text-ghost">→ manual reporting found <span className="text-pulse">[$3,200/mo labor]</span></div>
              <div className="text-ghost">→ scheduling inefficiency <span className="text-pulse">[8hrs/week]</span></div>
              <div className="text-ghost">→ no CRM automation <span className="text-pulse">[30% lead loss]</span></div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <span className="text-mist/50">→ total recoverable value: </span>
                <span className="text-signal font-600 text-base">$87,400/yr</span>
              </div>
              <div className="text-signal/70">→ evolution readiness: CRITICAL ▓▓▓▓▓▓▓▓░░ 80%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const { ref, inView } = useInView()

  return (
    <section id="how-it-works" className="py-32 px-6 bg-carbon border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20" ref={ref}>
          <span className="tag bg-signal/10 text-signal border border-signal/20 mb-6 inline-block">THE PROCESS</span>
          <h2 className={`font-display font-800 text-4xl md:text-6xl text-pure fade-up ${inView ? 'visible' : ''}`}>
            From intake to transformed<br />
            <span className="text-signal">in 60 days.</span>
          </h2>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-signal/30 via-signal/10 to-transparent" />

          <div className="space-y-12">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className={`flex-1 ${i % 2 === 1 ? 'md:text-right' : ''}`}>
                  <div className={`fade-up delay-${(i + 1) * 100} ${inView ? 'visible' : ''} bg-graphite border border-white/8 rounded-sm p-6 card-hover`}>
                    <span className="font-mono text-xs text-signal tracking-widest">{step.day}</span>
                    <h3 className="font-display font-700 text-2xl text-pure mt-1 mb-2">{step.title}</h3>
                    <p className="text-mist text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
                <div className="hidden md:flex w-10 h-10 bg-void border-2 border-signal rounded-full items-center justify-center z-10 flex-shrink-0">
                  <div className="w-3 h-3 bg-signal rounded-full" />
                </div>
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Who It's For ─────────────────────────────────────────────────────────────
function WhoItsFor() {
  const { ref, inView } = useInView()
  const examples = [
    { icon: '🏋️', type: 'Gym / Fitness', pain: 'Manual scheduling, member follow-ups, lost leads', win: 'Auto-booking, retention AI, revenue recovery' },
    { icon: '🍽️', type: 'Restaurant', pain: 'Order errors, no-shows, manual inventory', win: 'Automated ops, smart reservations, waste reduction' },
    { icon: '⚖️', type: 'Law Firm', pain: 'Admin overload, client intake, billing gaps', win: 'AI intake, automated billing, case tracking' },
    { icon: '🏗️', type: 'Construction', pain: 'Scheduling chaos, quote delays, supplier chaos', win: 'Project AI, instant quotes, supplier automation' },
    { icon: '🏥', type: 'Medical Practice', pain: 'Patient admin, billing errors, no-show rate', win: 'AI scheduling, billing automation, reminders' },
    { icon: '🏢', type: 'Enterprise', pain: 'Siloed teams, manual reporting, process debt', win: 'Full ops rebuild, AI layer, unified intelligence' },
  ]

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16" ref={ref}>
          <span className="tag bg-signal/10 text-signal border border-signal/20 mb-6 inline-block">WHO WE EVOLVE</span>
          <h2 className={`font-display font-800 text-4xl md:text-6xl text-pure fade-up ${inView ? 'visible' : ''}`}>
            Any business.<br /><span className="text-signal">Every industry.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {examples.map((ex, i) => (
            <div key={i} className={`bg-graphite border border-white/8 rounded-sm p-6 card-hover fade-up delay-${(i + 1) * 100} ${inView ? 'visible' : ''}`}>
              <div className="text-3xl mb-4">{ex.icon}</div>
              <h3 className="font-display font-700 text-xl text-pure mb-3">{ex.type}</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-pulse text-sm mt-0.5 flex-shrink-0">×</span>
                  <span className="text-mist text-sm">{ex.pain}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-signal text-sm mt-0.5 flex-shrink-0">→</span>
                  <span className="text-ghost text-sm">{ex.win}</span>
                </div>
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
  const { ref, inView } = useInView()

  return (
    <section id="pricing" className="py-32 px-6 bg-carbon border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16" ref={ref}>
          <span className="tag bg-signal/10 text-signal border border-signal/20 mb-6 inline-block">PRICING</span>
          <h2 className={`font-display font-800 text-4xl md:text-6xl text-pure fade-up ${inView ? 'visible' : ''}`}>
            Every business has<br /><span className="text-signal">a starting point.</span>
          </h2>
          <p className="text-mist mt-4 max-w-xl mx-auto">All tiers include the Evolution Report. ROI guaranteed at 60 days post-deployment.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {TIERS.map((tier, i) => (
            <div
              key={tier.id}
              className={`relative rounded-sm p-7 flex flex-col card-hover fade-up delay-${(i + 1) * 100} ${inView ? 'visible' : ''}
                ${tier.highlight
                  ? 'bg-signal/5 border-2 border-signal glow-signal'
                  : 'bg-graphite border border-white/8'
                }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="tag bg-signal text-void">MOST POPULAR</span>
                </div>
              )}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{tier.emoji}</span>
                  <span className="font-mono text-xs text-mist tracking-widest uppercase">{tier.name}</span>
                </div>
                <h3 className="font-display font-800 text-2xl text-pure">{tier.label}</h3>
                <p className="text-mist text-xs mt-1">{tier.who}</p>
              </div>
              <div className="mb-6">
                <div className={`font-display font-800 text-3xl ${tier.highlight ? 'text-signal' : 'text-pure'}`}>{tier.price}</div>
                <p className="text-mist/60 text-xs mt-1">{tier.tagline}</p>
              </div>
              <ul className="space-y-2.5 flex-1 mb-7">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <span className="text-signal mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-ghost">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onCTA(tier.id)}
                className={`w-full py-3 rounded-sm font-700 text-sm tracking-wide transition-all
                  ${tier.highlight
                    ? 'btn-primary'
                    : 'border border-white/15 text-ghost hover:border-signal/40 hover:text-signal'
                  }`}
              >
                Start with {tier.name} →
              </button>
            </div>
          ))}
        </div>

        {/* Retainer add-on */}
        <div className="mt-8 bg-graphite border border-white/8 rounded-sm p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-signal rounded-full animate-pulse" />
              <span className="font-mono text-xs text-signal tracking-widest">EVOLVE RETAINER</span>
            </div>
            <h3 className="font-display font-700 text-xl text-pure">Keep evolving every month.</h3>
            <p className="text-mist text-sm mt-1">New automations built as your business grows. AI improves — so do you.</p>
          </div>
          <div className="flex items-center gap-8 flex-shrink-0">
            <div className="text-center">
              <div className="font-display font-800 text-2xl text-signal">$500–$25K</div>
              <div className="font-mono text-xs text-mist">/month</div>
            </div>
            <button onClick={() => onCTA('retainer')} className="btn-primary px-6 py-3 rounded-sm text-sm font-700 tracking-wide whitespace-nowrap">
              Add Retainer →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Loading Narrative ────────────────────────────────────────────────────────
const LOADING_NARRATIVE = [
  { label: 'SCANNING', message: 'Reading your business intake...', detail: 'Parsing operational data across all inputs' },
  { label: 'MAPPING', message: 'Mapping your workflow architecture...', detail: 'Identifying process gaps and dependencies' },
  { label: 'ANALYZING', message: 'Calculating automation opportunities...', detail: 'Running ROI models against your revenue range' },
  { label: 'BUILDING', message: 'Generating your automation roadmap...', detail: 'Sequencing by impact-to-effort ratio' },
  { label: 'WRITING', message: 'Compiling your Evolution Report...', detail: 'Formatting recommendations for your team' },
]

function LoadingNarrative({ step: loadingStep, elapsed }: { step: number; elapsed: number }) {
  const progress = Math.min(((loadingStep + 1) / LOADING_NARRATIVE.length) * 100, 100)
  const filled = Math.round(progress / 5)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-graphite border border-signal/20 rounded-sm p-8 font-mono glow-signal">
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-8 pb-4 border-b border-white/5">
          <div className="w-3 h-3 bg-pulse rounded-full animate-pulse" />
          <div className="w-3 h-3 bg-yellow-500/70 rounded-full" />
          <div className="w-3 h-3 bg-signal rounded-full animate-pulse" />
          <span className="text-mist/50 text-xs ml-3 tracking-widest">diagnostic_engine.run</span>
          <span className="ml-auto text-signal text-xs tracking-widest">{elapsed}s</span>
        </div>

        {/* Current phase */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-signal text-xs tracking-[0.2em] font-700">
              [{LOADING_NARRATIVE[loadingStep].label}]
            </span>
            <div className="w-1.5 h-1.5 bg-signal rounded-full animate-pulse" />
          </div>
          <p className="text-pure text-base mb-1">{LOADING_NARRATIVE[loadingStep].message}</p>
          <p className="text-mist text-xs">{LOADING_NARRATIVE[loadingStep].detail}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-mist/60 mb-2">
            <span>PROGRESS</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-signal transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1 text-signal/50 text-xs tracking-widest overflow-hidden">
            {'▓'.repeat(filled)}{'░'.repeat(20 - filled)}
          </div>
        </div>

        {/* Step log */}
        <div className="space-y-1.5">
          {LOADING_NARRATIVE.map((s, i) => {
            const done = i < loadingStep
            const active = i === loadingStep
            return (
              <div key={i} className={`text-xs flex items-center gap-2 transition-all duration-300 ${
                done ? 'text-signal/70' : active ? 'text-ghost' : 'text-mist/30'
              }`}>
                <span>{done ? '✓' : active ? '▶' : '○'}</span>
                <span>{s.label.toLowerCase()} {done ? 'complete' : active ? 'in progress...' : 'queued'}</span>
              </div>
            )
          })}
        </div>

        <p className="mt-8 text-mist/40 text-xs text-center tracking-widest">
          AI is generating your custom report — typically takes 20–35 seconds
        </p>
      </div>
    </div>
  )
}

// ─── Diagnostic Form ──────────────────────────────────────────────────────────
function DiagnosticForm({ defaultTier }: { defaultTier: string }) {
  const [form, setForm] = useState<FormData>({
    name: '', email: '', businessName: '', businessType: '',
    industry: '', revenue: '', teamSize: '', topPains: '',
    tools: '', customerJourney: '', errorPoints: '', hoursFreed: '',
    tier: defaultTier || 'grow',
  })
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [report, setReport] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const totalSteps = 4

  // Advance loading narrative phase every 5.5s while loading
  useEffect(() => {
    if (!loading) {
      setLoadingStep(0)
      setElapsed(0)
      return
    }
    const stepTimer = setInterval(() => {
      setLoadingStep(prev => Math.min(prev + 1, LOADING_NARRATIVE.length - 1))
    }, 5500)
    const elapsedTimer = setInterval(() => {
      setElapsed(prev => prev + 1)
    }, 1000)
    return () => {
      clearInterval(stepTimer)
      clearInterval(elapsedTimer)
    }
  }, [loading])

  const update = (field: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      let data: Record<string, unknown> = {}
      try {
        data = await res.json()
      } catch {
        throw new Error('The server returned an unexpected response. Please try again.')
      }

      if (res.status === 429) {
        throw new Error('You\'ve generated 3 reports this hour — your limit resets in 60 minutes. Check your email for your previous report.')
      }
      if (res.status === 400) {
        throw new Error((data.error as string) || 'Please check your inputs and try again.')
      }
      if (res.status === 502) {
        throw new Error('The AI engine timed out. This sometimes happens under load — please try again in 30 seconds.')
      }
      if (!res.ok) {
        throw new Error((data.error as string) || `Unexpected error (${res.status}). Please try again.`)
      }
      if (!data.success) {
        throw new Error((data.error as string) || 'Something went wrong generating your report. Please try again.')
      }

      setReport(data.report as string)
    } catch (err: unknown) {
      const message = err instanceof Error
        ? err.message
        : 'Connection failed. Check your internet connection and try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const formatReport = (text: string) => {
    return text
      .replace(/### (.*)/g, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.*)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[hup])/gm, '')
  }

  const inputClass = "w-full bg-graphite border border-white/8 rounded-sm px-4 py-3 text-sm text-pure placeholder-mist/40 focus:outline-none focus:border-signal/50 focus:shadow-[0_0_0_3px_rgba(0,255,148,0.08)] transition-all"
  const labelClass = "block text-xs font-mono text-mist tracking-widest uppercase mb-2"

  if (report) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-signal/10 border-2 border-signal rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-2xl">✓</span>
          </div>
          <h3 className="font-display font-800 text-3xl text-pure mb-2">Your Evolution Report</h3>
          <p className="text-mist text-sm">AI-generated diagnostic for {form.businessName || form.businessType}</p>
        </div>
        <div className="bg-graphite border border-signal/20 rounded-sm p-8 report-content">
          <div dangerouslySetInnerHTML={{ __html: formatReport(report) }} />
        </div>
        <div className="mt-8 bg-graphite border border-white/8 rounded-sm p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display font-700 text-pure">Ready to make this real?</p>
            <p className="text-mist text-sm">Book your 30-min strategy call and let's build the roadmap together.</p>
          </div>
          <a
            href="mailto:hello@theevolution.ai?subject=Evolution%20Strategy%20Call%20Request&body=I%20just%20received%20my%20Evolution%20Report%20and%20would%20like%20to%20book%20a%20strategy%20call."
            className="btn-primary px-6 py-3 rounded-sm text-sm font-700 tracking-wide whitespace-nowrap"
          >
            Book Strategy Call →
          </a>
        </div>
      </div>
    )
  }

  if (loading) {
    return <LoadingNarrative step={loadingStep} elapsed={elapsed} />
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/10">
            <div
              className="h-full bg-signal transition-all duration-500"
              style={{ width: i <= step ? '100%' : '0%' }}
            />
          </div>
        ))}
        <span className="font-mono text-xs text-mist ml-2">{step + 1}/{totalSteps}</span>
      </div>

      {/* Step 0: Contact */}
      {step === 0 && (
        <div className="space-y-5">
          <div>
            <h3 className="font-display font-700 text-2xl text-pure mb-1">Who are we evolving?</h3>
            <p className="text-mist text-sm">Your report will be delivered to your email within minutes.</p>
          </div>
          <div>
            <label className={labelClass}>Your Name</label>
            <input className={inputClass} placeholder="Eduardo Barbosa" value={form.name} onChange={e => update('name', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <input className={inputClass} type="email" placeholder="you@business.com" value={form.email} onChange={e => update('email', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Business Name</label>
            <input className={inputClass} placeholder="Your Business Name" value={form.businessName} onChange={e => update('businessName', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Evolution Tier</label>
            <select className={inputClass} value={form.tier} onChange={e => update('tier', e.target.value)}>
              {TIERS.map(t => <option key={t.id} value={t.id}>{t.name} — {t.label} ({t.price})</option>)}
              <option value="retainer">Evolve Retainer</option>
            </select>
          </div>
          <button
            onClick={() => form.name && form.email ? setStep(1) : null}
            disabled={!form.name || !form.email}
            className="btn-primary w-full py-4 rounded-sm font-700 tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step 1: Business info */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h3 className="font-display font-700 text-2xl text-pure mb-1">Tell us about your business.</h3>
            <p className="text-mist text-sm">The more specific, the more precise your report.</p>
          </div>
          <div>
            <label className={labelClass}>Business Type</label>
            <input className={inputClass} placeholder="e.g. CrossFit gym, family restaurant, law firm..." value={form.businessType} onChange={e => update('businessType', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Industry</label>
            <select className={inputClass} value={form.industry} onChange={e => update('industry', e.target.value)}>
              <option value="">Select industry...</option>
              {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Annual Revenue</label>
              <select className={inputClass} value={form.revenue} onChange={e => update('revenue', e.target.value)}>
                <option value="">Select range</option>
                {['Under $100K', '$100K–$500K', '$500K–$1M', '$1M–$5M', '$5M–$20M', '$20M–$100M', '$100M+'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Team Size</label>
              <select className={inputClass} value={form.teamSize} onChange={e => update('teamSize', e.target.value)}>
                <option value="">Select size</option>
                {['Solo (just me)', '2–5', '6–15', '16–50', '51–200', '200+'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="border border-white/10 text-mist px-5 py-3 rounded-sm hover:border-white/20 transition-colors text-sm">← Back</button>
            <button
              onClick={() => form.businessType && form.industry ? setStep(2) : null}
              disabled={!form.businessType || !form.industry}
              className="btn-primary flex-1 py-3 rounded-sm font-700 tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Pain points */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h3 className="font-display font-700 text-2xl text-pure mb-1">Where's the pain?</h3>
            <p className="text-mist text-sm">Be specific — this is what we'll target first.</p>
          </div>
          <div>
            <label className={labelClass}>Top 3 time-consuming tasks per week</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="e.g. Manually entering customer data into spreadsheets takes 3hrs. Following up on unpaid invoices takes 2hrs. Creating weekly reports takes 4hrs..."
              value={form.topPains}
              onChange={e => update('topPains', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Tools & software you currently use</label>
            <input className={inputClass} placeholder="e.g. QuickBooks, Google Sheets, Slack, Salesforce, Square..." value={form.tools} onChange={e => update('tools', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Where do errors or delays most often happen?</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={2}
              placeholder="e.g. When handing off between sales and fulfillment, double bookings happen..."
              value={form.errorPoints}
              onChange={e => update('errorPoints', e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="border border-white/10 text-mist px-5 py-3 rounded-sm hover:border-white/20 transition-colors text-sm">← Back</button>
            <button
              onClick={() => form.topPains ? setStep(3) : null}
              disabled={!form.topPains}
              className="btn-primary flex-1 py-3 rounded-sm font-700 tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Vision + Submit */}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <h3 className="font-display font-700 text-2xl text-pure mb-1">Paint the picture.</h3>
            <p className="text-mist text-sm">Help us understand your customer flow and your vision.</p>
          </div>
          <div>
            <label className={labelClass}>Describe your customer journey (start to finish)</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="e.g. Customer finds us on Instagram → calls to book → we manually check availability → send confirmation email → they show up → we bill manually after..."
              value={form.customerJourney}
              onChange={e => update('customerJourney', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>If you had 20 extra hours per week, you would...</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={2}
              placeholder="e.g. Focus on getting 3 more enterprise clients, expand to a second location, build out the team..."
              value={form.hoursFreed}
              onChange={e => update('hoursFreed', e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-500/8 border border-red-500/25 rounded-sm p-4 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-pulse text-sm flex-shrink-0 mt-0.5">×</span>
                <p className="text-red-400 text-sm leading-relaxed">{error}</p>
              </div>
              <button
                onClick={() => { setError(null) }}
                className="text-xs font-mono text-mist/60 hover:text-signal transition-colors ml-4"
              >
                ↑ Try again
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="border border-white/10 text-mist px-5 py-3 rounded-sm hover:border-white/20 transition-colors text-sm">← Back</button>
            <button
              onClick={handleSubmit}
              disabled={loading || !form.customerJourney}
              className="btn-primary flex-1 py-4 rounded-sm font-700 tracking-wide disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  <span>AI is analyzing your business...</span>
                </>
              ) : (
                'Generate My Evolution Report →'
              )}
            </button>
          </div>
          <p className="text-mist/40 text-xs text-center font-mono">
            Your report is generated by AI in real-time. Takes ~30 seconds.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Diagnostic Section ───────────────────────────────────────────────────────
function DiagnosticSection({ targetTier }: { targetTier: string }) {
  return (
    <section id="diagnostic" className="py-32 px-6 grid-bg">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="tag bg-signal/10 text-signal border border-signal/20 mb-6 inline-block">FREE AI AUDIT</span>
          <h2 className="font-display font-800 text-4xl md:text-6xl text-pure mb-4">
            Get your Evolution Report.<br />
            <span className="text-signal">Right now. Free.</span>
          </h2>
          <p className="text-mist max-w-lg mx-auto">
            Answer 10 questions about your business. Our AI analyzes your workflows and delivers a custom automation roadmap — valued at $2,500, yours free.
          </p>
        </div>
        <div className="bg-carbon border border-white/8 rounded-sm p-8 md:p-12 border-gradient">
          <DiagnosticForm defaultTier={targetTier} />
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-white/5 bg-void">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 bg-signal rounded-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)' }} />
              <span className="font-display font-700 text-pure tracking-tight">THE EVOLUTION</span>
            </div>
            <p className="text-mist text-sm max-w-xs leading-relaxed">
              AI-native business transformation. Every business. Every size. Every industry.
            </p>
            <p className="text-mist/40 text-xs font-mono mt-4">theevolution.ai</p>
          </div>
          <div className="grid grid-cols-2 gap-x-16 gap-y-3 text-sm text-mist">
            <a href="#how-it-works" className="hover:text-signal transition-colors">Process</a>
            <a href="#diagnostic" className="hover:text-signal transition-colors">Free Audit</a>
            <a href="#pricing" className="hover:text-signal transition-colors">Pricing</a>
            <a href="mailto:hello@theevolution.ai" className="hover:text-signal transition-colors">Contact</a>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-xs text-mist/40 font-mono">
          <span>© {new Date().getFullYear()} The Evolution. All rights reserved.</span>
          <span>60-Day ROI Guarantee on all Transformation engagements.</span>
        </div>
      </div>
    </footer>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [targetTier, setTargetTier] = useState('grow')
  const diagnosticRef = useRef<HTMLElement | null>(null)

  const scrollToDiagnostic = (tier?: string) => {
    if (tier) setTargetTier(tier)
    const el = document.getElementById('diagnostic')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main>
      <Nav onCTA={() => scrollToDiagnostic()} />
      <Hero onCTA={() => scrollToDiagnostic()} />
      <Stats />
      <Problem />
      <HowItWorks />
      <WhoItsFor />
      <Pricing onCTA={(tier) => scrollToDiagnostic(tier)} />
      <DiagnosticSection targetTier={targetTier} />
      <Footer />
    </main>
  )
}
