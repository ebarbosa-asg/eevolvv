import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { breadcrumbSchema } from '@/lib/schemas' // Ensure breadcrumbSchema is exported

export const metadata: Metadata = {
  title: 'Blog — eevolvv | AI Operations for Business',
  description: 'Guides on AI automation, ghost work, and building autonomous operations for small and local businesses.',
  alternates: { canonical: 'https://eevolvv.com/blog' },
  openGraph: {
    title: 'Blog — eevolvv',
    description: 'Guides on AI automation, ghost work, and building autonomous operations.',
    url: 'https://eevolvv.com/blog',
  },
  // Add schema for the blog index page
  // The 'other' property can hold custom metadata like JSON-LD.
  // It expects an object where keys are headers and values are strings/objects.
  // For multiple JSON-LD, it's usually an array of objects under 'application/ld+json'.
  other: {
    'application/ld+json': JSON.stringify(
      // breadcrumbSchema returns a single schema object, so it should be stringified directly.
      breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
      ])
    ),
  },
}

function getReadTime(content: string): string {
  const wpm = 200
  const words = content.split(/\s+/).length
  const mins = Math.max(1, Math.round(words / wpm))
  return `${mins} min read`
}

export default function BlogPage() {
  const posts = getAllPosts()
  return (
    <main style={{ background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'Space Grotesk, sans-serif' }}>
      <section style={{ padding: '80px 32px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, letterSpacing: '-2px', margin: '0 0 48px' }}>Blog</h1>
          <p style={{ fontSize: 17, opacity: 0.55, maxWidth: 500, margin: '-32px 0 48px', lineHeight: 1.6 }}>
            Guides on finding ghost work, automating your business, and building operations that run without you.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {posts.map(post => (
              <article key={post.slug} style={{ borderBottom: '1px solid var(--rule)', paddingBottom: 32 }}>
                <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, opacity: 0.35, marginBottom: 8 }}>
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{getReadTime(post.content)}</span>
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.3px' }}>{post.title}</h2>
                  <p style={{ fontSize: 15, opacity: 0.55, margin: '0 0 12px', lineHeight: 1.6 }}>{post.description}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {post.tags.map((tag: string) => (
                      <span key={tag} style={{ fontSize: 11, fontWeight: 600, opacity: 0.3, border: '1px solid var(--rule)', padding: '3px 10px', borderRadius: 20 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      {/* Bottom CTA */}
      <section style={{ padding: '64px 32px', textAlign: 'center', borderTop: '1px solid var(--rule)' }}>
        <p style={{ fontSize: 14, opacity: 0.5, marginBottom: 20 }}>Want to know exactly what to automate in your business?</p>
        <a href="/" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '14px 32px', borderRadius: 4, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
          Run the free AI diagnostic →
        </a>
      </section>
    </main>
  )
}
