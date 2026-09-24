import { authConfigured } from "@/lib/session";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  if (!authConfigured()) {
    return (
      <main>
        <p className="kicker">ops · sign in</p>
        <h1>Operator sign in</h1>
        <p>Operator auth is not configured.</p>
      </main>
    );
  }
  return (
    <main>
      <p className="kicker">ops · sign in</p>
      <h1>Operator sign in</h1>
      <p className="note">A one-time code is sent only for an email on the operator allowlist. This app does not send mail in tests.</p>
      <form method="post" action="/api/auth/otp">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
        <button type="submit">Email a code</button>
      </form>
    </main>
  );
}
