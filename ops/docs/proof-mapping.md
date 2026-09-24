# Proof export mapping

The marketing site's `/proof` page lives on the site rebuild (`lib/proof.ts`, `content/proof/snapshot.json`). This ops tree does not write that file. `evv_workers.proof_export.export_proof_snapshot` prints the JSON a later deploy can copy there.

## Site schema

`lib/proof.ts` parses a strict object:

| Field | Rule |
| --- | --- |
| `kpis` | array, possibly empty |
| `kpis[].id` | non-empty string |
| `kpis[].label` | non-empty string |
| `kpis[].unit` | `"count"` or `"cents"` |
| `kpis[].value` | integer |
| `kpis[].source` | non-empty string |
| `kpis[].asOf` | datetime with a timezone offset |

An empty `kpis` array is what the page renders as "Awaiting first export." `content/proof/snapshot.json` on that branch is `{ "kpis": [] }`.

## What this job emits

Source view: `v_proof_clipping` (migration `0003_review_posting.sql`).

| Site KPI `id` | How it is computed | `unit` | `asOf` |
| --- | --- | --- | --- |
| `published_posts` | count of posts whose status is `published` and that have a real `published_at` | `count` | max `published_at` |
| `views` | sum of recorded `views` | `count` | max `metrics_captured_at` among those rows |
| `likes` | sum of recorded `likes` | `count` | same |
| `comments` | sum of recorded `comments` | `count` | same |
| `shares` | sum of recorded `shares` | `count` | same |
| `watch_time_ms` | sum of recorded `watch_time_ms` | `count` | same |

`source` is always `ops.v_proof_clipping`.

A metric is omitted when every stored value is NULL. A stored `0` stays `0`. Sums skip NULL cells. A draft post does not increment `published_posts`. If a timestamp cannot be formatted with an offset, that KPI is omitted. The job does not call `now()` to fill `asOf`.

With no recorded posts the output is `{ "kpis": [] }`.

`cents` is unused. The proof view has no money column, so this job never emits a cents KPI.

## Not a site KPI

`platform_post_id` is on `v_proof_clipping` because publish records the provider id. The site schema has no post-id field, so the export does not invent a KPI for it. A later schema change can surface it.

The homepage social-proof figures in the marketing site are not read and are not exported.
