# Premium Visual-First Website Research — Archimedes Media and Marketing

**Date:** September 24, 2026 (America/Chicago)  
**Goal:** Inform a Cursor-built production site that is **heavy on diagrams, pictures, and drawings**, light on text walls, with a tasteful matrix + Archimedes-lever theme.  
**Draft reference:** `/workspace/youtube-automation/archimedes-media-site/` (+ zip).  
**Pitch art to reuse:** `/workspace/youtube-automation/pitch-diagram/` (lever, funnel, pills, phone_clip, platforms, flywheel icons; slide PNGs).

---

## Brand & domain (locked)

| Layer | Value |
| --- | --- |
| **Public brand / site name** | **eevolvv** (eevolvv 2.0) |
| **Legal / company** | **Archimedes Media and Marketing** (“by Archimedes Media and Marketing” in footer, About, legal) |
| **Canonical domain** | **https://eevolvv.com** (Eduardo owns; currently live on Vercel with an old “AI Operations Team for Growing Businesses” page — **replace**, do not run in parallel forever) |
| **Hosting** | **Vercel** — new Next.js project; point existing `eevolvv.com` domain at the new project |
| **Theme** | Archimedes lever + matrix (unchanged) |
| **Packages** | Clip & Ship · Clip & Dominate (unchanged) |


## 1. Design inspiration (2025–2026)

