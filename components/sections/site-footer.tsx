'use client'

export default function SiteFooter() {
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
            <div className="footer-col-title">Start</div>
            <div className="footer-link-list">
              <a href="/diagnostic">Free diagnostic</a>
              <a href="/api/stripe/checkout?product=report-roadmap&source=footer">Roadmap upgrade</a>
              <a href="/pricing">Build tiers</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Verticals</div>
            <div className="footer-link-list">
              <a href="/dental">Dental</a>
              <a href="/legal">Legal</a>
              <a href="/real-estate">Real estate</a>
              <a href="/fitness">Fitness</a>
              <a href="/restaurant">Restaurant</a>
              <a href="#industries">+ 9 more</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <div className="footer-link-list">
              <a href="/pricing">Pricing</a>
              <a href="/contact">Contact</a>
              <a href="/signin">Sign in</a>
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