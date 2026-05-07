# KARIMO RESEARCH SESSION
## eevolvv Side-Gig Pivot · Autonomous Full-Build Service

**Session type:** Deep strategic research + architecture planning  
**Scope:** End-to-end — business model → tech stack → client pipeline → pricing → build delivery → automation  
**Deliverable:** Strategic research report + implementation roadmap + improved pricing recommendation + Karimo build task breakdown

---

## CONTEXT: What E is trying to build

eevolvv is pivoting from a full-time consulting play to a **lean side-gig operation** with one technician. The goal is a **nearly fully autonomous business**: clients find eevolvv via SEO/inbound funnels, go through a free AI diagnostic, get an Evolution Report, see value, pay, get built for, and become long-term subscribers — all with minimal human touchpoints.

**The pipeline E envisions (end to end):**
```
SEO / content funnels
    → inbound traffic → diagnostic tool
        → Evolution Report (AI-generated, free)
            → post-report payment wall
                → automated onboarding
                    → build assignment (AI + technician)
                        → automated testing
                            → deployment
                                → subscription maintenance + quarterly re-calibration
```

**Two humans (E + technician), both in oversight-only roles:** Neither E nor the technician is doing execution work — they are doing async review and approval of what the autonomous pipeline produces. The target is ~95%+ automation. Humans are a final checkpoint, not a workflow step. Design every stage with this assumption: if neither human acts for 48 hours, the pipeline should still be able to proceed (or intelligently pause and notify).

**Client pays after the report** — meaning value-first, payment second. This is a key trust mechanism and needs to be modeled in the funnel.

---

## THE PRICING MODEL (to research, validate, and improve)

### Proposed Structure
- **Build fee: WAIVED** (included in membership — this is the acquisition hook)
- **First 6 months:** At the introductory monthly rate below
- **Months 7–12:** Same rate continues (still discounted vs. future regular pricing)
- **Month 13+:** Subscription continues at same or slightly higher rate unless canceled
- **"eevolvvtional Members" branding** — positions clients as part of an evolving community

### Proposed Tiers (research and validate each)
| Tier | Price | Target | Build Included |
|------|-------|--------|----------------|
| **Seed** | $99/mo | Solopreneurs, side-gigs, micro-businesses | Landing page or simple web presence + basic automation (1 workflow) |
| **Core** | $499/mo | Growing SMBs, local businesses, early startups | Web app or e-commerce build + 3–5 AI task agents + integrations |
| **Evolve** | $1,999/mo | Scaling businesses, multi-location, $1M–$10M revenue | Full-stack build: web, AI agents, CRM/ERP integrations, custom dashboards + quarterly re-calibration |

### Research questions for Karimo on pricing:
1. At $99/mo with a free build, what's the minimum viable CAC and LTV to make this sustainable as a side gig? Model this.
2. Is "6 months for the price of 1 month" actually what E means, or is it "first 6 months at intro rate, then regular rate"? Flag this ambiguity and model both scenarios. The first interpretation (literally 6 months' value for 1 month's payment) may be too aggressive to sustain even with low overhead.
3. What's the realistic build cost per tier (in Karimo/AI agent compute time + technician hours)?
4. What's the right regular price after the intro period? Suggest it.
5. Research comparable autonomous AI service businesses (Framer AI, 10Web, Durable, Mixo, etc.) — what do they charge and what do they include? Where is the gap eevolvv can own?
6. Should there be an annual plan option? Model the cash flow difference.
7. Is $1,999/mo for the Evolve tier underpriced for the scope described? What does a realistic comparable enterprise engagement cost?

---

## AUTONOMOUS PIPELINE — Research & Architecture

### Stage 1: SEO + Inbound Funnels (fully automated)
Research and propose:
- What SEO strategy should eevolvv run autonomously? (programmatic SEO, local SEO, long-tail content)
- What content cadence is realistic for a side-gig operator with no content team?
- Which tools can automate content creation, publishing, and distribution? (e.g., Surfer SEO + GPT pipelines, Beehiiv, Buffer, etc.)
- Should eevolvv target specific industries for the enterprise wedge (QA compliance, finance audit)? What search terms?
- What paid acquisition channels (if any) make sense at this scale?
- Propose: a minimal autonomous SEO stack that can run on $200–$500/mo in tooling

