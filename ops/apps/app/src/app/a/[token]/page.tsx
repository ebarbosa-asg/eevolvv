import { approvalSecretFromEnv } from "@/lib/links";
import { loadClientBatch, metadataLabel, previewLabel, reviewPoolFromEnv } from "@/lib/review";

export const dynamic = "force-dynamic";

export default async function ClientApprovalPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string; done?: string }>;
}) {
  const { token } = await params;
  const query = await searchParams;
  if (!process.env.DATABASE_URL || !process.env.APPROVAL_LINK_SECRET) {
    return (
      <main>
        <p className="kicker">ops · client</p>
        <h1>Clip approval</h1>
        <p>Database is not configured.</p>
      </main>
    );
  }
  const batch = await loadClientBatch(reviewPoolFromEnv(), token, approvalSecretFromEnv());
  return (
    <main>
      <p className="kicker">ops · client</p>
      <h1>Clip approval</h1>
      <p className="note">No account is required. This link works once.</p>
      {query.error ? <p className="error">{query.error}</p> : null}
      {batch.state === "invalid" ? <p>This link is not valid.</p> : null}
      {batch.state === "expired" ? <p>This link has expired.</p> : null}
      {batch.state === "used" ? <p>{query.done ? "Decision recorded. This link cannot be used again." : "This link was already used."}</p> : null}
      {batch.state === "ok" ? (
        <form method="post" action={`/api/approve/${token}`}>
          <p>{batch.clientName}</p>
          {batch.clips.length === 0 ? <p>No clips are waiting in this batch.</p> : null}
          {batch.clips.map((clip) => (
            <article className="card" key={clip.clipId}>
              <h2>{clip.hook ?? "Clip"}</h2>
              <p>Preview: {previewLabel(clip.storageKey, null)}</p>
              <p>{clip.excerpt}</p>
              <pre>{metadataLabel(clip.metadata)}</pre>
              <ul>
                {clip.qa.map((row) => (
                  <li key={row.checkCode}>
                    {row.checkCode} {row.status}
                  </li>
                ))}
              </ul>
              <label htmlFor={`decision-${clip.clipId}`}>Decision</label>
              <select id={`decision-${clip.clipId}`} name={`decision-${clip.clipId}`} defaultValue="approve">
                <option value="approve">Approve</option>
                <option value="changes_requested">Request changes</option>
                <option value="reject">Reject</option>
              </select>
              <label htmlFor={`reason-${clip.clipId}`}>Reason, required to reject or request changes</label>
              <textarea id={`reason-${clip.clipId}`} name={`reason-${clip.clipId}`} />
            </article>
          ))}
          {batch.clips.length > 0 ? <button type="submit">Submit</button> : null}
        </form>
      ) : null}
    </main>
  );
}
