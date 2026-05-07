# External Best Practices — autonomous-sidegig-pivot

**Phase:** External Research
**Date:** 2026-05-06

---

## A. Competitive Landscape

### Durable.co
- **Pricing:** Free → Starter $15/mo → Launch $22/mo → Grow $85/mo → Mogul $95/mo
- **What they automate:** AI site generation in seconds, basic CRM, invoicing, social post generator, Google ad generator
- **What they DON'T do:** Custom code, web apps, AI agents, integrations, ongoing business transformation
- **Target:** Solopreneurs, local businesses wanting a presence
- **eevolvv gap:** Durable builds websites. eevolvv builds systems. Durable stops at the front door; eevolvv rewires the building.

### 10Web.io
- **Pricing:** AI Starter $10/mo → AI Premium $15/mo → AI Ultimate $23/mo → Agency Starter $24/mo → Agency Premium $60/mo → Agency Ultimate $250/mo
- **What they automate:** WordPress site generation via 10 specialized AI agents (brief → design → build → content → SEO), ongoing site management
- **What they DON'T do:** Back-end workflows, CRM/ERP integrations, custom AI agents, business process automation
- **Target:** WordPress users, digital agencies building client sites
- **eevolvv gap:** 10Web is a web agency tool. It produces websites. eevolvv delivers operational transformation — workflows, agents, integrations that make a business run differently.

### Framer AI
- **Pricing:** Free → Basic $10/mo → Pro $30/mo → Scale $100/mo → Enterprise custom
- **What they automate:** Visual site generation from prompts, AI wireframer, AI Workshop (code), AI translation
- **What they DON'T do:** Back-end systems, automation workflows, AI business agents
- **Target:** Designers, marketing teams, startups wanting beautiful sites fast
- **eevolvv gap:** Framer is design-first. Zero overlap with eevolvv's core value proposition.

### Mixo.io
- **Pricing:** Free → Basic $9/mo → Growth $19/mo → Premium $39/mo → Business $49/mo
- **What they automate:** 30-second landing page generation from a description
- **What they DON'T do:** Multi-page web apps, integrations, AI agents, automation
- **Target:** Idea validation, startup landing pages
- **eevolvv gap:** Mixo is idea validation. eevolvv is operational transformation post-validation.

### Hocoos
- **Status:** SHUT DOWN April 23, 2026. Platform discontinued.
- **Lesson:** The pure "AI website in 5 minutes" commodity is getting killed. The race to the bottom on sites-as-a-service is over.

### Wegic.ai
- **Pricing:** Free → Starter $23.9/mo → Premium $41.9/mo → Ultra $2,999/mo
- **What they automate:** Conversational site builder, 300K+ sites built, multilingual, AI Manager for ongoing updates
- **What they DON'T do:** Business process automation, AI agents, integrations
- **Target:** Global SMBs wanting quick sites
- **eevolvv gap:** Same as Durable/Mixo. Website generation is the product, not business transformation.

### Competitive Gap for eevolvv
All competitors stop at website/content. **None combine:**
1. Free AI diagnostic that maps the business
2. Automated workflow/agent builds (not just sites)
3. Ongoing subscription maintenance + re-calibration
4. Genuine business intelligence (not just web presence)

eevolvv's position: "We don't build websites. We rebuild operations."

---

## B. AI Agency / Autonomous Service Business Models

### Revenue Models That Work (2025–2026)
1. **Productized subscription with build included** — most scalable; works when build cost amortizes over 6+ months of subscription
2. **Retainer + usage** — base monthly fee + per-task overage; used by AI automation agencies at $2K–$25K/month
3. **Outcome-based pricing** — percentage of documented savings; high friction to close, high client stickiness
4. **One-time + annual subscription** — one-time setup fee + ongoing maintenance subscription; best for SMB

### What Pricing Structures Work
- AI automation agencies achieving $30K/month use: 3–5 clients at $5K–$10K/month each
- Productized tiers at $99–$499 require volume (50–200 clients) to generate meaningful revenue
- The $1,999/mo Evolve tier is the most defensible — high enough to justify human oversight, low enough for scaling SMBs
- Agencies report 70–90% gross margins when delivery is AI-primary

### Realistic Automation Ceiling (2026)
- Intake → report: ~98% automated today (eevolvv already has this)
- Landing page generation: ~85% automated (Claude Code + v0.dev)
- Simple workflow automation (n8n/Make flows): ~80% automated
- Web app with 3–5 AI agents: ~60–70% automated (requires technician review)
- CRM/ERP integrations: ~40–50% automated (auth + client-specific config still needs humans)
- QA: ~75% automated with Playwright
- Deployment: ~90% automated (Vercel CLI)

