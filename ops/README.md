# eevolvv ops

Done-for-you short-form clipping. Creators send a long episode. The pipeline transcribes it, picks moments, reframes to 9:16, burns captions, writes per-platform metadata, and runs a QA gate before a person approves the cut.

This directory is self-contained. The marketing site at the repo root does not import it. `ops/` is excluded from the root TypeScript and ESLint projects so a Vercel preview of the site does not build this app.

## Architecture

```
client upload (apps/app)
  rights checkbox required
  multipart S3 (Cloudflare R2 in production, moto in tests)
  sha256 dedupe per client
  ffprobe rejects audio-only / non-video
        |
        v
jobs table  (FOR UPDATE SKIP LOCKED, backoff, heartbeat, dead-letter + alert)
        |
        v
transcribe  AssemblyAI presigned URL, words + sentences + speakers, cost_events
        |
        v
moments     prompts/moments_v1.md, sentence ids only, snap / dedupe / rank
        |
        v
reframe     speaker turn -> 9:16 crop, or blurred letterbox when face confidence < 0.6
        |
        v
captions + ffmpeg   ASS, brand accent, H.264 High 1080x1920, loudnorm -14 LUFS
        |
        v
metadata    prompts/metadata_v1.md, claims cite sentence ids inside the clip
        |
        v
QA gate     B1 B2 B3 B4 B5 B6 B7 B9 B11 -> needs_review or qa_failed
        |
        v
operator review (apps/app /review) then client magic link (/a/<token>)
        |
        v
posting adapter   dry-run by default; a mock provider in tests
        |
        v
proof export      ops/docs/proof-mapping.md
```

Postgres is the queue and the gate. A clip can reach `approved` only when the latest operator decision and the latest client decision are both `approve`. A post can reach `queued`, `scheduled`, or `publishing` only when the clip is approved, source rights are attested, the latest QA run has no failed blocking check, and both of those decisions are still `approve`. `published` is allowed only from `publishing`. Client decisions require an unused, unexpired magic link for that client and batch; `evv.consume_approval_link` marks the link used after the batch is stored. Campaigns cannot go `active` unless `brand_safe` was set by an operator. Submissions are allowed only against active campaigns. Client members cannot forge auto-approvals, read operator tables, or read magic links.

`post_metrics` leaves unknown measurements NULL. The margin view does not treat a missing revenue figure as zero.

## Local checks

Requirements: Postgres 16, Python 3.12, [uv](https://docs.astral.sh/uv/), Node 22, pnpm, ffmpeg with libass.

```bash
cd ops
make test
```

`make test` applies the migrations to a throwaway database, runs the SQL invariant tests, then ruff, mypy `--strict`, pytest, eslint, `tsc --noEmit`, and vitest.

`make e2e` is the offline smoke: upload, fixture transcript, moments, reframe, captions, render, QA, operator approval, client link, dry-run post, and an empty proof export. It does not call AssemblyAI, Anthropic, or a posting provider.

## Local demo

No API keys. Moments and metadata come from fixtures. The source picture is an ffmpeg `testsrc` with a sine tone. Face boxes are a recorded track so the crop does not depend on a detector guess. Face detection itself is tested against the CC BY 2.5 clip in `fixtures/media/` (see `fixtures/LICENSE.md`).

```bash
cd ops
make demo
```

Outputs land in `ops/demo-out/` (gitignored):

- `source.mp4` — synthetic episode
- `clip-01.mp4`, `clip-02.mp4`, `clip-03.mp4` — 1080×1920 captioned cuts
- `clip-01-frame.png` — one frame from the first cut
- `qa.json` — per-check results

The demo exits non-zero if any blocking QA check fails.

## What is mocked

| Boundary | Default tests | Live |
| --- | --- | --- |
| AssemblyAI | recorded HTTP fixtures via respx | `RUN_LIVE=1` only, not part of `make test` |
| Claude | scripted tool client; prompts are the real files | not called |
| Object storage | moto S3 API and an in-memory store | R2 when `S3_*` env is set |
| Postgres | local Postgres 16 | same |
| ffmpeg / ffprobe | real binaries | real binaries |
| Posting provider | `MockProvider`, dry-run default | no live provider is configured |
| Approval links | HMAC with `APPROVAL_LINK_SECRET` from the environment; tests use a fixture secret | same signing, real secret required |
| Operator sign-in | Supabase Auth OTP shape, `MockOtpProvider` in tests, no email sent | `SUPABASE_URL` and `SUPABASE_ANON_KEY`; missing env denies access |

Prices in `workers/prices.yaml` are limited to rates checked on 2026-09-24. Speaker diarization is requested from AssemblyAI and is not billed here, because that add-on rate was not verified.

## Operator review and client links

`/review` lists clips in `needs_review` whose latest QA run has no failed blocking check. The clip page shows the storage key as the preview, a transcript excerpt, metadata, and the QA rows. Approve, reject, and request-edit each insert an `approvals` row; the database writes the audit row and rejects a reject or request-edit that has no reason. Reject and request-edit also require that reason in the `approvals` check constraint.

Issuing a client link stores only the SHA-256 of the token. The token is `linkId.base64url(hmac)`. The default lifetime is 7 days (`DEFAULT_LINK_TTL_MS`) until a policy replaces it. The client opens `/a/<token>` with no account. One submit covers the batch, then the link is consumed. Email delivery is not wired.

Posting goes through `PostingService`. `dry_run` defaults to true and rolls the gate probe back. A live call records `platform_post_id` and will not call the provider again for that post.

`export_proof_snapshot` writes the site `/proof` JSON from `v_proof_clipping` only. See `docs/proof-mapping.md`. An empty database exports `{ "kpis": [] }`.

Operator sign-in is a Supabase Auth email OTP. The ops app then sets an expiring HttpOnly session cookie. Review actions require that cookie, a matching CSRF token, and a row in `operators`. If `OPERATOR_SESSION_SECRET`, `SUPABASE_URL`, or `SUPABASE_ANON_KEY` is missing, review and sign-in deny access. Tests use `MockOtpProvider` and do not send email.

## Still needs a decision

The go-live list, including which accounts E must open and which pricing pages to check, is `RUNBOOK.md`.

- No posting provider is selected. The live path in tests is `MockProvider`. Dry-run stays the default.
- The proof JSON is not copied into the site repo. `platform_post_id` is stored on the proof view and is not a site KPI.
- Client-link email is not wired.
- Stripe and deploy of this app are not in this tree.
