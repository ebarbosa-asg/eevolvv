# Recommended Libraries — autonomous-sidegig-pivot

**Phase:** External Research
**Date:** 2026-05-06

---

## Payment Infrastructure

### stripe (npm: `stripe`)
- **Purpose:** Stripe Node.js SDK for checkout sessions, subscription management, webhook handling
- **Why:** Stripe Atlas entity already exists. Stripe is already configured in env vars. Zero switching cost.
- **Install:** `npm install stripe`
- **Key APIs needed:** `stripe.checkout.sessions.create()`, `stripe.webhooks.constructEvent()`, `stripe.subscriptions.retrieve()`
- **Version:** Latest stable (^16.x as of 2026)

### @stripe/stripe-js (npm: `@stripe/stripe-js`)
- **Purpose:** Client-side Stripe.js for Stripe Elements (if building custom payment UI)
- **Alternative:** Use Stripe Checkout (hosted) to avoid PCI scope — simpler for MVP
- **Recommendation:** Use hosted Checkout for MVP, add Elements later

---

## Automation Orchestration

### n8n (self-hosted)
- **Purpose:** Workflow automation for client intake → build queue → QA → deploy pipeline
- **Cost:** Free (self-hosted on $20–$40/mo VPS)
- **Pros:** No per-execution cost, HTTP + Webhook + Stripe nodes, self-healing
- **Cons:** Requires server management, Docker setup
- **When to use:** Once 10+ active clients make Vercel cron insufficient
- **Docker image:** `n8nio/n8n`

---

## Build Tools

### v0.dev (Vercel — web tool, not npm)
- **Purpose:** UI component generation from prompts (React + Tailwind)
- **Cost:** $20/mo subscription or pay-per-generation
- **Use case:** Generate landing page UI components from client intake data
- **Workflow:** Claude Code writes logic → v0.dev generates visual components → merge

### Vercel CLI (npm: `vercel`)
- **Purpose:** Programmatic deployment from build scripts
- **Cost:** Free (CLI) — Vercel Pro plan needed for production
- **Key commands:** `vercel deploy --prod`, `vercel domains add`
- **Install:** `npm install -g vercel`

---

## QA

### @playwright/test (npm: `@playwright/test`)
- **Purpose:** End-to-end testing, AI-driven test generation and healing
- **Cost:** Free
- **Version:** ^1.44+ (for Playwright Agents/Planner support)
- **Use case:** Automated QA for each client build before production deploy
- **Install:** `npm install -D @playwright/test`
- Note: Already has `tests/agents/runner.ts` in eevolvv — Playwright may already be installed

### lighthouse (npm: `lighthouse`)
- **Purpose:** Performance, accessibility, SEO scoring for client builds
- **Cost:** Free
- **Threshold:** Target 90+ on Performance, 95+ on Accessibility
- **CI integration:** `lighthouse-ci` package for automated PR checks

---

## SEO Infrastructure

### Ahrefs (web tool)
- **Cost:** Lite $129/mo
- **Use case:** Keyword research for programmatic SEO pages, competitor tracking
- **Alternative:** Semrush ($140/mo) — similar capability

### Surfer SEO (web tool)
- **Cost:** Essential $99/mo
- **Use case:** On-page optimization for high-value landing pages
- **Recommendation:** Use only for /industries/ and /use-cases/ pages; skip for blog posts

### Ghost CMS (self-hosted)
- **Purpose:** Blog/content CMS for SEO content pipeline
- **Cost:** ~$30/mo (Hetzner VPS) or Ghost Pro $9/mo
- **Already partially configured:** `ghost-locker/` directory exists
- **Integration:** Ghost Content API → Next.js ISR at `/blog`

---

## Monitoring

### Checkly (web tool — `@checkly/cli`)
- **Purpose:** Post-deploy continuous monitoring of client sites
- **Cost:** Free tier (10 checks) → Hobby $30/mo (100+ checks)
- **Use case:** Monitor each client site's critical paths, alert on failures
- **Integration:** Playwright tests → Checkly (reuse same test files)

### Sentry (already installed: `@sentry/nextjs`)
- **Already in use** — extend for build pipeline error tracking

---

## Email

### resend (already installed: `resend ^3.3.0`)
- **Already in use** — add new email templates only

### @react-email/components (already installed)
- **Already in use** — build new templates using existing patterns

---

## Build vs. Skip Decisions

| Library | Decision | Reason |
|---------|----------|--------|
| `stripe` | **Build now** | Critical path blocker |
| `n8n` | **Skip for MVP** | Vercel cron sufficient initially |
| `@playwright/test` | **Build for Core/Evolve** | Not needed for Seed MVP |
| `lighthouse` | **Build for QA step** | Simple, free, high value |
| Ghost CMS | **Configure now** | SEO is long-lead; start early |
| Ahrefs | **Subscribe month 2** | Need content first |
| Checkly | **Free tier now** | Monitoring from day one |
| Devin | **Skip for MVP** | $500/mo too expensive before revenue |
