# eevolvv 2.0 acceptance

Public brand is **eevolvv** only. Legal entity in the footer and legal pages is **eevolvv, Inc.**

## Routes

- `/`
- `/packages/clip-and-ship`
- `/packages/clip-and-dominate`
- `/niches/podcasts`
- `/niches/saas`
- `/niches/coaches`
- `/case-studies`
- `/blog` and three draft posts
- `/about`
- `/sample`
- `/legal/privacy`
- `/legal/terms`

Old “AI Operations Team” marketing URLs redirect to this site. `/os`, `/api`, client dashboards, and sign-in stay so production operations do not break when the preview is merged.

## Checks

- Prices only: Clip & Ship $1,497/mo and Clip & Dominate $3,497/mo.
- No testimonials, client logos, or invented view counts.
- `prefers-reduced-motion: reduce` hides the matrix canvas and skips motion.
- Desktop WebGL2 (not narrow, not save-data, not low-core) swaps the hero SVG for a lazy React Three Fiber lever after the first pointer move. The lever tips as the page scrolls, with shader rain and bloom. Mobile, reduced-motion, and the first paint keep the SVG so lab CWV stays on the static hero.
- Booking: `NEXT_PUBLIC_CAL_URL` (falls back to `NEXT_PUBLIC_CALENDLY_URL` if set).
- Payments: `NEXT_PUBLIC_STRIPE_LINK_SHIP` and `NEXT_PUBLIC_STRIPE_LINK_DOMINATE`.
- Contact override: `NEXT_PUBLIC_CONTACT_EMAIL` (defaults to hello@eevolvv.com).
- Analytics: existing PostHog token if set; optional Plausible via `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
- Canonical host: `NEXT_PUBLIC_SITE_URL` (defaults to https://eevolvv.com).

## Honest-copy grep

```bash
rg -n -i "archimedes|clipops|lorem ipsum|testimonial" app components/site lib/packages.ts lib/niches.ts lib/seo.ts content/blog
```
