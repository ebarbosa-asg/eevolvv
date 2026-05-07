# Research Summary — eevolvv Autonomous Side-Gig Pivot

**Date:** 2026-05-06
**Slug:** `autonomous-sidegig-pivot`
**Research modes:** Internal (codebase) + External (competitive + market)

---

## 1. Executive Summary

The eevolvv side-gig pivot is strategically sound. The competitive gap is real: all autonomous site builders (Durable, 10Web, Framer, Mixo) stop at the website layer. None combine free AI diagnostic + autonomous operational build + subscription maintenance. Hocoos shutting down April 2026 confirms the commodity website tier is dead. eevolvv's true competitive set is AI automation agencies charging $2K–$25K/month — and eevolvv wins on price by 90%.

The existing codebase is further along than it appears: the diagnostic → report flow is production-quality, the OS multi-client agent runtime exists, Langfuse tracing and Vercel cron are running. The critical gaps are all on the revenue side — Stripe is not wired, no payment wall exists, and no automated onboarding flow has been built. These are 2–3 weeks of focused dev work.

The business is viable as a side gig with two humans in oversight roles, but the 95% automation target is a 12–18 month journey, not a launch promise. At launch, Seed is ~85% automatable, Core is ~65%, Evolve is ~45%.

### Top 3 Risks

1. **Seed unit economics collapse at >6% monthly churn** — requires annual plans as the default offer to be safe
2. **Automation ceiling for Core/Evolve** — technician is doing real work (35–55%), not just oversight, for the first 12 months
3. **Post-report ghosting** — the diagnostic ends and clients walk away with a free report; without an active payment wall and follow-up sequence, conversion rate defaults to near 0%

### Top 3 Opportunities E Hasn't Named

1. **Diagnostic submissions are a proprietary business intelligence asset** — 500+ submissions in 12 months = SMB operational pattern data with real value for content marketing, investor narrative, and product improvement
2. **Evolve tier LTV is extraordinary** — $99,950 at 2% churn. Three Evolve clients delivers more value than 300 Seed clients. Sell Evolve first.
3. **Client stickiness must be designed as a switching cost** — agents trained on client context, integrations hosted by eevolvv, quarterly re-calibration referencing historical data. Design for lock-in from day one; "forever customer" only works if switching is genuinely painful.

---

## 2. Pricing Recommendation

### Final Tier Structure

| Tier | Monthly | Annual | What's included |
|------|---------|--------|----------------|
| **Seed** | $99/mo | $950/yr | Landing page + 1 automation workflow. 72hr build SLA. Hosting, uptime monitoring, 1 content update/mo. |
| **Core** | $499/mo | $4,790/yr | Web app + 3–5 AI agents + integrations. 7–10 day build SLA. Hosting + monitoring + 2 agent updates/mo + monthly performance report. |
| **Evolve** | $1,999/mo → raise to $2,999 after 3 case studies | $19,190/yr | Full-stack build + CRM/ERP integrations + custom dashboards. 14–21 day build SLA. Full managed service + quarterly re-calibration + monthly stakeholder report. |

**Make annual the default offer.** Monthly is available but priced without discount.

**Add a 3-month minimum commitment OR a one-time cancellation fee ($299 Seed / $999 Core) if canceling in months 1–2.** The build cost must be recovered.

### On the "6-month intro period" ambiguity

E almost certainly means "first 6 months at intro rate, then regular rate." The "6 months for the price of 1" interpretation would mean a client pays $99 once and gets 6 months of service — this is not viable.

**Recommendation: Drop the intro-rate framing entirely.** Annual plan with "2 months free" achieves the same acquisition hook without the month-6 churn cliff (30–50% churn spike at price increases is well-documented in B2B SaaS). Annual also provides upfront cash to cover build costs immediately.

### Post-intro pricing

Not applicable if annual-first is the offer. For monthly subscribers: maintain current pricing for the first 12 months, then send a "rate lock" offer (commit to annual and keep current price forever).

