# Lead Corral — Revenue Agent Plan

## What it is

Lead Corral is an AI-powered lead generation and outreach system that runs inside eevolvv.
It scrapes, qualifies, and messages local business owners on behalf of eevolvv (or as a
white-label service sold to other agencies). It generates revenue two ways:

1. **Internal engine** — drives inbound clients into eevolvv tiers ($499–$1,999/mo)
2. **Sold as a service** — "Lead Corral for Your Agency" at $500–$1,500/mo retainer

---

## Revenue Model

| Product | Price | Cadence |
|---|---|---|
| Lead Corral as eevolvv growth engine | internal | ongoing |
| Lead Corral for agencies (managed) | $500–$1,500/mo | retainer |
| Lead Corral setup + handoff | $1,500 flat | one-time |
| Lead list delivery (1,000 leads + enriched) | $299 | one-time |

---

## Target Buyers (Internal)

Local SMBs that can buy Agent One–Five:
- Dental offices
- Restaurants + food trucks
- Home contractors (HVAC, plumbing, electrical)
- Auto shops
- Gyms + studios
- Salons + medspas
- Chiropractors

Budget signal: anyone spending on Google Ads or Yelp is already paying for leads.

---

## Phase 1 — Week 1-2: Build the Scraper Layer

### Tools
- `google-maps-scraper` (Python, apify/playwright) — scrape by category + city
- Yelp GraphQL API or scrape — supplement
- Apify actor or local playwright script

### Output per lead
- Business name
- Phone (formatted for SMS)
- Email (if on site)
- Website URL
- Google rating + review count
- City / neighborhood
- Category

### Storage
- Supabase table: `leads` (business_name, phone, email, city, category, source, status)
- Status: `raw → contacted → replied → qualified → closed`

---

## Phase 2 — Week 2-3: Outreach Automation

### SMS (Grasshopper toll-free +1 844-433-8658)
Template A (generic):
> "Hey [Name], saw [Business] on Google — quick question. Do you have anything automated
> helping you get reviews or follow up with customers? I help [city] [type] businesses
> set that up in 48 hours. Worth a 5-min call? — Eduardo, eevolvv.com"

Template B (pain-specific):
> "Hey [Name] — [Business] has great reviews. Most shops at your level are still doing
> follow-ups manually. I fix that. Free diagnostic at eevolvv.com or reply here."

### Email (Resend)
- Subject: "Quick question about [Business]"
- Same punch: free diagnostic CTA

### Follow-up cadence
- Day 0: SMS
- Day 2: Email
- Day 5: SMS #2 (brief)
- Day 9: Final email

---

## Phase 3 — Month 2: Sell as a Service

Once internal engine is proven (2–3 clients acquired from it), package it:

- Landing page at eevolvv.com/lead-corral (or leadcorral.ai — check availability)
- Offer: "We build and run your lead scrape + outreach. You close."
- Positioning: done-for-you, no ad spend, pay per month
- Target buyers: marketing agencies, HVAC franchises, dental groups

---

## Build Order

1. [ ] Supabase `leads` table migration
2. [ ] Google Maps scraper script (playwright or Apify)
3. [ ] Supabase insert pipeline
4. [ ] SMS outreach script (Grasshopper API or manual batch)
5. [ ] Email outreach via Resend (template + bulk send script)
6. [ ] Dashboard route `/os/lead-corral` — view leads, status, send queue
7. [ ] Optional: Stripe product for "Lead Corral for Agencies"

---

## Quick Wins This Week

- Scrape 200 dental offices in Dallas/Houston/Austin
- Send 50 SMS messages
- Book 3 calls
- Close 1 at Agent One ($499/mo)

One client = $499/mo. Two clients = $998/mo. Five clients = $2,495/mo.
That pays for itself and funds the next phase.

---

## Notes

- Keep it manual-first. Scraper runs locally. Eduardo sends SMS from Grasshopper.
  Automation comes after proof.
- Do NOT build a full SaaS before getting first paid client from it.
- Leads data is an asset — treat it like one.
