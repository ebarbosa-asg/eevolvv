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
| **archimedes-rebrand** | Rename archimedes.ai → eevolvv/talent | ✅ DONE — talent lives at /talent in main app only |
| **micro-tier** | Corner store / global micro-retail expansion | LONG-TERM PLANNED |
| **global-expansion** | 25M+ micro-retailers worldwide, WhatsApp-first | LONG-TERM PLANNED |

## Key Terms
| Term | Meaning |
|------|---------|
| **Micro tier** | New $29–49/mo subscription for corner stores, kirana, sari-sari, bodegas |
| **eevolvv/talent** | Rebranded Archimedes — micro-contracting + micro-consulting platform |
| **forever customer** | Retention model: AI learns the store so deeply switching is prohibitive |
| **SHEET labels** | FIXED: A-09, A-99 removed. R-01/D-01 are intentional UI reference codes |
| **diagnostic engine** | The AI chat at /diagnostic — true AI conversation via ChatEngine.tsx |
| **the monkey logo** | eevolvv logo = evolution strip of primates; smallest monkey = eevolvv/talent logo |
| **Archimedes** | Project being absorbed into eevolvv as the "talent" sub-brand |
| **WhatsApp-first** | Delivery mechanism for Micro tier in emerging markets |

## Tech Stack (eevolvv.com)
| Layer | What |
|-------|------|
| Framework | Next.js (App Router), TypeScript, Tailwind |
| AI | Anthropic claude-sonnet-4-6 via `@anthropic-ai/sdk` |
| DB | Supabase (submissions table, rate limiting) |
| Email | Resend + react-email (`/emails/EvolutionReport`) |
| Hosting | Vercel |
| Fonts | Space Grotesk, JetBrains Mono, serif var |

## Key Files
| File | Purpose |
|------|---------|
| `app/page.tsx` | Entire homepage — Hero, Stats, Problem, Process, WhoItsFor, Pricing, DiagnosticForm, Footer |
| `components/ChatEngine.tsx` | True AI diagnostic chat engine (replaces static form) |
| `app/api/diagnostic/route.ts` | POST handler → Claude → Supabase → Resend |
| `app/privacy/page.tsx` | Privacy Policy page (live at /privacy) |
| `app/terms/page.tsx` | Terms of Service page (live at /terms) |
| `lib/diagnosticPrompts.ts` | System prompts + 14 industry context blocks |
| `lib/rateLimit.ts` | IP-based rate limiting (3/hr, also checked against Supabase) |
| `lib/supabase.ts` | DB client + saveSubmission / markEmailSent helpers |
| `public/brand-logo.png` | Evolution strip logo (695×359) |
| `eevolvv-service-agreement.docx` | Client service agreement template |

## Current Known Issues
1. Rate limit 3/hr per IP — needs session-based or user-auth upgrade
2. `RESEND_API_KEY` not set in `.env.local` — emails won't send locally
3. `SUPABASE_SERVICE_ROLE_KEY` not set — some admin operations unavailable

## Env Vars (set in .env.local AND Vercel dashboard)
| Var | Status |
|-----|--------|
| `ANTHROPIC_API_KEY` | ✅ Set |
| `SUPABASE_URL` | ✅ Set |
| `SUPABASE_ANON_KEY` | ✅ Set |
| `NEXT_PUBLIC_CALENDLY_URL` | ✅ Set → https://calendly.com/hello-eevolvv |
| `RESEND_API_KEY` | ⚠️ Needs adding |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ Needs adding |

→ Full project details: memory/projects/
→ Full strategy docs: eevolvv_Global_Expansion_Strategy.docx, eevolvv_AI_Audit_Review.docx
