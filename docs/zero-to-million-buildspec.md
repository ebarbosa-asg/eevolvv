# eevolvv — $0 to $1M ARR : Full Build Spec for Claude Code

**Context:** Single Next.js 14 app at `/Users/loko/eevolvv`  
**Stack:** App Router, TypeScript, Tailwind, Supabase, Resend, Stripe  
**Design:** Warm light-mode (--paper #faf7f0, --ink #141413, --accent oklch(0.45 0.13 25))  
**Fonts:** Space Grotesk (display), JetBrains Mono (mono), Newsreader (serif)  
**Package manager:** `pnpm`  
**Entity name:** Always "eevolvv, Inc."  
**Toll-free:** +1 (844) 433-8658  
**Key files to reference:** `lib/blog.ts` (blog data layer), `lib/vertical-data.ts` (industry configs), `lib/schemas.ts` (schema helpers), `lib/supabase.ts` (Supabase client), `app/layout.tsx` (root layout)

Do NOT modify design system tokens, color variables, or existing component patterns unless explicitly instructed. Follow existing code conventions in the repo.

---

## WORKSTREAM 1: CONTENT MACHINE

### 1.1 Blog Generation Pipeline Script

Create `scripts/generate-blog-posts.ts` — a script that generates SEO-optimized blog posts using AI via OpenRouter API and publishes them to `content/blog/`.

**Requirements:**
- Reads a `TOPICS` array of 240 keyword targets (see 1.3)
- Generates 3 posts per run (set for 3x/day cron)
- Each post: 800-1200 words, 3-5 subheadings, YAML frontmatter with title/description/date/author/tags
- Uses `OPENROUTER_API_KEY` from env
- Model: `anthropic/claude-sonnet-4` (or `deepseek/deepseek-v4-flash` for speed)
- Prompt: "Write an SEO-optimized blog post about [topic] targeting [keyword]. 800-1200 words. Include 3-5 subheadings. 1 internal link to eevolvv.com/diagnostic. YAML frontmatter with title, description (<155 chars), date (today), author (eevolvv), tags (3-5). Return valid markdown."
- Saves files to `content/blog/{slug}.md` where slug is URL-ified title
- Skips if slug already exists (no duplicates)
- Logs progress to stdout
- Rate-limit: wait 2s between posts to avoid API throttling

### 1.2 Blog Generation Cron Config

Set up a Hermes cron job: `eevolvv-blog-generator`  
- Schedule: three times daily (6am, 12pm, 6pm CDT) — override current weekly schedule  
- Script: `scripts/generate-blog-posts.ts`  
- Skills: none needed (self-contained script)  
- Run from workdir: `/Users/loko/eevolvv`

After each run, post a tweet: "New blog post: [title] → eevolvv.com/blog/[slug]"  
(hook into the X/Twitter queue system from WS3)

### 1.3 240 Blog Post Topic Targets — 24 Industries × 10

```typescript
const INDUSTRY_TOPICS: Record<string, string[]> = {
  dental: [
    "how much does AI cost for a dental practice",
    "dental office automation for appointment reminders",
    "automating insurance verification for dentists",
    "how to reduce dental no-shows with AI",
    "AI for dental recall campaigns automatic",
    "dental practice management AI tools 2026",
    "automate dental patient intake forms",
    "AI voice assistant for dental offices",
    "dental office workflow automation ROI",
    "best AI scheduling software for dentists",
  ],
  legal: [
    "AI for law firms automating client intake",
    "legal practice management AI tools",
    "automate legal document intake for attorneys",
    "AI receptionist for law firms cost",
    "how law firms use AI for lead follow up",
    "legal case management automation software",
    "AI for personal injury law firms",
    "automating legal consultation scheduling",
    "law firm client communication automation",
    "best AI tools for solo attorneys 2026",
  ],
  "real-estate": [
    "AI for real estate agents lead follow up",
    "automate real estate client intake system",
    "real estate CRM automation AI",
    "AI for property management companies",
    "automate real estate showing scheduling",
    "best AI tools for real estate agents 2026",
    "AI lead response for real estate",
    "real estate transaction automation software",
    "automate real estate review requests",
    "AI for real estate investor operations",
  ],
  fitness: [
    "AI for gyms and fitness studios",
    "automate gym membership management",
    "fitness studio scheduling automation",
    "AI personal trainer appointment system",
    "gym membership retention automation",
    "automate fitness client intake forms",
    "best AI tools for gym owners 2026",
    "AI for personal trainers client management",
    "fitness business automation ROI",
    "automate fitness class booking system",
  ],
  restaurant: [
    "AI for restaurant reservation management",
    "restaurant reservation system automation",
    "automate restaurant customer follow up",
    "AI for restaurant marketing automation",
    "restaurant online ordering automation",
    "best AI tools for restaurant owners 2026",
    "automate restaurant review collection",
    "AI for restaurant staff scheduling",
    "restaurant table management automation",
    "reduce restaurant no shows with AI",
  ],
  contractors: [
    "AI for contractors lead management",
    "contractor quoting and estimate automation",
    "automate contractor scheduling system",
    "best AI tools for construction businesses",
    "contractor customer follow up automation",
    "AI for home improvement contractors",
    "automate contractor review requests",
    "HVAC business automation software",
    "plumber lead response automation AI",
    "contractor project management AI tools",
  ],
  salon: [
    "AI for hair salons booking system",
    "salon appointment reminder automation",
    "salon client management AI tools",
    "automate salon marketing follow up",
    "best AI tools for salon owners 2026",
    "salon text message appointment reminders",
    "AI for nail salon operations",
    "salon review collection automation",
    "barber shop scheduling automation",
    "salon customer retention automation",
  ],
  chiropractic: [
    "AI for chiropractic offices patient intake",
    "chiropractor appointment automation system",
    "chiropractic practice management AI",
    "automate chiropractic insurance verification",
    "chiropractor patient recall automation",
    "best AI tools for chiropractors 2026",
    "chiropractic no show reduction AI",
    "automate chiropractic patient forms",
    "AI for chiropractic billing and coding",
    "chiropractic marketing automation software",
  ],
  cleaning: [
    "AI for cleaning businesses lead management",
    "cleaning service scheduling automation",
    "automate cleaning business customer follow up",
    "cleaning company estimate automation",
    "best AI tools for cleaning business owners",
    "cleaning service route optimization automation",
    "AI for house cleaning businesses",
    "cleaner customer review automation",
    "commercial cleaning business automation",
    "cleaning service recurring booking AI",
  ],
  "med-spa": [
    "AI for med spas client intake",
    "med spa appointment scheduling automation",
    "automate med spa patient follow up",
    "med spa marketing automation AI",
    "best AI tools for med spa owners 2026",
    "med spa patient retention automation",
    "AI for aesthetic clinic operations",
    "med spa review collection automation",
    "automate med spa consultation booking",
    "med spa inventory management AI",
  ],
  "auto-shop": [
    "AI for auto repair shops customer intake",
    "auto shop appointment scheduling automation",
    "automate auto repair customer follow up",
    "best AI tools for auto shop owners 2026",
    "auto repair shop marketing automation",
    "AI for tire shops and service centers",
    "automate auto shop estimate requests",
    "auto repair customer review automation",
    "car dealership service center automation",
    "auto shop text message reminders",
  ],
  childcare: [
    "AI for daycare centers parent communication",
    "childcare enrollment automation software",
    "automate daycare billing and payments",
    "daycare parent communication AI tools",
    "best AI tools for childcare centers 2026",
    "AI for preschool operations management",
    "automate childcare waitlist management",
    "daycare attendance tracking automation",
    "childcare marketing automation",
    "AI for after school programs",
  ],
  accounting: [
    "AI for accounting firms client intake",
    "automate accounting appointment scheduling",
    "accounting firm client communication AI",
    "best AI tools for accountants 2026",
    "AI for CPA firms document collection",
    "automate tax preparation client intake",
    "accounting practice management AI",
    "AI for bookkeeping businesses",
    "accountant lead follow up automation",
    "tax firm client portal automation",
  ],
  general: [
    "what is ghost work in business operations",
    "how to find ghost work in your business",
    "ghost work audit step by step guide",
    "small business automation ROI calculator",
    "AI receptionist vs human receptionist cost",
    "how much does business automation cost",
    "best AI tools for small businesses 2026",
    "small business workflow automation guide",
    "automate business operations without coding",
    "AI for small business FAQ guide",
  ],
  // Fill remaining 10 industries with similar patterns — each industry gets 10 keyword-specific posts
}
```

**Total: 240 posts minimum.** If the pipeline finishes early, add more.

### 1.4 Blog Post Template

Every post follows this structure:

```markdown
---
title: "How [Industry] Businesses [Benefit] with AI Automation"
description: "[Industry-specific pain point] costs [business type] [X hours/$]. Learn how AI automation solves [specific problem] with actionable steps. Free audit in 10 minutes."
date: "2026-05-27"
author: "eevolvv"
tags: ["[industry]", "[topic]", "AI automation", "small business"]
---

## The Problem: [Pain point headline]

[200-300 words describing the specific problem in this industry]

## How AI Automation Solves This

[200-300 words with specific solution]

## Step-by-Step Implementation Guide

1. [Step 1]
2. [Step 2]
3. [Step 3]

## What Results to Expect

[100-200 words with specific metrics/outcomes]

## Get Started Today

Ready to find out exactly what AI automation can do for your [industry] business? [Run the free 10-minute AI diagnostic →](https://eevolvv.com/diagnostic) No signup required. Instant report.
```

---

## WORKSTREAM 2: GHOST WORK RECEIPT GENERATOR

### 2.1 Route Setup

Create `app/ghost-work-receipt/page.tsx` — a standalone page at `/ghost-work-receipt`.

**Layout:** Centered column, max-width 560px, warm theme. Single purpose: generate a receipt.

### 2.2 Form Fields

| Field | Type | Options |
|-------|------|---------|
| Business name | Text input | Free text |
| Business type | Dropdown | Dental, Legal, Real Estate, Fitness, Restaurant, Contractor, Salon, Med Spa, Auto Shop, Childcare, Accounting, Other |
| Number of employees | Number input | 1-500 |
| Annual revenue | Currency input | $ range selector (under 250K, 250K-500K, 500K-1M, 1M-5M, 5M+) |
| Hours/week on admin | Range slider | 1-40 hours |
| Select ghost work areas | Multi-select checkboxes | Scheduling, Follow-ups, Data Entry, Customer Service, Invoicing, Marketing, Reporting, Inventory |

### 2.3 Calculation Engine

Create `lib/ghost-work-calculator.ts`:

```typescript
interface ReceiptInput {
  businessName: string
  businessType: string
  employees: number
  annualRevenue: number // midpoint of selected range
  adminHoursPerWeek: number
  ghostWorkAreas: string[]
}

interface ReceiptResult {
  annualGhostWorkCost: number // in dollars
  hoursLostPerWeek: number
  hoursLostPerYear: number
  effectiveHourlyRate: number
  breakdown: Array<{ area: string; hoursPerWeek: number; annualCost: number }>
  recoveryPercentage: number // automatable percentage
}

function calculateGhostWorkCost(input: ReceiptInput): ReceiptResult {
  // Base estimate: employees × adminHoursPerWeek × effectiveRate
  const effectiveHourlyRate = (input.annualRevenue / 2080) * 1.3 // 2080 work hours/yr, 30% overhead
  const hoursLostPerWeek = input.adminHoursPerWeek * input.employees
  const hoursLostPerYear = hoursLostPerWeek * 48 // 48 working weeks
  const annualGhostWorkCost = Math.round(hoursLostPerYear * effectiveHourlyRate)

  // Breakdown by selected areas
  const areaShares: Record<string, number> = {
    scheduling: 0.18,
    follow_ups: 0.22,
    data_entry: 0.15,
    customer_service: 0.14,
    invoicing: 0.11,
    marketing: 0.10,
    reporting: 0.06,
    inventory: 0.04,
  }

  const total = input.ghostWorkAreas.reduce((sum, area) => sum + (areaShares[area] || 0.1), 0)
  const breakdown = input.ghostWorkAreas.map(area => ({
    area,
    hoursPerWeek: Math.round(hoursLostPerWeek * (areaShares[area] || 0.1) / total),
    annualCost: Math.round(annualGhostWorkCost * (areaShares[area] || 0.1) / total),
  }))

  return {
    annualGhostWorkCost,
    hoursLostPerWeek,
    hoursLostPerYear,
    effectiveHourlyRate: Math.round(effectiveHourlyRate),
    breakdown,
    recoveryPercentage: 72, // 72% of ghost work is automatable
  }
}
```

### 2.4 Receipt Output Design

After form submission, display a "receipt" styled like a store receipt (think receipt printer paper):

```
╔══════════════════════════════╗
║   GHOST WORK RECEIPT         ║
║   eevolvv.com                ║
╠══════════════════════════════╣
║                              ║
║   [Business Name]            ║
║   [Business Type]            ║
║   [Employees] employees       ║
║                              ║
║   ─────────────────────────  ║
║                              ║
║   ANNUAL GHOST WORK COST     ║
║   $XXX,XXX                   ║
║                              ║
║   ─────────────────────────  ║
║                              ║
║   Hours lost per week:  XX   ║
║   Hours lost per year:  XXX  ║
║   Recovery possible:    72%  ║
║                              ║
║   ──── Breakdown ────────   ║
║   Scheduling:     XX hrs    ║
║   Follow-ups:     XX hrs    ║
║   Data Entry:     XX hrs    ║
║   ...                        ║
║                              ║
║   ─────────────────────────  ║
║   Your business loses        ║
║   $XXX/yr to ghost work.     ║
║   We can fix it.             ║
║                              ║
║   EEVOLVV.COM                ║
║   +1 (844) 433-8658          ║
╚══════════════════════════════╝
```

Style this as a HTML receipt using CSS. Receipt paper texture background (#f5f0e8). Monospace font for numbers. The amount should be large and bold. Include eevolvv branding at top and bottom.

### 2.5 Download as PDF/Image

Use `html2canvas` (install with pnpm) to capture the receipt as an image.
- **PDF download:** Create a PDF of the receipt. Gate behind email capture.
- **Email capture:** Show a simple email input + "Send my receipt" button. On submit, send PDF via Resend to that email. The email also includes: "Want to reduce this by 72%? Start with a free diagnostic →"
- The captured email goes into Supabase `receipt_leads` table (CREATE TABLE IF NOT EXISTS)

### 2.6 Supabase Table

```sql
CREATE TABLE receipt_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  business_name TEXT,
  business_type TEXT,
  annual_ghost_work_cost INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  converted_to_client BOOLEAN DEFAULT FALSE,
  diagnostic_started BOOLEAN DEFAULT FALSE
);
```

### 2.7 Share Button

After the receipt is shown, add share buttons:
- **"Share on X"** → Opens tweet composer with pre-filled text: "My business loses $XXX/yr to ghost work 😱 Check your own → eevolvv.com/ghost-work-receipt"
- **"Copy Link"** → Copies URL of the receipt page (store form state in URL params for shareable links: `/ghost-work-receipt?biz=MyBiz&type=dental&cost=47000`)
- **"Start Free Diagnostic"** → Links to /diagnostic

### 2.8 Embeddable Widget

Create `app/ghost-work-receipt/embed/page.tsx` — a minimal version for embedding via iframe:
- No header/footer/navigation
- Just the form → receipt flow
- Returns `X-Frame-Options: ALLOWALL` header
- Provide embed code snippet: `<iframe src="https://eevolvv.com/ghost-work-receipt/embed" width="100%" height="600" frameborder="0"></iframe>`

### 2.9 API Route for Email Capture

Create `app/api/receipt-pdf/route.ts`:
- POST: accepts `{ email, businessName, businessType, cost, hoursLost }`
- Inserts into `receipt_leads` table
- Generates a simple PDF (use a JS PDF lib or just Resend with HTML template)
- Sends email via Resend with receipt attached + CTA to start diagnostic

---

## WORKSTREAM 3: X/TWITTER CONTENT ENGINE

### 3.1 Content Queue Database

Create `lib/twitter-queue.ts` with a local JSON file `data/twitter-queue.json`:

```typescript
interface TweetPost {
  id: string
  content: string
  pillar: 'ghost-work-receipts' | 'build-in-public' | 'volvv-e' | 'founder-pov'
  status: 'draft' | 'queued' | 'posted'
  mediaUrl?: string
  scheduledFor?: string // ISO date
  postedAt?: string
  engagement?: { likes: number; replies: number; reposts: number }
}
```

### 3.2 Initial Queue — 100 Posts

Generate 100 pre-written posts across the 4 pillars:

**Ghost Work Receipts (35 posts)** — Real-sounding ghost work scenarios:
```
1. Your dental practice loses $47K/yr to no-shows and manual recall calls. 
   One AI agent handles both. Cost: $499/mo. math: (47,000 - 5,988) = $41K saved.
   That's a 7x ROI. Not bad for a text message. #ghostwork

2. Most law firms spend 12 hrs/week on intake alone.
   That's 624 hrs/yr. At $300/hr billable? $187K in lost capacity.
   Or one intake agent for $499/mo. Your call. #legal #automation

... (33 more)
```

**Build in Public (25 posts)** — Daily progress, metrics, transparent:
```
1. Day 1 of 90: 1 client, $999 MRR, 7 blog posts, 0 Twitter followers.
   Target: 84 clients, $83K MRR, 240 posts, 3K followers.
   We're building in public. Every win, every fail, every number.
   Follow along or get left behind. #buildinpublic #solofounder

2. Just shipped 3 new blog posts.
   That's 3 more pages Google can index. 3 more chances to be found.
   At $0 cost per impression.
   This is how $0 content marketing works. No budget required.
   #seo #contentmarketing

... (23 more)
```

**Volvv-E (20 posts)** — Mascot personality, humor, engagement bait:
```
1. [image of volvv-e mascot]
   "I've scanned 47 businesses today. 
    Most of them are leaking money through unsent follow-ups."
    — Volvv-E, your operations audit squid
   #volvve #automation

... (19 more)
```

**Founder POV (20 posts)** — Eduardo's voice, opinions, authority:
```
1. "AI won't replace your business. 
    But a competitor running AI operations will."
   
   The businesses winning right now aren't the ones with better products.
   They're the ones with better operations.
   #founder #operations

... (19 more)
```

### 3.3 Posting Script

Create `scripts/post-to-twitter.ts`:
- Reads from `data/twitter-queue.json`
- Picks next queued post
- Posts via xurl CLI (`xurl post "content"`)
- Marks as posted with timestamp
- Uses rate limiting: max 5 posts/day to start (ramp to 10/day)

### 3.4 X/Twitter Cron

Set up Hermes cron: `eevolvv-x-poster`
- Schedule: 4x/day (8am, 12pm, 4pm, 8pm CDT)
- Script: `scripts/post-to-twitter.ts`
- Skills: `xurl`
- Run from workdir: `/Users/loko/eevolvv`
- Each run posts 1 tweet from the queue (or 2 if queue is backed up)

### 3.5 Engagement Script (separate cron)

Create `scripts/twitter-engage.ts`:
- Search for industry-relevant tweets (dental, legal, small business, automation keyword mentions)
- Reply with value-add comments (not promotional)
- Follow relevant accounts
- Run once daily

Cron: `eevolvv-x-engage` — once daily at 10am CDT. Skills: `xurl`.

---

## WORKSTREAM 4: SELF-SERVE FUNNEL

### 4.1 Free Trial System

After diagnostic report is generated and before Stripe checkout:

**Add trial offer to report page** (`app/diagnostic/result/page.tsx` or equivalent):
- "Try one agent free for 7 days — no card required"
- Creates a trial record in a new Supabase table:
```sql
CREATE TABLE trials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  business_name TEXT,
  diagnostic_session_id UUID REFERENCES diagnostic_sessions(id),
  agent_type TEXT DEFAULT 'follow-up-reminder',
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  converted_to_subscription BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' -- active, expired, converted
);
```

### 4.2 Trial Agent — Minimal Viable

The trial "agent" doesn't need to be a real live agent. It's a demo agent page at `/os/trial/[id]` that shows:
- What the agent would do (simulated activity timeline)
- Screenshots/descriptions of the automation
- A "Subscribe to activate" CTA when they try to interact
- Day 5: "Your trial ends in 2 days" email
- Day 7: Auto-expires, sends "Your trial is over — but your agent is still waiting" email

### 4.3 Auto-Onboarding After Purchase

After successful Stripe checkout:
1. Create client record in Supabase `clients` table
2. Create agent page at `/os/[client-slug]`
3. Send welcome email via Resend with login link
4. Send intake form link
5. Create initial "Welcome" entry in client feed

Update `app/api/stripe/webhook/route.ts` to handle `checkout.session.completed` event.

### 4.4 Trial → Subscribe Sequence

Resend email sequence for trial users (create as Resend audiences or hardcoded):
- Day 1: "Welcome to your trial — here's what your agent is doing"
- Day 3: "Quick check-in — how's the agent working?"
- Day 5: "Your trial ends in 2 days — keep your agent for $499/mo"
- Day 7 (expiry): "Your agent has stopped working"
- Day 10: "Your agent is still ready — one click to reactivate"

Each email links to `/subscribe?trial=[id]` which creates a Stripe checkout session for Agent One.

---

## WORKSTREAM 5: SEO BLITZ v2

### 5.1 FAQ Schema on Top 10 Industry Pages

For each of these industries: dental, legal, real-estate, fitness, contractors, restaurant, salon, med-spa, auto-shop, accounting

Add FAQ schema (JSON-LD) AND visible FAQ section on the page.

In `lib/schemas.ts`, add:
```typescript
export function faqSchema(questions: Array<{name: string; text: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.name,
      acceptedAnswer: { '@type': 'Answer', text: q.text },
    })),
  }
}
```

Each industry page (e.g., `app/dental/page.tsx`) gets a visible FAQ section before the CTA + FAQPage schema in metadata:

Example for dental:
```typescript
const dentalFAQs = [
  {
    name: "How much does AI automation cost for a dental practice?",
    text: "AI automation for dental practices starts at $499/month for one workflow and $999/month for three. Most dental offices see ROI in the first month with reduced no-shows and automated recall campaigns."
  },
  {
    name: "Can AI work with Dentrix or Eaglesoft?",
    text: "Yes. eevolvv integrates with Dentrix, Eaglesoft, Open Dental, Carestream, and other major dental practice management platforms."
  },
  {
    name: "How long does it take to set up AI for a dental office?",
    text: "The first automation is live within 48 hours. The full diagnostic takes 10 minutes online with no signup required."
  },
  {
    name: "What's the ROI of AI automation for a dental practice?",
    text: "Most dental practices recover 15-20 hours per week and $2K-$4K per month in lost revenue from no-shows, missed recalls, and manual intake."
  },
]
```

Add the FAQ schema to `other: { 'application/ld+json': ... }` in the page metadata export.
Add a visible FAQ section component at the bottom of each page.

### 5.2 Internal Linking System

In `lib/blog.ts`, after generating posts, add function:
```typescript
export function getInternalLinks(currentSlug: string): Array<{title: string; url: string; type: 'blog' | 'industry'}> {
  // Matches current post tags to other posts with matching tags
  // Returns 2 related blog posts + 1 industry page link
}
```

### 5.3 Google Business Profile

Create `docs/gbp-setup-guide.md` — instructions for Eduardo to claim/verify:
1. Go to google.com/business
2. Search "eevolvv" or "AI operations Dallas"
3. Claim listing
4. Verify by phone or postcard
5. Fill in: description, hours, categories (AI consultant, business consultant), photos
6. Add link to eevolvv.com
7. Add "Free AI Diagnostic" as a service

### 5.4 Robots.txt Review

Current `public/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /os/
Disallow: /api/
Disallow: /signin/
Disallow: /run/
Disallow: /share/
```
Add: `Sitemap: https://eevolvv.com/sitemap.xml`

---

## WORKSTREAM 6: SOCIAL PROOF

### 6.1 Studio 23 Case Study

Write a blinded case study and save to `content/case-studies/studio-23-roofing.md`:

**Format:**
```markdown
---
title: "How Studio 23 Roofing Recovered 18 Hours/Week with AI Automation"
description: "A Dallas roofing company automated lead follow-up, job scheduling, and customer check-ins — recovering 18 hours per week and closing 30% more leads."
date: "2026-05-27"
client: "Studio 23 Roofing"
industry: "Contractor"
tier: "Agent Three"
---```

Publish as a blog post at `/blog/case-study-studio-23-roofing` AND add a case study section to the contractors industry page.

### 6.2 Five Vertical Case Studies

Write blinded/synthetic case studies for:
1. Dental: "City Smiles Dental saved $4K/mo from no-show reduction"
2. Legal: "Smith & Associates recovered 12 partner-hours/week from intake automation"
3. Fitness: "Peak Fitness Studios boosted membership retention 40% with automated follow-up"
4. Contractors: (use Studio 23 real case as the contractor one)
5. Restaurant: "Bella's Italian automated reservations and cut no-shows by 60%"

Each save to `content/case-studies/` and publish as blog posts.

### 6.3 Testimonial Collection

Create `scripts/request-testimonial.ts`:
- Runs weekly
- Sends text to Studio 23 (Leesa): "Hi Leesa! How's eevolvv working for you? Would you be open to sharing a quick testimonial?"
- If positive reply captured, format as testimonial and add to homepage trust bar

### 6.4 Homepage Trust Bar

Update homepage `app/page.tsx` — after the hero, add a trust bar:
```
[X] hours saved this month  ·  [X] automations running  ·  [X] clients onboarded
```
Use static numbers for now (update as real data comes in).

---

## WORKSTREAM 7: REFERRAL PROGRAM

### 7.1 Supabase Migration

Create `supabase/migrations/07_referrals.sql`:
```sql
CREATE TABLE referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES clients(id),
  referrer_email TEXT NOT NULL,
  referred_email TEXT NOT NULL,
  referred_name TEXT,
  status TEXT DEFAULT 'pending', -- pending, signed_up, subscribed, reward_granted
  reward_amount INTEGER DEFAULT 10000, -- $100 in cents
  stripe_coupon_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  subscribed_at TIMESTAMPTZ,
  reward_granted_at TIMESTAMPTZ
);
```

### 7.2 Referral Link System

Create `app/ref/[code]/page.tsx`:
- Reads referral code from URL
- Shows: "You were referred by [referrer]! Get started with eevolvv"
- Links to /diagnostic with referral tracking in URL params
- Stores referral in Supabase when the referred person completes diagnostic

### 7.3 Stripe Coupon

Create `scripts/create-referral-coupon.ts`:
- Creates a Stripe coupon: $100 off first 3 months ($33.33/mo discount)
- Stripe API: `stripe.coupons.create({ name: 'Referral Reward', duration: 'repeating', duration_in_months: 3, amount_off: 10000, currency: 'usd' })`

### 7.4 Referral Auto-Email

Add to Resend sequence: when referred person subscribes, send email:
- To referrer: "Great news! [Name] just subscribed using your referral link. Your $100 credit is on its way."
- Apply coupon automatically to next invoice via Stripe

### 7.5 Referral Dashboard

Add to `/os/dashboard` page: referral stats section
- Referrals sent: X
- Referrals signed up: X
- Referrals subscribed: X
- Rewards earned: $X

---

## BUILD ORDER SUMMARY

| Priority | Workstream | Est. Hours | Dependencies | Assigned To |
|----------|-----------|-----------|-------------|-------------|
| P0 | WS2: Ghost Work Receipt generator | 4-6h | None | Hermes |
| P0 | WS1: Content pipeline script | 2-3h | None | Hermes |
| P0 | WS3: X/Twitter queue + posting cron | 2-3h | X account created | Hermes/X ready |
| P1 | WS5: FAQ schema + internal links | 2-3h | None | Claude/Hermes |
| P1 | WS6: Case study writing | 3-4h | None | Claude |
| P2 | WS4: Self-serve trial funnel | 4-6h | None | Claude |
| P2 | WS7: Referral system | 3-4h | None | Claude |

---

## VERIFICATION CHECKLIST

After each workstream, verify:
- `pnpm build` passes with zero errors
- New routes return 200 (curl test)
- Supabase migrations run clean
- Cron jobs register and run without errors
- X posts post correctly (test 1 manual post first)
- Ghost Receipt form captures emails in Supabase
