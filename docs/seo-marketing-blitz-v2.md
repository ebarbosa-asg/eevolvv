# SEO + Marketing Blitz — Expanded (v2)

> **For Hermes:** Execute EVERY task below. Do not skip, do not stop on errors. Trust no self-report — verify every file was created/modified by reading it back.
>
> **Context:** Single Next.js 14 app at `/Users/loko/eevolvv`. App router, TypeScript, Tailwind.
> Design system: warm light-mode (--paper #faf7f0, --ink #141413, --accent oklch(0.45 0.13 25)).
> Fonts: Space Grotesk, JetBrains Mono, Newsreader.
> Package manager: `pnpm`. Use `cd /Users/loko/eevolvv && pnpm build` to verify.
> Entity name: always "eevolvv, Inc." in legal/UI copy.
>
> **Anti-slop rule:** No bg-black/cyan-500/white for page styling unless specified. Use design system tokens. No generic SaaS tropes. High-fidelity minimal design.

---

## Phase 1: SEO Machine

### Task 1.1: Add JSON-LD LocalBusiness Schema to Root Layout ⚡DONE

Already added to `app/layout.tsx`.

### Task 1.2: Add Service Schema to Every Industry Page ⚡DONE

Service schema added to all 15 industry pages via `lib/schemas.ts`.

### Task 1.3: Add FAQ Schema to Industry Pages

**Objective:** Each industry page gets FAQ structured data for Google rich results. FAQ schema triggers expandable Q&A in search results.

**Files:**
- Modify: All 15 industry pages — append FAQ schema after the Service schema

**Implementation:**
Add a second `<script type="application/ld+json">` block with FAQPage schema. Each industry should have 4-5 FAQ items specific to that vertical.

Example for dental:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does AI automation cost for a dental practice?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI automation for dental practices starts at $499/month for a single workflow (Agent One) and $999/month for three workflows (Agent Three). Most dental offices see ROI in the first month."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up AI for a dental office?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The first automation is live within 48 hours. The full diagnostic takes 10 minutes online with no signup required."
      }
    },
    {
      "@type": "Question",
      "name": "Can AI work with Dentrix or Eaglesoft?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. eevolvv integrates with Dentrix, Eaglesoft, Open Dental, Carestream, Weave, NexHealth, and other major dental practice management platforms."
      }
    },
    {
      "@type": "Question",
      "name": "What's the ROI of AI automation for a dental practice?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most dental practices recover 15-20 hours per week and $2K-$4K per month in lost revenue from no-shows, missed recalls, and manual intake."
      }
    }
  ]
}
```

Create a helper in `lib/schemas.ts`:
```tsx
export function faqSchema(questions: { name: string; text: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.name,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.text,
      },
    })),
  }
}
```

Add FAQ question sets to each industry page and render them as a visible FAQ section on the page (not just hidden schema). This gives users value AND triggers rich results.

**To keep this manageable, do it for the top 5 industry pages:** dental, legal, real-estate, fitness, contractors.

**Verify:**
```bash
pnpm build 2>&1 | grep -i error
```
No errors.

---

### Task 1.4: Add BreadcrumbList Schema to Layout

**Objective:** Every page gets BreadcrumbList schema so Google shows breadcrumb trails in search results.

**Files:**
- Modify: `app/layout.tsx` — add function that generates breadcrumb schema per path

**Implementation:**
Create a `BreadcrumbSchema` component in `lib/schemas.ts`:

```tsx
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `https://eevolvv.com${item.url}`,
    })),
  }
}
```

Then use in each industry page. For simplicity, add a generic breadcrumb to the root layout that just shows "eevolvv" for now.

**Verify:** Build passes.

---

### Task 1.5: Create Blog Section (10 Posts)

**Objective:** Stand up `/blog` with 10 SEO-optimized posts targeting high-value keywords.

**Files:**
- `lib/blog.ts` ✅ DONE
- `content/blog/` (10 posts)
- `app/blog/page.tsx` — listing page
- `app/blog/[slug]/page.tsx` — post page
- `content/blog/` directory

#### Blog Posts to Create:

1. `ai-for-small-business.md` ✅ DONE — "AI for small business", "small business automation"
2. `what-is-ghost-work.md` — "ghost work audit", "ghost work in business"
3. `automate-local-business.md` — "how to automate local business", "local business automation"
4. `ai-receptionist-cost.md` — "AI receptionist cost", "AI answering service cost"
5. `small-business-automation-tools.md` — "small business automation tools", "best AI for business"
6. `ai-for-dental-practices.md` — "AI for dental practices", "dental office automation"
7. `ai-for-law-firms.md` — "AI for law firms", "legal practice automation"
8. `reduce-no-shows-business.md` — "reduce no-shows", "appointment reminder automation"
9. `lead-follow-up-automation.md` — "lead follow-up automation", "missed call follow-up"
10. `ai-for-contractors.md` — "AI for contractors", "contractor automation"

Each post follows this format:
- YAML frontmatter: title, description (under 160 chars for SERP), date, author, tags (up to 5)
- Body: 500-1000 words, 3-4 subheadings, 1-2 bullet lists
- Internal link to eevolvv.com (the diagnostic) at the bottom
- No promotional fluff — genuinely useful content

#### Blog Listing Page (`app/blog/page.tsx`)

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog — eevolvv | AI Operations for Business',
  description: 'Guides on AI automation, ghost work, and building autonomous operations for small and local businesses.',
  alternates: { canonical: 'https://eevolvv.com/blog' },
  openGraph: {
    title: 'Blog — eevolvv',
    description: 'Guides on AI automation, ghost work, and building autonomous operations.',
    url: 'https://eevolvv.com/blog',
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
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', borderBottom: '1px solid var(--rule)' }}>
        <a href="/" style={{ fontWeight: 700, fontSize: 18, textDecoration: 'none', color: 'var(--ink)', letterSpacing: '-0.5px' }}>eevolvv</a>
      </nav>
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
                    {post.tags.map(tag => (
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
```

