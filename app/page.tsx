'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SectionMarker, Button, Card, CardContent } from '@/components/ds'
import DiagnosticSection from '@/components/DiagnosticSection'

function Pillar({ num, title, subtitle, points, active, onEnter }: any) {
  return (
    <div 
      className={`relative p-8 border transition-all duration-700 ${active ? 'bg-white/[0.03] border-accent/40 scale-[1.02]' : 'bg-transparent border-white/5 opacity-40'}`}
      onMouseEnter={onEnter}
    >
      <div className="absolute top-0 right-0 p-4 mono text-[10px] text-accent tracking-widest">{num}</div>
      <h3 className="text-3xl font-bold tracking-tighter mb-2 text-white">{title}</h3>
      <p className="text-accent mono text-[10px] uppercase tracking-[0.2em] mb-6">{subtitle}</p>
      <ul className="space-y-3">
        {points.map((p: string, i: number) => (
          <li key={i} className="text-white/60 text-sm flex gap-3 items-start leading-relaxed">
            <span className="text-accent mt-1">·</span> {p}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Home() {
  const [activePillar, setActivePillar] = useState(1)

  return (
    <main className="bg-black text-white selection:bg-accent selection:text-paper font-sans">
      
      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-20">
        <div className="mono text-[10px] text-accent tracking-[0.5em] font-bold mb-12 uppercase animate-pulse">
          Autonomous Infrastructure · 2026
        </div>
        <h1 className="text-6xl md:text-[7rem] font-bold tracking-tighter leading-[0.9] text-white mb-10 max-w-[1000px]">
          The Future is <br />
          <span className="text-accent italic font-serif decoration-accent/20 underline underline-offset-[12px]">Autonomous.</span>
        </h1>
        <p className="text-white/40 text-lg md:text-xl max-w-[600px] mx-auto leading-relaxed mb-16">
          We don't just build websites. We build the architecture for businesses that want to grow without manual labor.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('pillars')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-accent text-black px-12 py-5 mono text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white transition-colors"
            >
              The Vision →
            </button>
            <button 
              onClick={() => document.getElementById('diagnostic')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-transparent border border-white/20 text-white px-12 py-5 mono text-[10px] uppercase tracking-[0.3em] font-bold hover:border-white transition-colors"
            >
              Start Diagnostic
            </button>
        </div>
      </section>

      {/* ── THE 3 PILLARS ── */}
      <section id="pillars" className="py-32 px-6 max-w-[1200px] mx-auto">
        <div className="mb-20">
          <SectionMarker num="01" label="THE ARCHITECTURE" />
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-6 max-w-xl">
            A single bridge between your public face and your private operations.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <Pillar 
            num="PHASE 01"
            title="The Presence"
            subtitle="The Public Front"
            points={[
              "High-performance website infrastructure",
              "Conversion-optimized UI/UX",
              "Autonomous SEO & Market Domination",
              "24/7 Lead Capture Machine"
            ]}
            active={activePillar === 1}
            onEnter={() => setActivePillar(1)}
          />
          <Pillar 
            num="CORE"
            title="The AI Layer"
            subtitle="The Intelligence Hub"
            points={[
              "Unified data synchronization",
              "Client diagnostic processing",
              "Real-time decision mapping",
              "The Bridge to Phase 02"
            ]}
            active={activePillar === 2}
            onEnter={() => setActivePillar(2)}
          />
          <Pillar 
            num="PHASE 02"
            title="The OS"
            subtitle="The Private Engine"
            points={[
              "A private hub to run your business",
              "Autonomous Agent workforce visibility",
              "Financial & Operational HUD",
              "Live Build Timeline monitoring"
            ]}
            active={activePillar === 3}
            onEnter={() => setActivePillar(3)}
          />
        </div>

        {/* The Ethos Quote */}
        <div className="mt-32 text-center max-w-2xl mx-auto border-t border-white/5 pt-12">
            <p className="text-2xl font-serif italic text-white/50 leading-relaxed">
              "We move your business from a collection of fragmented manual tasks into a single, cohesive autonomous engine."
            </p>
            <div className="mt-6 mono text-[10px] text-accent tracking-widest uppercase font-bold">Eduardo Barbosa · FOUNDER</div>
        </div>
      </section>

      {/* ── DIAGNOSTIC HOOK ── */}
      <section id="diagnostic" className="bg-[#0A0A09] py-32 border-y border-white/5">
         <div className="max-w-[1200px] mx-auto px-6">
            <div className="mb-16">
              <SectionMarker num="02" label="DAY 1 DIAGNOSTICS" />
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-6">
                Ready to find the waste? <br />
                <span className="text-white/30 italic">It starts with a 10-minute audit.</span>
              </h2>
            </div>
            <div className="bg-black/40 border border-white/5 p-4 md:p-12">
               <DiagnosticSection />
            </div>
         </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-20 px-8 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <div className="text-3xl font-bold tracking-tighter text-white mb-2">eevolvv, Inc.</div>
            <div className="mono text-[10px] text-white/20 tracking-widest uppercase">Global Autonomous Infrastructure</div>
          </div>
          <div className="flex gap-12 mono text-[10px] text-white/40 uppercase tracking-widest">
            <Link href="/os/sales" className="hover:text-accent transition-colors">Sales HUB</Link>
            <Link href="/marketing/vision" className="hover:text-accent transition-colors">The Vision</Link>
            <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
          </div>
        </div>
        <div className="mt-20 text-center mono text-[8px] text-white/10 tracking-[0.5em] uppercase">
           © 2026 · built for the future.
        </div>
      </footer>

    </main>
  )
}
