# Google Ads — Week 1 Campaign Config

Status: ready to launch
Owner: E (Eduardo)
Budget: $50/month
Source: `docs/marketing-automation-gameplan.md` § 4 Paid Search

## Locked Decisions

- **Budget:** $50/month (~$1.65/day)
- **Match type:** Exact match only (no broad, no phrase to start)
- **No display, no retargeting, no shopping**
- **Single campaign, single ad group** to start — split only when data justifies it
- **Geography:** US, English
- **Verticals (top of funnel):** contractors / roofing / home services first

## Campaign Settings

| Setting | Value |
|---|---|
| Campaign name | `eevolvv · missed-lead · exact · US · 2026-Q2` |
| Goal | Leads (manual setup, not goal-based) |
| Type | Search |
| Networks | Google Search only (uncheck Search Partners + Display Network) |
| Locations | United States · Targeting "Presence" |
| Languages | English |
| Audience | None at start |
| Bid strategy | Manual CPC with enhanced CPC OFF; max CPC $4.50 |
| Daily budget | $1.65 |
| Ad rotation | "Optimize: prefer best performing ads" |
| Schedule | All days, all hours (collect data first) |

## Ad Group

**Name:** `ag · contractors · missed-lead`

### Keywords (exact match)

Wrap each in `[brackets]` in Google Ads UI for exact match.

```
[missed lead follow up automation]
[ai receptionist for small business]
[contractor lead follow up]
[roofing lead follow up]
[small business lead automation]
[automate customer follow up]
[ai phone receptionist small business]
[missed call text back automation]
[lead follow up software for contractors]
[ai assistant for roofers]
```

### Negative keywords (campaign-level)

```
free
crack
download
tutorial
how to build
github
open source
diy
chatgpt
zapier
make.com
n8n
career
jobs
salary
```

## Ads

### Ad 1 — "Missed leads"

**Final URL:** `https://eevolvv.com/missed-lead-follow-up?utm_source=google&utm_medium=cpc&utm_campaign=missed-lead-week-1&utm_term={keyword}&utm_content=missed-leads-1`

**Headlines (15):**
1. Stop Losing Leads to Slow Follow-Up
2. AI Receptionist for Contractors
3. Every Missed Call → A Booked Job
4. Built for Roofers, Cleaners, Trades
5. Get Your Free Ghost Work Report
6. Automate Lead Follow-Up in 7 Days
7. Reply to Leads in Under 60 Seconds
8. AI That Actually Books Jobs
9. Stop Re-Typing Lead Info
10. We Build It. You Own The Workflow.
11. Free 10-Minute Business Diagnostic
12. SMB AI, Not Enterprise Bloat
13. Real Service, Not Just Software
14. Ghost Work Is Eating Your Margin
15. eevolvv — AI Ops for Small Business

**Descriptions (4):**
1. Free diagnostic finds the leads, hours, and revenue you're losing. We build the workflow — you own the customer.
2. AI agent answers calls, follows up with leads, books jobs into your calendar. Built for trades.
3. Get your free Evolution Report. Custom automation roadmap inside, ROI projected, ready in 10 minutes.
4. Not software. A service. We diagnose, build, integrate, and maintain — so you can stop chasing leads.

### Ad 2 — "AI receptionist"

**Final URL:** `https://eevolvv.com/ai-receptionist-small-business?utm_source=google&utm_medium=cpc&utm_campaign=missed-lead-week-1&utm_term={keyword}&utm_content=ai-receptionist-1`

**Headlines (15):**
1. AI Receptionist for Small Business
2. Never Miss a Lead Again
3. 24/7 Lead Capture for SMBs
4. Books Jobs While You Sleep
5. AI Answers · You Show Up
6. Built for Service Businesses
7. Replace the After-Hours Voicemail
8. Free Evolution Diagnostic
9. AI Agent + Human Quality
10. 10-Minute Setup Diagnostic
11. Stop Paying $1,800/mo for VAs
12. Trades-First AI Automation
13. We Build · We Integrate · We Maintain
14. Custom AI for Your Business
15. eevolvv — Real Ops Team, AI-Native

**Descriptions (4):**
1. AI receptionist that handles calls, books jobs, and follows up. Free diagnostic in 10 minutes.
2. We don't sell software. We build a custom AI ops team that works inside your existing tools.
3. Every missed call costs you $250+. Get a free Evolution Report — find every ghost in your business.
4. Built for contractors, roofers, gyms, cleaners, salons. Not generic AI. Not enterprise. Just yours.

