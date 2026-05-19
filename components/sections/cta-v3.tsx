'use client'

export default function CTAV3() {
  return (
    <section className="scope report-close-section" id="diagnostic">
      <div className="site-rail">
        <div className="report-close">
          <div>
            <div className="mono report-close-kicker">THE SIMPLE PATH</div>
            <h2>
              Start with the free report.
              <span>Only buy the roadmap if the signal is real.</span>
            </h2>
            <p>
              The report shows the problem. The $97 roadmap turns it into a build order:
              first workflow, tools, rough ROI, and what to ship next.
            </p>
          </div>

          <div className="report-close-actions">
            <a href="/diagnostic" className="btn-primary report-primary">
              <span className="tiny-spray-v tiny-spray-v-inline" aria-hidden="true">v</span>
              Free diagnostic
              <span>→</span>
            </a>
            <a href="/api/stripe/checkout?product=report-roadmap&source=homepage" className="btn-ghost report-secondary">
              Roadmap upgrade · $97
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