**Overall for Seed tier (landing page + 1 workflow): ~85% automation is achievable now.**
**Overall for Core tier (web app + 3–5 agents): ~65% automation is achievable now.**
**Overall for Evolve tier (full-stack + integrations): ~45% automation is achievable now.**

---

## C. SaaS Pricing Best Practices for Service-Software Hybrids

### Free Diagnostic → Paid Funnel Performance
- Free trial to paid: 2–5% industry average; top performers 10%+
- SEO leads: 51% MQL-to-SQL conversion (strongest lead source)
- Website leads: 31% lead-to-MQL
- A free, personalized diagnostic is stronger than a generic free trial because it delivers demonstrable value specific to the business

### LTV/CAC Math for $99/mo
- Monthly churn for SMB SaaS: 3–7% per month = 36–84% annual
- At 5% monthly churn: average LTV = $99 / 0.05 = $1,980
- At 3% monthly churn: average LTV = $99 / 0.03 = $3,300
- Build cost (Claude Code + technician time): ~$400–$800 for a landing page + 1 workflow
- CAC via SEO (low-cost channel): $50–$200 in content/tool costs per acquired customer
- **At 5% churn: LTV:CAC = $1,980 / $150 = 13:1 — very healthy IF churn is controlled**
- **Critical risk:** If churn is 10%/month (LTV = $990), and build cost is $600, it's LTV-negative

### LTV/CAC Math for $499/mo
- At 4% monthly churn: LTV = $499 / 0.04 = $12,475
- Build cost for web app + 3–5 agents: ~$1,500–$3,000
- CAC via content + outbound: $300–$800
- **LTV:CAC = $12,475 / $500 = 25:1 — excellent**

### LTV/CAC Math for $1,999/mo
- At 2% monthly churn (enterprise-adjacent clients): LTV = $1,999 / 0.02 = $99,950
- Build cost for full-stack + integrations: $5,000–$15,000 (mostly technician time)
- CAC: $1,000–$3,000 (outreach + sales call)
- **LTV:CAC = $99,950 / $2,000 = 50:1 — outstanding**

### "Value-First, Payment-Second" Funnel — Proven Pattern
Yes, this is a proven model. Closest analogs:
- HubSpot: free CRM → paid marketing/sales tools
- Clearbit: free enrichment → paid API
- Intercom: free live chat trial → paid full suite
- Typeform: free form → paid advanced features

For eevolvv: the free Evolution Report is the "aha moment." The key is the report must be specific enough that the client thinks "I need someone to actually do this." Generic reports convert poorly.

### Annual Plan Math
- Annual upfront: $99 × 12 × 0.8 (20% discount) = $950/year vs. $1,188/year monthly
- Cash flow benefit: $950 received upfront vs. $99/month drip
- Churn benefit: annual customers churn at 1/4 the rate of monthly customers
- **Recommendation:** Offer annual at 20% discount. Frame as "2 months free." For Seed tier: $950/year vs. $99/month.

---

## D. SEO Automation Stack

### Recommended Stack Under $500/month Total
| Tool | Cost | Role |
|------|------|------|
| Ahrefs Lite | $129/mo | Keyword research, competitor analysis, backlink tracking |
| Surfer SEO Essential | $99/mo | Content optimization (use on high-value pages only) |
| Ghost CMS (self-hosted) | ~$30/mo server | Blog publishing (already partially configured at eevolvv) |
| Claude API | ~$50–$100/mo | Content drafting at scale |
| Total | ~$310–$360/mo | Well under $500 |

### Programmatic SEO Strategy for eevolvv
- **Target pages:** "AI automation for [industry]" × 20 industries = 20 landing pages
- **Industry pages:** `/industries/restaurant-automation`, `/industries/gym-automation`, etc.
- **Use case pages:** `/use-cases/invoice-automation`, `/use-cases/customer-onboarding-automation`
- **Comparison pages:** "eevolvv vs Durable", "eevolvv vs [agency name]"
- **Blog (Ghost):** 2–4 posts/week, AI-drafted, human-edited for E's voice
- **Local SEO:** Not applicable for a fully remote digital service

### Content Automation
- Ghost CMS → Next.js ISR (Incremental Static Regeneration) at `/blog`
- Claude drafts → E edits → Ghost publishes
- Ahrefs alerts for new competitor content → trigger response posts
- Fully autonomous: Claude → Ghost API → publish (no E involvement once workflow is built)

---

## E. Automation Orchestration

### Recommendation: n8n (self-hosted)

