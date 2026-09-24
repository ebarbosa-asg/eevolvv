import Link from "next/link";

import { loadClipReview, metadataLabel, previewLabel, reviewPoolFromEnv } from "@/lib/review";

export const dynamic = "force-dynamic";

export default async function ClipReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ clipId: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { clipId } = await params;
  const query = await searchParams;
  if (!process.env.DATABASE_URL) {
    return (
      <main>
        <p className="kicker">ops · review</p>
        <h1>Clip</h1>
        <p>Database is not configured.</p>
      </main>
    );
  }
  const clip = await loadClipReview(reviewPoolFromEnv(), clipId);
  if (!clip) {
    return (
      <main>
        <p className="kicker">ops · review</p>
        <h1>Clip</h1>
        <p>Clip not found.</p>
      </main>
    );
  }
  return (
    <main>
      <p className="kicker">ops · review</p>
      <h1>{clip.hook ?? "Clip"}</h1>
      <p>
        <Link href="/review">Queue</Link>
      </p>
      {query.error ? <p className="error">{query.error}</p> : null}
      {query.saved ? <p>Decision recorded.</p> : null}
      <section className="card">
        <dl>
          <dt>Client</dt>
          <dd>{clip.clientName}</dd>
          <dt>Status</dt>
          <dd>{clip.status}</dd>
          <dt>Preview</dt>
          <dd>{previewLabel(clip.storageKey, clip.thumbKey)}</dd>
          <dt>Transcript</dt>
          <dd>{clip.excerpt}</dd>
          <dt>Operator</dt>
          <dd>{clip.operatorDecision ?? "No operator decision recorded."}</dd>
          <dt>Client</dt>
          <dd>{clip.clientDecision ?? "No client decision recorded."}</dd>
        </dl>
        <h2>Metadata</h2>
        <pre>{metadataLabel(clip.metadata)}</pre>
        <h2>QA</h2>
        {clip.qa.length === 0 ? <p>No QA run stored.</p> : null}
        <ul>
          {clip.qa.map((row) => (
            <li key={row.checkCode}>
              {row.checkCode} {row.status}
              {row.blocking ? " blocking" : ""}
            </li>
          ))}
        </ul>
      </section>
      <p className="note">Operator id is checked against the operators table. Session auth is not wired yet.</p>
      <form method="post" action={`/api/review/${clip.clipId}`}>
        <input type="hidden" name="decision" value="approve" />
        <label htmlFor="approve-operator">Operator id</label>
        <input id="approve-operator" name="operatorId" required />
        <button type="submit">Approve</button>
      </form>
      <form method="post" action={`/api/review/${clip.clipId}`}>
        <input type="hidden" name="decision" value="reject" />
        <label htmlFor="reject-operator">Operator id</label>
        <input id="reject-operator" name="operatorId" required />
        <label htmlFor="reject-reason">Reason</label>
        <textarea id="reject-reason" name="reason" required />
        <button type="submit">Reject</button>
      </form>
      <form method="post" action={`/api/review/${clip.clipId}`}>
        <input type="hidden" name="decision" value="changes_requested" />
        <label htmlFor="edit-operator">Operator id</label>
        <input id="edit-operator" name="operatorId" required />
        <label htmlFor="edit-reason">What should change</label>
        <textarea id="edit-reason" name="reason" required />
        <button type="submit">Request edit</button>
      </form>
      <form method="post" action="/api/review/links">
        <input type="hidden" name="clientId" value={clip.clientId} />
        <input type="hidden" name="batchId" value={clip.batchId} />
        <label htmlFor="link-operator">Operator id for the client link</label>
        <input id="link-operator" name="operatorId" required />
        <button type="submit">Issue client link</button>
      </form>
    </main>
  );
}
