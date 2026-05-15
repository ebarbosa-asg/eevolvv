# eevolvv Make Money Now Operating Plan

## Immediate cash thesis

eevolvv should make money through three paths at once:

1. **Low-friction paid diagnostic upgrade**
   - Product: Full Report + Roadmap
   - Price: $97 one-time
   - Buyer: anyone who ran the free diagnostic but is not ready for a call
   - Proof: permanent report URL, prioritized fixes, tool-specific next steps, upgrade path

2. **Managed agent page subscriptions**
   - Agent One: $499/mo
   - Agent Three: $999/mo
   - Agent Five: $1,999/mo
   - Buyer: business owner who wants eevolvv to implement
   - Proof: private agent page, active work, Ghost Locker, visible deliverables

3. **Manual founder-led implementation sales**
   - Website build: $2,000 flat
   - SCO management: $500/mo
   - Extra automation: $300-$750/mo
   - Ads setup: $750
   - Custom dashboard: $1,500+
   - Buyer: warm leads, local businesses, referrals, platform inbound
   - Proof: file, URL, checklist, report, workflow, dashboard, or status card

## What is already built

- Free AI diagnostic
- Admin lead notification email
- Follow-up email queue
- Permanent report URL at `/report/[id]`
- Stripe checkout for agent subscriptions
- Studio 23 client agent page template
- Client agent request flow into OS service tasks
- Ghost Locker product model

## What was missing and is now wired

- `$97` Full Report + Roadmap product model
- One-time Stripe Checkout path for `report-roadmap`
- Post-report $97 CTA
- `/pricing` $97 CTA
- Required env var: `STRIPE_PRICE_REPORT_ROADMAP`

## Stripe task still required

Create this in Stripe:

- Product: `eevolvv Report + Roadmap`
- Price: `$97.00 USD`
- Billing: one-time
- Env var: `STRIPE_PRICE_REPORT_ROADMAP=price_...`
- Set in `.env.local` and Vercel production

The app route is already wired:

```txt
/api/stripe/checkout?product=report-roadmap
```

## 48-hour revenue sprint

### Today

- Send 10 warm texts.
- DM 10 business owners on LinkedIn.
- Post one LinkedIn “ghost work reveal.”
- Create Stripe `$97` price and set `STRIPE_PRICE_REPORT_ROADMAP`.
- Deploy the app.
- Manually follow up with every diagnostic lead inside 2 hours.

### Tomorrow

- List on Contra, Upwork, Fiverr, and GrowthMentor.
- Offer one concrete service:
  - `AI Business Automation Audit`
  - `Website + AI Agent Page Setup`
  - `Local SEO/SCO Audit`
- Publish one LinkedIn post.
- Reach out to 10 local roofing, gym, restaurant, medspa, contractor, and agency owners.

### This week

- Create Product Hunt listing.
- Create Clutch/GoodFirms/UpCity listings.
- Launch one $197 workshop offer for diagnostic users.
- Create one Gumroad playbook offer.
- Run one small ad test only after the $97 checkout is live.

## Legit parallel cash ideas

These can use eevolvv assets without pretending to be something else:

- Sell `$97-$197` industry playbooks on Gumroad.
- Sell `$197/person` live Ghost Work Audit Workshop.
- Sell `$299/mo` white-label diagnostic licensing to consultants.
- Sell `$150-$250/hr` automation consulting on freelance platforms.
- Sell `$2,000` flat website builds with an agent page handoff.

Avoid anything deceptive, hidden from clients, or branded as passive income if it needs delivery. Cash now comes from clear offers, fast fulfillment, and visible proof.

## Rule

No paid offer should exist without a deliverable definition.

Every product must have:

- name
- price
- buyer
- promise
- proof artifact
- delivery window
- upsell path
