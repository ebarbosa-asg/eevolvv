# SEO + Marketing Blitz — eevolvv

> **For Hermes:** Execute this plan task-by-task using subagent-driven-development. Each task is self-contained with exact file paths, complete code, and verification steps. Do not skip steps. Do not stop on errors — fix and continue.

**Goal:** Build an SEO machine that ranks eevolvv for "AI for [industry] business" searches, simplify the marketing page into a one-click buy flow, and produce marketing copy ready to ship.

**Architecture:** The site is a single Next.js app (app router, TypeScript, Tailwind). Industry pages live at `/dental`, `/legal`, `/real-estate`, etc. All use a consistent pattern: metadata export + ghost work grid + stats + pricing + CTA. The `/marketing` page is a standalone page with chaos/simple toggle and pricing cards.

**Tech Stack:** Next.js 14, TypeScript, Tailwind, JSON-LD for schema, Next.js sitemap, Stripe for checkout

---

## Phase 1: SEO Machine

### Task 1.1: Add JSON-LD LocalBusiness Schema to Root Layout

**Objective:** Inject LocalBusiness schema markup into every page via the root layout so Google understands eevolvv is a service business in Dallas, TX.

**Files:**
- Modify: `app/layout.tsx` — add JSON-LD script to `<head>`

**Step 1: Read current layout**

```bash
cat app/layout.tsx
```

**Step 2: Add schema script block**

After the `preconnect` link tags, add:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'eevolvv',
      alternateName: 'eevolvv, Inc.',
      url: 'https://eevolvv.com',
      description: 'AI operations team for growing businesses. We find ghost work, build AI agents, and turn every client engagement into a visible operating layer.',
      foundingDate: '2025',
      founder: { '@type': 'Person', name: 'Eduardo Barbosa' },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dallas',
        addressRegion: 'TX',
        addressCountry: 'US',
      },
      telephone: '+18444338658',
      priceRange: '$499 - $1,999/mo',
      sameAs: [
        'https://linkedin.com/company/eevolvv',
        'https://x.com/eevolvv',
      ],
    }),
  }}
/>
```

**Step 3: Verify layout passes build**

```bash
pnpm build 2>&1 | tail -20
```
Expected: no errors

**Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(seo): add LocalBusiness JSON-LD schema to root layout"
```

---

### Task 1.2: Add Service Schema to Every Industry Page

**Objective:** Each industry page gets a unique `Service` schema that describes that specific vertical. Google surfaces rich results for "AI for dental practices near me" etc.

**Files:**
- Create: `lib/schemas.ts` — schema generation helpers
- Modify: `app/dental/page.tsx` — add Service schema
- Modify: `app/legal/page.tsx` — add Service schema
- Modify: `app/real-estate/page.tsx` — add Service schema
- Modify: `app/fitness/page.tsx` — add Service schema
- Modify: `app/restaurant/page.tsx` — add Service schema
- Modify: `app/salon/page.tsx` — add Service schema
- Modify: `app/chiro/page.tsx` — add Service schema
- Modify: `app/cleaning/page.tsx` — add Service schema
- Modify: `app/contractors/page.tsx` — add Service schema
- Modify: `app/medspa/page.tsx` — add Service schema
- Modify: `app/auto-shop/page.tsx` — add Service schema
- Modify: `app/childcare/page.tsx` — add Service schema
- Modify: `app/ecommerce/page.tsx` — add Service schema
- Modify: `app/accounting/page.tsx` — add Service schema

**Step 1: Create schema helper**

Create `lib/schemas.ts`:

```tsx
export function serviceSchema(opts: {
  name: string
  description: string
  providerName: string
  areaServed: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    provider: {
      '@type': 'LocalBusiness',
      name: opts.providerName,
    },
    areaServed: {
      '@type': 'City',
      name: opts.areaServed,
    },
  }
}
```

**Step 2: Add schema to each industry page**

