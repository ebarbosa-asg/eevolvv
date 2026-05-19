'use client'

const REPORT_POINTS = [
  ['Ghost work', 'The repeated tasks hiding in plain sight.'],
  ['First fix', 'The workflow to automate before anything else.'],
  ['Roadmap', 'A clean next-step path if the report hits.'],
]

export default function HeroV3() {
  return (
    <section className="hero report-hero" id="free-report">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid" />
      </div>

      <div className="site-rail report-hero-inner report-hero-simple">
        <div className="report-hero-copy">
          <div className="hero-head report-hero-head">
            <span className="hero-head-counter mono">§ 00</span>
            <span className="hero-head-label mono">Free diagnostic report</span>
            <span className="hero-head-status">No credit card</span>
          </div>

          <h1 className="report-hero-title">
            Find the ghost work.
            <span>Get the report free.</span>
          </h1>

          <p className="report-hero-body">
            Answer a few questions. We turn the messy parts of your operation into a sharp report:
            what is leaking time, what to fix first, and whether a real AI build is worth it.
          </p>

          <div className="report-hero-actions">
            <a className="btn-primary report-primary" href="/diagnostic">
              <span className="tiny-spray-v tiny-spray-v-inline" aria-hidden="true">v</span>
              Get free report
              <span>→</span>
            </a>
          </div>

          <div className="report-point-grid">
            {REPORT_POINTS.map(([title, body]) => (
              <div key={title} className="report-point">
                <span className="mono">{title}</span>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