### Is $1,999 underpriced for Evolve?

Yes. Traditional automation consultancy charges $5,000–$25,000/month for comparable scope. Launch at $1,999 to close the first 3 case studies, then raise to $2,999. Steady-state target: $3,999/mo.

### Should there be a $29/mo Micro tier?

No — not for this pivot. Keep it in the roadmap for the global WhatsApp-first expansion. Adding a fourth tier at launch diffuses focus and creates support complexity.

### Year 1 MRR Model (conservative ramp)

Assuming 60% Core / 30% Seed / 10% Evolve mix and 5% blended monthly churn:

| Month | New clients | Cumulative | MRR |
|-------|-------------|-----------|-----|
| 1–3 | 5/mo | 15 | ~$3,600 |
| 4–6 | 10/mo | 45 | ~$10,800 |
| 7–12 | 15/mo | 135 | ~$30,000+ |

Break-even (covering $500/mo tooling): Month 2.
First meaningful revenue ($10K MRR): Month 5–6.

---

## 3. Autonomous Pipeline Architecture

### Stage-by-Stage Breakdown

| Stage | Automation % Today | 12mo | Primary tools | Technician role |
|-------|-------------------|------|--------------|----------------|
| SEO / inbound | 60% (tooling exists) | 80% | Ahrefs + Surfer + Claude | Monthly review |
| Diagnostic chat | 98% | 99% | Claude, existing | None |
| Report generation | 98% | 99% | Claude, existing | None |
| Payment capture | 0% (must build) | 99% | Stripe hosted checkout | None |
| Onboarding intake | 0% (must build) | 90% | Tally/Typeform → Supabase | None |
| Build — Seed | 0% (must build) | 85% | Claude Code + v0.dev | QA approval |
| Build — Core | 0% (must build) | 65% | Claude Code + technician | Active build participation |
| Build — Evolve | 0% (must build) | 45% | Claude Code + Devin | Primary engineer |
| QA | 0% (must build) | 75% | Playwright + Checkly + Lighthouse CI | Go/no-go sign-off |
| Deployment | 0% (must build) | 90% | Vercel API + CLI | None |
| Subscription maintenance | 20% (cron) | 80% | Extend existing OS cron | Monthly review |
| Quarterly re-calibration | 0% | 60% | Templates + Claude | 2hr review session |

### 48-Hour Watchdog Logic

If neither human acts in 48 hours:
- `build status = awaiting_review` → notify again → at 48h: `auto_proceeded` (if pre-approved template) or `escalated` (if custom work)
- Implementation: n8n Wait node, or extend the existing Vercel cron with a staleness check

---

## 4. Build Playbook Outline

### Seed Tier Template Library

Pre-built categories, each with: intake form mapping, Claude Code prompt template, v0.dev component library, Vercel deploy config:

1. **Service business landing page** (consultant, coach, freelancer)
2. **Local business landing page** (restaurant, salon, retail)
3. **Product waitlist page** (startup pre-launch)
4. **Portfolio page** (designer, developer, photographer)
5. **Simple e-commerce** (1–5 products, Stripe checkout)

Each comes with: 1 automation workflow (contact form → CRM, booking form → calendar, order → notification)

### Core Tier Template Library

Build types with defined scope:

1. **Business web app** (dashboard + CRUD + 3–5 integrated APIs)
2. **E-commerce store** (Shopify alternative, multi-product, inventory)
3. **Client portal** (document sharing, status tracking, messaging)
4. **Booking + scheduling system** (service business with calendar)
5. **Internal ops tool** (team task management, reporting, approvals)

Each includes: 3–5 AI task agents (configured in the OS), integrations (CRM, email, Slack, Zapier/n8n)

### Evolve Tier: Discovery-First

- Full discovery questionnaire post-onboarding (2-hour async interview via conversational AI)
- Scope defined collaboratively — no fixed template
- Build plan presented for approval before execution begins
- QA milestone required before deployment