In each industry page's render function, add a `<script>` block with the vertical-specific schema. The schema content should match the page's specific vertical (e.g., for dental: "AI automation for dental practices", for legal: "AI automation for law firms").

Place it right before the closing `</main>` tag in each page:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(serviceSchema({
      name: 'AI Automation for Dental Practices',
      description: 'Dental offices recover 15–20 hrs/week by automating recalls, no-shows, and patient intake.',
      providerName: 'eevolvv, Inc.',
      areaServed: 'Dallas',
    })),
  }}
/>
```

Adjust name and description per vertical.

**Step 3: Verify**

```bash
pnpm build 2>&1 | tail -20
```

**Step 4: Commit**

```bash
git add lib/schemas.ts app/dental/page.tsx app/legal/page.tsx app/real-estate/page.tsx app/fitness/page.tsx app/restaurant/page.tsx app/salon/page.tsx app/chiro/page.tsx app/cleaning/page.tsx app/contractors/page.tsx app/medspa/page.tsx app/auto-shop/page.tsx app/childcare/page.tsx app/ecommerce/page.tsx app/accounting/page.tsx
git commit -m "feat(seo): add Service JSON-LD schema to all 15 industry pages"
```

---

### Task 1.3: Create Blog Section with SEO-Optimized Posts

**Objective:** Stand up a `/blog` section with 5 initial posts targeting high-value SEO keywords: "AI for small business", "ghost work audit", "how to automate local business", "AI receptionist cost", "small business automation tools".

**Files:**
- Create: `app/blog/page.tsx` — blog listing page
- Create: `app/blog/[slug]/page.tsx` — blog post page
- Create: `content/blog/` — directory for blog posts
- Create: `content/blog/ai-for-small-business.md`
- Create: `content/blog/what-is-ghost-work.md`
- Create: `content/blog/automate-local-business.md`
- Create: `content/blog/ai-receptionist-cost.md`
- Create: `content/blog/small-business-automation-tools.md`
- Create: `lib/blog.ts` — blog data loader

**Step 1: Create blog content directory**

```bash
mkdir -p content/blog
```

**Step 2: Create blog data loader (`lib/blog.ts`)**

This loads markdown files and returns frontmatter + content. Use gray-matter for parsing.

```tsx
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  content: string
}

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'))
  const posts = files.map(file => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8')
    const { data, content } = matter(raw)
    return {
      slug: file.replace('.md', ''),
      title: data.title,
      description: data.description,
      date: data.date,
      author: data.author || 'eevolvv',
      tags: data.tags || [],
      content,
    }
  })
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts()
  return posts.find(p => p.slug === slug) || null
}
```

**Step 3: Install gray-matter**

```bash
pnpm add gray-matter
```

**Step 4: Create first blog post**

Create `content/blog/ai-for-small-business.md`:

```markdown
---
title: "AI for Small Business: The 2026 Guide to Automating Operations"
description: "How small businesses use AI agents to automate follow-ups, scheduling, intake, and reporting — without hiring developers or buying expensive software."
date: "2026-05-18"
author: "eevolvv"
tags: ["AI for small business", "automation", "ghost work"]
---

**TL;DR:** Small businesses waste 15–20 hours/week on repetitive tasks that AI can handle. This guide covers what to automate first, how much it costs, and how to get started in 48 hours.

## What Is Ghost Work?

Every business has tasks that need to get done but don't directly generate revenue — follow-up emails, appointment reminders, intake forms, billing follow-ups. We call these "ghost work." They're invisible, they're time-consuming, and they compound.

### The Cost of Ghost Work

A typical small business owner spends:
- **4–6 hours/week** on client follow-ups and reminders
- **3–5 hours/week** on scheduling and rescheduling
- **2–4 hours/week** on manual intake and data entry
- **3–5 hours/week** on billing and collections follow-ups

Total: **12–20 hours/week** of non-revenue work that AI can handle.

