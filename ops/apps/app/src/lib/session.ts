import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "evv_op";
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

export class AuthError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export type Session = {
  sub: string;
  csrf: string;
  exp: number;
};

type OpenResult = { ok: true; session: Session } | { ok: false; reason: "missing" | "invalid" | "expired" };

export function authConfigured(): boolean {
  return Boolean(sessionSecret() && process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}

export function sessionSecret(): string {
  return process.env.OPERATOR_SESSION_SECRET ?? "";
}

export function requireAuthEnv(): { secret: string; supabaseUrl: string; supabaseAnonKey: string } {
  const secret = sessionSecret();
  const supabaseUrl = process.env.SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? "";
  if (!secret || !supabaseUrl || !supabaseAnonKey) {
    throw new AuthError("operator auth is not configured", 503);
  }
  return { secret, supabaseUrl, supabaseAnonKey };
}

export function signSession(session: Session, secret: string): string {
  if (!secret) {
    throw new AuthError("operator auth is not configured", 503);
  }
  const body = Buffer.from(JSON.stringify(session)).toString("base64url");
  const mac = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${mac}`;
}

export function openSession(token: string, secret: string, now = Date.now()): OpenResult {
  if (!secret || !token) {
    return { ok: false, reason: "missing" };
  }
  const dot = token.indexOf(".");
  if (dot <= 0) {
    return { ok: false, reason: "invalid" };
  }
  const body = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = createHmac("sha256", secret).update(body).digest();
  const given = Buffer.from(mac, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return { ok: false, reason: "invalid" };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return { ok: false, reason: "invalid" };
  }
  if (typeof parsed !== "object" || parsed === null) {
    return { ok: false, reason: "invalid" };
  }
  const row = parsed as { sub?: unknown; csrf?: unknown; exp?: unknown };
  if (typeof row.sub !== "string" || typeof row.csrf !== "string" || typeof row.exp !== "number") {
    return { ok: false, reason: "invalid" };
  }
  if (row.exp <= now) {
    return { ok: false, reason: "expired" };
  }
  return { ok: true, session: { sub: row.sub, csrf: row.csrf, exp: row.exp } };
}

export function issueSession(sub: string, secret: string, now = Date.now()): { token: string; session: Session } {
  const session = { sub, csrf: randomBytes(32).toString("base64url"), exp: now + SESSION_TTL_MS };
  return { token: signSession(session, secret), session };
}

export function sessionCookie(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}${secure}`;
}

export function readCookie(header: string | null, name: string): string {
  if (!header) {
    return "";
  }
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) {
      return rest.join("=");
    }
  }
  return "";
}

export function csrfMatches(expected: string, provided: string): boolean {
  if (!expected || !provided) {
    return false;
  }
  const left = Buffer.from(expected);
  const right = Buffer.from(provided);
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}
