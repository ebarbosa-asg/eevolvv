'use client'

type Product = {
  key: string
  icon: string
  name: string
  price: string
  description: string
}

type Props = {
  products: Product[]
}

export function AddMore({ products }: Props) {
  if (products.length === 0) return null

  return (
    <details style={{ marginBottom: 40, cursor: 'pointer' }}>
      <summary className="mono" style={{
        fontSize: 10,
        letterSpacing: '0.18em',
        color: 'rgba(20,20,19,0.35)',
        padding: '8px 0',
        userSelect: 'none',
        listStyle: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        ＋ ADD MORE
      </summary>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8, marginTop: 12 }}>
        {products.map(p => (
          <div key={p.key} style={{
            border: '1px solid var(--rule)',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
            <span style={{ fontSize: 24 }}>{p.icon}</span>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.08em' }}>
              {p.price}
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.45, color: 'rgba(20,20,19,0.55)', margin: 0 }}>
              {p.description}
            </p>
            <a
              href={`/api/stripe/checkout?product=${p.key}&source=addon`}
              className="mono"
              style={{
                marginTop: 'auto',
                padding: '10px 0',
                border: '1px solid var(--ink)',
                textAlign: 'center',
                textDecoration: 'none',
                color: 'var(--ink)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.14em',
              }}
            >
              + ADD
            </a>
          </div>
        ))}
      </div>
    </details>
  )
}