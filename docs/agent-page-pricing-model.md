# Agent Page Pricing Model

**Status:** Draft for immediate offer  
**Core product:** client agent page  
**Rule:** Websites, SEO, SCO, ads, automations, reports, and strategy are files/actions inside the agent page.

---

## Recommended Public Tiers

### Tier 1 — Agent One

**Recommended price:** `$499/mo`  
**Annual:** `$4,990/yr`  
**Who it is for:** one-location SMB, solo operator, early service business

Includes:

- Private client agent page
- Google OAuth client access
- Weekly recommendations
- 1 active integration or automation
- Monthly status summary
- File hub for docs, reports, assets, website, SEO ideas, and next actions
- Hosting/monitoring for the agent page
- SCO management available as an add-on
- Website available as a flat-rate add-on

Good fit:

- Lead intake
- Booking request packet
- Contact form to email/CRM
- Review request workflow
- Simple content idea generator

Internal cost target:

- Setup: 4-6 hours
- Monthly maintenance: 1.5-2.5 hours
- Gross margin target: 70%+

---

### Tier 2 — Agent Three

**Recommended price:** `$999/mo`  
**Annual:** `$9,990/yr`  
**Who it is for:** growing SMB with recurring leads, service ops, and multiple tools

Includes:

- Everything in Tier 1
- 3 active integrations or automations
- Weekly recommendations
- Monthly agent optimization pass
- Priority update queue
- Simple reporting view inside the agent page
- SCO management available as an add-on
- Website available as a flat-rate add-on

Good fit:

- Lead intake + CRM sync + follow-up
- Booking + calendar + reminders
- Content engine + publish queue + performance notes
- Quote request packet + owner alert + job tracker

Internal cost target:

- Setup: 8-12 hours
- Monthly maintenance: 3-5 hours
- Gross margin target: 65%+

---

### Tier 3 — Agent Five

**Recommended price:** `$1,999/mo`  
**Annual:** `$19,990/yr`  
**Who it is for:** serious local business, multi-location operator, or SMB using eevolvv as its AI ops layer

Includes:

- Everything in Tier 2
- Up to 5 active integrations or automations
- Weekly recommendations
- Ads/SEO/SCO management included
- Monthly growth report
- Quarterly strategy recalibration
- Priority build queue

Important note:

- Ads/SEO/SCO management is included.
- Ad spend is not included.
- Paid tools, SaaS subscriptions, phone/SMS usage, and API usage are passed through or approved separately.

Good fit:

- CRM + booking + follow-up + review generation + local SEO content
- Ads intake + lead routing + campaign ideas + landing page tests + monthly report
- Job pipeline + reminder system + estimate follow-up + review requests + content engine

Internal cost target:

- Setup: 14-22 hours
- Monthly maintenance: 6-10 hours
- Gross margin target: 60%+

---

## Website Add-On

The website is not the base product. It is an add-on file inside the agent page.

### Website Build

**Price:** `$2,000 one-time`

Includes:

- Conversion-ready branded website
- Mobile responsive
- Contact CTA
- Core pages or sections based on scope
- Basic SEO metadata
- Launch checklist
- Added as a tangible product file inside the client Ghost Locker

Why one flat rate:

- It keeps the offer simple.
- It prevents the website from becoming the product.
- It lets eevolvv sell the real thing: the client's agent page and ongoing operating layer.
- If a client needs an unusually large custom website, scope it separately as custom work.

Recommended offer:

- Every tier can buy the website add-on for `$2,000`.
- The finished website appears in the Ghost Locker with URL, page list, launch checklist, and future recommendations.

---

## Add-On Pricing

Use this when clients need more than their tier includes.

| Add-on | Price |
| --- | ---: |
| Extra integration / automation | `$300-$750/mo` depending on complexity |
| One-time automation build | `$750-$2,500` |
| SCO management for Agent One / Agent Three | `$500/mo` |
| Extra weekly content/SEO action | `$300/mo` |
| Ads campaign setup | `$750 one-time` |
| Ads management beyond Tier 3 scope | `10%-15% of spend, $500/mo minimum` |
| SMS/phone automation | usage + `$300/mo management` |
| Custom dashboard | `$1,500-$5,000 one-time` |
| Website build | `$2,000 one-time` |