## What to Automate First

Not everything needs automation at once. The highest-ROI automations are:

### 1. Missed Lead Follow-Up (ROI: 5x)
When a prospect calls and you miss them, that lead is dead 80% of the time unless you follow up within 5 minutes. AI handles this automatically — captures the lead, sends a text, books the appointment.

### 2. Appointment Reminders (ROI: 4x)
No-shows cost businesses $200–$300 per slot. Automated reminder sequences (7-day, 48-hr, 2-hr) cut no-shows by 30–50%.

### 3. Client Intake (ROI: 3x)
Replace paper forms with automated digital intake sent before the visit. Data flows directly into your system. No manual entry.

### 4. Review Requests (ROI: 2x)
Automated post-visit review requests at the right moment in the customer journey. More reviews = higher local SEO ranking = more customers.

## How Much Does AI for Small Business Cost?

**Realistic pricing in 2026:**
- **Single automation:** $499/month — one workflow, one agent page, weekly reports
- **Three automations:** $999/month — the sweet spot for most businesses
- **Full stack (5+ automations + ads/SEO):** $1,999/month

## Getting Started

The fastest way to start is a **free AI diagnostic** — a 10-minute conversation that maps your business and identifies exactly what to automate first. No signup, no credit card.

[Get your free AI audit →](https://eevolvv.com)
```

**Step 5: Create remaining 4 posts**

Same format, targeting these keywords:
- `content/blog/what-is-ghost-work.md` — "ghost work audit", "find ghost work in business"
- `content/blog/automate-local-business.md` — "how to automate local business", "local business automation"
- `content/blog/ai-receptionist-cost.md` — "AI receptionist cost", "AI answering service for small business"
- `content/blog/small-business-automation-tools.md` — "small business automation tools", "best AI tools for business"

**Step 6: Create blog listing page**

`app/blog/page.tsx`:

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

export default function BlogPage() {
  const posts = getAllPosts()
  return (
    <main style={{ background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'Space Grotesk, sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', borderBottom: '1px solid var(--rule)' }}>
        <a href="/" style={{ fontWeight: 700, fontSize: 18, textDecoration: 'none', color: 'var(--ink)' }}>eevolvv</a>
      </nav>
      <section style={{ padding: '80px 32px' }}>
        <div className="site-rail mx-auto" style={{ maxWidth: 720 }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, letterSpacing: '-2px', margin: '0 0 48px' }}>Blog</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {posts.map(post => (
              <article key={post.slug} style={{ borderBottom: '1px solid var(--rule)', paddingBottom: 32 }}>
                <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.5px' }}>{post.title}</h2>
                  <p style={{ fontSize: 15, opacity: 0.55, margin: '0 0 12px', lineHeight: 1.6 }}>{post.description}</p>
                  <div style={{ display: 'flex', gap: 16, fontSize: 13, opacity: 0.35 }}>
                    <span>{post.date}</span>
                    <span>{post.author}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
```

**Step 7: Create blog post page**

`app/blog/[slug]/page.tsx` — dynamic route that loads and renders the markdown post from lib/blog.ts.

**Step 8: Add blog to sitemap**

Add `{ url: '/blog', changefreq: 'weekly', priority: 0.9 }` to `app/sitemap.xml/route.ts`.

**Step 9: Verify build**

```bash
pnpm build 2>&1 | tail -20
```

**Step 10: Commit**

```bash
git add .
git commit -m "feat(blog): add blog section with 5 SEO-optimized posts"
```

---

### Task 1.4: Add Blog Posts to Sitemap Dynamically

**Objective:** The sitemap should include each blog post URL dynamically so Google indexes them.

**Files:**
- Modify: `app/sitemap.xml/route.ts` — load blog posts and add to pages array

**Step 1: Import getAllPosts**

Add to the top of `app/sitemap.xml/route.ts`:
```tsx
import { getAllPosts } from '@/lib/blog'
```

**Step 2: Add blog posts to pages**

After the static pages array:
```tsx
const blogPosts = getAllPosts().map(post => ({
  url: `/blog/${post.slug}`,
  changefreq: 'monthly' as const,
  priority: 0.8,
}))
```

Then merge `pages` and `blogPosts` in the stream.

**Step 3: Build + commit**

---

### Task 1.5: Audit and Improve Per-Industry Meta Descriptions

**Objective:** Every industry page's meta description should be unique, keyword-rich, and include a location signal + CTA. Current ones are good but can be stronger.

**Files:**
- Modify: meta descriptions in all 15 industry pages + the 3 landing pages + the marketing page

**Optimize each description to include:**
1. The industry keyword in first 10 words
2. A specific benefit (hours saved, revenue recovered)
3. A mini-CTA ("Free audit in 10 minutes")

Example improvement for dental:
```
"AI automation for dental practices in Dallas. Dental offices recover 15–20 hrs/week by automating recalls, no-shows, and patient intake. Free AI audit in 10 minutes. No signup."
```

---

## Phase 2: Dead Simple Marketing Page

### Task 2.1: Rewrite /marketing as a One-Click Buy Page

**Objective:** Transform the `/marketing` page into a 4-section page that a "baby can sign up from." Remove the chaos toggle, collapse to: Problem → Solution → Price → Buy. Every CTA goes to Stripe checkout (not a form, not a diagnostic).

**Files:**
- Overwrite: `app/marketing/page.tsx`

**Design principles:**
- 4 sections max
- No toggle/interaction gimmicks (the chaos toggle is clever but adds friction)
- Hero states the problem in 5 words → solution → pricing → buy button
- "Free diagnostic" is a secondary option below the buy buttons
- The page should take 15 seconds to understand and 30 seconds to buy

**Section 1 — Hero:**
```
Headline: Your business is running on 16 tools. We replace them with one.
Sub: AI agents handle follow-ups, scheduling, intake, reports, and billing. You handle clients.
CTA: Start at $499/mo → (links to Stripe checkout for Agent One)
```

**Section 2 — How It Works (3 steps, no toggle):**
1. We audit (10 min AI diagnostic)
2. We build (48 hours, first automation live)
3. You work (agents run, you get reports)

**Section 3 — Pricing (3 tiers, same as now but buy buttons go to Stripe):**
Agent One $499, Agent Three $999 (highlighted), Agent Five $1,999

**Section 4 — Trust + CTA:**
Stats bar (48hrs, $499/mo, 10 min, 0 tech) + "Free diagnostic available" secondary CTA

**Key rules:**
- Every pricing card has a real href to Stripe checkout
- No email capture required to see pricing
- No signup required to buy
- Mobile-first layout

---

### Task 2.2: Add Stripe Checkout Links

**Objective:** Generate real Stripe checkout links for each tier and wire them into the buy buttons on `/marketing` and `/pricing`.

**Files:**
- Modify: Environment or config with Stripe price IDs
- Modify: Buy button hrefs on `/marketing/page.tsx` and `/pricing/PricingTiers.tsx`

The checkout links should include:
- `?tier=seed` / `?tier=core` / `?tier=evolve` query params for tracking
- UTM parameter passthrough for campaign tracking
- `prefilled_email` capture on Stripe's checkout page

If Stripe price IDs don't exist yet, create placeholder links like `/api/checkout?tier=seed` and implement a simple redirect endpoint.

---

### Task 2.3: Create Stripe Checkout API Route

**Objective:** Create a `/api/checkout` endpoint that creates a Stripe Checkout Session and redirects to Stripe.

**Files:**
- Create: `app/api/checkout/route.ts`

```tsx
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

const PRICE_IDS: Record<string, string> = {
  seed: process.env.STRIPE_PRICE_SEED!,
  core: process.env.STRIPE_PRICE_CORE!,
  evolve: process.env.STRIPE_PRICE_EVOLVE!,
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tier = searchParams.get('tier') || 'core'
  const priceId = PRICE_IDS[tier]
  if (!priceId) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/onboard/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
  })

  return NextResponse.redirect(session.url!, 303)
}
```

---

### Task 2.4: Link the Marketing Page from Main Nav

**Objective:** Add a "Buy" link to the main homepage nav.

**Files:**
- Modify: `app/page.tsx` — add "/marketing" link to SiteHeader

Change the nav links to include:
```tsx
<a href="/marketing" style={{ color: 'var(--accent)', fontWeight: 700 }}>Buy</a>
```

---

## Phase 3: Marketing Copy

### Task 3.1: Create 5 Text Posts Ready to Copy-Paste

**Objective:** Produce 5 short-form posts that Eduardo can copy-paste into SMS, text, or DM. Each one explains what eevolvv does in a way a busy business owner understands in 5 seconds.

**Files:**
- Create: `docs/marketing/sms-scripts.md`

Each post follows the format:
```
[hook in 5 words]
[one-sentence explanation]
[one-sentence proof/social]
[link]
```

Example 1:
```
Your business runs on 16 tools. We replace them with one.
AI handles follow-ups, scheduling, intake, reports, billing.
You handle clients. $499/mo. 48-hour setup.
eevolvv.com/marketing
```

Write 5 variations covering different angles:
1. **Cost angle:** "AI for your business costs less than a part-time employee"
2. **Time angle:** "You lose 15 hours a week to tasks your AI could do"
3. **Simplicity angle:** "Three clicks to automate your business"
4. **Fear angle:** "Your competitors are automating. You're still doing it manually."
5. **Direct angle:** "Stop running your business manually. Here's how."

---

### Task 3.2: Create 5 Social Posts for LinkedIn/X

**Objective:** 5 LinkedIn/X-ready posts explaining ghost work and eevolvv.

**Files:**
- Create: `docs/marketing/social-posts.md`

Each post is a short-form (~200 chars for X, ~500 chars for LinkedIn) with:
- Hook
- Body
- Link/CTA
- 1-2 relevant hashtags

---

### Task 3.3: Create Follow-Up SMS Templates for Leesa

**Objective:** Produce 3 follow-up SMS messages for Leesa at Studio 23.

**Files:**
- Create: `docs/marketing/leesa-followup.md`

Templates should:
1. Ask if she received the Evolution Report
2. Offer to book a 10-min call
3. Mention a specific result tailored to her business

---

## Phase 4: Funnel Optimization

### Task 4.1: Add "Buy Now" Button on Evolution Report Page

**Objective:** Users who complete the diagnostic and see their report should see a "Buy Now" button that goes to checkout.

**Files:**
- Check: `app/report/` directory structure
- Add: pricing CTAs in the report output

### Task 4.2: Add UTM Parameter Tracking to All Buy Links

**Objective:** Every buy link across the site captures `utm_source`, `utm_medium`, `utm_campaign` and passes them through to Stripe.

**Files:**
- Modify: All buy buttons to include `prefilled_email` capture
- Modify: `/api/checkout` to pass UTM data

---

## Verification

After all tasks are complete:

1. **Build check:**
```bash
pnpm build 2>&1 | grep -i error
```
Expected: zero errors

2. **Sitemap check:**
```bash
curl -s https://eevolvv.com/sitemap.xml | grep -c "<url>"
```
Expected: 35+ URLs (previous 30 + blog listing + 5 posts)

3. **Schema check:**
```bash
curl -s https://eevolvv.com | grep -c "application/ld+json"
```
Expected: 2 (LocalBusiness + one more)

4. **Page load check:**
```bash
curl -s -o /dev/null -w "%{http_code}" https://eevolvv.com/marketing
```
Expected: 200

**When verification passes:**
```bash
git push origin main
```