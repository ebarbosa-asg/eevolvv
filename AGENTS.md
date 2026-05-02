# eevolvv — Working Memory

## The Business
eevolvv is an AI-native business transformation service. Tagline: **"A service, not software."**
Core brand truth: **"eevolvving forward, together."**
Owner: E (Eduardo Barbosa) — eduardocbarbosa1998@gmail.com

## Contact / Infrastructure
| Item | Value |
|------|-------|
| **Business email** | hello@eevolvv.com |
| **Phone** | +1 (844) 433-8658 (Grasshopper) |
| **Calendly** | https://calendly.com/hello-eevolvv |
| **Banking** | Mercury |
| **Payments** | Stripe Atlas (entity + Stripe) |
| **Entity** | eevolvv, Inc. (Delaware C corp, via Stripe Atlas) |

## Active Projects
| Name | What | Status |
|------|------|--------|
| **homepage-v2** | Full page redesign + true AI chat engine | ✅ DONE |
| **archimedes-rebrand** | Rename archimedes.ai → eevolvv/talent | ✅ DONE — talent lives at /talent in main app only. Standalone talent/ app deleted. |
| **investor-pitch** | Password-gated pitch deck + investor strategy doc | 🔄 IN PROGRESS — see `public/investor/` and `docs/investor-strategy.md` |
| **micro-tier** | Corner store / global micro-retail expansion | LONG-TERM PLANNED |
| **global-expansion** | 25M+ micro-retailers worldwide, WhatsApp-first | LONG-TERM PLANNED |

## Investor Strategy (Option A)
Current fundraising framing: **SMB is the brand. Enterprise is the revenue.**
- **Enterprise wedge:** QA programs + finance audit — high-contract-value, underserved by AI diagnostics, SOX/ISO regulatory urgency
- **SMB brand:** 400M+ businesses, emotional hook, data flywheel, forever customer model
- **Global vision:** WhatsApp-first micro tier, India/Philippines/LatAm corner stores
- Raising: **$1M pre-seed · Q2 2026**
- Future: separate SMB-only deck planned (pitch-smb.html) for impact/SMB-focused investors
- Full strategy doc: `docs/investor-strategy.md`

## Proprietary Pipeline
**Diagnose → Onboard → Build Task Agents & Integration → Maintain**

| Stage | What happens |
|-------|-------------|
| **Diagnose** | AI-led diagnostic session maps business health across 12 nodes. Outputs: Evolution Report with ranked automation opportunities |
| **Onboard** | Scope agreement, access provisioning, integrations mapped, pilot program defined |
| **Build Task Agents & Integration** | Custom AI task agents built for the client's specific workflows; integrated with their existing tools (CRM, ERP, finance, QA systems) |
| **Maintain** | Ongoing AI advisory, monitoring, iteration, quarterly re-calibration. Context compounds every month → forever customer |

This pipeline is the core service delivery model across all tiers (Micro, Core, Enterprise). Enterprise engagements are deeper at every stage.

## Market Context (Research · May 2026)
| Market | Size | Growth | Notes |
|--------|------|--------|-------|
| **SMB AI Automation** | $68.3B → $124.5B by 2033 | ~8% CAGR | 91% of SMBs using AI report revenue increase; 58% now using gen AI (up from 40%) |
| **QA / Testing Automation** | $28.1B → $55.2B by 2028 | 14.5% CAGR | AI-enabled testing specifically: $1.01B → $4.64B by 2034 (18.3% CAGR); 75% of enterprises use AI in QA |
| **Finance / AI Audit** | $1.4B → $8.7B by 2033 | 22.8% CAGR | AI in Accounting: $6.68B → $37.6B by 2030 (41% CAGR); SMEs fastest segment at 45.2% CAGR; 1 in 2 CFOs still in pilot phase = massive unmet demand |
| **Global SMB Advisory** | $340B+ TAM | — | <1% of SMBs have ever accessed professional advisory |

**Enterprise wedge target segment:** Companies $5M–$50M revenue running QA compliance (ISO 9001, Six Sigma, CMMI) or finance audit — too small for Big 4, too complex for generic SaaS. $50K–$500K/yr in consultant spend, highly motivated by SOX/ISO regulatory urgency.

## Key Terms
| Term | Meaning |
|------|---------|
| **Micro tier** | $29–49/mo subscription for corner stores, kirana, sari-sari, bodegas |
| **eevolvv/talent** | Rebranded Archimedes — micro-contracting + micro-consulting platform, lives at /talent |
| **forever customer** | Retention model: AI learns the business so deeply switching becomes prohibitive |
| **diagnostic engine** | The AI chat at /diagnostic — true AI conversation via ChatEngine.tsx |
| **the monkey logo** | eevolvv logo = evolution strip of primates; smallest monkey = eevolvv/talent logo |
| **WhatsApp-first** | Delivery mechanism for Micro tier in emerging markets |
| **enterprise wedge** | QA programs + finance audit = near-term high-contract revenue while SMB builds brand |
| **Option A** | Current investor pitch strategy: SMB brand + enterprise revenue, single deck |
| **proprietary pipeline** | Diagnose → Onboard → Build Task Agents & Integration → Maintain |

