# eevolvv Business + Marketing Automation Game Plan

Status: working plan  
Updated: May 2026  
Goal: make eevolvv's growth engine operate like the service itself: diagnose, route, build, report, recalibrate.

## 1. Business Audit

### What is strong

- Positioning is now distinct: "We don't sell software. We become your AI operations team."
- The villain is memorable: ghost work is clearer than "inefficiency" or "automation."
- The offer is more tangible than before: diagnostic, private client agent page, Ghost Locker, weekly recommendations, workflow allowance, add-ons.
- The pricing ladder is simple: Agent One, Agent Three, Agent Five, plus enterprise custom scope.
- The codebase already supports the operating model: Stripe checkout, client pages, Ghost Locker data, onboarding, monthly reports, follow-up emails, quarterly recalibration, churn detection, and internal OS surfaces.
- The enterprise wedge is credible: QA programs and finance audit are urgent, budgeted, and underserved by generic SaaS.

### What is not strong enough yet

- Proof is thin. The brand promises hard outcomes, but the public site still needs real case studies, screenshots, redacted reports, and before/after metrics.
- The funnel has too many implicit handoffs. Diagnostic to follow-up to checkout to onboarding to agent page must feel automatic.
- Marketing operations are not yet fully closed-loop. Content, outbound, lead scoring, CRM movement, retargeting, referrals, and reporting need one pipeline.
- Enterprise and SMB messaging still compete for the same homepage oxygen. The current answer is correct: SMB is the brand, enterprise is the revenue. The site should keep the emotional broad promise while giving enterprise buyers a clear QA/finance door.
- Analytics must become a founder cockpit: traffic, diagnostic starts, completions, booked calls, checkouts, active clients, churn risk, and monthly revenue should be visible every day.

### Strategic diagnosis

eevolvv is no longer just a landing page plus diagnostic. It is becoming an AI-native service operating system. The marketing engine should not be a separate activity. It should be one more agent network: find demand, qualify demand, route demand, nurture demand, convert demand, and turn delivery proof back into new demand.

## 2. Core Marketing System

### Primary funnel

1. Visitor lands on eevolvv.com.
2. Visitor runs the Evolution Assessment.
3. Assessment creates a report, score, recommended tier, and top 3 ghost work findings.
4. Lead enters segmented follow-up based on industry, company size, urgency, and report score.
5. Qualified SMB is routed to checkout or Calendly.
6. Enterprise QA/finance lead is routed to founder-led consultative sales.
7. New client receives onboarding, client agent page, Ghost Locker, and first recommendations.
8. Delivery proof becomes case study content, referral prompt, badge, and future benchmark data.

### Segments

- SMB self-serve: local services, restaurants, fitness, agencies, trades, clinics. Route to Agent One / Three / Five.
- Enterprise wedge: QA, finance audit, FP&A, compliance, multi-system operations. Route to custom diagnostic call.
- Micro future: WhatsApp-first corner stores and global micro-retail. Keep on long-horizon nurture until product is ready.
- Partners: accountants, fCFOs, consultants, small agencies. Route to white-label diagnostic and referral/rev-share flow.

## 3. Automation Architecture

### Data sources

- Website and diagnostic events: PostHog.
- Leads and submissions: Supabase.
- Email delivery: Resend.
- Payments and subscriptions: Stripe.
- Booking: Calendly.
- CRM: HubSpot or Pipedrive.
- Client work: Ghost Locker and client agent pages.
- Internal command center: eevolvv OS.

### Minimum useful automation map

| Stage | Trigger | Automation | Output |
| --- | --- | --- | --- |
| Attract | LinkedIn post / SEO page / referral | UTM capture and page analytics | Source attribution |
| Diagnose | Assessment completed | Save report, score, top ghosts, recommended tier | Lead profile |
| Nurture | Report sent | 24h, 72h, 7d follow-up sequence | Booked call or checkout |
| Qualify | Score, company size, industry | Lead score and segment | SMB / enterprise / partner route |
| Convert | Checkout or call booked | Create client record and onboarding token | Client start |
| Onboard | Payment completed | Agent page, Ghost Locker, welcome email | Client operating home |
| Deliver | Build status changes | Client update email and internal OS event | Visible progress |
| Retain | Month end / quarter end | Monthly report and recalibration | Renewal proof |
| Expand | New recommendation accepted | Add-on checkout or invoice | Expansion revenue |
| Refer | Client win logged | Referral ask and share asset | New diagnostic starts |

## 4. Content Machine

### Weekly cadence

- Monday: ghost work story with one specific before/after number.
- Tuesday: enterprise wedge post for CFOs, QA leaders, or operators.
- Wednesday: founder build-in-public post showing the operating layer.
- Thursday: educational post: "what we found in X industry."
- Friday: client/prospect story, teardown, or diagnostic insight.

### Monthly pillar assets

- Ghost Work Index by industry.
- One redacted Evolution Report teardown.
- One enterprise wedge article: QA audit, close process, compliance evidence, or finance workflow.
- One partner-facing asset for accountants/fCFOs/consultants.
- One product proof post showing the client agent page or Ghost Locker.

### Automation loop

1. Pull anonymized diagnostic findings from Supabase.
2. Convert findings into content drafts.
3. Founder reviews and adds voice.
4. Schedule posts.
5. Track reach, comments, clicks, diagnostic starts, and booked calls.
6. Promote winners into landing page copy, email sequences, and outbound hooks.

