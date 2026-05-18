# eevolvv — Revenue & Marketing Game Plan

## CURRENT STATE AUDIT

### Real Clients
- **Studio 23** (Leesa) — Agent Three $999/mo
- **Bryce @ MKM** — build stage
- Total MRR: $999 (from Studio 23 alone)

### Pricing Tiers (Already Configured ✅)
| Tier | Monthly | Annual | Automations | 
|------|---------|--------|-------------|
| Agent One (Seed) | $499 | $4,990 | 1 |
| Agent Three (Core) | $999 | $9,990 | 3 |
| Agent Five (Evolve) | $1,999 | $19,990 | 5 + ads/SEO/SCO |

### Add-ons
- Website Build: $2,000 one-time
- SCO Management: $500/mo
- Extra Automation: $300-$750/mo
- Ads Setup: $750 one-time
- Custom Dashboard: $1,500-$5,000 one-time

### Conversion Funnel
```
Industry Page → Diagnostic Chat → Evolution Report (email) 
  → Eduardo reaches out → Call → Pricing → Stripe Checkout
```
**Problem:** Manual step (Eduardo reaching out) creates friction and delay.

---

## PHASE 1: PAYMENT STRUCTURE (Build This Week)

### 1. Add ACH / Bank Transfer Payments
- Stripe Payment Intents supports ACH debits
- Reduces fees (0.8% vs 2.9%) and enables enterprise clients
- **Build:** Add ACH option to checkout page

### 2. Self-Serve Funnel (Kill Manual Step)
- Evolution Report page → shows pricing tiers inline → "Start Agent One" CTA
- No human needed for $499/mo signups
- **Build:** Add tier CTAs to /report/[id] page

### 3. $97 Report → Upgrade Path
- Someone buys the $97 Report + Roadmap
- Auto-upsell: "Upgrade to Agent One — first month $299" (limited-time)
- **Build:** Post-purchase upgrade email + Stripe coupon

### 4. Invoice / Purchase Order Support
- Enterprise clients need invoices before paying
- **Build:** Stripe Invoicing API for custom billing

---

## PHASE 2: CONVERSION OPTIMIZATION (Build Next Week)

### 5. Social Proof on Pricing Page
- Case study cards for Studio 23 (anonymized or with permission)
- "Saved 15hrs/week on admin" → real numbers
- **Build:** Case study component on /pricing

### 6. Abandoned Cart Recovery
- Stripe sends email when someone starts checkout but doesn't finish
- **Build:** Enable Stripe recovery + add Resend follow-up sequence

### 7. Reduce Diagnostic Friction
- Current: 10-min chat → email → manual outreach
- Fix: Show report IN BROWSER instantly (no email wait) → pricing right after
- **Build:** Real-time report rendering on /extract page

### 8. Calendly Deep Integration
- Every Evolution Report footer: "Book 15-min walkthrough"
- Every SMS follow-up: Calendly link
- Every email: Calendly link
- Already have: calendly.com/hello-eevolvv/30min

---

## PHASE 3: MARKETING ENGINE (This Month)

### 9. LinkedIn Ghost Work Receipts (Your Voice)
Post 3-4x/week:
- Specific business type → bullet workflow steps with hours
- Dollar total of what they're losing
- "Nobody called it a problem" hook
- Specific fix → insight → CTA: "Free ghost work audit at eevolvv.com"

### 10. Leesa/Bryce Case Studies
- Document the exact process for Studio 23:
  - Before: manually managing roofing leads
  - After: AI handles intake, follow-up, review requests
- Use as website content, emails, and LinkedIn posts

### 11. Cold Outbound (When SMS Is Approved)
- Striker scrapes daily → exports to CSV
- Warm SMS → Evolution Report link → Calendly
- 3-touch sequence: SMS (Day 0) → Email (Day 2) → LinkedIn (Day 5)

### 12. Referral Program
- $250 credit for every referral that converts
- Simple: "Give us one intro → get one month free"

---

## BUILD PRIORITY

### Today/Tonight (High Impact, Low Effort)
1. ✅ Add HubSpot sync on diagnostic completion (DONE)
2. ✅ Diagnostic → HubSpot contact (DONE)
3. Add $97 report inline upsell on report page
4. Enable Stripe abandoned cart recovery

### Tomorrow
5. Admin Telegram alert on every diagnostic submission
6. Evolution Report → Pricing CTA buttons
7. Calendly link in every SMS template

### This Week
8. ACH payment option
9. Leesa case study page
10. LinkedIn content calendar (3 drafts queued)

### This Month
11. Cold email outreach via Striker data
12. Referral program page
13. Industry-specific landing page optimization