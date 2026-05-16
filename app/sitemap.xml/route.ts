import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'

const pages = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/pricing', changefreq: 'monthly', priority: 0.9 },
  { url: '/contact', changefreq: 'monthly', priority: 0.7 },
  { url: '/privacy', changefreq: 'yearly', priority: 0.3 },
  { url: '/terms', changefreq: 'yearly', priority: 0.3 },
  { url: '/dental', changefreq: 'weekly', priority: 0.8 },
  { url: '/auto-shop', changefreq: 'weekly', priority: 0.8 },
  { url: '/chiro', changefreq: 'weekly', priority: 0.8 },
  { url: '/cleaning', changefreq: 'weekly', priority: 0.8 },
  { url: '/contractors', changefreq: 'weekly', priority: 0.8 },
  { url: '/fitness', changefreq: 'weekly', priority: 0.8 },
  { url: '/legal', changefreq: 'weekly', priority: 0.8 },
  { url: '/medspa', changefreq: 'weekly', priority: 0.8 },
  { url: '/real-estate', changefreq: 'weekly', priority: 0.8 },
  { url: '/restaurant', changefreq: 'weekly', priority: 0.8 },
  { url: '/salon', changefreq: 'weekly', priority: 0.8 },
  { url: '/childcare', changefreq: 'weekly', priority: 0.8 },
  { url: '/ecommerce', changefreq: 'weekly', priority: 0.8 },
  { url: '/accounting', changefreq: 'weekly', priority: 0.8 },
  { url: '/marketing', changefreq: 'weekly', priority: 0.8 },
  { url: '/agency', changefreq: 'weekly', priority: 0.8 },
  { url: '/ai-agents-for-small-business', changefreq: 'weekly', priority: 0.9 },
  { url: '/ai-receptionist-small-business', changefreq: 'weekly', priority: 0.9 },
  { url: '/local-business-automation', changefreq: 'weekly', priority: 0.9 },
  { url: '/website-and-automation', changefreq: 'weekly', priority: 0.8 },
  { url: '/recovery', changefreq: 'weekly', priority: 0.7 },
  { url: '/missed-lead-follow-up', changefreq: 'weekly', priority: 0.7 },
  { url: '/partners', changefreq: 'monthly', priority: 0.6 },
  { url: '/referral', changefreq: 'monthly', priority: 0.5 },
  { url: '/extract', changefreq: 'monthly', priority: 0.6 },
]

export async function GET() {
  const stream = new SitemapStream({ hostname: 'https://eevolvv.com' })
  const xml = await streamToPromise(Readable.from(pages).pipe(stream)).then(String)
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
