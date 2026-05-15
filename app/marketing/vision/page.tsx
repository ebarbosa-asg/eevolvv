'use client'

import { SectionMarker, Card, CardContent } from '@/components/ds'
// import { OSTopbar } from '../os/components/OSTopbar'

function Step({ num, title, body, icon }: { num: string, title: string, body: string, icon: string }) {
  return (
    <div className="flex gap-6 mb-12">
      <div className="flex-shrink-0 w-12 h-12 bg-accent/10 border border-accent/20 flex items-center justify-center mono text-accent font-bold text-xl">
        {num}
      </div>
      <div>
        <h3 className="text-2xl font-semibold tracking-tight text-white mb-2">{title}</h3>
        <p className="text-white/50 leading-relaxed text-sm">{body}</p>
      </div>
    </div>
  )
}

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* <OSTopbar title="THE VISION" /> */}
      
      <div className="max-w-[800px] mx-auto px-6 py-12">
        
        {/* HERO */}
        <div className="mb-20 text-center">
          <div className="mono text-[10px] text-accent tracking-[0.4em] uppercase font-bold mb-6">
            The Industry Shift · 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-8 leading-[0.95]">
            From Manual<br />
            <span className="text-accent underline decoration-accent/30 underline-offset-8">To Autonomous.</span>
          </h1>
          <p className="text-white/40 text-lg leading-relaxed max-w-[500px] mx-auto italic font-serif">
            "We don't just build websites. We build the architecture for your business's future."
          </p>
        </div>

        {/* THE DIAGRAM / BRIDGE */}
        <section className="mb-32">
          <SectionMarker num="01" label="THE TWO PILLARS" />
          
          <div className="mt-12 space-y-4">
             {/* Component 1: The Face */}
             <div className="bg-[#0A0A09] border border-white/10 p-8 hover:border-accent/40 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-4 h-4 rounded-full bg-accent" />
                  <span className="mono text-[10px] text-accent tracking-widest uppercase font-bold">Phase 1: The Presence</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">A High-Performance Frontend</h2>
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  Most websites are static brochures. Our builds are performance weapons—designed to capture every lead and outshine every competitor in your market.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="mono text-[9px] text-white/30 p-3 border border-white/5 uppercase tracking-tighter">
                    → SEO Domination
                  </div>
                  <div className="mono text-[9px] text-white/30 p-3 border border-white/5 uppercase tracking-tighter">
                    → conversion ops
                  </div>
                </div>
             </div>

             {/* The Connector */}
             <div className="flex justify-center h-16 w-full">
               <div className="w-[1px] h-full bg-gradient-to-b from-accent to-transparent" />
             </div>

             {/* Component 2: The Heart */}
             <div className="bg-accent text-black p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 mono text-[10px] font-bold opacity-30">EEVOLVV CORE</div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">The AI Intelligence Layer</h2>
                <p className="text-black/70 text-sm font-medium leading-relaxed italic">
                  Connecting your website's data to your business's workflow.
                </p>
             </div>

             {/* The Connector */}
             <div className="flex justify-center h-16 w-full">
               <div className="w-[1px] h-full bg-gradient-to-b from-transparent to-white/10" />
             </div>

             {/* Component 3: The Engine */}
             <div className="bg-[#0A0A09] border border-white/10 p-8 hover:border-accent/40 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-4 h-4 border border-white/40" />
                  <span className="mono text-[10px] text-white/40 tracking-widest uppercase font-bold">Phase 2: The Engine Room</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Your Private Business OS</h2>
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  This is the place where you run the business. A private dashboard where you see your agents working, your revenue scaling, and your operations automated.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="mono text-[9px] text-white/30 p-3 border border-white/5 uppercase tracking-tighter">
                    → Agent OS Hub
                  </div>
                  <div className="mono text-[9px] text-white/30 p-3 border border-white/5 uppercase tracking-tighter">
                    → Financial Pulse
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="mb-32">
          <SectionMarker num="02" label="THE COMPARISON" />
          <div className="mt-12 grid grid-cols-2 gap-px bg-white/5 border border-white/5 overflow-hidden">
            <div className="p-8 bg-black">
              <div className="mono text-[9px] text-white/30 uppercase mb-8">Traditional Business</div>
               <ul className="space-y-6">
                 <li className="text-sm opacity-30">Manual Outreach</li>
                 <li className="text-sm opacity-30">Static Site (Ghost Town)</li>
                 <li className="text-sm opacity-30">Fragmented Tools</li>
                 <li className="text-sm opacity-30 text-accent">Linear Growth Limit</li>
               </ul>
            </div>
            <div className="p-8 bg-white/[0.02]">
              <div className="mono text-[9px] text-accent uppercase mb-8">eevolvv-Powered</div>
               <ul className="space-y-6">
                 <li className="text-sm font-bold">Autonomous Prospecting</li>
                 <li className="text-sm font-bold">Capture Machine</li>
                 <li className="text-sm font-bold">Unified Operating System</li>
                 <li className="text-sm font-bold text-accent underline">Exponential Scaling</li>
               </ul>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="text-center">
            <h2 className="text-4xl font-bold tracking-tighter mb-8 leading-none">
              Start The Conversion.
            </h2>
            <a href="/contact" className="inline-block bg-accent text-black px-12 py-5 mono text-xs uppercase tracking-[0.3em] font-bold active:scale-95 transition-transform">
              Begin Build Sequence →
            </a>
            <p className="mt-12 text-[10px] mono text-white/20 uppercase tracking-widest">
              eevolvv, Inc. · Global autonomous Infrastructure
            </p>
        </section>

      </div>
    </div>
  )
}
