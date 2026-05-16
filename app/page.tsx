'use client'

import './homepage-v3.css'
import HeroV3 from '@/components/sections/hero-v3'
import ProtocolV3 from '@/components/sections/protocol-v3'
import IndustriesV3 from '@/components/sections/industries-v3'
import OrganizeV3 from '@/components/sections/organize-v3'
import CTAV3 from '@/components/sections/cta-v3'

// ── Arcade ticker ─────────────────────────────────────────────────────
const TICKER_PHRASES = [
  'A SERVICE NOT SOFTWARE',
  'EEVOLVVING FORWARD TOGETHER',
  'FIND THE GHOST WORK',
  'BUILD THE AGENTS',
  'COMPOUND FOREVER',
  'BUSINESS EVOLUTION · NOT AI AUTOMATION',
]
const ALL_PHRASES = [...TICKER_PHRASES, ...TICKER_PHRASES]

function ArcadeTicker() {
  return (
    <div className="arcade-ticker" aria-hidden="true">
      <div className="arcade-track">
        {ALL_PHRASES.map((p, i) => (
          <span key={i}>
            <span className="dot">◈</span>
            {p}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Header ────────────────────────────────────────────────────────────
function SiteHeader() {
  return (
    <header className="site">
      <div className="site-rail header-inner">
        <a href="/" className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="eevolvv" style={{ imageRendering: 'pixelated' }} />
        </a>
        <nav className="primary">
          <a href="#time-leak">The Problem</a>
          <a href="#protocol" className="active">Protocol</a>
          <a href="#industries">Verticals</a>
          <a href="#diagnostic">Diagnostic</a>
        </nav>
        <a href="#diagnostic" className="header-cta">
          Get free report
          <span>→</span>
        </a>
      </div>
    </header>
  )
}

// ── Footer ────────────────────────────────────────────────────────────
function SiteFooter() {
  return (
    <footer className="site-v3">
      <div className="site-rail">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mascot.png"
                alt=""
                style={{ width: 44, height: 44, imageRendering: 'pixelated' }}
              />
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 20,
                  letterSpacing: '-.04em',
                  color: 'var(--accent)',
                  textTransform: 'lowercase',
                  lineHeight: 1,
                }}>
                  eevolvv
                </div>
                <div className="mono" style={{ fontSize: 9, letterSpacing: '.22em', color: 'var(--accent)', opacity: 0.55, marginTop: 4 }}>
                  EEVOLVV.COM
                </div>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, maxWidth: '42ch', opacity: 0.88, margin: 0 }}>
              We migrate businesses from fragmented manual labor into elite autonomous systems.
              <span style={{ fontStyle: 'italic', display: 'block', marginTop: 8, opacity: 0.7 }}>
                — eevolvving forward, together.
              </span>
            </p>
          </div>
          <div>
            <div className="footer-col-title">Protocol</div>
            <div className="footer-link-list">
              <a href="#protocol">Diagnose</a>
              <a href="#protocol">Onboard</a>
              <a href="#protocol">Build agents</a>
              <a href="#protocol">Maintain</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Verticals</div>
            <div className="footer-link-list">
              <a href="#industries">Dental</a>
              <a href="#industries">Legal</a>
              <a href="#industries">Real estate</a>
              <a href="#industries">+ 5 more</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Systems</div>
            <div className="footer-link-list">
              <a href="/os">OS Login</a>
              <a href="/os/sales">Talent</a>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </div>
          </div>
        </div>
        <div style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          <span className="mono" style={{ fontSize: 9, letterSpacing: '.4em', textTransform: 'uppercase', opacity: 0.6 }}>
            © 2026 eevolvv, inc · delaware c corp
          </span>
          <span className="mono" style={{ fontSize: 9, letterSpacing: '.4em', textTransform: 'uppercase', opacity: 0.4 }}>
            ◈ global autonomous infrastructure
          </span>
        </div>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main style={{ background: 'var(--paper)', color: 'var(--ink)', overflowX: 'hidden' }}>
      <SiteHeader />
      <HeroV3 />
      <ArcadeTicker />
      <ProtocolV3 />
      <IndustriesV3 />
      <OrganizeV3 />
      <CTAV3 />
      <SiteFooter />
    </main>
  )
}
