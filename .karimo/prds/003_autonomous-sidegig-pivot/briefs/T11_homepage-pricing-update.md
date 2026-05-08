# Task Brief: Homepage Pricing Section Update

**ID:** T11
**PRD:** autonomous-sidegig-pivot
**Complexity:** 2/5
**Priority:** should
**Model:** sonnet
**Depends on:** T02, T10

---

## Objective

Update the existing `Pricing` function in `app/page.tsx` (lines 1000–1056) to reflect the new subscription model. Replace the existing 5-tier one-time pricing content with the Seed/Core/Evolve subscription tiers at annual pricing, with CTAs linking to `/pricing` for full detail. This is a copy/price update — the homepage is not the conversion point, just a teaser.

---

## Context

**Verify before starting:**
- `lib/stripe-prices.ts` exports `TIER_CONFIGS` (T02 complete)
- `/pricing` page exists (T10 complete)

**Existing pricing section (`app/page.tsx` lines 1000–1056):**
The `Pricing` function renders a 5-column grid using the `TIERS` constant array with one-time pricing. The `onCTA` prop triggers a scroll to the diagnostic section.

**IMPORTANT: `app/page.tsx` is a `'use client'` component** (line 1 of the file). This means:
- You can use React state (useState) for the toggle
- You can import from `lib/stripe-prices.ts` directly
- Do not convert it to a server component

**Design system:**
- Follow exactly the same inline style patterns already in `app/page.tsx`
- Section header: `<SectionHeader number="05" eyebrow="PRICING" title="..." note="..." />` (SectionHeader is defined inline in page.tsx around line 140)
- Grid: same border+cell pattern as existing pricing grid

**Minimal change philosophy:** This is a homepage teaser, not the full pricing page. Keep it concise:
- Show 3 tiers with annual prices (default display)
- Minimal monthly toggle (optional — can be a simple label)
- CTA per tier goes to `/pricing` (not directly to checkout)
- Keep the section copy feeling consistent with the rest of the homepage voice

---

## Implementation

### Files to Modify

- `app/page.tsx` — Update the `Pricing` function (lines 1000–1056) and the `TIERS` data that feeds it

### Files to Create

None.

### Step-by-Step

1. Open `app/page.tsx`. Find the `TIERS` constant array (near the top of the file or near the `Pricing` function). Note how it's structured.

2. Remove the old `TIERS` constant (or leave it for other sections if used elsewhere — search for all usages first).

3. Replace the `Pricing` function with this updated version:

