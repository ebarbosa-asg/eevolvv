'use client'

import { useState, useEffect } from 'react'
import { VolvvE } from '@/components/VolvvE'
import { ChaosToOrder } from '@/components/diagrams/chaos-to-order'
import { TimeLeak } from '@/components/diagrams/time-leak'
import { AgentPipeline } from '@/components/diagrams/agent-pipeline'
import { BarrelDiagram } from '@/components/diagrams/barrel-diagram'
import { CTADiagram } from '@/components/diagrams/cta-diagram'

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

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE — 4 Sections, Diagram-First, Minimal Text
// ═══════════════════════════════════════════════════════════════════════════════
export default function Home() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [hasWebsite, setHasWebsite] = useState<boolean | null>(null)
  const [url, setUrl] = useState('')
  const [businessName, setBusinessName] = useState('')

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
      window.location.href = `/#diagnostic?url=${encodeURIComponent(url)}`
    } else if (!hasWebsite && businessName) {
      window.location.href = `/#diagnostic?business=${encodeURIComponent(businessName)}`
    }
  }

  return (
    <main className="bg-paper text-ink selection:bg-ink selection:text-paper font-sans">

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1: HERO — Split-Flap + Dual-Path CTA
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-[0.03]" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="mono text-[10px] text-accent tracking-[0.5em] font-bold mb-8 uppercase">
            Autonomous Infrastructure · 2026
          </div>

          <div className="mb-6">
            <span className="serif text-5xl md:text-7xl font-normal tracking-tight" style={{ transform: 'skewX(-3deg)', display: 'inline-block' }}>
              We evolve every
            </span>
          </div>

          <div className="mb-8">
            <span className="flap-stage hero-flap-stage" style={{ color: 'var(--paper)' }}>
              {currentPhrase.split('').map((char, i) => (
                <FlapChar key={i} char={char} isWide={isWideChar(char)} />
              ))}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-normal mb-8 text-ink/70 serif italic">
            into the new era.
          </h1>

          {/* Chaos → Order micro-animation */}
          <div className="mb-10">
            <ChaosToOrder />
          </div>

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
              I Don&apos;t Have a Website Yet
            </button>
          </div>

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

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2: THE PROBLEM — Time Leak Diagram
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 border-t border-rule bg-white/30">
        <TimeLeak />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3: THE SOLUTION — Agent Pipeline Diagram
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 border-t border-rule">
        <AgentPipeline />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3.5: INDUSTRY BARREL — What We Automate
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 border-t border-rule bg-white/30">
        <BarrelDiagram />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 4: CTA — 7-Day Diagnostic Offer
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 bg-ink text-paper">
        <CTADiagram />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════════════════════════ */}
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
