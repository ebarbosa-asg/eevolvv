'use client'

import { serviceSchema } from '@/lib/schemas'
import { useState } from 'react'
import { SectionMarker, Button } from '@/components/ds'

export default function RecoveryPage() {
  const [calls, setCalls] = useState(3)
  const [value, setValue] = useState(1000)
  
  const weeklyLoss = calls * value
  const yearlyLoss = weeklyLoss * 52

  return (
    <div className="min-h-screen bg-black text-white selection:bg-accent font-sans">
      {/* HEADER */}
      <nav className="p-6 border-b border-white/10 flex justify-between items-center">
        <div className="text-xl font-bold tracking-tighter">eevolvv <span className="text-accent underline decoration-accent/30 underline-offset-4 ml-2">RECOVERY</span></div>
        <div className="mono text-[10px] text-white/40 uppercase tracking-widest animate-pulse">● System: Active</div>
      </nav>

      <div className="max-w-[800px] mx-auto px-6 py-16">
        
        {/* HERO */}
        <div className="mb-20">
          <div className="mono text-[10px] text-accent tracking-[0.4em] uppercase font-bold mb-6">Immediate Revenue Recovery</div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95] mb-8">
            Every Missed Call is a <br />
            <span className="text-accent">Gift to your competitor.</span>
          </h1>
          <p className="text-white/50 text-xl leading-relaxed max-w-[600px]">
            We install an AI layer that instantly responds to missed calls and books jobs while you're in the field. No voicemail. Just closed deals.
          </p>
        </div>

        {/* CALCULATOR */}
        <section className="bg-[#0A0A09] border border-white/10 p-8 md:p-12 mb-20">
          <SectionMarker num="01" label="THE WASTE CALCULATOR" />
          <h2 className="text-2xl font-bold mt-6 mb-12 uppercase tracking-tight">How much are you losing?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <label className="mono text-[10px] text-white/40 uppercase block mb-4">Avg. Missed Calls / Week</label>
              <input 
                type="range" min="1" max="20" value={calls} 
                onChange={(e) => setCalls(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 accent-accent appearance-none cursor-pointer"
              />
              <div className="mt-4 text-3xl font-bold">{calls} <span className="text-sm font-normal opacity-30">calls</span></div>
            </div>
            <div>
              <label className="mono text-[10px] text-white/40 uppercase block mb-4">Avg. Job Value ($)</label>
              <input 
                type="range" min="100" max="5000" step="100" value={value} 
                onChange={(e) => setValue(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 accent-accent appearance-none cursor-pointer"
              />
              <div className="mt-4 text-3xl font-bold">${value.toLocaleString()} <span className="text-sm font-normal opacity-30">per job</span></div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mono text-[9px] text-white/30 uppercase mb-1">Weekly Revenue Leak</div>
              <div className="text-4xl font-bold text-red-500 tracking-tighter">${weeklyLoss.toLocaleString()}</div>
            </div>
            <div className="bg-white/5 p-6 border-l-2 border-accent">
              <div className="mono text-[9px] text-accent uppercase mb-1">Yearly Recovery Potential</div>
              <div className="text-4xl font-bold tracking-tighter">${yearlyLoss.toLocaleString()}</div>
            </div>
          </div>
        </section>

        {/* RECOVERY STEPS */}
        <section className="mb-20">
          <SectionMarker num="02" label="THE 15-MINUTE SETUP" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mt-10 bg-white/5 border border-white/5">
             <div className="p-8 bg-black">
                <div className="mono text-accent text-xs mb-4">01. PIPE</div>
                <p className="text-sm text-white/70">Connect your existing business line to our AI recovery bridge.</p>
             </div>
             <div className="p-8 bg-black">
                <div className="mono text-accent text-xs mb-4">02. LOGIC</div>
                <p className="text-sm text-white/70">AI instant-replies via SMS to every missed call. Qualifies & Books.</p>
             </div>
             <div className="p-8 bg-black">
                <div className="mono text-accent text-xs mb-4">03. COLLECT</div>
                <p className="text-sm text-white/70">You get a notification of a new booked job. No manual work required.</p>
             </div>
          </div>
        </section>

        {/* THE OFFER */}
        <section className="text-center bg-accent p-12 text-black">
           <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Secure your revenue.</h2>
           <p className="text-lg font-medium mb-10 opacity-70">One-time setup: $499. Pay for itself in the first 24 hours.</p>
           <a href="/pricing?product=report-roadmap" className="inline-block bg-black text-white px-12 py-5 mono text-xs uppercase tracking-[0.3em] font-bold active:scale-95 transition-transform">
             Deploy Recovery Engine →
           </a>
        </section>

        <p className="mt-20 text-center mono text-[9px] text-white/20 uppercase tracking-[0.4em]">
          eevolvv, Inc. · Deployment Instance: 2026.RECOVERY
        </p>

      </div>
    <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(serviceSchema({name: "Lead Recovery Automation", description: "Recover lost leads with automated follow-up sequences that re-engage prospects who went cold.", providerName: "eevolvv, Inc.", areaServed: "Dallas"}))}}
        />
      </div>
  )
}
