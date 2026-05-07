# External Research Findings — eevolvv Autonomous Side-Gig Pivot

**Date:** 2026-05-06
**Sources:** Competitive analysis, pricing research, tool evaluations

---

## A. Competitive Landscape

| Competitor | Price | Builds | Doesn't do | eevolvv gap |
|------------|-------|--------|-----------|------------|
| Durable | $15–$95/mo | Landing pages | Automations, agents | Stops at website |
| 10Web | $10–$250/mo | WordPress sites | Back-end, workflows | Site-only |
| Framer | $10–$100/mo | Designer sites | Anything operational | Design-first |
| Mixo | $9–$49/mo | 30-second landing pages | Multi-page, integrations | Idea validation only |
| Hocoos | **SHUT DOWN April 2026** | Sites | Everything else | Dead |
| Wegic | $24–$2,999/mo | Conversational sites | Business process | Website commodity |

**Key insight:** All competitors stop at the website layer. None combine: (1) free AI diagnostic, (2) autonomous build of workflows/agents (not just sites), (3) subscription maintenance + re-calibration. Hocoos shutting down April 2026 validates that the commodity website tier is a dead market.

eevolvv's actual competitive set is AI automation agencies charging $2K–$25K/month retainers — not website builders.

---

## B. Pricing Model Validation

### $99/mo Seed — Viable Only with Annual Plans

- At 5% monthly churn: LTV = $1,980; build cost $600; CAC $150; net $1,230. LTV:CAC 13:1.
- At 8% monthly churn (realistic SMB): LTV = $1,238; after $750 costs, net is $488. Thin.
- Annual plan ($950/year) solves this — churn rate drops ~4x for annual subscribers; upfront cash covers build cost immediately.

### $499/mo Core — Strong Economics

- At 4% churn: LTV = $12,475. Build cost $1,500–$3,000. LTV:CAC 15–40:1.
- This is the anchor tier. Best unit economics. Target 5+ Core clients for meaningful MRR.

### $1,999/mo Evolve — Underpriced

- Traditional automation consultancy: $5,000–$25,000/month
- At 2% churn: LTV = $99,950. Five Evolve clients = ~$10K MRR.
- **Recommendation:** Raise to $2,999–$3,999/mo after first 3 case studies.

### Intro Period Analysis

- Intro rate creates a churn cliff at month 6 (30–50% churn at price increase is documented in B2B SaaS research)
- Annual plan with "2 months free" is the better structure — no cliff, better cash flow, lower churn
- **Recommendation: Annual as default offer, monthly as fallback**

### Annual Plan Cash Flow Model

| Tier | Monthly | Annual | Upfront cash |
|------|---------|--------|-------------|
| Seed | $99 | $950 | $950 |
| Core | $499 | $4,790 | $4,790 |
| Evolve | $1,999 | $19,190 | $19,190 |

---

## C. Automation Feasibility by Stage (2026)

| Stage | Today | 12 Months | Notes |
|-------|-------|-----------|-------|
| Diagnostic chat | 98% | 99% | Already built |
| Report generation | 98% | 99% | Already built |
| Payment capture | 0% (unbuilt) | 99% | Stripe hosted checkout |
| Onboarding | 0% (unbuilt) | 90% | Form + webhook |
| Seed build (landing + 1 workflow) | 0% (unbuilt) | 85% | Claude Code |
| Core build (web app + agents) | 0% (unbuilt) | 65% | Claude Code + technician |
| Evolve build (full-stack + integrations) | 0% (unbuilt) | 45% | Claude Code + Devin + technician |
| QA | 0% (unbuilt) | 75% | Playwright agents |
| Deployment | 0% (unbuilt) | 90% | Vercel CLI + API |
| Subscription maintenance | 20% (cron) | 80% | Extend existing cron |
| Quarterly re-calibration | 0% | 60% | Templated + human review |

**95% automation target is achievable for Seed in 12–18 months. For Core it's ~80%. For Evolve it's ~60%.**

---

## D. Tool Stack Recommendations

### Orchestration: n8n (Self-Hosted)

- Free on self-hosted VPS ($20–$40/mo) vs. Zapier ($20–$69/mo) or Make ($9–$29/mo)
- 80–90% cost reduction vs. Zapier at scale
- Has: Stripe node, HTTP node, Webhook node, Cron node, Wait node (for 48-hour watchdog)
- **For MVP:** Continue with Vercel cron. Add n8n when 10+ active clients.

### AI Coding: Claude Code (Primary) + v0.dev (UI)

- Claude Code: 78.4% SWE-bench Verified — highest autonomy rating in 2026
- Auto mode (released May 2026): multi-step workflows with human approval gates
- v0.dev: UI component generation from prompts — ideal for landing page visual layer
- Devin ($500/mo): skip until post-revenue

### QA: Playwright + Checkly + Lighthouse CI (All Free Tier)

- Playwright: autonomous test creation + self-healing agents
- Checkly: converts Playwright tests to continuous monitors post-deploy
- Lighthouse CI: performance + accessibility scoring
- Cost per QA run on a landing page: ~$0.05–$0.15 in LLM tokens

### Deployment: Vercel Pro ($20/mo)

- Unlimited projects on Pro
- Vercel API enables programmatic domain addition post-build
- Agency-owned for Seed/Core; client-owned for Evolve

### SEO Stack (<$500/mo Total)

- Ahrefs Lite ($129/mo) + Surfer Essential ($99/mo) + Ghost self-hosted ($30/mo) + Claude API ($50–$100/mo) = ~$310–$360/mo total
- Programmatic SEO: industry verticals × city = infinite long-tail pages

---

## E. Free → Paid Conversion Benchmarks

- Generic free trial to paid: 2–5% industry average; top performers 10%+
- SEO leads → MQL: 51% (strongest acquisition source)
- eevolvv's personalized diagnostic estimated to outperform generic free trial by 2–3x
- **Realistic conversion range for report recipients → paid: 4–10%**

---

## F. Post-Report Ghosting Mitigation

Counter-mechanisms (ranked by impact):
1. Embed payment CTA in the report body (not just at the bottom)
2. 7-day countdown: "Your Evolution Report expires / offer locks in X days"
3. Follow-up email sequence at 24h, 72h, 7 days, 14 days (Resend + react-email already in place)
4. Report framing: "Chapter 1 of 2 — Chapter 2 only exists if we build it together"
5. Teaser report free, full report gated (alternative architecture — higher friction but higher intent signals)