### Stage 2: Diagnostic → Evolution Report (partially automated, already exists)
The diagnostic tool (ChatEngine.tsx) exists at /diagnostic. Research and propose:
- How should the post-diagnostic payment wall work technically? (Stripe, gating, session tracking)
- What should happen between "report generated" and "payment"? Any nurture sequence?
- Should the Evolution Report be the free output, or should a teaser report be free and the full report gated?
- How do we prevent low-intent users from consuming compute without converting?
- Propose: a conversion optimization strategy for the diagnostic → payment step

### Stage 3: Automated Onboarding (needs to be built)
After payment, the client should experience near-zero human friction. Research and propose:
- What information does eevolvv need to collect to begin a build? Design an automated onboarding intake flow.
- How should scope be defined automatically based on tier? (e.g., $99 = landing page template selection, $499 = app type + integrations, $1999 = full discovery questionnaire)
- Should onboarding use a Typeform/Tally-style form, a conversational AI flow (like the diagnostic), or a guided portal?
- What's the automated "welcome + scope confirmation" communication flow? (email sequence, Slack/portal)
- How long should onboarding-to-build-kickoff take? Propose a timeline per tier.

### Stage 4: Build Assignment + Execution (the core automation challenge)
This is the hardest part. Research and propose:
- For Seed tier ($99): Can a landing page be built end-to-end by AI from intake data alone? What tools? (v0.dev, Vercel, Framer, custom Next.js templates?) What's the technician's role here?
- For Core tier ($499): What does a "web app + 3–5 AI agents" actually mean as a deliverable? How do we scope this tightly enough to be repeatable? What's the build template library?
- For Evolve tier ($1,999): This is the most custom. How does AI-assisted scoping work? What percentage is templated vs. custom? What's the technician's role?
- Propose: a **Build Playbook** structure — a library of pre-scoped, templatizable build types that can be matched to client intake data automatically.
- Research: what AI coding tools (Claude Code, Cursor, GitHub Copilot Workspace, Devin) can run the most autonomous build pipeline? What's the realistic level of autonomy today?
- Propose: a build queue system — how does the technician see what's pending, in progress, and ready for QA?

### Stage 5: Automated Testing (needs to be built)
Research and propose:
- What's the minimum viable automated QA suite for each tier?
- Seed: visual regression test, mobile responsiveness check, Lighthouse score
- Core: unit tests, integration tests, API endpoint testing, user flow testing
- Evolve: full E2E test suite, performance benchmarks, security scan
- What tools run autonomously? (Playwright, Checkly, Lighthouse CI, etc.)
- Who reviews the QA report — AI or technician? Propose the decision tree.
- What's the go/no-go criteria before deployment?

### Stage 6: Deployment (near-fully automated)
Research and propose:
- Should all client sites deploy to Vercel under eevolvv's team account, or to client-owned accounts?
- What's the handoff process? Does the client get repo access, Vercel access, both?
- How is domain/DNS managed? Automated or client-handled?
- What's the "launch notification" flow to the client?
- Propose: a deployment pipeline that requires zero technician input for Seed tier, minimal for Core, and defined for Evolve.

### Stage 7: Subscription Maintenance + Quarterly Re-calibration (automated)
Research and propose:
- What does "ongoing subscription" mean as a deliverable per tier?
  - Seed: hosting, uptime monitoring, 1 content update/mo?
  - Core: hosting + monitoring + 2 agent updates/mo + monthly performance report?
  - Evolve: full managed service + quarterly AI re-calibration session + monthly stakeholder report?
- How are subscription deliverables tracked and delivered automatically?
- What triggers a churn risk flag? How is it detected and responded to?
- Propose: a monthly automated client report template (uptime, performance, value delivered)
- What's the re-calibration process at month 6? How does it automatically generate upsell opportunities?

---

## BUSINESS OPERATIONS (side-gig friendly)

Research and propose:
- What's the minimum viable tooling stack to run this entire operation for <$500/mo? List every tool with cost.
- How should the technician's workflow be structured? (async, batch review sessions, ticket queue?)
- What's the capacity limit? How many clients can this operation handle at each tier before needing to hire?
  - Model: E spends 5 hrs/week, technician spends 20 hrs/week. What's max client count per tier?
- What's the financial model for Year 1? Assume slow ramp (5 clients/mo):
  - Month 1–3: 5 clients/mo, mixed tiers
  - Month 4–6: 10 clients/mo
  - Month 7–12: 15+ clients/mo
  - What's MRR at end of month 12? What's churn assumption?
