# External Best Practices: report-feature

**Phase:** External Research
**Date:** 2026-05-08

---

## 1. AI Report UX: Premium vs. Cheap

**What makes a generated document feel premium:**
- Document metaphor beats chat metaphor: using report IDs, dates, document headers, and a "COMPLETE" status indicator creates an artifact that feels like something received, not something generated on the fly. eevolvv already does this well with the EEVOLVV DIAGNOSTIC REPORT header.
- Staggered reveal is critical: showing all content at once kills the premium feel. Progressive section-by-section reveal (which eevolvv implements via `revealStage`) is the correct pattern.
- Specificity signals quality: AI-generated reports that include real numbers specific to the user's inputs are perceived as significantly more credible than reports with generic advice. Claude's 14 industry contexts are the right investment.
- Font discipline: two font maximum. The eevolvv report already correctly uses Space Grotesk for headings and JetBrains Mono for labels — do not add more fonts.
- White space makes reports feel less overwhelming and more professional. The current report has adequate padding but the sections could breathe more.

**What to avoid:**
- Showing the full raw markdown before formatting is applied (never)
- No loading indication on a 15–35 second wait (kills trust)
- Generic fallback stats that contradict the specific report content

---

## 2. Loading State Best Practices (15–35 Second Wait)

The research consensus across Nielsen Norman Group, Smashing Magazine, and Pencil & Paper is clear:

