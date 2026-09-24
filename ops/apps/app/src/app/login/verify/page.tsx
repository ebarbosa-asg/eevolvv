import { authConfigured } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; error?: string }>;
}) {
  const query = await searchParams;
  if (!authConfigured()) {
    return (
      <main>
        <p className="kicker">ops · sign in</p>
        <h1>Enter the code</h1>
        <p>Operator auth is not configured.</p>
      </main>
    );
  }
  return (
    <main>
      <p className="kicker">ops · sign in</p>
      <h1>Enter the code</h1>
      {query.error ? <p className="error">{query.error}</p> : null}
      <form method="post" action="/api/auth/verify">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required defaultValue={query.email ?? ""} />
        <label htmlFor="token">Code</label>
        <input id="token" name="token" required autoComplete="one-time-code" />
        <button type="submit">Sign in</button>
      </form>
    </main>
  );
}
