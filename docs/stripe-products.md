# Stripe Products Setup Guide

**PRD:** autonomous-sidegig-pivot  
**Task:** T02 — Stripe Billing Setup  
**Status:** MANUAL STEP REQUIRED by E before Wave 2 runtime tests

---

## Overview

This document guides E through creating 6 Stripe products in the Stripe dashboard. After creation, price IDs must be populated in `.env.local` and the Vercel project environment variables.

**BLOCKING GATE:** Wave 2 tasks (T03, T04, T07, T10) cannot run end-to-end without these price IDs populated.

---

## Step 1: Create Products in Stripe Dashboard

Go to: https://dashboard.stripe.com/products

### Product 1: eevolvv Seed (Monthly)

| Field | Value |
|-------|-------|
| Product name | `eevolvv Seed` |
| Price | $99.00 USD |
| Billing period | Monthly |
| Lookup key | `seed_monthly` |

### Product 2: eevolvv Seed (Annual)

Add a second price to the same `eevolvv Seed` product:

| Field | Value |
|-------|-------|
| Price | $950.00 USD |
| Billing period | Yearly |
| Lookup key | `seed_annual` |

_Annual = 10 × $99 = $990 − $40 savings (approximately 2 months free at $238 off)_

### Product 3: eevolvv Core (Monthly)

| Field | Value |
|-------|-------|
| Product name | `eevolvv Core` |
| Price | $499.00 USD |
| Billing period | Monthly |
| Lookup key | `core_monthly` |

### Product 4: eevolvv Core (Annual)

Add a second price to the same `eevolvv Core` product:

| Field | Value |
|-------|-------|
| Price | $4,790.00 USD |
| Billing period | Yearly |
| Lookup key | `core_annual` |

_Annual = 10 × $499 = $4,990 − $200 savings (2 months free, $1,198 off)_

### Product 5: eevolvv Evolve (Monthly)

| Field | Value |
|-------|-------|
| Product name | `eevolvv Evolve` |
| Price | $1,999.00 USD |
| Billing period | Monthly |
| Lookup key | `evolve_monthly` |

### Product 6: eevolvv Evolve (Annual)

Add a second price to the same `eevolvv Evolve` product:

| Field | Value |
|-------|-------|
| Price | $19,190.00 USD |
| Billing period | Yearly |
| Lookup key | `evolve_annual` |

_Annual = 10 × $1,999 = $19,990 − $800 savings (2 months free, $4,798 off)_

---

## Step 2: Copy Price IDs

After creating each price, copy the `price_XXXX` ID from the Stripe dashboard into the table below:

| Variable | Stripe Price ID |
|----------|-----------------|
| `STRIPE_PRICE_SEED_MONTHLY` | `price_` ← fill in |
| `STRIPE_PRICE_SEED_ANNUAL` | `price_` ← fill in |
| `STRIPE_PRICE_CORE_MONTHLY` | `price_` ← fill in |
| `STRIPE_PRICE_CORE_ANNUAL` | `price_` ← fill in |
| `STRIPE_PRICE_EVOLVE_MONTHLY` | `price_` ← fill in |
| `STRIPE_PRICE_EVOLVE_ANNUAL` | `price_` ← fill in |

---

## Step 3: Populate Environment Variables

### Local development (`.env.local`):

```
STRIPE_PRICE_SEED_MONTHLY=price_XXXX
STRIPE_PRICE_SEED_ANNUAL=price_XXXX
STRIPE_PRICE_CORE_MONTHLY=price_XXXX
STRIPE_PRICE_CORE_ANNUAL=price_XXXX
STRIPE_PRICE_EVOLVE_MONTHLY=price_XXXX
STRIPE_PRICE_EVOLVE_ANNUAL=price_XXXX
```

### Vercel dashboard:

Go to: https://vercel.com/ebarbosa-asg/eevolvv/settings/environment-variables

Add the same 6 variables above for the Production environment.

---

## Step 4: Webhook Configuration (for T04)

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. Endpoint URL: `https://eevolvv.com/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. After saving, copy the **Signing secret** (`whsec_...`) into:
   - `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_...`
   - Vercel: same variable

---

## Pricing Summary

| Tier | Monthly | Annual | Savings |
|------|---------|--------|---------|
| Seed | $99/mo | $950/yr | $238 off (2 months free) |
| Core | $499/mo | $4,790/yr | $1,198 off (2 months free) |
| Evolve | $1,999/mo | $19,190/yr | $4,798 off (2 months free) |

All annual prices = monthly × 10 (2 months free).

---

## Lookup Key Reference

These lookup keys are used by the checkout API (T03) to create Stripe Checkout Sessions:

| Lookup Key | Tier | Interval |
|-----------|------|----------|
| `seed_monthly` | Seed | Monthly |
| `seed_annual` | Seed | Annual |
| `core_monthly` | Core | Monthly |
| `core_annual` | Core | Annual |
| `evolve_monthly` | Evolve | Monthly |
| `evolve_annual` | Evolve | Annual |
