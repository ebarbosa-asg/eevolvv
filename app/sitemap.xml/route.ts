import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'
import { getAllPosts } from '@/lib/blog'

const pages = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/pricing', changefreq: 'weekly', priority: 0.9 },
  { url: '/diagnostic', changefreq: 'weekly', priority: 0.85 },
  { url: '/intake', changefreq: 'weekly', priority: 0.9 },
  { url: '/textback', changefreq: 'weekly', priority: 0.9 },
  { url: '/contact', changefreq: 'monthly', priority: 0.7 },
  { url: '/privacy', changefreq: 'yearly', priority: 0.3 },
  { url: '/terms', changefreq: 'yearly', priority: 0.3 },
  { url: '/blog', changefreq: 'weekly', priority: 0.9 },
  { url: '/partners', changefreq: 'monthly', priority: 0.6 },
  { url: '/referral', changefreq: 'monthly', priority: 0.5 },
  { url: '/buy', changefreq: 'monthly', priority: 0.9 },
  { url: '/revenue-calculator', changefreq: 'monthly', priority: 0.7 },
  { url: '/ghost-work-receipt', changefreq: 'monthly', priority: 0.7 },
]

const industrySlugs = [
  'dental', 'law-firms', 'real-estate', 'fitness', 'restaurant', 'salon',
  'chiro', 'cleaning', 'contractors', 'medspa', 'auto-shop', 'childcare',
  'ecommerce', 'accounting', 'agency',
  'local-business-automation', 'ai-agents-for-small-business',
  'ai-receptionist-small-business', 'missed-lead-follow-up',
  'website-and-automation',
]

for (const slug of industrySlugs) {
  pages.push({ url: `/${slug}`, changefreq: 'weekly', priority: 0.8 })
}

const posts = getAllPosts()
for (const post of posts) {
  pages.push({ url: `/blog/${post.slug}`, changefreq: 'monthly', priority: 0.6 })
}

export async function GET() {
  const stream = new SitemapStream({ hostname: 'https://eevolvv.com' })
  const xml = await streamToPromise(Readable.from(pages).pipe(stream)).then(String)
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}