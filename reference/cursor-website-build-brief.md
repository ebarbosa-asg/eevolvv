# Cursor Build Brief — eevolvv.com (eevolvv 2.0)

**Self-contained brief for a Cursor cloud agent working in the existing repo `ebarbosa-asg/eevolvv` (already connected to Vercel; production = eevolvv.com). Build eevolvv 2.0 on a new branch that fully replaces the old site; merging the PR is the go-live step.**  
**Owner:** Eduardo Barbosa  
**Date:** 2026-09-24  

---

## 0. Goals

Build a **visual-first** marketing site that replaces the current eevolvv.com Vercel site (“AI Operations Team for Growing Businesses”) with **eevolvv 2.0**: a short-form clipping / distribution agency offer.

| Must | Must not |
| --- | --- |
| Feel premium, dark, matrix + lever | Fake testimonials, logos, view counts, or client names |
| **Heavy diagrams/pictures; minimal text walls** (≥70% visual surface per section) | Essay sections or feature paragraphs without art |
| Two clear packages with published prices | Opaque “contact for pricing” only |
| SSG, SEO niche pages, WCAG 2.2 AA, strong CWV | Ignore `prefers-reduced-motion` |
| Reuse copy/structure from the draft static site | Invent new package names or prices |

**Public brand:** **eevolvv** (spoken/written as eevolvv; “eevolvv 2.0” ok in hero eyebrow).  
**Brand rule:** eevolvv is the ONLY brand. Never mention “Archimedes Media and Marketing”, “Archimedes Media”, or ClipOps anywhere in UI, metadata, schema, or legal pages. The draft site uses those old names; rebrand every string to eevolvv. The lever quote (“Give me a lever and a place to stand, and I’ll move the world”) may be used as an unattributed theme line.  
**Canonical domain:** `https://eevolvv.com`  
**Theme:** Matrix (tasteful) + the lever (“your content = place to stand; our automation = the lever”).  
**Packages (keep names):** **Clip & Ship** ($1,497/mo) · **Clip & Dominate** ($3,497/mo).

### Reference assets (copy into repo)

| Asset | Path (on research machine) | Use |
| --- | --- | --- |
| Draft HTML site | `draft-site.zip` (uploaded) | **Source of truth for copy, FAQ, package details, niche pages** — redesign visually, don’t rewrite claims |
| Pitch diagrams/icons | `pitch-diagram/icons/*.png`, `pitch-diagram/slides/*.png` | Style reference / temporary art until SVG/Rive |
| Research | `web-research/premium-site-research.md` | Design rationale |
| Ref screenshots | `web-research/refs/*.png` | Moodboard |

Place under `/reference/` in the repo and read before coding. Attached uploads: draft-site.zip, the pitch diagram PNGs, premium-site-research.md, and ref screenshots.

---

## 1. Stack (locked)

```
Next.js 15 (App Router) + TypeScript
Tailwind CSS + CSS variables (design tokens)
shadcn/ui (customized dark)
Motion (motion/react) — UI micro-interactions
GSAP + ScrollTrigger — one signature scroll scene (pipeline or lever)
Optional: Lenis — only if reduced-motion respected and synced to GSAP ticker
Rive (@rive-app/react-canvas) — lever + pills interactions
MDX — blog stubs
next/og — dynamic OG images
Vercel hosting
Cal.com embed — booking (TODO URL)
Stripe Payment Links — optional checkout (TODO)
Plausible OR PostHog — pick one analytics (TODO keys)
```

**Do not** use Webflow/Framer as the production codebase. **Do not** ship Spline in the critical LCP path (optional lazy island only).

### Domain swap (Eduardo / deploy step)

1. The repo is already connected to Vercel, so the PR gets a preview URL automatically.  
2. Eduardo reviews the preview; merging to `main` swaps eevolvv.com to eevolvv 2.0 (no domain move needed).  
3. Remove all old “AI Operations Team…” pages/content in this branch so only eevolvv 2.0 serves.  
4. Set env: `NEXT_PUBLIC_SITE_URL=https://eevolvv.com`.

---

## 2. Design tokens

```ts
// styles/tokens.css or tailwind theme
--bg: #0A0C0B;
--surface: #121614;
--card: #161B18;
--border: #243028;
--text: #E8F0EA;
--muted: #A3B5A9;
--accent: #3DFF8A;
--accent-dim: #1A9F52;
--warning: #FFD166;
--font-sans: "Geist Sans", "IBM Plex Sans", system-ui, sans-serif;
--font-mono: "Geist Mono", "IBM Plex Mono", ui-monospace, monospace;
```

