'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { VolvvE } from '@/components/VolvvE'

export default function Home() {
  const [url, setUrl] = useState('')
  const [isScanning, setIsScanning] = useState(false)

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
    setIsScanning(true)
    // Future: Redirect to /extract?url=...
  }

  return (
    <main className="bg-paper text-ink selection:bg-ink selection:text-paper font-sans min-h-screen flex flex-col overflow-hidden">
      
      {/* ── MINIMAL HEADER ── */}
      <header className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <VolvvE scale={2} state={isScanning ? 'thinking' : 'idle'} />
          <span className="text-xl font-bold tracking-tighter">eevolvv</span>
        </div>
        <Link href="/signin" className="mono text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 hover:opacity-100 transition-opacity">
          OS_LOGIN
        </Link>
      </header>

      {/* ── THE EXTRACTION CORE ── */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 relative">
        
        {/* SCANNING BACKGROUND LINE */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="w-full h-[2px] bg-accent/20 absolute top-0 animate-[scan_3s_linear_infinite]" />
            <style jsx>{`
              @keyframes scan {
                0% { top: 0% }
                100% { top: 100% }
              }
            `}</style>
          </div>
        )}

        <div className="max-w-[900px] w-full text-center relative z-10">
          <h1 className="text-5xl md:text-[6.5rem] font-bold tracking-tighter leading-[0.85] mb-12">
            The Future is <span className="hero-gradient-word italic font-serif">Autonomous.</span><br />
            Manual labor is a bug.
          </h1>

          <form onSubmit={handleStart} className="relative max-w-2xl mx-auto group">
            <input 
              type="text"
              placeholder="ENTER BUSINESS URL TO START EXTRACTION..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-transparent border-b-2 border-ink/10 py-6 px-4 mono text-xs md:text-sm tracking-widest focus:border-accent transition-colors outline-none text-center uppercase"
            />
            <button 
              type="submit"
              className="mt-12 group-hover:bg-accent bg-ink text-paper px-16 py-6 mono text-[10px] font-bold tracking-[0.4em] uppercase transition-all hover:scale-105 active:scale-95"
            >
              {isScanning ? 'EXTRACTING...' : 'BOIL THE OCEAN →'}
            </button>
          </form>

          <p className="mt-16 mono text-[9px] tracking-[0.3em] text-ink/30 uppercase">
            Identifies ghost work · Maps automation · Ships the fix
          </p>
        </div>
      </section>

      {/* ── AMBIENT DATA FEEDS (GRAPHICS OVER WORDS) ── */}
      <div className="fixed bottom-12 left-12 hidden lg:flex flex-col gap-2 opacity-20 pointer-events-none">
         <div className="w-32 h-[1px] bg-ink" />
         <div className="w-24 h-[1px] bg-ink" />
         <div className="w-40 h-[1px] bg-ink" />
      </div>

      <footer className="p-12 flex justify-between items-center opacity-20 border-t border-rule bg-paper relative z-10">
        <span className="mono text-[8px] tracking-[.5em]">EEVOLVV.COM // GLOBAL_OS</span>
        <div className="flex gap-8 mono text-[8px] tracking-[.3em]">
          <Link href="/privacy">PRIVACY</Link>
          <Link href="/terms">TERMS</Link>
        </div>
      </footer>

    </main>
  )
}
