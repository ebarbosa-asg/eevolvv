import Link from "next/link";

import { operatorPage } from "@/lib/operator-page";
import { listReviewQueue, previewLabel, reviewPoolFromEnv } from "@/lib/review";

export const dynamic = "force-dynamic";

export default async function ReviewQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const query = await searchParams;
  const operator = await operatorPage();
  if (operator.state === "unconfigured") {
    return (
      <main>
        <p className="kicker">ops · review</p>
        <h1>Operator review</h1>
        <p>Operator auth is not configured.</p>
      </main>
    );
  }
  if (operator.state === "anonymous") {
    return (
      <main>
        <p className="kicker">ops · review</p>
        <h1>Operator review</h1>
        <p>
          <Link href="/login">Sign in</Link>
        </p>
      </main>
    );
  }
  if (operator.state === "denied") {
    return (
      <main>
        <p className="kicker">ops · review</p>
        <h1>Operator review</h1>
        <p>This account is not an operator.</p>
      </main>
    );
  }
  const queue = await listReviewQueue(reviewPoolFromEnv());
  return (
    <main>
      <p className="kicker">ops · review</p>
      <h1>Operator review</h1>
      <p className="note">Clips that passed QA and are waiting on a person. This surface is not part of the marketing site.</p>
      {query.error ? <p className="error">{query.error}</p> : null}
      {queue.length === 0 ? <p>No clips are waiting on operator review.</p> : null}
      {queue.map((item) => (
        <article className="card" key={item.clipId}>
          <h2>{item.hook ?? item.clientName}</h2>
          <p>{item.clientName}</p>
          <p className="note">Preview: {previewLabel(item.storageKey, null)}</p>
          <p>
            <Link href={`/review/${item.clipId}`}>Open</Link>
          </p>
        </article>
      ))}
    </main>
  );
}
