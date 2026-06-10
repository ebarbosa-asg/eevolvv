import { createClient } from '@supabase/supabase-js'

interface Testimonial {
  id: string
  client_name: string | null
  vertical: string | null
  quote: string
  metric_headline: string | null
}

async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return []

  const client = createClient(url, key)
  const { data } = await client
    .from('testimonials')
    .select('id, client_name, vertical, quote, metric_headline')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(6)

  return (data as Testimonial[]) ?? []
}

export async function Results() {
  const testimonials = await getPublishedTestimonials()

  // Render nothing until there is real published data
  if (!testimonials.length) return null

  return (
    <section style={{ padding: '80px 0', borderTop: '1px solid var(--rule)' }}>
      <div className="site-rail mx-auto">
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 14, fontWeight: 700 }}>
          § · RESULTS
        </div>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 48, lineHeight: 1.1 }}>
          What clients actually said.
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {testimonials.map(t => (
            <div
              key={t.id}
              style={{ padding: '28px 28px 24px', border: '1px solid var(--rule)', display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {t.metric_headline && (
                <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--accent)', lineHeight: 1 }}>
                  {t.metric_headline}
                </div>
              )}
              <blockquote style={{ margin: 0, fontSize: 14, lineHeight: 1.65, opacity: 0.85, fontStyle: 'italic' }}>
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', opacity: 0.5, marginTop: 'auto' }}>
                {[t.client_name, t.vertical].filter(Boolean).join(' · ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