#### Blog Post Page (`app/blog/[slug]/page.tsx`)

Render the markdown content. Since we're using gray-matter (import with `import matter from 'gray-matter'`), the content comes as markdown strings. Render them as formatted HTML on the page. Use simple React rendering (no markdown-to-jsx needed — just display the content as pre-formatted text or use a simple markdown renderer).

Actually, simplest approach: display the blog content in a clean reading layout. The content field has markdown — convert `<h2>` tags, `<p>` tags, `<ul>` tags, etc. manually in the render, or use a simple approach like rendering the raw markdown in a `<pre>`-ish styled div with proper typography.

Better yet: use a `<div>` with proper typography CSS and render the content. Since markdown is just text with # headers and - bullets, we can style those with CSS.

If the project already has `react-markdown` or similar, use it. Otherwise render the content in a `<div>` with CSS that styles `h2, h3, p, ul, li, a` appropriately.

Add Article schema to the blog post page:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      author: { '@type': 'Organization', name: 'eevolvv' },
    }),
  }}
/>
```

**Verify:**
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/blog
```
Expected: 200 (or build passes for static)

---

### Task 1.6: Add Blog to Sitemap Dynamically

**Files:**
- Modify: `app/sitemap.xml/route.ts`

Add import and merge blog posts into the sitemap:
```tsx
import { getAllPosts } from '@/lib/blog'
```

After the static pages array:
```tsx
const blogPosts = getAllPosts().map(post => ({
  url: `/blog/${post.slug}`,
  changefreq: 'monthly' as const,
  priority: 0.8,
}))
```

Merge: `const allPages = [...pages, ...blogPosts]`

**Verify:**
```bash
cd /Users/loko/eevolvv && pnpm build 2>&1 | tail -10
```

---

### Task 1.7: Create RSS Feed for Blog

**Objective:** RSS feed at `/feed.xml` so Google News and RSS readers can pick up blog posts.

**Files:**
- Create: `app/feed.xml/route.ts`

```tsx
import { getAllPosts } from '@/lib/blog'

export async function GET() {
  const posts = getAllPosts()
  const items = posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>https://eevolvv.com/blog/${post.slug}</link>
      <guid>https://eevolvv.com/blog/${post.slug}</guid>
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
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
```