| Tool | Cost | Self-host | Best for eevolvv use case |
|------|------|-----------|--------------------------|
| **n8n** | Free (self-hosted) | Yes | Client intake → build queue → QA → deploy |
| Make (Integromat) | $9–$29/mo | No | Simpler conditional workflows |
| Zapier | $20–$69/mo | No | Simple triggers, expensive at scale |

**n8n wins for eevolvv because:**
- Self-hosted = zero per-execution cost (only server cost ~$20–$50/mo on Hetzner/DigitalOcean)
- HTTP Request node can call eevolvv API routes (trigger builds, update Supabase)
- Stripe trigger node: payment.succeeded → start onboarding flow
- Cron nodes: replace Vercel cron for complex multi-step pipelines
- Webhook nodes: receive events from Vercel deployment, Playwright QA results
- 48-hour watchdog: n8n Wait node with timeout + notify

**For the MVP:** Start with Vercel cron (already works). Add n8n only when pipeline complexity exceeds what cron can handle (likely around 10+ active clients).

---

## F. AI Coding Tools for Autonomous Builds

### Capability Matrix (2026)

| Tool | Best for | Autonomy level | Cost |
|------|---------|----------------|------|
| **Claude Code** | Full-stack builds, multi-file reasoning, CLAUDE.md conventions | 78.4% SWE-bench | Usage-based via API |
| **Cursor** | Daily editing, IDE-integrated development | 67.2% SWE-bench | $20/mo/seat |
| **v0.dev (Vercel)** | UI component generation (React/Tailwind) | High for UI | $20/mo → pay-per-use |
| **Devin** | Full-project autonomous builds (PR → deploy) | 60.8% SWE-bench | $500/mo |
| **GitHub Copilot Workspace** | PR-level code generation | Moderate | $19/mo |

### Recommended Stack for eevolvv Builds
- **Seed tier (landing page):** Claude Code + v0.dev for components → Vercel deploy. ~85% autonomous.
- **Core tier (web app + agents):** Claude Code as primary, Cursor for technician review → Vercel deploy. ~65% autonomous.
- **Evolve tier (full-stack + integrations):** Claude Code + Devin for extended sessions + technician QA. ~45% autonomous.

### Realistic Landing Page Build (Seed)
From intake data → Claude Code can:
1. Generate Next.js page structure from business description
2. Apply eevolvv's design system tokens (CLAUDE.md conventions)
3. Create responsive layout with hero, services, CTA, contact
4. Add basic Resend contact form
5. Push to GitHub → Vercel auto-deploys

**Gap:** Domain provisioning, DNS setup, client-specific copy review still need human (technician) touch.

---

## G. QA Automation

### Recommended Stack
| Tool | Cost | Role |
|------|------|------|
| **Playwright** | Free (open source) | End-to-end UI testing, agent-driven |
| **Checkly** | Free tier → $30/mo | Continuous monitoring post-deploy |
| **Lighthouse CI** | Free | Performance + accessibility scoring |

### Minimum Viable Autonomous QA for Seed Tier
1. Playwright Planner agent explores the generated site
2. Playwright Generator creates test suite from exploration
3. Run tests against staging deploy
4. Lighthouse CI scores performance (target: 90+ PageSpeed)
5. Pass/fail report → Supabase `builds` status update
6. If fail: notify technician; if pass: trigger production deploy

**Cost per QA run:** ~$0.05–$0.15 in LLM tokens for Playwright agents on a landing page.

---

## H. Multi-Client Vercel Deployment

### Vercel Pricing
- **Hobby:** Free (no custom domains for commercial use)
- **Pro:** $20/month per seat + $20 usage credit
- **Enterprise:** Custom

### Multi-Client Strategy Options

**Option A: Agency-owned (recommended for MVP)**
- One Vercel Pro account ($20/mo for E)
- Each client = one Vercel project (`client-name.vercel.app` or custom domain)
- Client domain: client manages DNS, adds CNAME record
- Cost: $20/mo Vercel + client domain costs (~$15/yr per domain)
- **Best for Seed/Core tiers**

**Option B: Client-owned Vercel**
- Client creates their own Vercel account
- eevolvv deploys to their account via Vercel API + access token
- More complex, better for clients who want to own their infrastructure
- **Best for Evolve tier**

### Domain/DNS Automation
- Vercel API: `POST /v9/projects/{id}/domains` to add domain programmatically
- Client provides domain → eevolvv adds to Vercel via API → Vercel generates DNS records → send to client
- Can be triggered automatically from build completion webhook
- Vercel auto-provisions SSL via Let's Encrypt

### Cost at Scale (10 clients)
- Vercel Pro: $20/mo (one seat)
- 10 projects: included in Pro (unlimited projects)
- Bandwidth: included up to limits
- **Total Vercel cost for 10 Seed clients: $20/mo** — highly efficient