**Motion:** transform/opacity only; matrix rain opacity 4–12%; pause off-screen; `prefers-reduced-motion: reduce` → static SVG posters, no Lenis/scramble/autoplay.

**Visual rule:** Each section = large art + eyebrow + short H2 + ≤2 lines + CTA. No walls of text.

---

## 3. Repo file structure

```
/
  /reference/                 # unzipped draft site + pitch icons + research md
  /public/
    /brand/                   # logo marks, favicons
    /illustrations/           # optimized SVG
    /rive/                    # .riv files
    /posters/                 # static fallbacks
    /samples/                 # placeholder vertical posters (no fake clients)
  /src
    /app
      layout.tsx              # shell, fonts, JSON-LD org
      page.tsx                # home
      robots.ts
      sitemap.ts
      opengraph-image.tsx     # default OG
      /packages/clip-and-ship/page.tsx
      /packages/clip-and-dominate/page.tsx
      /niches/podcasts/page.tsx
      /niches/saas/page.tsx
      /niches/coaches/page.tsx
      /case-studies/page.tsx
      /blog/page.tsx
      /blog/[slug]/page.tsx
      /about/page.tsx
      /legal/privacy/page.tsx
      /legal/terms/page.tsx
      /sample/page.tsx        # free sample lead magnet
    /components/...
    /content/blog/*.mdx
    /lib/seo.ts
    /lib/packages.ts          # single source of package facts
  /docs/ACCEPTANCE.md
```

---

## 4. SEO / schema / meta

| Field | Value |
| --- | --- |
| Site name | **eevolvv** |
| Default title pattern | `{Page} · eevolvv` |
| Organization `@type` | Organization |
| Organization `name` | **eevolvv** |
| Organization `url` | https://eevolvv.com |
| Brand | `{ "@type": "Brand", "name": "eevolvv" }` |
| `alternateName` | eevolvv 2.0 |

**JSON-LD graph on layout/home:** Organization + WebSite + Service offers (Clip & Ship 1497 USD, Clip & Dominate 3497 USD).  
**FAQPage** on home + niche pages (copy from draft).  
**Canonical:** `https://eevolvv.com{path}`  
**robots:** allow all when live (draft had noindex — **remove** for production).  
**sitemap:** all routes below.

---

## 5. Page list — every section visual-led

Copy package facts, FAQs, and niche angles from `/reference/draft-site/`. Replace every ClipOps / Archimedes string with **eevolvv**.

### 5.1 Home `/`

| Section | Visual (primary) | Text budget |
| --- | --- | --- |
| Nav | Logo wordmark “eevolvv” + accent mark | Links + Book CTA |
| Hero | **LeverHero** Rive/SVG full viewport left/right; optional faint MatrixCanvas behind | Eyebrow “eevolvv 2.0”; H1 from draft (“clipping team for creators…”); quote + 1-line lever interpretation; 2 CTAs |
| Lever triad | 3 illustrated cards (Place to stand / Lever / World) — icons from pitch | Title + 1 line each |
| Pipeline | **PipelineDiagram** animated SVG nodes | “Five steps” title only; labels on nodes |
| Packages | Side-by-side **PackageCardVisual** + mini mock phones | Prices + 5 bullets max each (icons) |
| Pill chooser | **PillChooser** red/blue geometric | “Pick your lever length” |
| Niches | 3 art tiles linking niches | 1 line each |
| Clip wall | **PhoneWall** 3–6 devices | “Sample output” + honest empty state if no videos |
| FAQ | Accordion; optional small diagram per answer | Draft FAQ copy |
| Book | Cal.com embed or CTA card | Short |
| Footer | eevolvv wordmark | Links + TODO contact |

### 5.2 Packages

**`/packages/clip-and-ship`** — Visual comparison strip + illustrated inclusions checklist (icons, not paragraphs). Facts from draft Standard.  
**`/packages/clip-and-dominate`** — Same + network-boost diagram + soft-guarantee callout as visual badge (“extra week of work ≠ refund”).

### 5.3 Niches

**`/niches/podcasts`** | **`/saas`** | **`/coaches`**  
Each: NicheHeroArt + 1 diagram (e.g. episode→clips) + package recommendation card + FAQ. SEO titles adapted from draft (`Podcast clipping…`, `SaaS clipping…`, etc.) with `· eevolvv`.

