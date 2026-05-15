# Stripe Products Setup Guide

**Status:** update Stripe before taking payments on the revised agent-page model  
**Core product:** client agent page subscription  
**Internal tier keys:** keep `seed`, `core`, and `evolve` for code/database compatibility.

---

## Subscription Products

Create or update these three Stripe products. Each product has a monthly and annual price.

### Product 1: eevolvv Agent One

| Field | Monthly | Annual |
|-------|--------:|------:|
| Product name | `eevolvv Agent One` | `eevolvv Agent One` |
| Price | `$499.00 USD` | `$4,990.00 USD` |
| Billing period | Monthly | Yearly |
| Lookup key | `seed_monthly` | `seed_annual` |
| Env var | `STRIPE_PRICE_SEED_MONTHLY` | `STRIPE_PRICE_SEED_ANNUAL` |

Includes: private agent page, weekly recommendations, 1 active integration/automation, Ghost Locker product view.

### Product 2: eevolvv Agent Three

| Field | Monthly | Annual |
|-------|--------:|------:|
| Product name | `eevolvv Agent Three` | `eevolvv Agent Three` |
| Price | `$999.00 USD` | `$9,990.00 USD` |
| Billing period | Monthly | Yearly |
| Lookup key | `core_monthly` | `core_annual` |
| Env var | `STRIPE_PRICE_CORE_MONTHLY` | `STRIPE_PRICE_CORE_ANNUAL` |

Includes: private agent page, weekly recommendations, 3 active integrations/automations, monthly optimization pass.

### Product 3: eevolvv Agent Five

| Field | Monthly | Annual |
|-------|--------:|------:|
| Product name | `eevolvv Agent Five` | `eevolvv Agent Five` |
| Price | `$1,999.00 USD` | `$19,990.00 USD` |
| Billing period | Monthly | Yearly |
| Lookup key | `evolve_monthly` | `evolve_annual` |
| Env var | `STRIPE_PRICE_EVOLVE_MONTHLY` | `STRIPE_PRICE_EVOLVE_ANNUAL` |

Includes: private agent page, weekly recommendations, up to 5 active integrations/automations, ads/SEO/SCO management.

---

## Add-On Products

These can be created as one-time prices or subscription prices. They do not need to be wired into automated checkout on day one; they can be invoiced manually until the add-on checkout UI is built.

| Add-on | Stripe product name | Price | Billing |
|--------|---------------------|------:|---------|
| Report + Roadmap | `eevolvv Report + Roadmap` | `$97` | One-time |
| Website Build | `eevolvv Website Build` | `$2,000` | One-time |
| SCO Management | `eevolvv SCO Management` | `$500` | Monthly |
| Extra Integration / Automation | `eevolvv Extra Automation` | `$300-$750` | Monthly or one-time scope |
| Ads Campaign Setup | `eevolvv Ads Campaign Setup` | `$750` | One-time |
| Custom Dashboard | `eevolvv Custom Dashboard` | `$1,500-$5,000` | One-time |

Tier rule:

- Agent One and Agent Three can buy SCO Management for `$500/mo`.
- Agent Five includes ads/SEO/SCO management. Ad spend is not included.
- Every tier can buy the Website Build add-on for `$2,000`.

---

## Environment Variables

After creating the subscription prices, copy the `price_...` IDs into `.env.local` and the Vercel production environment:

```bash
STRIPE_PRICE_SEED_MONTHLY=price_1TX6IR822jgZpeCahXFgOOxK
STRIPE_PRICE_SEED_ANNUAL=price_1TX6IR822jgZpeCaHncERDAy
STRIPE_PRICE_CORE_MONTHLY=price_1TX6IS822jgZpeCa91jUkgcT
STRIPE_PRICE_CORE_ANNUAL=price_1TX6IS822jgZpeCa41GYfbUt
STRIPE_PRICE_EVOLVE_MONTHLY=price_1TX6IT822jgZpeCaZtr79Mjy
STRIPE_PRICE_EVOLVE_ANNUAL=price_1TX6IT822jgZpeCaSxyt6jXX
STRIPE_PRICE_REPORT_ROADMAP=price_XXXX
```

---

## Webhook Configuration

Endpoint URL:

```txt
https://eevolvv.com/api/stripe/webhook
```

Events:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

Store the signing secret as:

```bash
STRIPE_WEBHOOK_SECRET=whsec_XXXX
```

---

## Pricing Summary

| Tier | Monthly | Annual | Included automations/integrations |
|------|--------:|-------:|----------------------------------:|
| Agent One | `$499/mo` | `$4,990/yr` | 1 |
| Agent Three | `$999/mo` | `$9,990/yr` | 3 |
| Agent Five | `$1,999/mo` | `$19,990/yr` | up to 5 + ads/SEO/SCO |

All annual plans are priced as 10 months paid, 2 months free.

---

## Live Stripe IDs

### Subscription products

| Product | Product ID | Monthly price ID | Annual price ID |
|---------|------------|------------------|-----------------|
| eevolvv Agent One | `prod_UToFYtrn3bwAAW` | `price_1TX6IR822jgZpeCahXFgOOxK` | `price_1TX6IR822jgZpeCaHncERDAy` |
| eevolvv Agent Three | `prod_UToIS9lH0vnkKY` | `price_1TX6IS822jgZpeCa91jUkgcT` | `price_1TX6IS822jgZpeCa41GYfbUt` |
| eevolvv Agent Five | `prod_UToK25ATIP0tLV` | `price_1TX6IT822jgZpeCaZtr79Mjy` | `price_1TX6IT822jgZpeCaSxyt6jXX` |

### Add-on products

| Add-on | Product ID | Price ID | Payment Link |
|--------|------------|----------|--------------|
| Report + Roadmap | `TODO` | `STRIPE_PRICE_REPORT_ROADMAP` | wired through `/api/stripe/checkout?product=report-roadmap` |
| Website Build | `prod_UW8axlKgLuFgRs` | `price_1TX6JV822jgZpeCaQUZshWhD` | https://buy.stripe.com/fZu4gtcX79sX1zma7f48000 |
| SCO Management | `prod_UW8aZtpQ2njtAw` | `price_1TX6JV822jgZpeCab0t3QLi0` | https://buy.stripe.com/00w7sF2it5cHem87Z748001 |
| Extra Automation — Starter | `prod_UW8ap9v0t3Jc8Z` | `price_1TX6JW822jgZpeCacPOgwFVv` | https://buy.stripe.com/aFaeV73mxdJda5Scfn48002 |
| Extra Automation — Advanced | `prod_UW8ap9v0t3Jc8Z` | `price_1TX6JW822jgZpeCagOhXMK9J` | https://buy.stripe.com/fZueV7e1b7kP5PC7Z748003 |
| Ads Campaign Setup | `prod_UW8aU0RHBA29Xc` | `price_1TX6JX822jgZpeCaV8quqgOh` | https://buy.stripe.com/8x2aER8GRbB591O0wF48004 |
| Custom Dashboard — Base | `prod_UW8a206O9Sj6fY` | `price_1TX6JX822jgZpeCasHQJYUnw` | https://buy.stripe.com/8x26oB5uF34z2Dqbbj48005 |