## 5. Outbound Machine

### Enterprise list

Target $5M-$50M companies with visible QA, finance, compliance, manufacturing, logistics, or multi-location complexity.

Required fields:

- Company
- Industry
- Revenue estimate
- Buyer title
- Buyer name
- LinkedIn URL
- Pain hypothesis
- Compliance trigger
- Current tool hints
- Personalization line
- Outreach status

### Sequence

- Day 1: short LinkedIn connection or email with one pain hypothesis.
- Day 3: ghost work example from their function.
- Day 7: enterprise wedge proof or redacted report example.
- Day 14: "worth mapping this for you?" CTA.
- Day 30: useful teardown or benchmark, no hard sell.

CTA: "Want me to map the first 3 AI opportunities in your QA/finance process?"

## 6. Website Roadmap

### Shipped in this pass

- Homepage now reflects the current operating layer: diagnostic, client agent page, Ghost Locker, Stripe-backed tiers, automated follow-up/reporting loops, and enterprise wedge.
- Global vision section is now rendered.
- Metadata now matches the AI operations team / ghost work positioning.

### Next page-level additions

- `/case-studies`: redacted reports, before/after metrics, and screenshots.
- `/enterprise`: QA + finance audit landing page with a custom call CTA.
- `/partners`: accountant/fCFO/consultant white-label diagnostic offer.
- `/ghost-work-index`: SEO/GEO content hub by industry.
- `/diagnostic/share`: report share card for LinkedIn.

## 7. Highest-Leverage Automation Builds

### Build 1: Diagnostic share card

Auto-generate a branded image after every report:

- Evolution Score
- Top 3 ghost work findings
- Estimated hours recovered
- CTA: "Get yours at eevolvv.com"

Why: it turns every diagnostic into potential distribution.

### Build 2: Lead scoring and routing

Score by:

- Company size
- Industry
- Urgency language
- Annual savings estimate
- Compliance terms
- Number of workflows
- Buyer role

Routes:

- SMB low-mid score: email nurture and pricing page.
- SMB high score: Calendly + recommended tier.
- Enterprise: founder alert + enterprise sequence.
- Partner: partner intake.

### Build 3: Founder command center

One dashboard showing:

- Traffic by source
- Diagnostic starts/completions
- Report scores
- Follow-up sequence stage
- Booked calls
- Checkout starts/completions
- MRR/ARR
- Active client health
- Case study candidates
- Referral opportunities

### Build 4: Content extraction engine

Every report and client win should generate:

- LinkedIn draft
- Email nurture angle
- Case study note
- Industry benchmark datapoint
- Sales objection answer

### Build 5: Referral and badge loop

After a meaningful win:

- Send "Evolution Certified" badge.
- Generate LinkedIn milestone post.
- Ask for one peer referral.
- Offer free quarterly recalibration for a successful intro.

## 8. 30/60/90-Day Plan

### Days 1-30: Close the public funnel

- Add analytics events to every key CTA and diagnostic step.
- Add lead scoring fields to submissions.
- Add enterprise routing rules.
- Publish `/enterprise` page.
- Publish first 10 LinkedIn posts from the brand playbook.
- Create one redacted sample Evolution Report.
- Build founder command center MVP with traffic, diagnostics, calls, and Stripe revenue.

### Days 31-60: Automate nurture and proof

- Segment follow-up emails by SMB, enterprise, and partner.
- Add share card generation to report completion.
- Start weekly Ghost Work Dispatch.
- Add case study capture flow to client delivery.
- Add partner list and first partner sequence.
- Add automated "book a recalibration" prompt for warm leads.

### Days 61-90: Turn delivery into distribution

- Launch Ghost Work Index content hub.
- Add referral/badge loop.
- Add retargeting audiences once analytics is clean.
- Launch enterprise outbound list of 250 accounts.
- Publish 3 redacted case studies.
- Review channel ROI and double down on the top 2 sources.

## 9. KPIs

### Funnel

- Visitor to diagnostic start
- Diagnostic start to completion
- Report delivered
- Report to booked call
- Report to checkout
- Checkout to onboarding complete

### Revenue

- MRR
- ARR
- Average revenue per client
- Add-on attach rate
- Enterprise pipeline value
- Conversion by tier

### Marketing

- LinkedIn reach per post
- LinkedIn click-through to diagnostic
- Organic diagnostic starts
- Referral-sourced diagnostics
- Partner-sourced diagnostics
- Case study views

### Retention

- Monthly report open/click
- Recalibration completion
- Client health score
- Expansion recommendations accepted
- Churn-risk alerts

## 10. Immediate Decision List

- Choose CRM: HubSpot Free is the default unless there is a strong reason to prefer Pipedrive.
- Decide enterprise CTA: Calendly diagnostic call or "request enterprise audit."
- Decide first vertical for enterprise wedge: QA programs or finance audit. Do not split founder focus equally.
- Define the Evolution Score formula.
- Approve the first redacted sample report.
- Decide whether the public pricing page should include an enterprise card or keep enterprise as consultative only.

## 11. Operating Principle

Marketing should become the same thing eevolvv sells: a living operating layer. Every campaign creates data. Every lead improves routing. Every client win becomes proof. Every proof asset creates the next lead. The loop is the moat.