- What legal/contractual wrapper is needed? (eevolvv service agreement already exists — what needs updating?)
- What payment/billing automation is needed beyond Stripe? (dunning, failed payment recovery, upgrade flows)

---

## KARIMO'S JOB: IMPROVE THE IDEA

Don't just execute the brief. **Push back and improve it.**

Specifically:
1. **Pricing gut-check:** Is $99 with a free build viable long-term? What's your recommendation? Should there be a 4th tier (e.g., $29/mo Micro) or should the $99 be the floor?
2. **"Fully autonomous" reality check:** What percentage of the pipeline can realistically be automated today vs. in 12 months? Where are the hard limits?
3. **"Paying post-report" risk:** What prevents a client from consuming the report and ghosting before payment? Propose a mitigation strategy.
4. **Tier naming:** "Seed / Core / Evolve" is a suggestion — propose better names that fit eevolvv's brand ("eevolvvtional Members" framing, evolution theme).
5. **The 6-month intro period:** Flag whether "6 months for the price of 1 month" vs. "6 months at intro rate" is what E intends, model both, and recommend which is better for LTV.
6. **Enterprise wedge:** Should the $1,999 tier be positioned more explicitly as the enterprise wedge (QA/finance audit framing from the investor strategy)? Or keep it SMB-focused?
7. **What's missing from E's vision?** What hasn't he thought of that a fully autonomous side-gig service business needs?

---

## DELIVERABLE FORMAT

Karimo should produce the following outputs in a structured report:

```
1. EXECUTIVE SUMMARY
   → Validated or revised business model summary (2-3 paragraphs)
   → Top 3 risks + mitigations
   → Top 3 opportunities E hasn't named

2. PRICING RECOMMENDATION
   → Final tier names, prices, and what's included
   → Intro period structure (precise model)
   → Financial model: MRR projections, break-even, capacity

3. AUTONOMOUS PIPELINE ARCHITECTURE
   → Stage-by-stage breakdown with tool recommendations
   → Automation percentage per stage (today vs. 12mo)
   → Technician touchpoints (exactly when and what)

4. BUILD PLAYBOOK OUTLINE
   → Template library structure per tier
   → Intake-to-build matching logic
   → QA and deployment decision trees

5. TOOLING STACK
   → Every tool needed, cost, category
   → Total monthly tooling cost estimate

6. IMPLEMENTATION ROADMAP
   → Phase 1 (MVP, 0-30 days): What must exist to take first client?
   → Phase 2 (30-90 days): What gets built to reach 20 clients?
   → Phase 3 (90-180 days): What gets built to reach 50 clients?
   → Karimo task breakdown: list of PRDs and build waves needed

7. OPEN QUESTIONS FOR E
   → Decisions Karimo can't make without E's input
```

---

## CODEBASE CONTEXT

The existing eevolvv.com stack:
- Next.js (App Router), TypeScript, Tailwind
- Supabase (submissions, rate limiting)
- Anthropic claude-sonnet-4-6 (diagnostic AI)
- Resend + react-email (Evolution Report delivery)
- Vercel (hosting)
- Stripe (payments — already configured via Atlas)
- Design system: `--paper` / `--ink` / `--accent` tokens, JetBrains Mono, Space Grotesk
- Diagnostic at `/diagnostic` — ChatEngine.tsx is the AI chat engine
- Evolution Report email template exists at `/emails/EvolutionReport`
- Client service agreement at `docs/eevolvv-service-agreement.docx`

The diagnostic → report → payment flow is the critical path to get right first. Everything else builds from that.

---

## RESEARCH SOURCES TO PULL

- Comparable autonomous service businesses: Durable.co, 10Web.io, Hocoos, Framer AI, Mixo.io — pricing, positioning, what they automate
- SaaS pricing best practices for service-software hybrids
- "AI agency" business model research (2024–2026)
- Stripe Atlas + Mercury integration for automated billing
- Vercel Team deployment pipelines for multi-client management
- Playwright + Checkly for autonomous QA pipelines
- n8n / Make / Zapier for automation orchestration — compare for this use case
- SEO automation tools: Surfer, Ahrefs, programmatic SEO playbooks

---

*Generated for eevolvv.com · Owner: E (Eduardo Barbosa) · Date: 2026-05-06*
*Use this as the seed for `/karimo:research "autonomous-sidegig-pivot"`*
