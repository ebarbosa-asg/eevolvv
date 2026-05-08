# Seed Build SOP — eevolvv Technician Playbook

**Tier:** Seed ($99/mo or $950/yr)
**Build SLA:** 72 hours from `builds.status = in_progress`
**Technician role:** QA approval + Vercel deploy + client notification
**Automation ceiling:** ~85% (technician is final QA only)

---

## Overview

The Seed build delivers a landing page + 1 automation workflow to a paying client within 72 hours. The build pipeline is:

1. Client pays → T06 creates build record with `status: queued`
2. Technician claims build in OS → `status: in_progress` → 72-hour SLA starts
3. Technician completes intake review → selects template → generates with Claude Code + v0.dev
4. Technician QA → approval → Vercel deploy
5. T17's `BuildLive.tsx` email sent → client portal updated

---

## Step 1 — Intake Review (15 min)

Open the build in `/os/builds`. Review the client's onboarding form responses:

- **Business name** — confirm it's a real business
- **Primary goal** — identify the #1 outcome the landing page must achieve
- **Pain points** — find the most automatable pain (usually: manual inquiry follow-up, booking, or lead capture)
- **Existing tools** — identify integration points for the automation workflow

**Select build type based on primary goal:**

| If client says... | Build type |
|-------------------|-----------|
| "Get more clients / leads" | Service Business |
| "Let people find / visit us" | Local Business |
| "Collect interest before launch" | Product Waitlist |
| "Show my work" | Portfolio |
| "Sell products online" | Simple E-Commerce |

---

## Step 2 — Template Selection

Five Seed templates are available in the [eevolvv template library] (link to be added when created). Each template includes:
- Pre-built section structure
- Brand token integration (paper/ink/accent)
- One placeholder automation slot

Select the template matching the build type identified in Step 1.

---

## Step 3 — Claude Code Prompt Construction

Use the following base prompt for each build type. Replace `[BRACKETS]` with client intake data.

### Template A — Service Business

```
You are building a landing page for [BUSINESS_NAME], a [BUSINESS_TYPE] serving [LOCATION_OR_TARGET].

Client goal: [PRIMARY_GOAL]
Design system: eevolvv — use CSS vars --paper (#faf7f0), --ink (#141413), --accent (#8C2B1A), JetBrains Mono for section markers, Space Grotesk for headings.

Build a single-page HTML (or Next.js page) with:
1. Hero: [BUSINESS_NAME] + tagline from "[PRIMARY_GOAL]" + strong CTA button
2. Services: 3 key services derived from [PAIN_POINTS]
3. Why us: 3 differentiators (derive from intake or use: Fast response / Local expert / Guaranteed satisfaction)
4. Contact form: name, email, phone, message fields — submit to [AUTOMATION_ENDPOINT or Formspree placeholder]
5. Footer: business name, phone, email

Make it production-ready, mobile-first, no external CSS frameworks.
```

### Template B — Local Business

```
Build a landing page for [BUSINESS_NAME], a [BUSINESS_TYPE] at [ADDRESS_OR_AREA].

Goal: Drive foot traffic and online orders.
Design system: eevolvv tokens (same as above).

Sections: Hero with CTA ("Visit Us" or "Order Online") / About (2 sentences from intake description) / Highlights (3 items from features/menu/offerings) / Hours + Location (placeholder — technician fills) / CTA band / Footer.
```

### Template C — Product Waitlist

```
Build a waitlist landing page for [PRODUCT_NAME].

Goal: Capture emails before launch. No pricing shown.
Design system: eevolvv tokens.

Sections: Hero with value prop + email capture form / Problem (3 bullets from pain points) / Solution (what the product does — derive from intake) / Social proof placeholder ("Join X others already on the list") / Second CTA.

The email form should POST to /api/waitlist or Formspree. Include a simple success message on submit.
```

### Template D — Portfolio

```
Build a portfolio landing page for [NAME], a [ROLE/PROFESSION].

Goal: Attract clients / employers. Showcase work quality.
Design system: eevolvv tokens.

Sections: Hero (name, role, 1-line value statement) / Work (3 project placeholder cards with title + description from intake) / Skills (from tools/tech stack in intake) / Contact (email CTA) / Footer.
```

### Template E — Simple E-Commerce

