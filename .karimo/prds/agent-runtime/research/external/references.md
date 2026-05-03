# External Research: References

## Anthropic

- [Streaming Messages — Anthropic API Docs](https://platform.claude.com/docs/en/api/streaming) — TypeScript stream pattern, `stream.finalMessage()` for token counts
- [Client SDKs — Anthropic](https://docs.anthropic.com/en/api/client-sdks) — SDK versions and capabilities
- [@anthropic-ai/sdk on npm](https://www.npmjs.com/package/@anthropic-ai/sdk) — Current SDK changelog

## Vercel Cron Jobs

- [Vercel Cron Jobs Overview](https://vercel.com/docs/cron-jobs) — How crons work, cron expression format
- [Cron Jobs Quickstart](https://vercel.com/docs/cron-jobs/quickstart) — vercel.json config, App Router route handler pattern
- [Cron Jobs Usage & Pricing](https://vercel.com/docs/cron-jobs/usage-and-pricing) — Hobby: once/day max; Pro: once/minute max
- [Managing Cron Jobs](https://vercel.com/docs/cron-jobs/manage-cron-jobs) — Monitoring, error handling, local testing

## Webhook Security

- [How to Implement SHA256 Webhook Signature Verification — Hookdeck](https://hookdeck.com/webhooks/guides/how-to-implement-sha256-webhook-signature-verification) — Full HMAC verification walkthrough
- [Validating Webhook Deliveries — GitHub Docs](https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries) — Reference implementation, X-Hub-Signature-256 header
- [Webhook Security: HMAC Signatures — DEV Community](https://dev.to/snappy_tools/webhook-security-how-to-verify-incoming-requests-with-hmac-signatures-2d) — timing-safe comparison pattern
- [Secure Vercel Cron Routes in Next.js 14 — CodingCat.dev](https://codingcat.dev/post/how-to-secure-vercel-cron-job-routes-in-next-js-14-app-router) — CRON_SECRET pattern

## LLM Observability

- [LLM Observability: Tutorial & Best Practices — Patronus AI](https://www.patronus.ai/llm-testing/llm-observability) — What to log in every trace
- [4 Best Tools for Monitoring LLM & Agent Applications — Langwatch](https://langwatch.ai/blog/4-best-tools-for-monitoring-llm-agentapplications-in-2026) — Logging architecture patterns
- [The Beginner's Guide to Tracking Token Usage — KDnuggets](https://www.kdnuggets.com/the-beginners-guide-to-tracking-token-usage-in-llm-apps) — Token tracking implementation

## Agent Delivery / Sharing Models (Competitive Reference)

- [Share Your Agent — Relevance AI](https://relevanceai.com/docs/agent/share-your-agent) — Link sharing + iframe embed
- [Chat Embed — Relevance AI](https://relevanceai.com/chat-embed) — Pop-up chat widget pattern
- [Embedded AI — Relevance AI](https://relevanceai.com/features/embed) — Full embed feature overview
- [Build AI Teammates — Zapier Agents](https://zapier.com/agents) — Zapier's agent delivery model
- [Power your product with Zapier — Developer Platform](https://zapier.com/developer-platform) — API key + embed approach

## Next.js Streaming

- [Real-time AI in Next.js: Vercel AI SDK Streaming — LogRocket](https://blog.logrocket.com/nextjs-vercel-ai-sdk-streaming/) — SSE streaming patterns
- [Building AI Applications with Anthropic SDK and Next.js — Mehd.ir](https://mehd.ir/posts/building-ai-applications-with-anthropics-sdk-and-nextjs) — Direct SDK integration reference
