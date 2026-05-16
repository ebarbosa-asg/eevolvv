'use client'

const CHAOS_PATTERN = [
  'x','x','d','x','d','d','x',
  'd','x','x','d','x','d','d',
  'x','d','d','x','x','d','x',
]

export default function CTAV3() {
  return (
    <section className="scope inverted cta-section" id="diagnostic">
      <div className="site-rail">
        <div className="sec-head" style={{ borderTopColor: 'rgba(250,247,240,.2)' }}>
          <span className="sec-marker mono">§ 04</span>
          <h2 className="sec-head-title" style={{ color: 'var(--paper)', maxWidth: '22ch' }}>
            7 days. 1 report.{' '}
            <span className="serif" style={{ color: 'var(--accent)' }}>Zero risk.</span>
          </h2>
          <span className="sec-marker mono" style={{ textAlign: 'right', opacity: 0.6 }}>FREE DIAGNOSTIC</span>
        </div>

        <div className="cta-transform">
          {/* BEFORE */}
          <div className="cta-panel cta-before">
            <div className="cta-panel-head">
              <span className="cta-panel-dot off" />
              <span className="cta-panel-tag">BEFORE · WK 0</span>
              <span className="cta-panel-state off">MANUAL</span>
            </div>
            <div className="cta-panel-body">
              <div className="cta-pct">
                <span className="cta-pct-label">AUTOMATED</span>
                <span className="cta-pct-val cta-pct-val-bad">0%</span>
                <div className="cta-pct-bar"><i style={{ width: '0%' }} /></div>
              </div>

              <div className="cta-cal-grid" aria-hidden="true">
                {CHAOS_PATTERN.map((kind, i) => (
                  <span
                    key={i}
                    className={kind}
                    style={{ animationDelay: `${(i * 90) % 1600}ms` }}
                  >
                    {kind === 'x' ? '×' : '·'}
                  </span>
                ))}
              </div>

              <div className="cta-log">
                <div><span className="cta-log-arrow">→</span> NO_REPLY <span className="cta-num">47</span></div>
                <div><span className="cta-log-arrow">→</span> MISSED <span className="cta-num">12</span></div>
                <div><span className="cta-log-arrow">→</span> MANUAL <span className="cta-num">89</span></div>
                <div><span className="cta-log-arrow">→</span> GHOSTED <span className="cta-num">16.5h</span></div>
                <div className="cta-log-dim">// ghost work · undetected</div>
                <div className="cta-log-dim">// systems · fragmented</div>
              </div>

              <div className="cta-trend cta-trend-down">
                <svg viewBox="0 0 100 32" preserveAspectRatio="none" shapeRendering="crispEdges">
                  <polyline points="0,6 12,10 24,8 36,16 48,14 60,20 72,18 84,24 100,28" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                <span>PRODUCTIVITY ↓</span>
              </div>

              <div className="cta-money cta-money-bad">
                <span className="cta-money-val">−$2.4K</span>
                <span className="cta-money-unit">/MO LEAKING</span>
              </div>
            </div>
          </div>

          {/* MIDDLE — Volvv-E */}
          <div className="cta-mid">
            <div className="cta-mid-rings" aria-hidden="true">
              <span /><span /><span />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/volvv-e.png" alt="" className="cta-mid-vlvv" />
            <span className="cta-mid-label">VOLVV-E.exe</span>
            <span className="cta-mid-status">◈ 7-DAY SCAN</span>
          </div>

          {/* AFTER */}
          <div className="cta-panel cta-after">
            <div className="cta-panel-head">
              <span className="cta-panel-dot on" />
              <span className="cta-panel-tag">AFTER · WK 1</span>
              <span className="cta-panel-state on">AUTONOMOUS</span>
            </div>
            <div className="cta-panel-body">
              <div className="cta-pct cta-pct-good">
                <span className="cta-pct-label">AUTOMATED</span>
                <span className="cta-pct-val">89%</span>
                <div className="cta-pct-bar"><i style={{ width: '89%' }} /></div>
              </div>

              <div className="cta-cal-grid" aria-hidden="true">
                {Array.from({ length: 21 }).map((_, i) => (
                  <span key={i} className="ok" style={{ animationDelay: `${i * 35}ms` }}>✓</span>
                ))}
              </div>

              <div className="cta-log">
                <div><span className="cta-log-arrow">→</span> AGENT.001 <span className="cta-ok">✓ LIVE</span></div>
                <div><span className="cta-log-arrow">→</span> AGENT.002 <span className="cta-ok">✓ LIVE</span></div>
                <div><span className="cta-log-arrow">→</span> AGENT.003 <span className="cta-ok">✓ LIVE</span></div>
                <div><span className="cta-log-arrow">→</span> AGENT.004 <span className="cta-ok">✓ LIVE</span></div>
                <div className="cta-log-dim">// + 8 agents online</div>
                <div className="cta-log-dim">// uptime · 99.97%</div>
              </div>

              <div className="cta-trend cta-trend-up">
                <svg viewBox="0 0 100 32" preserveAspectRatio="none" shapeRendering="crispEdges">
                  <polyline points="0,26 12,24 24,20 36,22 48,14 60,16 72,10 84,8 100,2" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                <span>RECOVERY ↑</span>
              </div>

              <div className="cta-money cta-money-good">
                <span className="cta-money-val">+$28.8K</span>
                <span className="cta-money-unit">/YR RECOVERED</span>
              </div>
            </div>
          </div>
        </div>

        {/* 7-day strip */}
        <div className="cta-7day">
          {[
            { day: '01', glyph: '▣', label: 'MOUNT' },
            { day: '02', glyph: '◎', label: 'OBSERVE' },
            { day: '03', glyph: '◎', label: 'OBSERVE' },
            { day: '04', glyph: '⊞', label: 'CLASSIFY' },
            { day: '05', glyph: '▷', label: 'DRAFT' },
            { day: '06', glyph: '◈', label: 'REVIEW' },
            { day: '07', glyph: '★', label: 'DELIVER' },
          ].map((d, i) => (
            <div key={i} className={`cta-7day-cell${i === 6 ? ' last' : ''}`}>
              <span className="cta-day-num">D · {d.day}</span>
              <div className="cta-day-glyph">{d.glyph}</div>
              <span className="cta-day-label">{d.label}</span>
            </div>
          ))}
        </div>

        {/* CTA band */}
        <div className="cta-band">
          <div>
            <div className="cta-band-label">100% MONEY-BACK · ZERO RISK</div>
            <div className="cta-band-headline">
              We find <span style={{ color: 'var(--accent)' }}>$2K+/mo</span> in recoverable ghost work — or you pay nothing.
            </div>
          </div>
          <a href="/diagnostic" className="btn-primary cta-band-btn">
            Start free diagnostic →
          </a>
        </div>
      </div>
    </section>
  )
}
