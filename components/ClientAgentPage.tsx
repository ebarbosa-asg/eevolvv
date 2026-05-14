import type { ClientAgentPage as ClientAgentPageData } from '@/lib/client-agent-pages'
import { ADD_ONS, WEBSITE_ADD_ON } from '@/lib/agent-products'
import { getPlanForClient } from '@/lib/client-agent-pages'

const MONO = { fontFamily: 'JetBrains Mono, ui-monospace, monospace' } as const

function StatusBadge({ status }: { status: string }) {
  const isIncluded = status === 'included' || status === 'active' || status === 'paid'
  return (
    <span
      style={{
        ...MONO,
        fontSize: 9,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        border: `1px solid ${isIncluded ? 'rgba(74,222,128,0.36)' : 'rgba(20,20,19,0.14)'}`,
        color: isIncluded ? '#227a43' : 'rgba(20,20,19,0.48)',
        padding: '4px 8px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  )
}

export function ClientAgentPage({ page }: { page: ClientAgentPageData }) {
  const plan = getPlanForClient(page)
  const ownedProducts = page.products.filter((product) =>
    ['included', 'active', 'paid', 'queued'].includes(product.status)
  )
  const availableProducts = page.products.filter((product) => product.status === 'available')

  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink)' }}>
      <section
        style={{
          borderBottom: '1px solid var(--rule)',
          background:
            'linear-gradient(120deg, rgba(140,43,26,0.11), rgba(20,20,19,0.02) 48%, rgba(20,20,19,0.06))',
        }}
      >
        <div className="site-rail mx-auto" style={{ paddingTop: 56, paddingBottom: 44 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.24em', color: 'var(--accent)', marginBottom: 14, fontWeight: 700 }}>
            EEVOLVV · CLIENT AGENT PAGE
          </div>
          <div className="client-agent-hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(280px,0.9fr)', gap: 28, alignItems: 'end' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(36px, 7vw, 76px)', lineHeight: 0.92, letterSpacing: '-0.055em', margin: '0 0 18px', maxWidth: 820 }}>
                {page.headline}
              </h1>
              <p style={{ fontSize: 18, lineHeight: 1.55, opacity: 0.72, maxWidth: 680, margin: 0 }}>
                {page.summary}
              </p>
            </div>
            <div
              style={{
                border: '1px solid var(--ink)',
                background: 'rgba(250,247,240,0.72)',
                padding: 24,
              }}
            >
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 16 }}>
                CURRENT PLAN
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 6 }}>
                {plan.publicName}
              </div>
              <p style={{ fontSize: 14, opacity: 0.62, lineHeight: 1.55, margin: '0 0 18px' }}>
                {plan.automationAllowance}. {plan.includesSco ? 'Ads, SEO, and SCO included.' : 'SCO can be added any time.'}
              </p>
              <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', lineHeight: 1.8 }}>
                → WEBSITE ADD-ON {WEBSITE_ADD_ON.price}
                <br />
                → SCO ADD-ON {plan.includesSco ? 'INCLUDED' : ADD_ONS['sco-management'].price}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="agent-actions" className="site-rail mx-auto" style={{ paddingTop: 44, paddingBottom: 20 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.24em', color: 'var(--accent)', marginBottom: 18, fontWeight: 700 }}>
          § 01 · WEEKLY RECOMMENDATIONS
        </div>
        <div className="client-agent-recommendations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', border: '1px solid var(--ink)' }}>
          {page.recommendations.map((item, index) => (
            <article
              key={item.title}
              style={{
                padding: 24,
                minHeight: 190,
                borderRight: index % 2 === 0 ? '1px solid var(--ink)' : 'none',
                borderBottom: index < page.recommendations.length - 2 ? '1px solid var(--ink)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                <span className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'rgba(20,20,19,0.42)' }}>
                  R-{String(index + 1).padStart(2, '0')}
                </span>
                <StatusBadge status={item.status} />
              </div>
              <h2 style={{ fontSize: 24, lineHeight: 1.08, letterSpacing: '-0.03em', margin: '0 0 12px' }}>
                {item.title}
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.58, opacity: 0.68, margin: 0 }}>{item.description}</p>
              {item.price && (
                <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.08em', marginTop: 16 }}>
                  {item.price}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="site-rail mx-auto" style={{ paddingTop: 36, paddingBottom: 56 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.24em', color: 'var(--accent)', marginBottom: 18, fontWeight: 700 }}>
          § 02 · GHOST LOCKER
        </div>
        <div className="client-agent-locker-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(280px,360px)', gap: 24, alignItems: 'start' }}>
          <div style={{ border: '1px solid var(--ink)' }}>
            {ownedProducts.map((product, index) => (
              <article
                key={product.key}
                style={{
                  padding: 22,
                  borderBottom: index < ownedProducts.length - 1 ? '1px solid var(--rule)' : 'none',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0,1fr) auto',
                  gap: 18,
                }}
              >
                <div>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--accent)', marginBottom: 8 }}>
                    {product.type.toUpperCase()}
                  </div>
                  <h3 style={{ fontSize: 22, letterSpacing: '-0.025em', margin: '0 0 8px' }}>{product.name}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.58, opacity: 0.66, margin: '0 0 10px' }}>{product.description}</p>
                  <div className="mono" style={{ fontSize: 11, lineHeight: 1.7, opacity: 0.52 }}>
                    proof: {product.proof}
                  </div>
                </div>
                <StatusBadge status={product.status} />
              </article>
            ))}
          </div>

          <aside style={{ border: '1px solid var(--ink)', padding: 22, position: 'sticky', top: 24 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 14, fontWeight: 700 }}>
              AVAILABLE TO ADD
            </div>
            {availableProducts.map((product) => (
              <div key={product.key} style={{ paddingBottom: 18, marginBottom: 18, borderBottom: '1px solid var(--rule)' }}>
                <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>{product.name}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.08em', marginBottom: 8 }}>{product.price}</div>
                <p style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.62, margin: 0 }}>{product.description}</p>
              </div>
            ))}
            <div className="mono" style={{ fontSize: 11, lineHeight: 1.8, color: 'rgba(20,20,19,0.52)' }}>
              Every product needs a visible artifact: URL, file, scope, checklist, report, runbook, or status card.
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
