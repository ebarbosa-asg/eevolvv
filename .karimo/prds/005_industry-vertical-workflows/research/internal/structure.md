# Structure — Industry Vertical Codebase Organization

## How Industry Flows Are Currently Organized

### Routing
- 15 industry landing pages at `/app/{vertical}/page.tsx`
- Each is a self-contained Server Component with static data arrays + `ChatEngine` embed
- No shared industry layout, no shared industry data file

### Industry Data
- **Static marketing data** (ghost work items, stats, studio types, testimonials): hardcoded inside each `page.tsx`
- **Dynamic AI context** (prompts, benchmarks, terminology): centralized in `lib/diagnosticPrompts.ts`
- **No shared industry config file** — the two systems (marketing and AI) are disconnected

### Component Reuse
- `ChatEngine.tsx` is the only shared component in the industry flow
- Page CSS classes use `fitness-*` prefixes (e.g., `fitness-stats-bar`) across all industry pages — naming inconsistency
- The `VolvvECard` appears only on fitness page in the diagnostic CTA, not on dental or restaurant pages

### Naming Conventions for Industries
The `INDUSTRY_CONTEXT` keys in `diagnosticPrompts.ts` use verbose strings: `"Restaurant / Food & Beverage"`, `"Gym / Fitness / Wellness"`, `"Medical / Healthcare"`. The `getIndustryShortName` map provides aliases. No slug/ID system exists for industries.

### What "Built Correctly" Would Look Like Structurally

A vertically mature architecture would introduce:

```
lib/
  industries/
    dental.ts    ← industry config: key, chatQuestions, reportSections, integrations, benchmarks
    restaurant.ts
    fitness.ts
    index.ts     ← IndustryConfig type + registry

app/
  dental/
    page.tsx     ← imports from lib/industries/dental.ts
```

Currently, industry-specific data is split between `page.tsx` (marketing) and `diagnosticPrompts.ts` (AI), with no shared schema binding them.

## File Size and Complexity

| File | Lines | Notes |
|------|-------|-------|
| `lib/diagnosticPrompts.ts` | 273 | Clean, well-structured; easy to extend |
| `components/ChatEngine.tsx` | 749 | Monolithic; handles 4 phases in one file |
| `app/dental/page.tsx` | 407 | Pure static marketing; no logic |
| `app/api/chat/route.ts` | 72 | Simple; industry override is 2 lines |
| `app/api/diagnostic/route.ts` | ~300 | Handles rate limiting, Claude, Supabase, Resend, PostHog |
| `app/api/extract-intake/route.ts` | 91 | Thin extraction layer |

## What the Build Pattern Looks Like

A new vertical currently requires:
1. Create `/app/{vertical}/page.tsx` — copy from an existing page, change the static data arrays
2. Set `defaultIndustry` in the `ChatEngine` embed to the exact key from `INDUSTRY_CONTEXT`
3. Done — the existing pipeline handles the rest

The minimum viable new vertical is about 400 lines of static TSX + one string in ChatEngine props.

**What's missing for a "built correctly" vertical:**
1. Correct `defaultIndustry` key (dental page has wrong key right now)
2. Industry-specific intake questions in the chat prompt
3. Industry-specific report sections in `BASE_PROMPT`
4. Industry-specific report rendering in the UI
5. Industry-specific follow-up email copy
6. Industry-specific onboarding questions
7. Real integrations with the vertical's native tools