```
Build a product showcase page for [BUSINESS_NAME] selling [PRODUCT_TYPE].

Goal: Drive purchases or inquiries.
Design system: eevolvv tokens.

Sections: Hero with hero product image placeholder + CTA / Product grid (3 placeholder product cards) / How it works (3 steps) / Testimonials placeholder / Contact/purchase CTA.

Note: No actual payment processing in Seed. CTA links to WhatsApp/email inquiry.
```

---

## Step 4 — v0.dev Component Generation (if needed)

For complex UI components (hero animations, form interactions, product grids), use v0.dev:

1. Go to v0.dev
2. Prompt: "Create a [component type] using only CSS custom properties (no Tailwind). Variables: --paper: #faf7f0, --ink: #141413, --accent: #8C2B1A. Font: Space Grotesk headings, JetBrains Mono labels."
3. Copy output → integrate into Claude Code build
4. Test in browser before QA

---

## Step 5 — Automation Workflow

The "1 automation workflow" included in Seed is typically one of:

| Workflow | Tool | Setup |
|----------|------|-------|
| Contact form → email notification | Formspree free tier | Add Formspree form ID to HTML form action |
| Contact form → Slack notification | Make.com / Zapier | Create zap: Webhook → Slack message |
| Email list capture | Resend broadcast list | Add client to Resend audience, form POSTs to /api/subscribe |
| Booking link | Calendly | Embed Calendly inline widget |
| WhatsApp CTA | wa.me link | "Message us on WhatsApp" button with pre-filled message |

**Default for service businesses:** Formspree → email notification (zero monthly cost, no setup required from client).

---

## Step 6 — QA Checklist

Before deploying, verify all items:

- [ ] **Lighthouse score ≥ 90** — Run in Chrome DevTools → Lighthouse → Mobile
- [ ] **Mobile responsive** — Test at 375px, 768px, 1280px breakpoints
- [ ] **No broken links** — Click all CTAs, navigation links, footer links
- [ ] **Form submission tested** — Submit test data; verify delivery to client's email (or technician email in staging)
- [ ] **Images load** — All placeholder images load; no broken src attributes
- [ ] **Page speed < 3s FCP** — Check Lighthouse or WebPageTest
- [ ] **Spelling/grammar** — Proofread all visible text (use Grammarly browser extension)
- [ ] **Business name correct** — Matches intake form exactly
- [ ] **Contact info accurate** — Client's real phone/email if provided; placeholder if not

---

## Step 7 — Vercel Deploy

```bash
# If using Next.js app router in monorepo:
vercel --prod --cwd ./client-builds/[client-slug]

# If standalone HTML:
vercel --prod
# Vercel auto-detects static HTML
```

**Domain setup:**
1. In Vercel dashboard → Project → Settings → Domains
2. Add client's custom domain (if provided in intake)
3. Client updates DNS: add CNAME pointing to `cname.vercel-dns.com`
4. Vercel provides SSL automatically (Let's Encrypt)

**If no custom domain:** Use Vercel subdomain (`[slug].vercel.app`) for initial delivery. Client can add domain later.

---

## Step 8 — Build Queue Status Update

In the OS at `/os/builds`:
1. Click "Mark Live" on the client's build
2. Enter the production URL in the build_url field
3. Status updates to `live`
4. This triggers `BuildLive.tsx` email to client automatically (T17)
5. Client portal at `/client/[token]` shows live URL

---

## Step 9 — Escalation

**If build exceeds 72 hours:**
1. Notify E immediately via Slack/email
2. E sends client a proactive delay notice with revised ETA
3. Subscription is extended by the delay — no client action needed

**If intake data is insufficient:**
1. Reply to client's onboarding email with specific questions
2. Pause the 72-hour clock until client responds (update builds.notes with "AWAITING CLIENT INFO — paused at [time]")
3. Resume clock when client responds

---

## Delivery Checklist

Before marking live:
- [ ] All QA items above checked
- [ ] Automation workflow tested end-to-end
- [ ] Vercel deploy successful (green)
- [ ] Production URL verified in browser
- [ ] Build URL entered in OS before marking live
- [ ] No console errors in production

---

*Last updated: 2026-05-06 · Owner: E · Technician: [assigned]*