---

## 5. Tooling Stack

| Tool | Category | Cost | Notes |
|------|----------|------|-------|
| Vercel Pro | Hosting | $20/mo | Unlimited projects |
| Supabase Pro | Database | $25/mo | Already in use |
| Anthropic API | AI | $50–$200/mo | Claude Code + diagnostic |
| Resend | Email | $20/mo | Already in use |
| n8n (self-hosted) | Orchestration | $20–$40/mo VPS | Add at 10+ clients |
| Ahrefs Lite | SEO | $129/mo | Keyword research |
| Surfer Essential | SEO | $99/mo | Content optimization |
| Ghost self-hosted | Blog/CMS | $30/mo | SEO content publishing |
| Playwright | QA | Free | Autonomous test suite |
| Checkly | Monitoring | Free tier | Post-deploy monitoring |
| Lighthouse CI | Performance | Free | Build-time scoring |
| PostHog | Analytics | Free tier | Already in use |
| Langfuse | LLM observability | Free tier | Already in use |
| Stripe | Payments | 2.9% + $0.30 | Must install |
| Tally or Typeform | Onboarding forms | $0–$29/mo | Post-payment intake |
| **Total** | | **~$400–$600/mo** | Pre-revenue phase |

---

## 6. Critical Path to First Client (MVP)

**Time estimate: 2–3 weeks with Claude Code**

In exact order:
1. `npm install stripe` + create `lib/stripe.ts`
2. Build `app/api/stripe/checkout/route.ts` (Stripe hosted checkout session)
3. Build `app/api/stripe/webhook/route.ts` (`checkout.session.completed` → create client in Supabase)
4. Replace Calendly CTA in `ChatEngine.tsx` (~line 499) with tier selection + Stripe checkout redirect
5. Create `emails/WelcomeEmail.tsx` + trigger from webhook handler
6. Update pricing UI in `app/page.tsx` (Seed/Core/Evolve, subscription model, annual default)
7. Create `supabase/migrations/006_subscriptions_builds.sql`
8. Define Seed build SOP (even if semi-manual: Claude Code → technician QA → Vercel deploy)

**Phase 2 (30–90 days, 20 clients target):**
- Build post-payment onboarding intake flow
- Build `/app/client/[token]/` client-facing status portal
- Build Seed build automation (Claude Code agent + v0.dev + Vercel API)
- Add Playwright QA pipeline
- Build follow-up email sequence for post-report unconverted leads

**Phase 3 (90–180 days, 50 clients target):**
- Build Core build template library
- Add n8n for orchestration
- Build Evolve discovery questionnaire
- Monthly automated client report emails
- Quarterly re-calibration workflow

---

## 7. Open Questions for E

1. **Build SLA enforcement:** What happens if a Seed build takes longer than 72 hours? Is there a penalty or just a communication? This needs to be in the service agreement.

2. **Technician contract structure:** Is the technician a contractor (1099) or employee? At 20 hrs/week, this needs to be defined for liability purposes.

3. **Client asset access:** For web apps, does the client get GitHub repo access? Vercel dashboard access? Or does eevolvv retain control and hand off on request? This determines churn economics.

4. **Evolve scope creep protection:** The $1,999/mo Evolve tier has undefined scope. What's the hard limit? (Hours/month? Number of integrations? Feature count?) Without this, the technician's 20 hours gets consumed by one Evolve client.

5. **The 48-hour auto-proceed rule:** For Core and Evolve, auto-proceeding without human approval is risky. Should the watchdog pause and notify repeatedly, or truly auto-proceed?

6. **Enterprise wedge positioning for Evolve:** Should the $1,999 tier be explicitly marketed as the QA/finance audit enterprise play (per the investor strategy), or kept SMB-focused? These are different buyer personas requiring different landing pages and sales copy.

7. **Annual plan legal structure:** Annual plan payments need refund terms defined. If a client pays $4,790 upfront for Core and churns in month 2, what do they get back?