---

### Task 1.8: Add Breadcrumb + Article Schema to Blog Pages

Each blog post page gets:
1. `Article` schema ✅ (covered in Task 1.5)
2. `BreadcrumbList` schema

---

### Task 1.9: Enhance Per-Industry Meta Descriptions

**Objective:** Every industry page already has metadata. Review and tighten them for maximum click-through rate in SERPs.

**Formula:** `[Industry-specific keyword phrase] + [specific benefit in hours/dollars] + [location signal] + [mini-CTA]`

Example for dental (current):
```
"AI automation for dental practices in Dallas. Dental offices recover 15–20 hrs/week by automating recalls, no-shows, and patient intake. Free AI audit in 10 minutes. No signup."
```

Tighten for every industry page. Ensure:
- First 10 words contain the primary keyword
- Contains a specific number (hours saved, % improvement)
- Ends with a CTA ("Free audit in 10 minutes")
- Under 160 characters

**Files:** All 15 industry pages + 3 landing pages. Read each one and update its metadata export.

---

## Phase 2: Dead Simple Marketing Page

### Task 2.1: Rewrite /marketing as One-Click Buy Page

**Objective:** Transform `/marketing` into a page so simple a child can sign up. Remove the chaos toggle. 4 sections max. Every CTA → Stripe checkout.

**Files:**
- Overwrite: `app/marketing/page.tsx`

**Design brief:** Warm theme (var(--paper) bg, var(--ink) text). Minimal. High-fidelity.

**Section 1 — Hero:**
```
Headline: Your business runs on 16 tools. We replace them with one.
Sub: AI agents handle follow-ups, scheduling, intake, reports, billing. You handle clients.
CTA: Start at $499/mo → (links to /api/checkout?tier=seed)
```

**Section 2 — How It Works (3 steps, no toggle):**
1. We audit (10 min AI conversation)
2. We build (48 hours, first automation live)
3. You work (agents run, you get weekly reports)

Display as 3 columns with step numbers. Clean, no fluff.

**Section 3 — Pricing (3 tiers, buy buttons → Stripe):**

| Agent One $499 | Agent Three $999 | Agent Five $1,999 |
|----------------|------------------|-------------------|
| 1 workflow | 3 workflows | 5+ workflows |
| Agent page | Agent page | Agent page |
| Weekly reports | Wkly+mo reports | Ads+SEO managed |
| Direct to Eduardo | Optimization call | Priority response |
| **Buy Agent One →** | **Buy Agent Three →** | **Buy Agent Five →** |

Agent Three highlighted (MOST POPULAR badge). Each buy button links to `/api/checkout?tier=seed` / `core` / `evolve`.

Below the pricing: "Free diagnostic available →" linking to the homepage diagnostic.

**Section 4 — Trust Strip:**
```
48hrs first automation | $499/mo starting | 10 min audit | 0 tech required
```

**Footer:** Simple, minimal.

**Add Article/site links:** Include `<link rel="canonical" href="https://eevolvv.com/marketing" />` in metadata.

**Design rules for this page:**
- Use Tailwind classes OR inline styles (whichever the project uses) — check existing pages
- Mobile-first layout (single column on mobile, grid on desktop)
- No icon-heavy grids
- Clean typography using Space Grotesk
- Buy buttons must be obvious (high contrast, large tap target)
- Add `rel="noreferrer"` on external links

---

### Task 2.2: Create Stripe Checkout API Route

**Objective:** `/api/checkout?tier=seed|core|evolve` redirects to Stripe Checkout Session.

**Files:**
- Create: `app/api/checkout/route.ts`

To avoid requiring the Stripe SDK install/build issues, use a simpler approach: create a response that describes to the user what Stripe price IDs to create. OR use the fetch-based Stripe API.

**Simpler approach:** Since we don't have Stripe price IDs yet, create the route that either:
a) Uses Stripe SDK if STRIPE_SECRET_KEY is set
b) Falls back to a "Coming soon" redirect

