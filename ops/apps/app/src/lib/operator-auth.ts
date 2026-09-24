import type { Pool } from "pg";

import { MockOtpProvider, SupabaseOtpProvider, type OtpProvider, type VerifiedOperator } from "./otp";
import {
  AuthError,
  csrfMatches,
  openSession,
  readCookie,
  requireAuthEnv,
  SESSION_COOKIE,
  type Session,
} from "./session";

export async function isAllowlisted(pool: Pool, userId: string): Promise<boolean> {
  const result = await pool.query("SELECT 1 FROM operators WHERE user_id = $1", [userId]);
  return (result.rowCount ?? 0) === 1;
}

export async function operatorIdForEmail(pool: Pool, email: string): Promise<string | null> {
  const result = await pool.query<{ user_id: string }>(
    "SELECT user_id FROM operators WHERE email IS NOT NULL AND lower(email) = lower($1)",
    [email],
  );
  if ((result.rowCount ?? 0) !== 1) {
    return null;
  }
  return result.rows[0]?.user_id ?? null;
}

/** Sends an OTP only when the email is on exactly one operator row. No email is sent by the mock. */
export async function requestOperatorOtp(pool: Pool, provider: OtpProvider, email: string): Promise<{ delivered: boolean }> {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) {
    throw new AuthError("email is required", 400);
  }
  const operatorId = await operatorIdForEmail(pool, normalized);
  if (!operatorId) {
    return { delivered: false };
  }
  await provider.send(normalized);
  return { delivered: true };
}

export async function verifyOperatorOtp(
  pool: Pool,
  provider: OtpProvider,
  email: string,
  token: string,
): Promise<VerifiedOperator> {
  const verified = await provider.verify(email.trim().toLowerCase(), token.trim());
  const allowed = await isAllowlisted(pool, verified.userId);
  if (!allowed) {
    throw new AuthError("operator is not allowlisted", 403);
  }
  const expected = await operatorIdForEmail(pool, verified.email);
  if (expected !== verified.userId) {
    throw new AuthError("operator is not allowlisted", 403);
  }
  return verified;
}

export function providerFromEnv(): OtpProvider {
  const env = requireAuthEnv();
  return new SupabaseOtpProvider(env.supabaseUrl, env.supabaseAnonKey);
}

export function mockProvider(users: Map<string, string>): MockOtpProvider {
  return new MockOtpProvider(users);
}

export async function requireOperator(secret: string, request: Request, csrf: string, pool: Pool): Promise<Session> {
  if (!secret) {
    throw new AuthError("operator auth is not configured", 503);
  }
  const opened = openSession(readCookie(request.headers.get("cookie"), SESSION_COOKIE), secret);
  if (!opened.ok) {
    if (opened.reason === "expired") {
      throw new AuthError("session is expired", 401);
    }
    throw new AuthError("session is required", 401);
  }
  const allowed = await isAllowlisted(pool, opened.session.sub);
  if (!allowed) {
    throw new AuthError("operator is not allowlisted", 403);
  }
  if (!csrf) {
    throw new AuthError("csrf token is required", 403);
  }
  if (!csrfMatches(opened.session.csrf, csrf)) {
    throw new AuthError("csrf token does not match", 403);
  }
  return opened.session;
}