### 5.4 Case studies `/case-studies`

**Only** dashed **Coming soon / TODO** frames (as draft). No fake logos.

### 5.5 Blog `/blog` + MDX stubs

Illustrated header per post; body can be outline until Eduardo fills sources (3 stubs from draft). Visual lead image required.

### 5.6 About `/about`

eevolvv story told as the lever diagram; no fake bios.

### 5.7 Sample `/sample`

Big drop-zone UI art + form (episode URL) → thank-you → Cal.com. Lead magnet.

### 5.8 Legal

Privacy + Terms — text-ok; still dark theme, short pages.

---

## 6. Component specs (animation)

### `MatrixCanvas`

- WebGL or canvas 2D rain; opacity ~0.08; FPS cap 30; `visibility` pause; destroy on unmount.  
- Refs: [Rezmason/matrix](https://github.com/Rezmason/matrix), [MatrixCode](https://github.com/JamesBedford/MatrixCode).  
- Reduced motion: CSS grid background only (as draft `.bg-matrix`).

### `LeverHero`

- Rive state machine: idle → hover lift → click pulse.  
- Fallback: SVG from redraw of `pitch-diagram/icons/lever.png`.  
- `aria-label` explaining metaphor.  
- Lazy: load Rive after LCP / when in view.

### `PipelineDiagram`

- 5 nodes; stroke draw on enter (Motion or GSAP).  
- Mobile: vertical stack.  
- GSAP pin **desktop only**, once.

### `PillChooser`

- Two large pills (Ship / Dominate); keyboard focus; links to package routes.  
- Art ref: `pitch-diagram/icons/pills.png`.

### `PhoneWall` / `SampleClipWall`

- Device chrome SVG; interior `<video>` or poster.  
- No autoplay if reduced-motion; IntersectionObserver play/pause.

### `FunnelGraphic`

- SVG funnel; optional particle scrub once.

### `TerminalStrip`

- One-shot typewriter mono line; decorative `aria-hidden` if redundant.

### `PackageCardVisual`

- Price mono; feature rows with Lucide/custom icons; Dominate = accent border + “Most leverage”.

### `StickyBookCTA`

- Mobile sticky after 40% scroll; opens `#book` or Cal.com.

### `SiteFooter`

```
eevolvv
```

---

## 7. Package data (`lib/packages.ts`)

```ts
export const packages = {
  ship: {
    name: "Clip & Ship",
    price: 1497,
    clips: 24,
    platforms: ["YouTube Shorts", "TikTok", "Instagram Reels"],
    sourceHours: 4,
    report: "Monthly Loom + spreadsheet",
    // ...bullets from draft standard.html
  },
  dominate: {
    name: "Clip & Dominate",
    price: 3497,
    clips: 48,
    platforms: ["YouTube Shorts", "TikTok", "Instagram Reels", "LinkedIn"],
    sourceHours: 8,
    networkBoostUsd: 500,
    softGuarantee:
      "If fewer than 8 clips/month clear 10k views on at least one platform, we extend production by 1 week at no charge (extra work, not a fee refund).",
  },
} as const;
```

---

## 8. Performance / a11y / SEO acceptance

| Check | Target |
| --- | --- |
| LCP | ≤ 2.5s (field p75) — [web.dev/vitals](https://web.dev/articles/vitals) |
| INP | ≤ 200ms |
| CLS | ≤ 0.1 |
| axe | **0 serious / critical** on all marketing routes |
| Lighthouse a11y | ≥ 95 |
| Lighthouse SEO | ≥ 95 |
| Lighthouse perf | ≥ 90 desktop / ≥ 85 mobile (stretch; CWV wins disputes) |
| Reduced motion | No rain, no pin-scrub, no autoplay, no scramble |
| Honest content | CI grep fail on lorem client names if needed |

---

## 9. Phased PR tickets

**Priority: ship v1 (PR1–PR6) ASAP as a deployable preview; PR7 3D comes right after.**

### PR1 — Foundation
- Next.js app, tokens, fonts, shell, footer brand lines, `/reference` copied.  
- Home static layout with **placeholder** SVG lever (pitch PNG ok).  
- `packages.ts` + pricing section.  
- robots/sitemap/canonical `eevolvv.com`.  
- **Accept:** builds; no axe serious on home.

### PR2 — Visual system
- SVG illustration set v1 (pipeline, funnel, phones, pills, icons).  
- MatrixCanvas behind hero.  
- PhoneWall empty state.  
- **Accept:** home is visually dense; LCP poster defined.

### PR3 — Motion islands
- Rive LeverHero + PillChooser.  
- Pipeline draw-on-scroll; optional GSAP pin desktop.  
- Reduced-motion paths tested.  
- **Accept:** toggle OS reduced-motion; no crashes.

### PR4 — Packages + niches + sample
- Package pages, 3 niches (MDX/TS content from draft), sample form UI.  
- FAQ schema.  
- **Accept:** SEO titles unique; internal links work.

### PR5 — Blog + case studies + about + legal
- MDX stubs; case study placeholders; about company blurb.  
- Dynamic OG.  
- **Accept:** OG cards render.

### PR6 — Integrations + cutover
- Cal.com embed (env).  
- Stripe Payment Links buttons (env).  
- Analytics.  
- Confirm production build on `main` will serve eevolvv 2.0 at eevolvv.com.  
- Remove noindex; Verify Search Console later (Eduardo).  
- **Accept:** production URL serves eevolvv 2.0 only.

### PR7 — Crazy-style 3D upgrade (after v1 is live)
Ship v1 (PR1–PR6) first; 3D must never block launch. Build these as lazy-loaded islands behind a capability check (WebGL2 + not low-power + no reduced-motion), loaded after LCP, with static poster / Rive / SVG fallbacks on mobile and slow devices.
- **3D LeverHero:** React Three Fiber + drei. A glowing matrix-green lever on a fulcrum that tips on scroll (GSAP ScrollTrigger or drei ScrollControls) and lifts a globe / wall of phones. Low-poly glTF with Draco or meshopt compression, target under ~500 KB total for the hero scene.
- **3D PhoneWall:** grid of phone meshes in depth with muted looping vertical clips as video textures (posters until real samples exist); subtle cursor parallax.
- **Depth code rain:** shader-based matrix rain with 2–3 depth layers behind hero content (opacity capped, 30fps, paused off-screen).
- **Postprocessing:** @react-three/postprocessing bloom + light chromatic aberration; brief glitch transition between major sections (disabled under reduced motion).
- **Cursor-reactive particles** in the audience-capture funnel (viewer → follower → subscriber → customer).
- **Asset pipeline:** model in Blender or Spline, export glTF, compress (gltf-transform), texture budget ≤1024px, KTX2 where possible.
- **Accept:** CWV targets in §8 still pass on mobile (3D islands not loaded there by default); reduced-motion shows only static art; no WebGL errors in console; Lighthouse perf ≥ 85 mobile.

---

## 10. Eduardo TODOs (blockers for launch)

| Item | Notes |
| --- | --- |
| **Go live** | Review Vercel preview, merge PR to `main` |
| **Cal.com** (or Calendly) link | Replace Book CTA / embed |
| **Contact email** | Footer, privacy, sample form |
| **Stripe** | Payment Links or Checkout price IDs for $1497 / $3497 |
| **Analytics** | Plausible domain OR PostHog key |
| **Sample clip assets** | Real vertical MP4s or keep illustrated posters |
| **Case studies** | Real metrics + permission — until then placeholders only |
| **Legal review** | Privacy/terms for service business |
| **Logo lockup** | Final eevolvv wordmark (mono + accent) |
| **Illustration pass** | Designer/Rive finals if agent ships placeholders |

---

## 11. Content honesty rules

- Never fabricate clients, logos, “18B views,” or testimonials.  
- Soft view goal language exactly as draft (extra work ≠ refund).  
- Competitor claims only if citing public pages in blog drafts.  
- Old eevolvv “AI Operations Team” messaging is **retired** — do not mix.

---

## 12. Quick agent checklist

1. Unzip `draft-site.zip` → `/reference/draft-site`.  
2. Copy `pitch-diagram/icons` → `/reference/pitch-icons`.  
3. Scaffold Next.js; implement tokens + shell with **eevolvv** branding.  
4. Port copy from draft; rebrand every string to eevolvv (no Archimedes anywhere).  
5. Build visual sections before polishing prose.  
6. Wire Cal/Stripe as env-driven stubs.  
7. Run axe + Lighthouse; fix serious issues.  
8. Open the PR; Vercel preview URL → Eduardo reviews and merges to go live.

---

*End of brief. Companion research: `premium-site-research.md`.*
