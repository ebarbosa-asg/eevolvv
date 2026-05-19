'use client'

const ORG_ITEMS = [
  'Email', 'Forms', 'Calls', 'Calendar', 'CRM', 'Tasks', 'Docs', 'Invoices', 'Follow-up',
]

const SITE_BLOCKS = [
  'Hero', 'Offer', 'Proof', 'FAQ', 'Booking', 'Checkout',
]

const MARKETING_ROWS = [
  ['Search', 'pages + schema'],
  ['Email', 'follow-up loops'],
  ['Social', 'small proof posts'],
  ['Ads', 'landing tests'],
]

export default function CapabilityTriptych() {
  return (
    <section className="scope capability-section" id="capabilities">
      <div className="site-rail">
        <div className="capability-head">
          <span className="mono">What eevolvv can manage</span>
          <h2>Three systems. One operating layer.</h2>
          <p>
            The free report shows which of these matters first: organize the work,
            rebuild the web presence, or turn marketing into a repeatable loop.
          </p>
        </div>

        <div className="capability-grid">
          <article className="capability-card capability-organize">
            <div className="cap-card-top">
              <span className="mono">01 · Organize</span>
              <MiniVolvvE />
            </div>
            <div className="organize-graphic" aria-label="Many business inputs organized into one operating hub">
              <div className="org-inputs">
                {ORG_ITEMS.map((item, i) => (
                  <span key={item} style={{ '--d': `${i * 40}ms` } as React.CSSProperties}>
                    {item}
                  </span>
                ))}
              </div>
              <div className="org-hub">
                <b>Operating hub</b>
                <i>one place to see what matters</i>
              </div>
            </div>
            <h3>Bring the scattered work into one place.</h3>
            <p>Email, forms, calls, tasks, reports, and handoffs become one readable system.</p>
          </article>

          <article className="capability-card capability-website">
            <div className="cap-card-top">
              <span className="mono">02 · Website builder</span>
              <MiniVolvvE />
            </div>
            <div className="website-graphic" aria-label="Website builder graphic">
              <div className="browser-bar"><span /><span /><span /></div>
              <div className="site-canvas">
                {SITE_BLOCKS.map((block, i) => (
                  <span key={block} className={i === 0 ? 'wide' : ''}>{block}</span>
                ))}
              </div>
            </div>
            <h3>Turn the offer into a clean website.</h3>
            <p>Pages, forms, booking, checkout, proof, and reporting can all connect.</p>
          </article>

          <article className="capability-card capability-marketing">
            <div className="cap-card-top">
              <span className="mono">03 · Marketing</span>
              <MiniVolvvE />
            </div>
            <div className="marketing-graphic" aria-label="Marketing engine graphic">
              <div className="marketing-target">
                <span />
                <span />
                <b>Lead</b>
              </div>
              <div className="marketing-list">
                {MARKETING_ROWS.map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <b>{value}</b>
                  </div>
                ))}
              </div>
            </div>
            <h3>Make marketing a managed loop.</h3>
            <p>Search, content, email, ads, and follow-up stop living in separate corners.</p>
          </article>
        </div>
      </div>
    </section>
  )
}

function MiniVolvvE() {
  return (
    <span className="mini-volvve" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/volvv-e.png" alt="" />
    </span>
  )
}