```tsx
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tier = searchParams.get('tier') || 'core'

  const tierNames: Record<string, string> = {
    seed: 'Agent One ($499/mo)',
    core: 'Agent Three ($999/mo)',
    evolve: 'Agent Five ($1,999/mo)',
  }

  const name = tierNames[tier] || 'eevolvv'

  // If Stripe is configured, create a checkout session
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-02-24.acacia',
      })
      const PRICE_IDS: Record<string, string> = {
        seed: process.env.STRIPE_PRICE_SEED!,
        core: process.env.STRIPE_PRICE_CORE!,
        evolve: process.env.STRIPE_PRICE_EVOLVE!,
      }
      const priceId = PRICE_IDS[tier]
      if (priceId) {
        const session = await stripe.checkout.sessions.create({
          mode: 'subscription',
          line_items: [{ price: priceId, quantity: 1 }],
          success_url: `${process.env.NEXT_PUBLIC_URL || 'https://eevolvv.com'}/onboard/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: 'https://eevolvv.com/pricing',
        })
        return NextResponse.redirect(session.url!, 303)
      }
    } catch (e) {
      // fall through to placeholder
    }
  }

  // Placeholder: show a page saying "Ready to buy {name}"
  return new Response(`
    <!DOCTYPE html>
    <html><body style="font-family:sans-serif;text-align:center;padding:80px">
      <h1>Ready to buy ${name}?</h1>
      <p style="color:#666">Stripe checkout coming online. Email hello@eevolvv.com to subscribe.</p>
      <a href="/pricing" style="color:#000">← Back to pricing</a>
    </body></html>
  `, {
    headers: { 'Content-Type': 'text/html' },
  })
}
```

**Import Stripe:**
```bash
pnpm add stripe
```

---

### Task 2.3: Add "Buy" Link to Main Nav

**Files:**
- Modify: `app/page.tsx` (SiteHeader component)

Add a `/marketing` link styled distinctively:
```tsx
<a href="/marketing" style={{ color: 'var(--accent)', fontWeight: 700 }}>Buy</a>
```

---

### Task 2.4: Add Checkout CTAs to the Diagnostic Report Page

**Objective:** Users who run the diagnostic and see their report should see "Buy [Recommended Tier]" buttons.

**Files:**
- Check: `app/report/[id]/page.tsx`
- Check: any report page components

Add a pricing CTA block at the bottom of the report output. Style it to blend with the report design.

If the report page already has a pricing section, verify it links to real checkout URLs. If not, add one.

---

## Phase 3: Marketing Copy Files

### Task 3.1: Create SMS Templates

**Files:**
- Create: `docs/marketing/sms-scripts.md`

Write 10 SMS templates:

**A. Cold Outreach (3 variations):**
1. **Direct:** "Hey [Name], I help [industry] businesses automate follow-ups so you never lose another lead. Want to see a free audit of your current setup? — Eduardo, eevolvv"
2. **Problem-first:** "Your missed calls are costing you $[X]/week. We install AI that texts them back instantly and books jobs. $499/mo. — Eduardo"
3. **Social proof:** "I just helped [similar business] recover 15 hrs/week on intake alone. Quick call to see if we can do the same for you? — Eduardo"

**B. Follow-Up (3 variations):**
4. **Soft check-in:** "Hey [Name], Eduardo from eevolvv. Did you get a chance to look at the report? Happy to walk through it in 5 min."
5. **Direct close:** "You're losing [X hrs/week] to tasks we can automate. Ready to start? First automation live in 48hrs. Reply YES and I'll send the link."
6. **Objection handler:** "Too busy to set this up? That's the point — we do the setup. You just show up to work. Takes 10 min to audit."

**C. Client Retention (2 variations):**
7. **Monthly check-in:** "Your agents ran [X] automations this month. That's [Y] hours saved. Report: [link]. Anything to improve?"
8. **Referral ask:** "Know another business owner losing time to manual work? Send them my way. Happy to help them too. — Eduardo"

**D. Leesa-specific (2 variations):**
9. **Follow-up:** "Hey Leesa, Eduardo from eevolvv. How's the AI agent page working for Studio 23? Got a few ideas I'd love to share for next month's optimization."
10. **Upsell:** "Saw your agent stats this month — solid numbers. I think we could add lead intake automation to catch after-hours calls. Want me to scope it?"

---

### Task 3.2: Create Social Posts (LinkedIn/X)

**Files:**
- Create: `docs/marketing/social-posts.md`

Write 5 posts ready to copy-paste:

**Post 1 — The ghost work problem:**
"Your business runs on 16 tools. Email, texts, spreadsheets, scheduling, invoicing, follow-ups, reviews, ads...

Most owners spend 15 hrs/week just keeping these running.

We replace them with one AI operation layer.

$499/mo. 48hr setup. No tech required.

eevolvv.com/marketing"

**Post 2 — The cost of manual:**
"A missed call today costs you $200-300 in lost revenue.

Not because the customer won't call back — because 80% of missed leads never call again.

We built AI that texts them back within 60 seconds. Books the appointment. No voicemail.

First automation live in 48 hours."

**Post 3 — How simple it is:**
"Three steps to automate your business:

1. 10-min AI audit (free)
2. We build 48hrs
3. You get time back

That's it. No contracts. Cancel anytime.

Start at $499/mo."

**Post 4 — Social proof:**
"I just helped [industry] recover [X hrs/week].

They're running on autopilot now — follow-ups, reminders, reports, all handled by AI.

Their clients don't know the difference. Their bottom line does."

**Post 5 — Fear/urgency:**
"AI for business isn't coming. It's already here.

Your competitors are automating follow-ups while you're still doing them by hand.

The question isn't if you'll adopt AI — it's when.

Free audit. 10 minutes. No signup."

---

### Task 3.3: Create Email Sequences

**Files:**
- Create: `docs/marketing/email-sequences.md`

Write 3 email sequences (3 emails each):

**Sequence A: Post-Diagnostic Nurture** (sent after someone runs the free audit)
- Email 1 (Day 0): "Your Evolution Report is ready" — includes report summary + CTA to buy
- Email 2 (Day 3): "Here's what [similar business] recovered" — social proof case study
- Email 3 (Day 7): "Last chance to start at $499/mo" — limited-time offer CTA

**Sequence B: Abandoned Cart** (someone clicked pricing but didn't buy)
- Email 1 (Day 1): "Still thinking? Here's exactly what you get"
- Email 2 (Day 3): "Quick question — what's holding you back?"
- Email 3 (Day 7): "Your free audit is still waiting"

**Sequence C: Re-Engagement** (cold prospects, >30 days since last contact)
- Email 1: "We built something new since we last talked"
- Email 2: "Quick question about your [industry] business"
- Email 3: "Last email — here's the direct link to start"

---

## Phase 4: Funnel Optimization

### Task 4.1: Add Buy CTAs on Diagnostic Report Page

**Files:**
- Read: `app/report/[id]/page.tsx` — check current structure
- Modify: Add pricing CTAs

### Task 4.2: Add Post-Diagnostic Redirect to /marketing

After the diagnostic completes, redirect users to /marketing with their recommended tier pre-selected.
- Add `?recommended=core` query param
- On /marketing, auto-scroll to pricing and highlight the recommended tier

### Task 4.3: Link Blog Posts to Industry Pages

Each blog post about a specific industry should link back to the corresponding industry page. Example: "AI for dental practices" post links to `/dental`.

This is an internal linking SEO win. Add at the bottom of each industry-specific blog post:
```markdown
[Learn more about AI automation for your industry →](/dental)
```

---

## Verification

After ALL tasks:

```bash
cd /Users/loko/eevolvv
pnpm build 2>&1 | grep "error" | grep -v "node_modules" | grep -v "Pre-existing"
```
Expected: zero errors from our changes.

```bash
git add -A
git status
git commit -m "feat: seo + marketing blitz v2 — schema, blog (10 posts), buy page, checkout, copy"
git push origin main
```

Then summarize in the final response:
1. What was built (by phase)
2. Key URLs: /blog, /marketing, /api/checkout, /feed.xml
3. Copy files location: docs/marketing/
4. Blog posts count and slugs
5. Industry pages with schema