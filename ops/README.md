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
```

Postgres is the queue and the gate. A post can reach `queued`, `scheduled`, or `publishing` only when the clip is approved, source rights are attested, the latest QA run has no failed blocking check, and the latest approval is `approve`. `published` is allowed only from `publishing`. Campaigns cannot go `active` unless `brand_safe` was set by an operator. Submissions are allowed only against active campaigns. Client members cannot forge auto-approvals or read operator tables.

`post_metrics` leaves unknown measurements NULL. The margin view does not treat a missing revenue figure as zero.

## Local checks

Requirements: Postgres 16, Python 3.12, [uv](https://docs.astral.sh/uv/), Node 22, pnpm, ffmpeg with libass.

```bash
cd ops
make test
```

`make test` applies the migrations to a throwaway database, runs the SQL invariant tests, then ruff, mypy `--strict`, pytest, eslint, `tsc --noEmit`, and vitest.

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

Prices in `workers/prices.yaml` are limited to rates checked on 2026-09-24. Speaker diarization is requested from AssemblyAI and is not billed here, because that add-on rate was not verified.

## Not in this tree yet

Operator review UI, client magic-link approval, the posting aggregator, Stripe, and deploy. The upload app is the HTTP front for source intake. Auth is a later Supabase magic link.