```tsx
function Pricing({ onCTA }: { onCTA: (tier: string) => void }) {
  const [showMonthly, setShowMonthly] = useState(false)

  const tiers = [
    {
      id: 'seed',
      code: 'T-01',
      name: 'Seed',
      label: 'Foundation',
      who: 'Solopreneur or small local business',
      price: showMonthly ? '$99' : '$950',
      period: showMonthly ? '/month' : '/year',
      saving: showMonthly ? null : 'Save $238 vs monthly',
      tagline: showMonthly ? 'No commitment required' : '2 months free — billed annually',
      highlight: false,
      features: [
        'Landing page + 1 automation workflow',
        '72-hour build SLA',
        'Hosting + uptime monitoring',
        '1 content update / month',
      ],
    },
    {
      id: 'core',
      code: 'T-02',
      name: 'Core',
      label: 'AI-Powered',
      who: 'Growing business ready for automation',
      price: showMonthly ? '$499' : '$4,790',
      period: showMonthly ? '/month' : '/year',
      saving: showMonthly ? null : 'Save $1,198 vs monthly',
      tagline: showMonthly ? 'No commitment required' : '2 months free — billed annually',
      highlight: true,
      features: [
        'Web app + 3–5 AI agents',
        '7–10 day build SLA',
        'CRM + integration connections',
        '2 agent updates / month',
        'Monthly performance report',
      ],
    },
    {
      id: 'evolve',
      code: 'T-03',
      name: 'Evolve',
      label: 'Full-Stack',
      who: 'Established business, complex operations',
      price: showMonthly ? '$1,999' : '$19,190',
      period: showMonthly ? '/month' : '/year',
      saving: showMonthly ? null : 'Save $4,798 vs monthly',
      tagline: showMonthly ? 'No commitment required' : '2 months free — billed annually',
      highlight: false,
      features: [
        'Full-stack build + CRM/ERP',
        '14–21 day build SLA',
        'Custom dashboards + pipelines',
        'Full managed service',
        'Quarterly re-calibration',
      ],
    },
  ]

  return (
    <section id="pricing" className="anchor-scroll" style={{ padding: '120px 0', borderBottom: '1px solid var(--rule)', background: 'rgba(20,20,19,0.02)' }}>
      <div className="mx-auto site-rail">
        <SectionHeader number="05" eyebrow="PRICING" title="A service, not software." note="THREE TIERS" />
        <p style={{ fontSize: 16, lineHeight: 1.55, opacity: 0.7, maxWidth: 580, marginTop: 24 }}>
          We build it, host it, maintain it, and evolve it — every month. Choose your starting point.
        </p>

        {/* Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 32, marginBottom: 40 }}>
          <button
            onClick={() => setShowMonthly(false)}
            className="mono"
            style={{
              padding: '6px 14px', fontSize: 10, letterSpacing: '0.16em', fontWeight: 600,
              background: !showMonthly ? 'var(--ink)' : 'transparent',
              color: !showMonthly ? 'var(--paper)' : 'var(--ink)',
              border: '1px solid var(--ink)', cursor: 'pointer',
            }}
          >
            ANNUAL
          </button>
          <button
            onClick={() => setShowMonthly(true)}
            className="mono"
            style={{
              padding: '6px 14px', fontSize: 10, letterSpacing: '0.16em', fontWeight: 600,
              background: showMonthly ? 'var(--ink)' : 'transparent',
              color: showMonthly ? 'var(--paper)' : 'var(--ink)',
              border: '1px solid var(--ink)', cursor: 'pointer',
            }}
          >
            MONTHLY
          </button>
          {!showMonthly && (
            <span className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em' }}>2 MONTHS FREE</span>
          )}
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: 0, border: '1px solid var(--ink)' }}>
          {tiers.map((tier, i) => (
            <div key={tier.id} style={{
              padding: 28, borderRight: i < tiers.length - 1 ? '1px solid var(--ink)' : 'none',
              background: tier.highlight ? 'var(--ink)' : 'transparent',
              color: tier.highlight ? 'var(--paper)' : 'var(--ink)',
              position: 'relative', display: 'flex', flexDirection: 'column',
            }}>
              {tier.highlight && (
                <div className="mono" style={{ position: 'absolute', top: -12, left: 24, background: 'var(--accent)', color: 'var(--paper)', padding: '4px 10px', fontSize: 9, letterSpacing: '0.22em', fontWeight: 600 }}>MOST POPULAR</div>
              )}
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.55, marginBottom: 12 }}>{tier.code}</div>
              <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>{tier.name}</div>
              <div className="serif" style={{ fontStyle: 'italic', fontSize: 15, color: 'var(--accent)', marginBottom: 6 }}>{tier.label}</div>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 20 }}>{tier.who}</div>
              <div style={{ borderTop: '1px solid', borderColor: tier.highlight ? 'rgba(244,241,234,0.18)' : 'var(--rule)', paddingTop: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.015em' }}>{tier.price}</div>
                <div style={{ fontSize: 11, opacity: 0.55, marginTop: 4 }}>{tier.period}</div>
                {tier.saving && (
                  <div className="mono" style={{ fontSize: 9, color: 'var(--accent)', marginTop: 6, letterSpacing: '0.1em' }}>{tier.saving.toUpperCase()}</div>
                )}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1, marginBottom: 20 }}>
                {tier.features.map((f, j) => (
                  <li key={j} style={{ display: 'grid', gridTemplateColumns: '16px 1fr', gap: 8, padding: '6px 0', fontSize: 13, lineHeight: 1.5, opacity: 0.85 }}>
                    <span style={{ color: 'var(--accent)' }}>→</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/pricing"
                className="mono"
                style={{
                  display: 'block', textAlign: 'center', width: '100%', padding: '14px 0',
                  background: tier.highlight ? 'var(--accent)' : 'transparent',
                  color: tier.highlight ? 'var(--paper)' : 'var(--ink)',
                  border: tier.highlight ? 'none' : '1px solid var(--ink)',
                  fontSize: 11, letterSpacing: '0.18em', fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                START WITH {tier.name.toUpperCase()} →
              </a>
            </div>
          ))}
        </div>

        {/* Retainer band — keep for Evolve context */}
        <div style={{ marginTop: 24, border: '1px solid rgba(20,20,19,0.14)', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ fontSize: 14, opacity: 0.6, lineHeight: 1.5 }}>
            Not sure which tier fits?{' '}
            <button onClick={() => onCTA('seed')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 14, textDecoration: 'underline', padding: 0 }}>
              Run the free diagnostic first →
            </button>
          </div>
          <a href="/pricing" className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--ink)', opacity: 0.55, textDecoration: 'underline', whiteSpace: 'nowrap' }}>
            FULL PRICING DETAILS
          </a>
        </div>
      </div>
    </section>
  )
}
```

4. Search for any remaining references to the old `TIERS` array that might have been removed. If `TIERS` is used elsewhere in `page.tsx`, keep it and give the new array a different name.

5. Run `npm run build` to confirm no TypeScript errors.

---

## Code Patterns to Follow

```tsx
// Existing inline style pattern from app/page.tsx Pricing function
style={{ padding: '120px 0', borderBottom: '1px solid var(--rule)' }}

// SectionHeader already defined in page.tsx — use directly
<SectionHeader number="05" eyebrow="PRICING" title="..." note="..." />

// useState for toggle (already imported at top of page.tsx)
const [showMonthly, setShowMonthly] = useState(false)
```

---

## Environment Variables

None needed.

---

## Acceptance Criteria

- [ ] Homepage `#pricing` section shows 3 tiers: Seed, Core, Evolve
- [ ] Annual pricing shown by default; monthly toggle available
- [ ] Annual prices: Seed $950/yr, Core $4,790/yr, Evolve $19,190/yr
- [ ] Monthly prices: Seed $99/mo, Core $499/mo, Evolve $1,999/mo
- [ ] Each tier CTA links to `/pricing` (not directly to checkout)
- [ ] Copy reflects managed service positioning ("we build, host, maintain")
- [ ] Old 5-tier one-time pricing data removed
- [ ] No TypeScript errors
- [ ] `npm run build` passes
- [ ] Page section still renders at `#pricing` anchor

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| Updated homepage pricing section | None — end consumer |

---

## Do Not

- Do not modify ChatEngine, the hero section, or any section other than `Pricing`
- Do not convert `app/page.tsx` to a server component — it's `'use client'` and must stay that way
- Do not remove the `onCTA` prop from the `Pricing` function — it's passed from the parent
- Do not hardcode price strings in a way that's hard to update — use the local `tiers` array defined inside the function
- Do not add checkout functionality to the homepage — CTAs go to `/pricing` only
- Do not touch `.env*`, `package.json`, `next.config.js`, or `middleware.ts`