## Brand Design System

### Design Tokens (`app/globals.css` `:root`)
| Token | Value | Usage |
|-------|-------|-------|
| `--paper` | `#faf7f0` | Primary background — warm off-white |
| `--ink` | `#141413` | Primary text + dark section backgrounds |
| `--accent` | `oklch(0.45 0.13 25)` | Brick red (~#8C2B1A) — CTAs, markers, highlights |
| `--rule` | `rgba(20,20,19,.14)` | Borders, dividers, separators |
| `--font-display` | `'Space Grotesk', sans-serif` | Headings, wordmarks, UI |
| `--font-serif` | `'Newsreader', serif` | Italic accent text |
| `--site-max` | `1280px` | Content rail max-width |
| `--site-pad-x` | `32px` | Horizontal section padding |
| `--anchor-scroll-margin` | `72px` | Sticky header clearance |

**Inverted sections** (dark bg): swap `--paper` ↔ `--ink` usage. Accent stays the same.
**Selection**: `background: var(--ink); color: var(--paper)` — set globally, do not override.
**Status green** (live indicators only): `#4ade80`

### Fonts
| Family | Weights | Token / Class | Role |
|--------|---------|---------------|------|
| Space Grotesk | 400 500 600 700 | `--font-display` | Headings, wordmarks, body UI |
| JetBrains Mono | 300 400 500 600 700 | `.mono` | Section markers, labels, terminal blocks, code |
| Newsreader | 300 400 500 700 + italic | `--font-serif` / `.serif` | Italic accent phrases, serif moments |
| Instrument Serif | italic | `.serif` fallback | Alternate serif |
| Press Start 2P | 400 | inline only | Ticker / arcade text — use sparingly |

**Google Fonts CDN (required in any standalone HTML file):**
```
https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,700;1,6..72,400;1,6..72,500&family=Instrument+Serif:ital@0;1&family=Press+Start+2P&display=swap
```

### Utility Classes (`globals.css`)
| Class | What it does |
|-------|-------------|
| `.site-rail` | Centers content, max 1280px, pad 32px each side |
| `.mono` | JetBrains Mono + `font-feature-settings: "ss01","cv01"` |
| `.serif` | Newsreader / Instrument Serif |
| `.brand-wordmark` | Space Grotesk 600, -0.04em tracking, lowercase |
| `.link-rule` | Underline that draws in on hover (scaleX transition) |
| `.hero-gradient-word` | Animated ink→accent gradient text |
| `.btn-gradient` | Animated ink→accent gradient button, paper text |
| `.header-cta-gradient` | Same as btn-gradient + 1px ink border |
| `.grid-drift` | Animated 64px subtle grid background |
| `.blueprint-grid` | Static 32px grid background |
| `.anim-fade-up` | fadeUp 0.9s cubic-bezier(0.2,0.8,0.2,1) |
| `.anim-fade-in` | fadeIn 1.2s ease |
| `.anim-draw-line` | drawLine 1.4s cubic-bezier(0.65,0,0.35,1) |
| `.anim-blink` | blink 1.1s steps(1) infinite |

### UI Language Patterns
These patterns define the eevolvv voice in UI. Use them in every new page/component.

| Pattern | Format | Font | Color |
|---------|--------|------|-------|
| Section marker | `§ 00 · LABEL` | JetBrains Mono 11px, uppercase, 0.2em tracking | `--accent` |
| Sub-labels | `N=01`, `T-00`, `A-01` | JetBrains Mono 10–11px | `--accent` |
| Primary arrow | `→` | inherited | `--accent` |
| Sub-item arrow | `↳` | inherited | muted (0.5 opacity) |
| Progress bar | `▓▓▓▓▓░░░░░` | JetBrains Mono | `--accent` |
| Symbols | `◈ ◎ ▷ ★ ∞` | inherited | `--accent` or muted — decorative only |

**Terminal log block** (standard pattern for diagnostic/code/process sections):
```css
background: rgba(20,20,19,.055);      /* on light sections */
border: 1px solid var(--rule);
border-left: 3px solid var(--accent);
font-family: JetBrains Mono; font-size: 13px; line-height: 1.9;
```
Line format: `→ KEY    ↳ value or description`
Comment lines: `// text` at 30% opacity

**Report bullets**: `→` prefix in `--accent`, JetBrains Mono 11px section label above content.

### Color Mixing Patterns
```css
/* Footer / inverted text — tinted paper */
color-mix(in oklch, var(--accent) 24%, var(--paper))

/* Footer links */
color-mix(in oklch, var(--accent) 58%, var(--paper))

/* Frost panel (dark sections) */
background: rgba(20,20,19,0.48);
backdrop-filter: blur(14px);
border: 1px solid rgba(255,255,255,0.055);
```

### Animation Timings
| Animation | Duration | Easing | Use case |
|-----------|----------|--------|----------|
| `gradientShift` | 9s ease-in-out infinite | — | Gradient buttons + hero word |
| `fadeUp` | 0.9s | cubic-bezier(0.2,0.8,0.2,1) | Section entrances |
| `fadeIn` | 1.2s | ease | Softer entrances |
| `drawLine` | 1.4s | cubic-bezier(0.65,0,0.35,1) | Rule / underline draws |
| `flapTop/Bottom` | 0.32s | custom cubic-bezier | Split-flap counter digits |
| `scanBeam` | 3.5s ease-in-out infinite | — | Diagnostic scan overlay |

---

## Tech Stack (eevolvv.com)
| Layer | What |
|-------|------|
| Framework | Next.js (App Router), TypeScript, Tailwind |
| AI | Anthropic Codex-sonnet-4-6 via `@anthropic-ai/sdk` |
| DB | Supabase (submissions table, rate limiting) |
| Email | Resend + react-email (`/emails/EvolutionReport`) |
| Hosting | Vercel |
| Fonts | Space Grotesk, JetBrains Mono, Newsreader |

## Key Files
| File | Purpose |
|------|---------|
| `app/page.tsx` | Entire homepage — Hero, Stats, Problem, Process, WhoItsFor, Pricing, DiagnosticForm, Footer |
| `components/ChatEngine.tsx` | True AI diagnostic chat engine (replaces static form) |
| `app/api/diagnostic/route.ts` | POST handler → Codex → Supabase → Resend |
| `app/privacy/page.tsx` | Privacy Policy (live at /privacy) |
| `app/terms/page.tsx` | Terms of Service (live at /terms) |
| `lib/diagnosticPrompts.ts` | System prompts + 14 industry context blocks |
| `lib/rateLimit.ts` | IP-based rate limiting (3/hr, also checked against Supabase) |
| `lib/supabase.ts` | DB client + saveSubmission / markEmailSent helpers |
| `public/mascot.png` | Evolution strip logo (monkey mascot) |
| `eevolvv-service-agreement.docx` | Client service agreement template (root level) |
| `public/investor/index.html` | Password-gated investor pitch deck (pw: eevolvv!) |
| `docs/investor-strategy.md` | Option A investor strategy + action items |

## Folder Structure (top-level)
```
eevolvv/
├── app/              ← Next.js app (pages, API routes)
├── components/       ← React components (ChatEngine, talent/*)
├── data/             ← Static data (talent domains, skills, workTypes)
├── docs/             ← Briefs + strategy docs (.md, .docx)
├── emails/           ← Resend email templates
├── hooks/            ← Custom React hooks
├── lib/              ← Utilities (supabase, rateLimit, diagnosticPrompts)
├── memory/           ← Project notes (this file's source of truth)
├── public/           ← Static assets (investor deck at /investor/index.html)
└── supabase/         ← DB migrations
```

## Current Known Issues
1. Rate limit 3/hr per IP — needs session-based or user-auth upgrade
2. Calendly link in `public/investor/index.html` § 11 CTA — placeholder, needs real URL inserted
3. All `[X]` placeholders in index.html — traction metrics, TAM/SAM/SOM, fund allocation % still need real numbers

## Env Vars — Standard for ALL eevolvv projects (set in .env.local AND Vercel dashboard)
| Var | Value / Notes |
|-----|---------------|
| `ANTHROPIC_API_KEY` | ✅ Set — Codex API |
| `SUPABASE_URL` | ✅ Set — https://qmdygiumftesoqzqmsqe.supabase.co |
| `SUPABASE_ANON_KEY` | ✅ Set |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Set |
| `RESEND_API_KEY` | ✅ Set — transactional email |
| `NEXT_PUBLIC_CALENDLY_URL` | ✅ Set → https://calendly.com/hello-eevolvv — **always include in every eevolvv project** |

→ Full project details: memory/projects/
→ Strategy docs: docs/eevolvv_Global_Expansion_Strategy.docx, docs/eevolvv_AI_Audit_Review.docx
→ Investor materials: public/investor/ (deck) and docs/investor-strategy.md

<!-- KARIMO:START -->
## KARIMO

Autonomous agent orchestration for eevolvv feature development.

### GitHub Configuration

| Setting | Value |
|---------|-------|
| Owner Type | user |
| Owner | ebarbosa-asg |
| Repository | eevolvv |

### Usage
- `/karimo:research "feature"` → scan codebase + web, create PRD folder
- `/karimo:plan --prd <slug>` → 5-round interview → PRD + tasks + waves
- `/karimo:run --prd <slug>` → execute tasks in parallel waves
- `/karimo:merge --prd <slug>` → final PR to main
- `/karimo:doctor` → health check
<!-- KARIMO:END -->
