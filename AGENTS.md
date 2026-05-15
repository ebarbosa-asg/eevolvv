# eevolvv

## Project
eevolvv, Inc. — Delaware C Corp. AI business transformation platform.
- Codebase: `/Users/loko/eevolvv` (single Next.js app)
- Production: eevolvv.com (Vercel, auto-deploy on push to main)
- Stack: Next.js, TypeScript, Tailwind, Supabase, Anthropic, Resend
- Toll-free: +1 (844) 433-8658 (Grasshopper)

## Key Routes
- `/` — main AI transformation site
- `/privacy` — privacy policy (eevolvv, Inc., Delaware)
- `/terms` — terms of service
- `/contact` — TCPA-compliant SMS opt-in contact form → POST /api/contact → Resend

## Conventions
- Entity name: always "eevolvv, Inc." in legal/UI copy
- Governing law: Delaware
- Use `apps/talent/*` paths for talent sub-routes (they live at /talent/*)
- Run `pnpm dev` to start local dev server
- Run `pnpm build` before pushing to verify clean build
- After every push, Vercel auto-deploys — production is live in ~60s

## Current Branch / State
- Check `git status` and `git log --oneline -5` at session start
- Pending: merge feature/memory-bridge-client, clean stale worktrees

## What NOT to do
- Do not hardcode "eevolvv" without ", Inc." in legal copy
- Do not create new worktrees without cleaning up stale ones first
- Do not use `mcp__claude-in-chrome__*` tools — use `/browse` skill instead
