import type { Metadata } from 'next'
import Link from 'next/link'
import { getPostBySlug, getAllPosts } from '@/lib/blog'
// Ensure breadcrumbSchema is imported correctly and exported from lib/schemas.ts
import { breadcrumbSchema } from '@/lib/schemas'
import { notFound } from 'next/navigation'

// Helper to calculate read time (words per minute)
function getReadTime(content: string): string {
  const wpm = 200 // Words per minute
  const words = content.split(/\s+/).length
  const mins = Math.max(1, Math.round(words / wpm))
  return `${mins} min read`
}

// Generate dynamic metadata for each post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) {
    // Using notFound() will trigger a 404 page.
    // For metadata, returning a simple title might be sufficient for build,
    // but for actual rendering, notFound() is better.
    // However, in generateMetadata, we don't call hooks like notFound.
    // Let's assume post always exists for valid slugs due to generateStaticParams.
    // If it can be null, we'd return limited metadata.
    return { title: 'Post Not Found' };
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` },
  ]

  return {
    title: `${post.title} — eevolvv Blog`,
    description: post.description,
    alternates: { canonical: `https://eevolvv.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://eevolvv.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: ['eevolvv'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    // Add Article and Breadcrumb schema
    // 'application/ld+json' can accept a string or an array of strings (each string being a JSON object)
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        author: { '@type': 'Organization', name: 'eevolvv', url: 'https://eevolvv.com' },
        publisher: {
          '@type': 'Organization',
          name: 'eevolvv',
          logo: {
            '@type': 'ImageObject',
            url: 'https://eevolvv.com/logo.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://eevolvv.com/blog/${post.slug}`,
        },
      }),
    },
  }
}

// Generate static paths for blog posts
export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const readTime = getReadTime(post.content)
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` },
  ]

  // Simplified styling for blog content.
  const contentStyle = {
    fontFamily: 'JetBrains Mono, sans-serif', // Use JetBrains Mono for code-like feel, or Space Grotesk for body text
    fontSize: '16px',
    lineHeight: 1.7,
    maxWidth: '720px',
    margin: '0 auto',
    padding: '0 20px',
    'h2, h3': {
      fontWeight: 700,
      marginTop: '40px',
      marginBottom: '16px',
      letterSpacing: '-0.3px',
    },
    'h2': { fontSize: '28px' },
    'h3': { fontSize: '22px' },
    'p': {
      marginBottom: '20px',
    },
    'ul, ol': {
      marginBottom: '20px',
      paddingLeft: '25px',
    },
    'li': {
      marginBottom: '8px',
    },
    'a': {
      color: 'var(--accent)', // Assuming accent color is defined in CSS variables
      textDecoration: 'underline',
    },
    'strong, b': {
      fontWeight: 700,
    },
    'code': { // Basic styling for inline code
      fontFamily: 'JetBrains Mono, monospace',
      backgroundColor: 'var(--rule)', // Use a subtle background color
      padding: '2px 4px',
      borderRadius: '4px',
      fontSize: '0.9em'
    },
    'pre': { // Basic styling for code blocks
      fontFamily: 'JetBrains Mono, monospace',
      backgroundColor: 'var(--rule)',
      padding: '16px',
      borderRadius: '8px',
      overflowX: 'auto',
      fontSize: '0.9em'
    },
    'pre code': { // Reset code styling within pre
      backgroundColor: 'transparent',
      padding: 0,
      fontSize: 'inherit'
    }
  }

  return (
    <main style={{ background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'Space Grotesk, sans-serif' }}>
      <article style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <nav style={{ display: 'flex', gap: 8, fontSize: 12, opacity: 0.55, marginBottom: 16 }}>
            {breadcrumbs.map((item, index) => (
              <Link key={item.url} href={item.url} style={{ textDecoration: 'none', color: 'inherit', opacity: index === breadcrumbs.length - 1 ? 1 : 0.8 }}>
                {item.name}
                {index < breadcrumbs.length - 1 && ' / '}
              </Link>
            ))}
          </nav>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 700, letterSpacing: '-2px', margin: '0 0 16px' }}>{post.title}</h1>
          <div style={{ display: 'flex', gap: 12, fontSize: 12, opacity: 0.35, marginBottom: 32 }}>
            <span>{post.date}</span>
            <span>·</span>
            <span>{readTime}</span>
          </div>
          {/* Render tags */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
{post.tags.map((tag: string) => (
              <span key={tag} style={{ fontSize: 11, fontWeight: 600, opacity: 0.6, border: '1px solid var(--rule)', padding: '3px 10px', borderRadius: 20, backgroundColor: 'var(--paper)' }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Blog Content Styling - simplified rendering */}
          <div style={contentStyle}>
{post.content.split('\n').map((line: string, i: number) => {
              if (line.startsWith('##')) {
                return <h2 key={i} style={contentStyle['h2']}>{line.substring(2).trim()}</h2>
              } else if (line.startsWith('###')) {
                return <h3 key={i} style={contentStyle['h3']}>{line.substring(3).trim()}</h3>
              } else if (line.startsWith('- ')) {
                 return <li key={i} style={contentStyle['li']}>{line.substring(2).trim()}</li>
              } else if (line.trim() === '') {
                 // Handle empty lines for spacing, especially between list items or paragraphs
                 return <br key={i} style={{display: 'block', margin: '10px 0'}}/>
              }
              else {
                // Treat as paragraph
                return <p key={i} style={contentStyle['p']}>{line.trim()}</p>
              }
            })}
          </div>

          {/* Internal Link CTA */}
          <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 40, marginTop: 60, textAlign: 'center' }}>
            <p style={{ fontSize: 14, opacity: 0.5, marginBottom: 20 }}>Ready to automate your business operations?</p>
            <a href="/" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '14px 32px', borderRadius: 4, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
              Run the free AI diagnostic →
            </a>
          </div>
        </div>
      </article>
    </main>
  )
}