Aesthetic camp for Archimedes: **techno-futurist** (dark + one neon accent + motion + product/diagram demos)—same camp as Linear / Vercel / Raycast / Cursor—not the warm editorial camp (Notion / Anthropic). Discipline = **one accent + restraint**, not maximal neon chaos. ([Toimi 2026 SaaS designs](https://toimi.pro/blog/best-saas-website-designs/))

| # | Site | URL | What feels premium | Steal for Archimedes |
| --- | --- | --- | --- | --- |
| 1 | **Linear** | https://linear.app/ | Dark canvas, kinetic type, live product demo as hero, bento features, “FIG” technical labels, heavy whitespace | Hero = interactive diagram (lever), not a paragraph; product-as-demo vibe → pipeline demo |
| 2 | **Vercel** | https://vercel.com/ | Near-black + shaders, Geist type, terminal UI sections, monochrome system | Terminal/CLI strips; shader-lite backgrounds; dense but scannable |
| 3 | **Raycast** | https://www.raycast.com/ | Dense feature cards, uniform components, signature accent ownership | Card/bento consistency; one accent green only |
| 4 | **Cursor** | https://cursor.com/ | Cyan accent ownership, developer seriousness, product-forward | Own **matrix green**; avoid looking like a gimmick site |
| 5 | **Framer** | https://www.framer.com/ | Motion as product, shaders, cursor reveals | Scroll storytelling; keep mobile simpler |
| 6 | **ElevenLabs** | https://elevenlabs.io/ | Sensory product demo in hero (audio) | Sensory parallel: **show clips** (video wall), not describe them |
| 7 | **Stripe** | https://stripe.com/ | WebGL mesh gradient, Söhne, micro-interactions | Restraint: one hero effect, clean elsewhere ([Toimi](https://toimi.pro/blog/best-saas-website-designs/)) |
| 8 | **Attio** | https://attio.com/ | Live command demo, refined monochrome, bento hover craft | Hover micro-interactions on diagram nodes |
| 9 | **Ramp** | https://ramp.com/ | Formalized bento system, scroll-driven walkthrough | Bento for features with **visual cells**, not text cells |
| 10 | **Opus Clip** | https://www.opus.pro/home | Tool marketing: before/after clip demos, vertical video focus | Phone/video walls of Shorts; competitor = DIY tool → we sell ops |
| 11 | **Lumina Clippers** | https://luminaclippers.com/ | Dark agency, cinematic, proof numbers, niche pages | Niche landings; cinematic dark; **we differentiate** with fixed prices + lever story |
| 12 | **PostHog** (counter) | https://posthog.com/ | Weird/illustration-led counter-aesthetic | Lesson: personality wins—our lever/matrix is the POV ([Toimi](https://toimi.pro/blog/best-saas-website-designs/)) |
| 13 | **Anthropic** (counter) | https://anthropic.com/ | Editorial cream/serif restraint | What **not** to do for Archimedes brand |
| 14 | **Godly / Land-book / Awwwards** | https://godly.website/ · https://land-book.com/ · https://www.awwwards.com/ | Trend galleries for dark agency / 3D heroes | Moodboard only—don’t copy gimmicks wholesale |
| 15 | **Pitch deck assets (own)** | `/workspace/youtube-automation/pitch-diagram/` | Lever, funnel, red/blue pills, phone clip, platforms | Production site should **elevate** these into SVG/Rive, not reinvent |

**Reference screenshots captured (hero crops):**  
`/workspace/youtube-automation/web-research/refs/` — `linear-app.png`, `vercel.png`, `raycast.png`, `cursor.png`, `framer.png`, `elevenlabs.png`, `opus-clip.png`, `lumina-clippers.png`.

### Patterns that read “premium” (not “cheesy”)

1. **One accent color**, grayscale everything else ([Toimi](https://toimi.pro/blog/best-saas-website-designs/)).  
2. **Show, don’t tell** — live UI / diagram / media wall in the first viewport ([aydesign patterns](https://www.aydesign.ai/blog/modern-saas-landing-page-design-patterns-2026)).  
3. **Oversized type + short lines**; body copy secondary.  
4. **Bento / asymmetric grids** with visuals inside cells ([Ramp via Toimi](https://toimi.pro/blog/best-saas-website-designs/); [CodeFronts bento](https://codefronts.com/layouts/css-bento-grid-layouts/saas-feature-value-prop-matrix/)).  
5. **Motion on transform/opacity**; scroll storytelling reserved for 1–2 signature sections.  
6. **Proof = specific** (named quotes, metrics) when you have it—never fake logos ([aydesign](https://www.aydesign.ai/blog/modern-saas-landing-page-design-patterns-2026)). Until then: sample-clip walls + “Coming soon” case slots (as draft site).

---

## 2. Visual-first storytelling (Eduardo’s mandate)

**Rule:** Every section is **≥70% visual surface area**. Text is caption-length (eyebrow + H2 + ≤2 short lines + CTA). No essay sections.

### 2.1 Hero — Archimedes lever (large illustrated)

| Approach | Tool | When | Cost / risk |
| --- | --- | --- | --- |
| **Primary (recommended)** | Custom **SVG + Rive** state machine: fulcrum, lever arm, “content block” on ground, world/globe tip | Interactive, light, themeable | Design time; small runtime ([Rive websites](https://rive.app/use-cases/websites)) |
| Alternative | **Spline** embedded scene | Fast 3D look | Heavier; lazy-load; static poster on mobile ([3D WebGL guidance](https://studiomeyer.io/en/blog/3d-webdesign-webgl)) |
| Alternative | **React Three Fiber** lever model | Max control | Highest eng cost ([R3F vs Three](https://www.creativedevjobs.com/blog/react-three-fiber-vs-threejs)) |
| Fallback | Static SVG/PNG from pitch `lever.png` / `lever_mini.png` | `prefers-reduced-motion` / no-WebGL | Required |

**Copy budget in hero:** quote (1 line) + interpretation (1–2 lines) + 2 CTAs. Pipeline steps live **inside** the diagram labels, not a paragraph list.

### 2.2 Animated / interactive pipeline diagram

Five stages as **nodes + glowing connectors** (Place to stand → Clip → Caption → Post → Report):

- SVG path draw-on-scroll (`strokeDashoffset` + Motion `useInView`) — common marketing pattern ([svg-topology skill notes](https://skillsmp.com/creators/mcevoyinit/agentic-skills/skills-frontend-svg-topology-framer-motion)).  
- Or **svg-flow** style glowing tubes between DOM nodes ([svg-flow](https://github.com/bUxEE/svg-flow)).  
- Ready-made conceptual cousins: pipeline / Sankey feature blocks ([shadcn.io pipeline](https://www.shadcn.io/blocks/features-pipeline-step-diagram), [Sankey](https://www.shadcn.io/blocks/features-sankey-flow-diagram)).  
- **A11y:** `role="img"` + `aria-label` summarizing stages; keyboard focusable nodes with text alternatives; mobile = vertical stacked cards with same icons.

### 2.3 Illustration system (mandatory consistency)

Define a **family**, not one-offs ([DEV SVG family](https://dev.to/yi_shen_liu/how-to-build-a-consistent-svg-family-from-a-product-brief-1dbm); [aydesign: 6–12 piece system](https://www.aydesign.ai/blog/modern-saas-landing-page-design-patterns-2026)):

| Spec | Recommendation |
| --- | --- |
| Style | Line + glow: 1.5–2px strokes, rounded joins, matrix-green `#3DFF8A` on charcoal, optional phosphor trails |
| Geometry | Simple machinery (levers, gears as abstract arcs, phone bezels, funnel wedges)—not clipart people |
| Color count | BG `#0A0C0B`, surface `#161B18`, ink `#E8F0EA`, accent `#3DFF8A`, muted `#A3B5A9`, warn `#FFD166` |
| Formats | **SVG primary**; PNG/WebP for OG/email; Rive for interactive; Lottie only if AE pipeline already exists |
| Optimization | SVGO after visual QA; strip metadata; theme via CSS variables ([Icora SVG notes](https://icora.io/blog/svg-illustrations-for-product-teams)) |
| A11y | Meaningful art: `alt` / `aria-labelledby`; decorative: `aria-hidden="true"` |

**Asset list to produce (minimum):**

1. Lever hero (Rive + static)  
2. Pipeline 5-node diagram  
3. Phone wall (3–6 devices with placeholder vertical frames)  
4. Audience funnel  
5. Red pill / blue pill package chooser art  
6. Platform glyph row (YT / TikTok / IG / LinkedIn)  
7. “Place to stand / Lever / World” trio spots  
8. Icon set ~16 (reuse pitch icons as style reference)  
9. Matrix glyph ornaments (CSS/canvas, not photos)  
10. Empty / Coming-soon case study frame

### 2.4 Phone wall / video wall

- Dark cinematic device mockups ([SnackTV phone styles](https://snacktv.io/phone-mockup-styles-favored-by-top-saas-brands-on-social-media/)).  
- Inside bezels: muted looping **vertical clip samples** (client-approved or watermarked demos)—pause off-screen; `prefers-reduced-motion` → poster frames.  
- Prefer CSS/HTML device chrome + `<video muted playsinline loop>` over giant MP4 hero.  
- Until real clips exist: illustrated phone frames with abstract waveform/caption bars (pitch `phone_clip.png` as temp).

### 2.5 Audience funnel illustration

Large funnel graphic (pitch `funnel.png` → redraw as SVG): Long-form → Clips → Feed → Audience → Calls. Labels ≤4 words each. Animate fill/particles on scroll once.

### 2.6 Red pill / blue pill package interaction

- Full-bleed interactive chooser (art: pitch `pills.png`).  
- Hover/focus: Ship vs Dominate diverge visually; click → package page or scroll to pricing cards.  
- **Honesty:** Metaphor for **package choice**, not political meme spam—keep geometric pills, short labels “Ship $1,497” / “Dominate $3,497”.  
- Keyboard operable; no color-only meaning (icons + text).

### 2.7 Sourcing / production pipeline

| Method | Use | Caution |
| --- | --- | --- |
| **Custom SVG** (Illustrator/Figma) | Core diagram system | Keep path complexity low ([Helion360](https://helion360.com/blog/how-to-create-professional-vector-illustrations-for-websites)) |
| **Rive** | Lever, pills, pipeline micro-interactions | Prefer over Lottie for interactive web ([Rive](https://rive.app/use-cases/websites)) |
| **Lottie** | Simple loops if designer is AE-native | Larger / less interactive than Rive in many comparisons |
| **Spline** | Optional 3D lever hero | Lazy-load; poster fallback |
| **Three.js / R3F** | Only if Spline insufficient | Cap DPR, pause offscreen ([Three tips](https://www.utsubo.com/blog/threejs-best-practices-100-tips)) |
| **AI → vectorize** | Drafts for spots/icons | Human cleanup; style lock; sanitize SVG ([SVG AI workflow](https://www.svgai.org/blog/ai-assisted-svg-creation)) |
| **Licensed packs** | Avoid generic “startup people” packs—breaks matrix POV | If used, recolor heavily |
| **Pitch-diagram reuse** | Immediate placeholders | Replace with production SVG/Rive before launch |

---

## 3. Theme effects without cheese

### Matrix rain

| Do | Don’t |
| --- | --- |
| Full-bleed **behind** content at **4–12% opacity** | Opaque green blizzard over copy |
| Cap FPS 30; pause when tab hidden / off-hero | Always-on 60fps bloom everywhere |
| Prefer GPU particle / texture rain ([Rezmason matrix](https://github.com/Rezmason/matrix); [MatrixCode WebGL2](https://github.com/JamesBedford/MatrixCode)) | DOM nodes per glyph |
| `prefers-reduced-motion: reduce` → static grid CSS only ([web.dev](https://web.dev/articles/prefers-reduced-motion)) | Ignore OS setting |
| Lower `resolution` / bloom on mobile | Same settings as desktop |

### Glitch / scramble text

- Use sparingly: logo hover, section eyebrows, one headline scramble on first paint (≤400ms).  
- Libraries: custom `requestAnimationFrame` char scramble, or GSAP SplitText (club plugin—confirm license).  
- Never scramble body copy continuously.

### Terminal / CLI aesthetic

- Narrow “status strip”: `archimedes@ops:~$ clip --ship episode-14.mp4` with typing once.  
- Vercel-like deploy log motif for “pipeline running” ([Toimi on Vercel](https://toimi.pro/blog/best-saas-website-designs/)).  
- IBM Plex Mono / Geist Mono for strips; Plex Sans / Geist Sans for UI.

### Scroll / motion stack

| Layer | Library | Role |
| --- | --- | --- |
| UI micro | **Motion** (`motion/react`) | Enter/exit, layout, hover ([GSAP vs Motion 2026](https://www.hontran.dev/blog/gsap-vs-framer-motion)) |
| Scroll story | **GSAP + ScrollTrigger** | Pin pipeline / lever scrub (1–2 sections max) |
| Smooth scroll | **Lenis** optional | Sync to GSAP ticker; disable on reduced-motion ([Lenis+GSAP Next](https://www.hontran.dev/blog/nextjs-smooth-scroll-gsap-lenis)) |
| CSS | scroll-driven animations | Progressive enhancement for simple fades |

**Perf rules:** animate `transform`/`opacity` only; one RAF loop; `ScrollTrigger.refresh()` after fonts/images; no pin on small mobile viewports ([Rahul Patel guide](https://rahhuul.github.io/blog/gsap-scrolltrigger-lenis-nextjs-scroll-animations/)).

---

## 4. Recommended tech stack (pick one)

### **Next.js 15 App Router + TypeScript + Tailwind CSS v4 + shadcn/ui + Motion + GSAP (island) + MDX**

| Piece | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js App Router** | SSG/ISR for SEO niche pages; RSC for content; easy Vercel |
| Style | **Tailwind + CSS variables** | Tokens match draft; fast Cursor iteration |
| Components | **shadcn/ui** | Accessible primitives; customize dark |
| Motion | **Motion** default + **GSAP ScrollTrigger** for pipeline/lever | Split responsibilities ([2026 comparisons](https://buildwithumar.com/blogs/gsap-vs-framer-motion-nextjs-2026)) |
| Content | **MDX** in-repo (+ optional later Sanity/Contentlayer) | Case studies/blog without CMS lock-in at v1 |
| Hosting | **Vercel** | First-class Next; OG via `next/og` |
| Booking | **Cal.com** embed | Open-source Calendly alternative ([Cal embed](https://cal.com/embed)) |
| Payments | **Stripe Payment Links** or Checkout | Fast; Eduardo fills price IDs |
| Analytics | **Plausible** (privacy) or **PostHog** (product) | Pick one for v1 |
| Illustrations | **SVG + Rive** (+ optional Spline island) | Visual-first without always-on heavy 3D |

**Not chosen for v1:** Astro (excellent static, weaker interactive island ergonomics for Rive/GSAP storytelling), Framer-only site (less repo control for Cursor agents), Webflow (harder for programmatic niche pages in git).

---

## 5. Performance, SEO, a11y (motion-heavy)

### Core Web Vitals (official)

Per [web.dev Web Vitals](https://web.dev/articles/vitals) (updated Oct 31, 2024):

| Metric | Good |
| --- | --- |
| **LCP** | ≤ **2.5s** (75th percentile) |
| **INP** | ≤ **200ms** |
| **CLS** | ≤ **0.1** |

### Requirements

- **SSG** all marketing routes; stream minimal JS.  
- **Lazy-mount** WebGL/Rive/Spline after LCP (IntersectionObserver + `requestIdleCallback`).  
- **Poster** images for heroes; dimension attributes to protect CLS.  
- **`prefers-reduced-motion`** kills rain, Lenis, scramble, autoplay; keeps opacity fades ≤150ms ([web.dev reduced motion](https://web.dev/articles/prefers-reduced-motion)).  
- **SEO:** unique title/description per niche; `Organization` + `Service` + `FAQPage` JSON-LD (as draft); `sitemap.xml`; canonical; **dynamic OG** via `next/og`.  
- **Programmatic pages:** `/niches/[slug]` from config (podcasts, saas, coaches + future).  
- **WCAG 2.2 AA:** contrast (draft already fixed nav CTA); focus states; axe **0 serious/critical** in CI.

### Lighthouse acceptance (lab, mobile + desktop)

- Performance ≥ **90** desktop / ≥ **85** mobile (stretch; motion sites often trade—fix LCP/INP/CLS first).  
- Accessibility ≥ **95**.  
- Best Practices ≥ **95**.  
- SEO ≥ **95**.

---

## 6. Conversion (premium agency patterns)

| Pattern | Application |
| --- | --- |
| Hero formula | Outcome + who it’s for + visual proof (lever/demo) ([Grid Rebels / SaaS lists](https://www.gridrebels.studio/post/20-best-saas-website-designs-in-2026-examples-that-actually-convert)) |
| Proof above fold | Until case studies: **sample clip wall** + honest “draft proof”—no fake logos |
| Two tiers | Eduardo already chose 2 packages; highlight **Dominate** as “Most leverage”; published prices beat opaque “book a call” competitors. Note: some SaaS research prefers **3** tiers for Goldilocks ([roast.page](https://roast.page/blog/pricing-page-psychology); [CXL-style summaries](https://www.getmonetizely.com/articles/customer-choice-overload-how-many-pricing-options-are-too-many))—Archimedes stays at **2** per product decision; use red/blue pills as chooser UX |
| Sticky CTA | Mobile sticky “Book a call” after scroll |
| Lead magnet | Free sample clip form (upload/link) → Cal.com |
| Booking | Cal.com inline + package query param |
| Pricing psychology | Dominate bordered/glow; Ship quieter; comparison as **visual table** not essay |

---

## 7. Recommended design system

### Color

```
--bg: #0A0C0B
--surface: #121614
--card: #161B18
--border: #243028
--text: #E8F0EA
--muted: #A3B5A9
--accent: #3DFF8A
--accent-dim: #1A9F52
--warning: #FFD166
--danger: #FF6B6B
```

### Type

| Role | Font | Notes |
| --- | --- | --- |
| Sans | **IBM Plex Sans** or **Geist Sans** | Free; UI + headlines |
| Mono | **IBM Plex Mono** or **Geist Mono** | Terminal strips, eyebrows |
| Display optional | Agency FB / custom later | Not required v1 |

### Spacing / radius

- 8px grid; section py `6–8rem` desktop.  
- Radius: controls `9999px`, cards `16–20px`.  
- Max content width `1120–1200px`; full-bleed for hero diagram & video wall.

### Motion principles

1. Visuals lead; motion explains diagrams.  
2. One signature scroll scene per page max.  
3. Reduced-motion = illustrated static comics of the same story.  
4. Never block LCP on Rive/WebGL.

### Component list (visual-led)

`SiteShell`, `MatrixCanvas`, `LeverHero`, `PipelineDiagram`, `BentoVisualGrid`, `PhoneWall`, `FunnelGraphic`, `PillChooser`, `PackageCardVisual`, `TerminalStrip`, `SampleClipWall`, `CaseStudyPlaceholder`, `NicheHeroArt`, `StickyBookCTA`, `CalEmbed`, `Md xProse` (blog only—still illustrated headers).

---

## 8. Unverified / caution

- Exact Lighthouse scores for Linear/Vercel cited as “above 90” in secondary roundups—**re-measure** yourself; don’t treat as guaranteed.  
- Paddle “1.4× conversion for 3 tiers vs 2” and similar pricing stats are **third-party summaries**—Archimedes stays on two packages by design.  
- Spline/Rive bundle sizes vary by file—budget-check each asset.  
- Godly/Land-book “winners” rotate; use as moodboard, not everlasting canon.

---

## 9. Sources

- https://toimi.pro/blog/best-saas-website-designs/  
- https://www.aydesign.ai/blog/modern-saas-landing-page-design-patterns-2026  
- https://www.gridrebels.studio/post/20-best-saas-website-designs-in-2026-examples-that-actually-convert  
- https://www.refs.gallery/projects/linear  
- https://linear.app/ · https://vercel.com/ · https://www.raycast.com/ · https://cursor.com/ · https://www.framer.com/ · https://elevenlabs.io/ · https://www.opus.pro/home · https://luminaclippers.com/  
- https://web.dev/articles/vitals · https://web.dev/articles/prefers-reduced-motion  
- https://github.com/Rezmason/matrix · https://github.com/JamesBedford/MatrixCode  
- https://www.hontran.dev/blog/gsap-vs-framer-motion · https://www.hontran.dev/blog/nextjs-smooth-scroll-gsap-lenis  
- https://buildwithumar.com/blogs/gsap-vs-framer-motion-nextjs-2026  
- https://rive.app/use-cases/websites · https://cal.com/embed  
- https://www.shadcn.io/blocks/features-pipeline-step-diagram  
- https://icora.io/blog/svg-illustrations-for-product-teams  
- https://snacktv.io/phone-mockup-styles-favored-by-top-saas-brands-on-social-media/  
- https://roast.page/blog/pricing-page-psychology  