### Assets (sitelinks, callouts)

**Sitelinks (4):**

| Title | Description 1 | Description 2 | URL |
|---|---|---|---|
| Free Diagnostic | 10-min AI assessment | Custom report inside | `/#diagnostic` |
| See Pricing | Agent One $500/mo | Start with one workflow | `/pricing` |
| Partner Program | 10% rev share | Bring your clients | `/partners` |
| How It Works | Diagnose → Build → Maintain | Service, not software | `/#process` |

**Callouts (6):**

- 10-minute free diagnostic
- Built in 7 days
- We integrate with your tools
- 10% partner rev share
- No long-term contracts
- Real humans + AI

**Snippets:**

- *Services:* Missed lead follow-up · AI receptionist · Booking automation · Review automation
- *Brands:* Roofing · Cleaning · Gyms · Salons · Auto · Contractors

## Conversion Tracking

Configure in Google Ads → Tools → Conversions, then link to GA4 if you have it. We track via PostHog primarily, but mirror the most important events into Google Ads so the auction bids on them.

| Conversion | Where | PostHog event | GAds category |
|---|---|---|---|
| Diagnostic started | `/#diagnostic` (CTA click → ChatEngine first user turn) | `cta_clicked` (target=diagnostic) | Lead |
| Diagnostic completed | `/api/diagnostic` POST 200 | `diagnostic_report_generated` | Lead |
| Pricing tier clicked | Homepage Pricing | `pricing_tier_clicked` | Lead |
| Partner application | `/partners` | `partner_application_submitted` | Sign-up |

For now, the primary conversion to optimize for is **diagnostic_report_generated**. Mark it as Primary; leave others as Secondary.

## Pause Rules

Per the gameplan: **pause any keyword that spends $10 without a diagnostic start, checkout start, or qualified click pattern.**

Operationalize as a weekly review:

1. Pull spend by keyword.
2. For each keyword: spend ÷ diagnostic_started rate.
3. Any keyword over $10 spend with 0 conversions → pause.
4. Any keyword under $0.40 CPC and ≥1 conversion → consider doubling budget on it next week.

## Week 1 → Week 2 Roll-Up

**At end of Week 1 ($50 spent):**

- Number of clicks
- Click-through rate by ad
- Number of diagnostic starts attributable to ads (PostHog filter: `utm_source=google`)
- Number of diagnostic completions
- Cost per diagnostic start
- Cost per diagnostic completion

**Decision rules:**

- CPL ≤ $25 (diagnostic completion) → keep + scale next week
- CPL $25–$60 → keep, tighten keywords
- CPL > $60 → pause campaign, revisit messaging
- Zero conversions, ≥40 clicks → message issue (rewrite top headlines + descriptions)
- Zero clicks → keyword/match issue (broaden to phrase match on the two best terms)

## Landing Page UTM Capture

UTMs land on the page and need to flow into the diagnostic submission. The diagnostic API now accepts `utmSource`, `utmMedium`, `utmCampaign`, `utmTerm`, `utmContent`, and `landingPage` — wire them up from the URL params on diagnostic start so attribution lands in `submissions` + PostHog.

TODO (engineering follow-up, not part of Google Ads setup):

- Read URL search params on first homepage / growth page render
- Persist to sessionStorage
- Pass to `/api/diagnostic` POST body
- Confirm presence in PostHog `diagnostic_report_generated` event

## Account Hygiene Checklist

- [ ] Conversion tracking firing in Google Ads test mode before campaign goes live
- [ ] Auto-applied recommendations OFF
- [ ] "Optimize ad rotation" set to manual
- [ ] Search partner network OFF
- [ ] Display network OFF
- [ ] Smart Bidding OFF (manual CPC at start)
- [ ] Geo target = United States · Presence only
- [ ] Daily budget = $1.65
- [ ] All ads pass policy review before pushing live
- [ ] Final URLs return 200 (`/missed-lead-follow-up` + `/ai-receptionist-small-business` already live)
- [ ] UTM params populate correctly when clicking each ad

## Future Expansion (after Week 1 validation)

- Add ad groups for cleaning + gyms (one ad group per vertical, ~3 keywords each)
- Phrase match a small set of terms once exact has validated CTR
- Once monthly diagnostic completions ≥ 30, layer audiences from PostHog cohort
- Once CPL stable < $40, consider raising budget to $200/month
