'use client'

import { useState, useEffect } from 'react'

const HERO_PHRASES = [
  'CORNER STORE',
  'LAW FIRM',
  'GYM',
  'RESTAURANT',
  'DENTAL PRACTICE',
  'REAL ESTATE TEAM',
  'BODEGA',
  'AGENCY',
  'MED SPA',
  'CONTRACTOR',
  'STARTUP',
  'CHIROPRACTIC',
  'ENTERPRISE',
]

function FlapChar({ char, isWide }: { char: string; isWide: boolean }) {
  return (
    <span className="flap-cell" aria-hidden="true">
      <span className="flap-half top">
        <span><i data-wide={isWide ? '1' : '0'}>{char}</i></span>
      </span>
      <span className="flap-half bottom">
        <span><i data-wide={isWide ? '1' : '0'}>{char}</i></span>
      </span>
    </span>
  )
}

export default function HeroV3() {
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setPhraseIndex(i => (i + 1) % HERO_PHRASES.length), 3400)
    return () => clearInterval(id)
  }, [])

  const phrase = HERO_PHRASES[phraseIndex]
  const isWide = (c: string) => ['M', 'W'].includes(c)

  return (
    <section className="hero" id="free-report">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid" />
        <div className="hero-radial" />
      </div>

      <div className="site-rail hero-inner" style={{ gap: 32 }}>
        <div className="hero-head">
          <span className="hero-head-counter mono">§ 00</span>
          <span className="hero-head-label mono">Autonomous infrastructure</span>
          <span className="hero-head-status">
            <span className="hero-head-dot" />
            <span>Live 24/7</span>
          </span>
        </div>

        <div className="hero-split-main">
          <div className="hero-split-copy">
            <p className="hero-split-line serif">
              We evolve every
            </p>

            <div className="hero-split-flap-wrap">
              <span className="flap-stage hero-flap-stage">
                {phrase.split('').map((char, i) => (
                  <FlapChar key={`${phraseIndex}-${i}`} char={char} isWide={isWide(char)} />
                ))}
              </span>
            </div>

            <p className="hero-split-line hero-split-line-sub serif">
              into an autonomous system.
            </p>
          </div>

          <div className="hero-split-cta">
            <a className="btn-primary" href="/diagnostic">
              <span className="tiny-spray-v tiny-spray-v-inline" aria-hidden="true">v</span>
              Get free report
              <span>→</span>
            </a>
            <p className="hero-split-tag">No signup · Instant report · 10 minutes</p>
          </div>
        </div>
      </div>
    </section>
  )
}