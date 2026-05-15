/**
 * Client-side analytics wrapper around PostHog.
 *
 * Use for all marketing CTA and growth instrumentation. Server-side captures
 * still go through `lib/posthog-server.ts`.
 *
 * Events follow a predictable schema:
 *   - `cta_clicked` — every primary/secondary CTA across marketing surfaces
 *   - `pricing_tier_clicked` — pricing tier select
 *   - `growth_page_viewed` — landing page impressions (paid + SEO)
 *   - `partner_*` — partner funnel events
 *
 * Properties always include `location` and `label` so PostHog can group across
 * surfaces without funnel reconfiguration.
 */
import posthog from 'posthog-js'

export type CTALocation =
  | 'header'
  | 'hero'
  | 'pricing_tier'
  | 'pricing_unsure'
  | 'pricing_full_details'
  | 'process'
  | 'growth_hero_primary'
  | 'growth_hero_secondary'
  | 'growth_final_cta'
  | 'partners_hero_primary'
  | 'partners_hero_secondary'
  | 'partners_intake_submit'
  | 'footer'

export type CTATarget =
  | 'diagnostic'
  | 'pricing'
  | 'partners'
  | 'partners_intake'
  | 'tier_checkout'
  | 'external'

interface BaseProps {
  [key: string]: unknown
}

function isClient() {
  return typeof window !== 'undefined'
}

export function track(event: string, props: BaseProps = {}) {
  if (!isClient()) return
  try {
    posthog.capture(event, props)
  } catch (err) {
    // Never break UX if analytics fails
    if (process.env.NODE_ENV === 'development') {
      console.warn('[analytics] capture failed:', err)
    }
  }
}

export function trackCTA(opts: {
  location: CTALocation
  label: string
  target: CTATarget
  tier?: string
  page?: string
  extra?: BaseProps
}) {
  track('cta_clicked', {
    location: opts.location,
    label: opts.label,
    target: opts.target,
    tier: opts.tier,
    page: opts.page,
    ...opts.extra,
  })
}

export function trackPricingTier(tier: string, action: 'start' | 'unsure') {
  track('pricing_tier_clicked', { tier, action })
}

export function trackGrowthPageView(slug: string) {
  track('growth_page_viewed', { slug })
}

export function trackPartnerEvent(
  event:
    | 'partner_page_viewed'
    | 'partner_intake_started'
    | 'partner_intake_submitted'
    | 'partner_intake_failed',
  props: BaseProps = {}
) {
  track(event, props)
}
