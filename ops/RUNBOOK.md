# eevolvv ops go-live

Do not invent a price in this file. Open the linked page and confirm the current rate before paying for anything. Rates already checked into `workers/prices.yaml` are historical; if the vendor page disagrees, update that file from the page and set a new `verified_on` date.

Nothing in `make test` or `make e2e` calls these vendors. Dry-run posting stays the default until a provider is chosen.

## Accounts and environment

| Env | What E supplies | Where to confirm what it costs |
| --- | --- | --- |
| `OPERATOR_SESSION_SECRET` | A long random secret generated locally. Signs the operator session cookie. | No vendor. |
| `APPROVAL_LINK_SECRET` | A long random secret generated locally. Signs client approval links. | No vendor. |
| `SUPABASE_URL` | Project URL from the Supabase dashboard. | [Supabase pricing](https://supabase.com/pricing) |
| `SUPABASE_ANON_KEY` | The anon key for that project. Used only as the Auth OTP client. | Same Supabase page. |
| `DATABASE_URL` | Postgres connection string for that project. The app role must bypass RLS the way `evv_service` does, or review writes cannot land. | Included with the Supabase project. Confirm database pricing on the same page. |
| `ASSEMBLYAI_API_KEY` | An AssemblyAI API key. Live transcription is not part of `make test`. | [AssemblyAI pricing](https://www.assemblyai.com/pricing). The speech-model table used for `prices.yaml` is [AssemblyAI models](https://www.assemblyai.com/docs/getting-started/models). Speaker diarization is requested and is not in `prices.yaml`; confirm that add-on on the pricing page before expecting it on an invoice. |
| `ANTHROPIC_API_KEY` | An Anthropic API key for live moment and metadata calls. Tests use the fixture tool client. | [Claude API pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| `S3_BUCKET` | Bucket name. Production target is Cloudflare R2. | [R2 pricing](https://developers.cloudflare.com/r2/pricing/) |
| `S3_ENDPOINT_URL` | R2 S3 endpoint for the account. | Same R2 page. |
| `S3_REGION` | `auto` for R2 unless the dashboard says otherwise. | Same R2 page. |
| `S3_ACCESS_KEY_ID` | R2 access key. | Same R2 page. Storage keys are not a separate product. |
| `S3_SECRET_ACCESS_KEY` | R2 secret. Never commit it. | Same R2 page. |
| Operator email OTP | Create each operator in Supabase Auth first, with `create_user` left false. Copy that user's id into `operators.user_id` and the same email into `operators.email`. Supabase's built-in mailer is rate-limited; custom SMTP is the path when that is not enough. | [Supabase pricing](https://supabase.com/pricing) and [custom SMTP for Auth](https://supabase.com/docs/guides/auth/auth-smtp). Confirm mail limits there. Do not copy a number into this repo. |
| Client-link email | Not wired. The ops app shows the link once to the operator. If E chooses Resend, which the marketing site already uses, open its pricing page before sending. | [Resend pricing](https://resend.com/pricing) |
| Posting provider | Not chosen. `PostingService` defaults to dry-run. A live provider must be named, and its pricing page opened, before `dry_run` is turned off. | No URL until E picks the vendor. Write that URL here before any live post. |

`make test` and `make e2e` must stay green with these unset. A missing `OPERATOR_SESSION_SECRET`, `SUPABASE_URL`, or `SUPABASE_ANON_KEY` denies operator sign-in and review actions.

## Checklist

1. Open [Supabase pricing](https://supabase.com/pricing) and create the project. Apply `ops/supabase/migrations` in order.
2. Generate `OPERATOR_SESSION_SECRET` and `APPROVAL_LINK_SECRET`. Put them in the ops host env, not in git.
3. Set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `DATABASE_URL` from that project.
4. Create each operator in Supabase Auth. Insert the same user id and email into `operators`. Confirm Auth email behavior on [the SMTP guide](https://supabase.com/docs/guides/auth/auth-smtp).
5. Open [AssemblyAI pricing](https://www.assemblyai.com/pricing) and [the models table](https://www.assemblyai.com/docs/getting-started/models). Set `ASSEMBLYAI_API_KEY` only after the speech-model rate matches or updates `workers/prices.yaml`.
6. Open [Claude API pricing](https://platform.claude.com/docs/en/about-claude/pricing). Set `ANTHROPIC_API_KEY` only after the token rates match or update `workers/prices.yaml`.
7. Open [R2 pricing](https://developers.cloudflare.com/r2/pricing/). Create the bucket and set `S3_BUCKET`, `S3_ENDPOINT_URL`, `S3_REGION`, `S3_ACCESS_KEY_ID`, and `S3_SECRET_ACCESS_KEY`.
8. Decide how client approval links are delivered. Until that exists, an operator copies the one-time path from the review page. If the choice is Resend, open [Resend pricing](https://resend.com/pricing) first.
9. Choose a posting provider and open that vendor's pricing page. Leave dry-run on until the choice is written into this runbook. The first live post should be one clip, then confirm `platform_post_id` shows on `v_proof_clipping`.
10. Run `make test` and `make e2e` on the release commit. Both stay offline.
11. Deploy the ops app. Hit `/login` and confirm a non-allowlisted email does not receive a code. Confirm `/review` shows "Operator auth is not configured" on any host missing the session env.
12. Run `export_proof_snapshot` against the live database before the first real post. The file must be `{ "kpis": [] }` until a post and its metrics are actually stored. Copy that JSON into the site `content/proof/snapshot.json` only as a separate deploy.
