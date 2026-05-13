# Research: GitHub Repos — eevolvv Upgrade Opportunities

## Source
Tweet from @roundtablespace — "10 GitHub repos that generate money while you sleep"

## Repos Evaluated

1. AutoHedge — https://github.com/The-Swarm-Corporation/AutoHedge (automated hedge fund)
2. Vibe-Trading — https://github.com/HKUDS/Vibe-Trading (LLM trading signals)
3. Claude Ads — https://github.com/AgriciDaniel/claude-ads (multi-platform ad audit Claude Code skill)
4. Toprank — https://github.com/nowork-studio/toprank (SEO + Google/Meta Ads audit Claude Code skill)
5. Fincept Terminal — https://github.com/Fincept-Corporation/FinceptTerminal (financial data terminal)
6. Agentic Inbox — https://github.com/cloudflare/agentic-inbox (self-hosted AI email inbox on Cloudflare)
7. ClawRouter — https://github.com/BlockRunAI/ClawRouter (smart LLM router, 55+ models, ~92% cost reduction vs Opus)
8. Camofox Browser — https://github.com/jo-inc/camofox-browser (privacy browser)
9. Open Higgsfield AI — https://github.com/Anil-matcha/Open-Generative-AI (open source generative AI)
10. HyperFrames — https://github.com/heygen-com/hyperframes (HTML-to-video framework for AI agents)

## Key Findings

### ClawRouter
- Routes requests across 55+ LLM models locally in <1ms
- Claims ~92% cost savings ($2.05/M tokens vs $25/M for Claude Opus)
- OpenAI-compatible API — drop-in replacement for existing API calls
- Agent-native: crypto micropayments, no API key signup friction
- **eevolvv fit:** High. Drop in front of `/api/diagnostic` route to cut COGS immediately.

### Toprank + Claude Ads
- Both are Claude Code skills (not standalone SaaS)
- Toprank: SEO audits via Google Search Console, keyword research, GEO optimization, Google/Meta Ads analysis
- Claude Ads: 250+ audit checks across Google, Meta, YouTube, LinkedIn, TikTok, Microsoft, Apple Ads
- Generates scored reports (Ads Health Score 0–100)
- **eevolvv fit:** High. Integrate as additional modules in eevolvv's diagnostic report — ad account health + SEO audit sections would significantly increase report perceived value.

### HyperFrames
- HTML → MP4 video renderer built for AI agents
- Supports GSAP, Lottie, Three.js, CSS animations
- Apache 2.0, no per-render fees
- Agent-written HTML becomes video output
- **eevolvv fit:** Medium-High. Generate a 60-sec personalized video summary of each diagnostic report as a premium tier deliverable.

### Agentic Inbox
- Self-hosted email with AI agent that auto-drafts replies
- Built on Cloudflare Durable Objects + R2
- **eevolvv fit:** Low-Medium. Could power automated lead follow-up but not core to product value.

## Prioritized Recommendations for eevolvv

| Priority | Feature | Rationale |
|---|---|---|
| 1 | ClawRouter API routing | Direct cost cut, minimal code change, immediate ROI |
| 2 | Ad + SEO audit in diagnostic report | 3x report value, stays in existing product lane |
| 3 | HyperFrames video report | Premium tier differentiator, fully automated |
