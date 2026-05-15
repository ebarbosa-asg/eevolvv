'use client'

import { useState, useEffect } from 'react'
import { VolvvE } from '@/components/VolvvE'

// ─── Hero Rotating Phrases ────────────────────────────────────────────────────
const HERO_PHRASES = [
  'CORNER STORE', 'GYM', 'RESTAURANT', 'LAW FIRM',
  'STARTUP', 'ENTERPRISE', 'BODEGA', 'CLINIC', 'LOGISTICS',
  'REAL ESTATE', 'AGENCY', 'FRANCHISE', 'MANUFACTURER',
] as const

// ─── Flap Character Component ─────────────────────────────────────────────────
function FlapChar({ char, isWide }: { char: string; isWide: boolean }) {
  return (
    <span className="flap-cell" aria-hidden="true">
      <span className="flap-half top" style={{ transition: 'background 0.4s ease, border-color 0.4s ease' }}>
        <span><i data-wide={isWide ? '1' : '0'}>{char}</i></span>
      </span>
      <span className="flap-half bottom" style={{ transition: 'background 0.4s ease, border-color 0.4s ease' }}>
        <span><i data-wide={isWide ? '1' : '0'}>{char}</i></span>
      </span>
    </span>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Home() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [hasWebsite, setHasWebsite] = useState<boolean | null>(null)
  const [url, setUrl] = useState('')
  const [businessName, setBusinessName] = useState('')

  // Rotate hero phrase every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % HERO_PHRASES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const currentPhrase = HERO_PHRASES[phraseIndex]
  const isWideChar = (c: string) => ['M', 'W'].includes(c)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (hasWebsite && url) {
      // Redirect to diagnostic with URL
      window.location.href = `/#diagnostic?url=${encodeURIComponent(url)}`
    } else if (!hasWebsite && businessName) {
      // Redirect to no-website flow
      window.location.href = `/#diagnostic?business=${encodeURIComponent(businessName)}`
    }
  }

  return (
    <main className="bg-paper text-ink selection:bg-ink selection:text-paper font-sans">
      
      {/* ── HERO WITH SPLIT-FLAP ── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-24 pb-16 relative overflow-hidden">
        
        {/* Background grid */}
        <div className="absolute inset-0 blueprint-grid opacity-[0.03]" />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          
          {/* Tagline */}
          <div className="mono text-[10px] text-accent tracking-[0.5em] font-bold mb-8 uppercase">
            Autonomous Infrastructure · 2026
          </div>

          {/* Hero Copy */}
          <div className="mb-6">
            <span className="serif text-5xl md:text-7xl font-normal tracking-tight" style={{ transform: 'skewX(-3deg)', display: 'inline-block' }}>
              We evolve every
            </span>
          </div>

          {/* Split-Flap Display */}
          <div className="mb-8">
            <span className="flap-stage hero-flap-stage" style={{ color: 'var(--paper)' }}>
              {currentPhrase.split('').map((char, i) => (
                <FlapChar key={i} char={char} isWide={isWideChar(char)} />
              ))}
            </span>
          </div>

          {/* Subtitle */}
          <h1 className="text-3xl md:text-4xl font-normal mb-16 text-ink/70 serif italic">
            into the new era.
          </h1>

          {/* Dual-Path CTA */}
          <div className="flex flex-col gap-4 items-center max-w-md mx-auto">
            <button
              onClick={() => setHasWebsite(true)}
              className="w-full bg-ink text-paper px-8 py-4 mono text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-accent transition-all"
            >
              I Have a Website →
            </button>
            <button
              onClick={() => setHasWebsite(false)}
              className="w-full bg-transparent border border-ink/20 text-ink px-8 py-4 mono text-[11px] font-bold tracking-[0.3em] uppercase hover:border-ink transition-all"
            >
              I Don't Have a Website Yet
            </button>
          </div>

          {/* Conditional Form */}
          {hasWebsite !== null && (
            <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto animate-[fadeIn_0.5s_ease]">
              {hasWebsite ? (
                <input
                  type="url"
                  placeholder="ENTER YOUR WEBSITE URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-ink/20 py-4 px-2 mono text-xs tracking-widest focus:border-accent transition-colors outline-none text-center uppercase"
                  required
                />
              ) : (
                <input
                  type="text"
                  placeholder="ENTER YOUR BUSINESS NAME..."
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-ink/20 py-4 px-2 mono text-xs tracking-widest focus:border-accent transition-colors outline-none text-center uppercase"
                  required
                />
              )}
              <button
                type="submit"
                className="mt-6 w-full btn-gradient px-8 py-4 mono text-[10px] font-bold tracking-[0.4em] uppercase"
              >
                GET FREE REPORT →
              </button>
            </form>
          )}

        </div>
      </section>

      {/* ── CAPABILITIES: VISUAL SHOWCASE ── */}
      <section className="py-32 px-6 border-t border-rule bg-white/30">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="mb-20 text-center">
            <div className="mono text-[10px] text-accent tracking-[0.3em] font-bold mb-4 uppercase">
              § 01 · The Operating System
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Three engines. One interface.
            </h2>
          </div>

          {/* Visual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule">
            
            {/* 01: Website Building */}
            <div className="bg-paper p-12 flex flex-col items-center text-center">
              <svg width="120" height="120" viewBox="0 0 120 120" className="mb-6">
                <rect x="10" y="20" width="100" height="80" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="10" y1="35" x2="110" y2="35" stroke="currentColor" strokeWidth="2" />
                <circle cx="20" cy="27.5" r="3" fill="var(--accent)" />
                <circle cx="30" cy="27.5" r="3" fill="var(--accent)" />
                <circle cx="40" cy="27.5" r="3" fill="var(--accent)" />
                <rect x="25" y="50" width="30" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <rect x="65" y="50" width="30" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <line x1="25" y1="80" x2="55" y2="80" stroke="currentColor" strokeWidth="1.5" />
                <line x1="65" y1="80" x2="95" y2="80" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <div className="mono text-[9px] text-accent tracking-[0.3em] mb-3 font-bold">ENGINE 01</div>
              <h3 className="text-xl font-bold mb-3">Website Building</h3>
              <p className="text-sm text-ink/60 leading-relaxed">
                High-performance infrastructure. Conversion-optimized UI. Built to capture and convert.
              </p>
            </div>

            {/* 02: Marketing/SEO */}
            <div className="bg-paper p-12 flex flex-col items-center text-center">
              <svg width="120" height="120" viewBox="0 0 120 120" className="mb-6">
                <circle cx="60" cy="60" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="60" cy="60" r="15" fill="var(--accent)" fillOpacity="0.2" />
                <line x1="60" y1="60" x2="85" y2="35" stroke="var(--accent)" strokeWidth="2" />
                <line x1="60" y1="60" x2="35" y2="85" stroke="var(--accent)" strokeWidth="2" />
                <line x1="60" y1="60" x2="90" y2="70" stroke="var(--accent)" strokeWidth="2" />
                <circle cx="85" cy="35" r="4" fill="var(--accent)" />
                <circle cx="35" cy="85" r="4" fill="var(--accent)" />
                <circle cx="90" cy="70" r="4" fill="var(--accent)" />
              </svg>
              <div className="mono text-[9px] text-accent tracking-[0.3em] mb-3 font-bold">ENGINE 02</div>
              <h3 className="text-xl font-bold mb-3">Marketing & SEO</h3>
              <p className="text-sm text-ink/60 leading-relaxed">
                Autonomous reach. Market domination. Your business climbs while competitors fade.
              </p>
            </div>

            {/* 03: AI Agents Hub */}
            <div className="bg-paper p-12 flex flex-col items-center text-center">
              <svg width="120" height="120" viewBox="0 0 120 120" className="mb-6">
                <rect x="45" y="25" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="60" cy="40" r="5" fill="var(--accent)" />
                <rect x="20" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <rect x="55" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <rect x="90" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <line x1="60" y1="55" x2="32.5" y2="70" stroke="var(--accent)" strokeWidth="1.5" />
                <line x1="60" y1="55" x2="67.5" y2="70" stroke="var(--accent)" strokeWidth="1.5" />
                <line x1="60" y1="55" x2="102.5" y2="70" stroke="var(--accent)" strokeWidth="1.5" />
                <circle cx="32.5" cy="82.5" r="3" fill="var(--accent)" />
                <circle cx="67.5" cy="82.5" r="3" fill="var(--accent)" />
                <circle cx="102.5" cy="82.5" r="3" fill="var(--accent)" />
              </svg>
              <div className="mono text-[9px] text-accent tracking-[0.3em] mb-3 font-bold">ENGINE 03</div>
              <h3 className="text-xl font-bold mb-3">AI Agents Hub</h3>
              <p className="text-sm text-ink/60 leading-relaxed">
                One interface for all operations. Agents handle the ghost work. You handle growth.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── VOLVV-E CARD ── */}
      <section className="py-32 px-6 bg-ink text-paper">
        <div className="max-w-4xl mx-auto">
          <div className="mono text-[10px] text-accent tracking-[0.3em] font-bold mb-8 text-center uppercase">
            § 02 · Meet Your Agent
          </div>
          <div className="bg-white/5 border border-white/10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-shrink-0">
                <VolvvE scale={10} state="idle" />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4">Volvv-E</h3>
                <p className="text-paper/70 text-lg leading-relaxed mb-6">
                  Your AI operations agent. Scans for ghost work, builds automation roadmaps, and keeps your business evolving month after month.
                </p>
                <div className="grid grid-cols-2 gap-4 mono text-[9px] text-accent tracking-[0.2em]">
                  <div>→ AVAILABLE 24/7</div>
                  <div>→ 1,200+ PATTERNS</div>
                  <div>→ 10-MIN REPORTS</div>
                  <div>→ ZERO TRAINING</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-20 px-8 border-t border-rule bg-paper">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <VolvvE scale={2} />
              <span className="text-2xl font-bold tracking-tighter">eevolvv</span>
            </div>
            <p className="text-ink/50 text-sm leading-relaxed max-w-sm">
              We migrate businesses from fragmented manual labor into elite autonomous systems.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12">
            <div className="flex flex-col gap-3">
              <span className="mono text-[10px] font-bold tracking-widest text-accent uppercase">Legal</span>
              <a href="/privacy" className="text-ink/60 hover:text-ink text-sm">Privacy</a>
              <a href="/terms" className="text-ink/60 hover:text-ink text-sm">Terms</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="mono text-[10px] font-bold tracking-widest text-accent uppercase">Systems</span>
              <a href="/os" className="text-ink/60 hover:text-ink text-sm">OS Login</a>
              <a href="/os/sales" className="text-ink/60 hover:text-ink text-sm">Sales Hub</a>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-rule text-center mono text-[8px] text-ink/20 tracking-[0.5em] uppercase">
          © 2026 eevolvv, Inc. · Delaware C Corp · Global Autonomous Infrastructure
        </div>
      </footer>

    </main>
  )
}
