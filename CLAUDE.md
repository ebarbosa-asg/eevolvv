# eevolvv — Working Memory

## The Business
eevolvv is an AI-native business transformation service. Tagline: **"A service, not software."**
Core brand truth: **"eevolvving forward, together."**
Owner: E (Eduardo Barbosa) — eduardocbarbosa1998@gmail.com

## Active Projects
| Name | What | Status |
|------|------|--------|
| **homepage-v2** | Full page redesign + true AI chat engine | SHORT-TERM NOW |
| **archimedes-rebrand** | Rename archimedes.ai → eevolvv/talent | SHORT-TERM NOW |
| **micro-tier** | Corner store / global micro-retail expansion | LONG-TERM PLANNED |
| **global-expansion** | 25M+ micro-retailers worldwide, WhatsApp-first | LONG-TERM PLANNED |

## Key Terms
| Term | Meaning |
|------|---------|
| **Micro tier** | New $29–49/mo subscription for corner stores, kirana, sari-sari, bodegas |
| **eevolvv/talent** | Rebranded Archimedes — micro-contracting + micro-consulting platform |
| **forever customer** | Retention model: AI learns the store so deeply switching is prohibitive |
| **SHEET labels** | Bug: "SHEET A-09", "SHEET A-02", "SHEET A-99" — dev labels left in production, MUST FIX |
| **diagnostic engine** | The AI chat at /diagnostic — currently a static 12-Q form, needs true AI conversation |
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
| `app/page.tsx` | Entire homepage (1422 lines — Hero, Stats, Problem, Process, WhoItsFor, Pricing, DiagnosticForm, Footer) |
| `app/api/diagnostic/route.ts` | POST handler → Claude → Supabase → Resend |
| `lib/diagnosticPrompts.ts` | System prompts + 14 industry context blocks |
| `lib/rateLimit.ts` | IP-based rate limiting (3/hr, also checked against Supabase) |
| `lib/supabase.ts` | DB client + saveSubmission / markEmailSent helpers |
| `public/brand-logo.png` | Evolution strip logo (695×359) |

## Current Known Bugs
1. "SHEET A-09 · CALL TO ACTION" visible in CTAClose component (line 1346 page.tsx)
2. "SHEET A-02 · MARKET TELEMETRY" in Stats (line 703) — internal, acceptable to keep or remove
3. "SHEET A-99 · DAY 60 AUDIT" in Footer (line 1390) — same
4. Post-report CTA is mailto: link only — needs Calendly embed
5. Rate limit 3/hr per IP — needs session-based or user-auth upgrade

→ Full project details: memory/projects/
→ Full strategy docs: eevolvv_Global_Expansion_Strategy.docx, eevolvv_AI_Audit_Review.docx
