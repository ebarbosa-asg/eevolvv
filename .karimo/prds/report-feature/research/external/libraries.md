# External Library Recommendations: report-feature

**Phase:** External Research
**Date:** 2026-05-08

---

## Priority 1: Recommended for Immediate Use

### flowtoken (npm: `flowtoken`)
- **Purpose:** Animate streaming LLM text output in React. Per-word or per-character animations.
- **Why for eevolvv:** The report body currently appears all-at-once via `dangerouslySetInnerHTML`. Using `flowtoken`'s `AnimatedMarkdown` with `sep="word"` and `animation="fadeIn"` would make the report content feel like it's being written live — significantly more premium than an instant render.
- **Key components:** `AnimatedMarkdown` (renders markdown with animations), `StreamText` (plain text streaming)
- **Key props:** `content`, `sep` ("word"|"char"), `animation` (fadeIn/dropIn/blurIn/slideUp/etc.), `animationDuration`, `animationTimingFunction`
- **Integration:** Works with Vercel AI SDK and Next.js. The report text arrives via API as a complete string, so animations would run on mount rather than during streaming — but this is intentional for the report phase reveal.
- **Size:** Lightweight (~5kb)
- **Version:** 1.0.40, last updated ~10 months ago. Stable but not actively maintained.
- **Link:** https://github.com/Ephibbs/flowtoken
- **Install:** `npm i flowtoken`
- **Alternative:** Manual CSS animation with `animation-delay` per section (no new dependency). Potentially preferable given maintenance status of flowtoken.

---

### react-confetti (npm: `react-confetti`)
- **Purpose:** Canvas-based confetti explosion for celebration moments.
- **Why for eevolvv:** A brief confetti burst when `revealStage` reaches 1 (report header appears) creates an "aha moment" delight that signals the report is ready. Should be restrained — 2 seconds max, then disappear.
- **Usage pattern:** `<Confetti recycle={false} numberOfPieces={200} onConfettiComplete={...} />` mounted at `revealStage >= 1`, removed after `recycle={false}` cycle completes.
- **Colors:** Use brand colors — `colors={['var(--accent)', '#141413', '#faf7f0']}` for on-brand feel.
- **Size:** ~15kb
- **Link:** https://www.npmjs.com/package/react-confetti
- **Install:** `npm i react-confetti`
- **Caution:** Should respect `prefers-reduced-motion`. Wrap in a check: `!window.matchMedia('(prefers-reduced-motion: reduce)').matches`.
- **Alternative:** `magicui` confetti component (https://magicui.design/docs/components/confetti) — more customizable but heavier dependency.

---

## Priority 2: Consider for Report PDF Export

### react-to-pdf (npm: `react-to-pdf`)
- **Purpose:** Client-side PDF export from React components using html2canvas + jsPDF.
- **Why for eevolvv:** Adding a "Download PDF" button to the report is a high-value feature — it gives the user a take-away artifact. Users who download are more likely to convert later.
- **Consideration:** The report uses CSS variables for colors. Need to use `useCORS: true` and ensure critical styles are inline or computed at export time. Custom fonts (JetBrains Mono, Space Grotesk) may not render in the PDF — system fonts would be substituted.
- **Alternative for searchable PDF text:** `@react-pdf/renderer` — generates text as text objects, not rasterized images. Requires rebuilding the report layout as React PDF components (significant work but produces better output).
- **Recommendation:** Start with `react-to-pdf` for a quick "Download Report" feature. Upgrade to `@react-pdf/renderer` if quality is insufficient.
- **Link:** https://www.npmjs.com/package/react-to-pdf
- **Install:** `npm i react-to-pdf`

---

## Priority 3: Animation Enhancements

### motion (Framer Motion, npm: `motion`)
- **Purpose:** Production-grade React animations including the Typewriter component.
- **Why for eevolvv:** The Typewriter component from motion (`motion.dev/docs/react-typewriter`) could enhance the extracting screen's activity log with more polished timing control. At 1.3kb it's tiny.
- **Current state:** eevolvv already uses CSS keyframe animations for most things. Framer Motion adds value if the team wants interactive transitions (e.g., report sections that can be expanded/collapsed).
- **Caution:** Motion is a larger dependency if only used for typewriter. Only add if expanding to other animations.
- **Link:** https://motion.dev/docs/react-typewriter
- **Install:** `npm i motion`

---

## Not Recommended

### html2canvas + jsPDF (direct use)
- The combination works but requires significant configuration for CSS variables and custom fonts. `react-to-pdf` wraps this more cleanly.

### Lottie animations
- Adds significant bundle weight (~30kb+). The eevolvv design system uses CSS keyframe animations that achieve the same effect. Not worth the dependency for this feature.

### Confetti cannons (multiple packages)
- Only one confetti library is needed. `react-confetti` is the lightest proven option.
