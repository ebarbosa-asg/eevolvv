import { getAllPosts } from '@/lib/blog'

export async function GET() {
  const posts = getAllPosts()

  const feedItems = posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>https://eevolvv.com/blog/${post.slug}</link>
      <guid isPermaLink="true">https://eevolvv.com/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>
  `).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>eevolvv Blog</title>
    <description>AI operations, ghost work, and business automation guides</description>
    <link>https://eevolvv.com</link>
    <atom:link href="https://eevolvv.com/feed.xml" rel="self" type="application/rss+xml"/>
    ${feedItems}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=600', // Cache for 10 minutes
    },
  })
}