**For waits over 10 seconds:**
- Show a determinate progress indicator with percentage AND status text — not just a spinner
- Activity/status feeds (like eevolvv's typewriter log) are highly effective at reducing perceived wait time
- The key metric: users perceive waits as 36% longer when there is no visible progress. Activity feeds eliminate this effect.

**Key principles:**
- The animation speed should match or slightly exceed real API progress to avoid a "frozen" feeling at 92%. The current approach of capping at 92% and then jumping to 100% creates a noticeable pause that reads as "something went wrong."
- "Communicate value while they wait" — the extracting screen should remind users what they're getting while it builds. eevolvv's activity lines already do this conceptually (parsing, loading templates, etc.) but could be enhanced with a brief value reminder: "Your custom automation roadmap is being built."
- Engagement tip from Netflix pattern: consider showing a preview stat or teaser before the full report loads (e.g., "Identified 7 automation opportunities" during the final compiling stage).

**What users tolerate:**
- 3 seconds: spinner alone is fine
- 10 seconds: need progress bar + status
- 15–35 seconds: need activity feed + percentage + value communication

---

## 3. Progressive Disclosure for Report Reveal

**The question:** All-at-once vs. section-by-section vs. typewriter per character?

**Best practice consensus:**
- Section-by-section reveal (stagger by section) is the optimal UX for structured reports. This is exactly what `revealStage` implements. It builds anticipation and keeps users reading rather than skimming.
- Character-by-character typewriter for the final report body is NOT recommended: it adds ~2–4 minutes of artificial wait to a document users want to read at their own pace. Reserve typewriter for loading screens and status updates.
- Per-word fade-in (the FlowToken `fadeIn` with `sep="word"`) is the sweet spot for AI text: fast enough to feel live, smooth enough to feel premium. Recommended for the report content sections.
- After animation completes, the animation class should be removed to leave zero DOM overhead on finished content.

**FlowToken** (npm: `flowtoken`) provides per-word and per-character animations specifically for LLM streaming output, including `fadeIn`, `dropIn`, `blurIn`, `slideUp`. It integrates with Vercel AI SDK and Next.js. Lightweight and maintained.

---

## 4. Free Deliverable → Paid Conversion

**Timing:** The highest-converting paywalls appear immediately after the user experiences the peak value moment. For eevolvv, this is right after the report body is revealed — the current `revealStage 3 → 4` sequence (Next Step banner → TierCards at 1600ms) is timed correctly.

**Free-to-paid conversion benchmarks:**
- Average freemium-to-paid conversion: 2–5% (B2B SaaS is higher, 8–15% when the free product is highly specific and the upgrade is clearly tied to implementation)
- Most decisions happen within 72 hours of the free experience
- Opt-out trials convert at 48.8% vs. opt-in at 18.2% — consider adding a "14-day access to your full roadmap + strategy call" trial CTA

**Conversion drivers for post-report paywall (ranked by impact):**

1. **Specificity of CTA to report content**: "Start building your 7-automation roadmap" converts better than "Choose your tier." The tier card CTA should reference something from their actual report.
2. **Social proof at the moment of decision**: Testimonials with specific metrics ("Cut invoicing time by 60%") perform better than generic praise. Must be near the tier cards, not buried in a footer.
3. **Urgency that's honest**: Time-limited offers tied to real events work. Fake urgency ("Only 2 spots left!") backlashes with B2B buyers who are more skeptical.
4. **Savings displayed prominently**: "2 MONTHS FREE" for annual is correct — make it larger.
5. **Tier recommendation matched to report**: The recommended tier from the report body should be visually pre-highlighted in TierCards. Currently it is not.
6. **Trial option reduces friction**: A 7-day access offer reduces the fear of commitment. Not currently present.
7. **FAQ / guarantee near CTA**: "Cancel anytime after month 3" is already in TierCards — good. Could be more prominent.

---

## 5. Audit/Diagnostic Report Visual Design Patterns

From SaaS audit tools (Semrush, HubSpot Grader) and consulting report templates:

**What the best audit reports do visually:**
- Lead with a score or summary metric that communicates the overall health at a glance before diving into details. eevolvv's stat callouts (3 numbers) are the right pattern but should be above the fold, not below the document header.
- Color-coded severity works: use accent color for opportunities/wins, neutral for info, muted for background context. Don't use red unless something is genuinely broken.
- Section numbering (01, 02, 03) helps users navigate and feel like they're making progress through the document.
- Callout boxes for key insights: important numbers or "bottom line" points benefit from visual separation (bordered box, accent left-border) so they're scannable without reading every word.
- Recommended service tier section should be visually distinguished from other sections — it's the most conversion-relevant part of the report.

**What makes a report feel cheap:**
- All body text, no visual hierarchy
- Same font size for everything
- No sectioning or numbered headers
- Generic phrasing that could apply to any business

---

## 6. Email Report Delivery UX

**Best practices for transactional report delivery emails:**
- The subject line that works best: "Your [BusinessName] report is ready — [specific finding]" e.g., "Your TacoShop report is ready — 6 automations identified." Not just "Your report is ready."
- The email CTA should go to payment/checkout, not a strategy call. A Calendly link is a soft second CTA, but the primary should be "Start building your roadmap →" linking to the Stripe checkout for the recommended tier.
- Timing of follow-up emails: 72 hours is the critical window. Three emails in the sequence (eevolvv has FollowUp1/2/3 templates) is the right number. No automation currently triggers these.

**Mobile email rendering:**
- The current `EvolutionReport.tsx` has `maxWidth: 600px` and `padding: '32px 0'` on body — correct for email. However, section padding of 40px on mobile may need to reduce to 24px.
- Font size 14px for body text is the safe minimum. Currently used — keep it.

Sources:
- [Smart Interface Design Patterns — Loading UX](https://smart-interface-design-patterns.com/articles/designing-better-loading-progress-ux/)
- [Smashing Magazine — Animated Progress Indicators](https://www.smashingmagazine.com/2016/12/best-practices-for-animated-progress-indicators/)
- [The Momentum — Paywall Conversion UX](https://www.themomentum.ai/blog/how-to-successfully-optimize-paywall-conversion-rates-with-ux)
- [RevenueCat — Paywall Conversion Boosters](https://www.revenuecat.com/blog/growth/paywall-conversion-boosters/)
- [UXPin — Progressive Disclosure](https://www.uxpin.com/studio/blog/what-is-progressive-disclosure/)
- [AI UX Design Guide — Progressive Disclosure in AI](https://www.aiuxdesign.guide/patterns/progressive-disclosure)
- [LogRocket — Typing Animations in React](https://blog.logrocket.com/5-ways-implement-typing-animation-react/)
- [Userpilot — Free-to-Paid Conversion](https://userpilot.com/blog/free-to-paid-conversion-strategy/)
- [Crazy Egg — Free-to-Paid Conversion Rates](https://www.crazyegg.com/blog/free-to-paid-conversion-rate/)
