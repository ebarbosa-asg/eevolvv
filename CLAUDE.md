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
| **investor-pitch** | Password-gated pitch deck + investor strategy doc | 🔄 IN PROGRESS — see `_investor/` |
| **micro-tier** | Corner store / global micro-retail expansion | LONG-TERM PLANNED |
| **global-expansion** | 25M+ micro-retailers worldwide, WhatsApp-first | LONG-TERM PLANNED |

## Investor Strategy (Option A)
Current fundraising framing: **SMB is the brand. Enterprise is the revenue.**
- **Enterprise wedge:** QA programs + finance audit — high-contract-value, underserved by AI diagnostics, SOX/ISO regulatory urgency
- **SMB brand:** 400M+ businesses, emotional hook, data flywheel, forever customer model
- **Global vision:** WhatsApp-first micro tier, India/Philippines/LatAm corner stores
- Raising: **$1M pre-seed · Q2 2026**
- Future: separate SMB-only deck planned (pitch-smb.html) for impact/SMB-focused investors
- Full strategy doc: `_investor/investor-strategy.md`

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

## Tech Stack (eevolvv.com)
| Layer | What |
|-------|------|
| Framework | Next.js (App Router), TypeScript, Tailwind |
| AI | Anthropic claude-sonnet-4-6 via `@anthropic-ai/sdk` |
| DB | Supabase (submissions table, rate limiting) |
| Email | Resend + react-email (`/emails/EvolutionReport`) |
| Hosting | Vercel |
| Fonts | Space Grotesk, JetBrains Mono, Newsreader |

## Key Files
| File | Purpose |
|------|---------|
| `app/page.tsx` | Entire homepage — Hero, Stats, Problem, Process, WhoItsFor, Pricing, DiagnosticForm, Footer |
| `components/ChatEngine.tsx` | True AI diagnostic chat engine (replaces static form) |
| `app/api/diagnostic/route.ts` | POST handler → Claude → Supabase → Resend |
| `app/privacy/page.tsx` | Privacy Policy (live at /privacy) |
| `app/terms/page.tsx` | Terms of Service (live at /terms) |
| `lib/diagnosticPrompts.ts` | System prompts + 14 industry context blocks |
| `lib/rateLimit.ts` | IP-based rate limiting (3/hr, also checked against Supabase) |
| `lib/supabase.ts` | DB client + saveSubmission / markEmailSent helpers |
| `public/mascot.png` | Evolution strip logo (monkey mascot) |
| `eevolvv-service-agreement.docx` | Client service agreement template (root level) |
| `_investor/pitch.html` | Password-gated investor pitch deck (pw: eevolvv!) |
| `_investor/investor-strategy.md` | Option A investor strategy + action items |

## Folder Structure (top-level)
```
eevolvv/
├── _investor/        ← pitch deck + investor strategy
├── app/              ← Next.js app (pages, API routes)
├── components/       ← React components (ChatEngine, talent/*)
├── data/             ← Static data (talent domains, skills, workTypes)
├── docs/             ← Briefs + strategy docs (.md, .docx)
├── emails/           ← Resend email templates
├── hooks/            ← Custom React hooks
├── lib/              ← Utilities (supabase, rateLimit, diagnosticPrompts)
├── memory/           ← Project notes (this file's source of truth)
├── public/           ← Static assets
└── supabase/         ← DB migrations
```

## Current Known Issues
1. Rate limit 3/hr per IP — needs session-based or user-auth upgrade
2. `RESEND_API_KEY` not set in `.env.local` — emails won't send locally
3. `SUPABASE_SERVICE_ROLE_KEY` not set — some admin operations unavailable
4. Calendly link in `_investor/pitch.html` § 11 CTA — placeholder, needs real URL inserted
5. All `[X]` placeholders in pitch.html — traction metrics, TAM/SAM/SOM, fund allocation % still need real numbers

## Env Vars — Standard for ALL eevolvv projects (set in .env.local AND Vercel dashboard)
| Var | Value / Notes |
|-----|---------------|
| `ANTHROPIC_API_KEY` | ✅ Set — Claude API |
| `SUPABASE_URL` | ✅ Set — https://qmdygiumftesoqzqmsqe.supabase.co |
| `SUPABASE_ANON_KEY` | ✅ Set |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Set |
| `RESEND_API_KEY` | ✅ Set — transactional email |
| `NEXT_PUBLIC_CALENDLY_URL` | ✅ Set → https://calendly.com/hello-eevolvv — **always include in every eevolvv project** |

→ Full project details: memory/projects/
→ Strategy docs: docs/eevolvv_Global_Expansion_Strategy.docx, docs/eevolvv_AI_Audit_Review.docx
→ Investor materials: _investor/

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