---

## What Counts As One Integration / Automation

One automation should have one primary job.

Examples that count as one:

- Contact form to email packet
- Website lead to CRM
- Booking request to calendar
- Missed lead follow-up
- Review request sequence
- Weekly SEO idea generation
- New job alert to owner
- Invoice reminder workflow
- Simple report generator

Examples that are more than one:

- CRM sync + SMS follow-up + review request = 3
- Ads intake + landing page + reporting dashboard = 3+
- Full customer portal = custom scope

---

## Immediate Service Menu

These are the services eevolvv can offer immediately with the current stack.

### Agent Page

Needed:

- Client config in `lib/client-agent-pages.ts`
- Google OAuth allowed email
- Files/actions/paid unlocks
- Internal OS client record

### Recommendations

Needed:

- Weekly recommendation template
- Source inputs: client notes, latest files, analytics, active automations
- Manual first, automated later

### Integrations / Automations

Immediate options:

- Website form to email
- Website form to CRM
- Intake form to lead packet
- Calendly/booking link routing
- Review request workflow
- Content idea generator
- Monthly report email
- Simple owner alert

Needed:

- Integration inventory per client
- Tool access checklist
- QA checklist
- Logging: what ran, when, and result

### Ads / SEO / SCO

Immediate options:

- SEO/SCO idea bank
- Local service-area content plan
- Google Business Profile checklist
- Landing page recommendations
- Ads campaign structure
- Monthly performance notes
- ChatGPT/Search discovery questions and answers
- FAQ/content updates that make the business easier for humans and AI systems to understand

Needed:

- Client ad account access
- Analytics/Search Console access
- Google Business Profile access
- Ad spend budget approval
- Publishing workflow

Tier rule:

- Agent One and Agent Three can add SCO management for `$500/mo`.
- Agent Five includes ads/SEO/SCO management. Ad spend remains separate.

### Website Add-On

Immediate options:

- One-page site
- 3-5 page service site
- Campaign landing page
- Intake/lead form

Needed:

- Brand assets
- Domain/DNS access
- Contact info
- Service area
- Services/offers
- Approval workflow

---

## First 7-Day Rollout

### Day 1

- Finalize tier names and public prices.
- Update pricing page copy.
- Update Stripe product plan.
- Define “one automation” in sales copy.

### Day 2

- Make `/os/[client-slug]` the canonical client delivery route.
- Add auth allowlist per client.
- Add file/action/paid unlock schema.

### Day 3

- Build Studio 23 as the first canonical example.
- Convert existing docs into agent-page files.
- Add first “request this build” CTA.

### Day 4

- Write onboarding checklist for integrations.
- Create templates for weekly recommendations.
- Create automation QA checklist.

### Day 5

- Update emails and onboarding copy.
- Make checkout tier names match agent-page model.
- Add website add-on language.

### Day 6

- Create sales script and proposal language.
- Package Studio 23 demo.
- Test Google OAuth access.

### Day 7

- Go live with revised pricing.
- Start selling the agent page as the product.

---

## Recommendation

Use these prices now:

| Tier | Monthly | Included automations/integrations |
| --- | ---: | ---: |
| Agent One | `$499/mo` | 1 |
| Agent Three | `$999/mo` | 3 |
| Agent Five | `$1,999/mo` | up to 5 + ads/SEO/SCO management |

Do not lead with a website. Lead with:

> “Your business gets an agent page. Everything we build lives there. Every week it recommends what to do next.”

Then sell the website as:

> “A website can be added as one of the files your agent controls.”

And make the human-facing rule:

> “Everything you pay for becomes visible in your Ghost Locker: what it is, what it does, what it cost, what stage it is in, and what proof exists.”
