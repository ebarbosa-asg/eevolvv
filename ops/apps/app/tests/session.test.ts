import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Client, Pool } from "pg";
import { afterAll, beforeAll, expect, it } from "vitest";

import { POST as reviewPost } from "../src/app/api/review/[clipId]/route";
import { closeReviewPool } from "../src/lib/review";
import { requestOperatorOtp, requireOperator } from "../src/lib/operator-auth";
import { MockOtpProvider, SupabaseOtpProvider } from "../src/lib/otp";
import { issueSession, requireAuthEnv, SESSION_COOKIE, signSession } from "../src/lib/session";

const SECRET = "test-operator-session-secret";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const dbName = `evv_auth_${randomUUID().replaceAll("-", "").slice(0, 12)}`;

function adminConfig(): string | { host: string; database: string } {
  const raw = process.env.DATABASE_URL;
  if (raw && raw.startsWith("postgres")) {
    const url = new URL(raw);
    url.pathname = "/postgres";
    return url.toString();
  }
  return { host: "/var/run/postgresql", database: "postgres" };
}

function databaseUrl(name: string): string {
  const raw = process.env.DATABASE_URL;
  if (raw && raw.startsWith("postgres")) {
    const url = new URL(raw);
    url.pathname = `/${name}`;
    return url.toString();
  }
  return `postgresql:///${name}?host=/var/run/postgresql`;
}

function psql(target: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("psql", [target, "-v", "ON_ERROR_STOP=1", "-q", ...args], { stdio: ["ignore", "pipe", "pipe"] });
    const err: Buffer[] = [];
    child.stderr.on("data", (chunk: Buffer) => err.push(chunk));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(Buffer.concat(err).toString("utf8") || `psql exited ${code ?? "null"}`));
    });
  });
}

let database = "";
let pool: Pool | undefined;
const saved = {
  DATABASE_URL: process.env.DATABASE_URL,
  OPERATOR_SESSION_SECRET: process.env.OPERATOR_SESSION_SECRET,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
};

function db(): Pool {
  if (!pool) throw new Error("database is not ready");
  return pool;
}

beforeAll(async () => {
  const admin = new Client(typeof adminConfig() === "string" ? { connectionString: adminConfig() as string } : adminConfig());
  await admin.connect();
  await admin.query(`CREATE DATABASE "${dbName}"`);
  await admin.end();
  database = databaseUrl(dbName);
  for (const file of ["0001_core.sql", "0002_proof.sql", "0003_review_posting.sql"]) {
    await psql(database, ["-f", path.join(root, "supabase/migrations", file)]);
  }
  process.env.DATABASE_URL = database;
  process.env.OPERATOR_SESSION_SECRET = SECRET;
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_ANON_KEY = "test-anon-key";
  pool = new Pool({ connectionString: database });
}, 60_000);

afterAll(async () => {
  await closeReviewPool();
  await pool?.end();
  process.env.DATABASE_URL = saved.DATABASE_URL;
  process.env.OPERATOR_SESSION_SECRET = saved.OPERATOR_SESSION_SECRET;
  process.env.SUPABASE_URL = saved.SUPABASE_URL;
  process.env.SUPABASE_ANON_KEY = saved.SUPABASE_ANON_KEY;
  const admin = new Client(typeof adminConfig() === "string" ? { connectionString: adminConfig() as string } : adminConfig());
  await admin.connect();
  await admin.query(`DROP DATABASE IF EXISTS "${dbName}" WITH (FORCE)`);
  await admin.end();
});

it("denies operator auth when the session env is missing and does not call Supabase", async () => {
  const previous = process.env.OPERATOR_SESSION_SECRET;
  delete process.env.OPERATOR_SESSION_SECRET;
  let called = false;
  const original = globalThis.fetch;
  globalThis.fetch = async () => {
    called = true;
    return new Response("{}", { status: 200 });
  };
  try {
    expect(() => requireAuthEnv()).toThrow(/not configured/);
    const response = await reviewPost(new Request("http://localhost/api/review/00000000-0000-4000-8000-000000000001", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ decision: "approve", csrf: "x" }),
    }), { params: Promise.resolve({ clipId: "00000000-0000-4000-8000-000000000001" }) });
    expect(response.status).toBe(503);
    expect(called).toBe(false);
  } finally {
    process.env.OPERATOR_SESSION_SECRET = previous;
    globalThis.fetch = original;
  }
});

it("sends a Supabase OTP request without putting the anon key in the error", async () => {
  const calls: { url: string; body: string; authorization: string }[] = [];
  const provider = new SupabaseOtpProvider("https://example.supabase.co", "super-secret-anon", async (url, init) => {
    calls.push({
      url,
      body: String(init?.body ?? ""),
      authorization: new Headers(init?.headers).get("authorization") ?? "",
    });
    return new Response("upstream failed", { status: 500 });
  });
  await expect(provider.send("op@example.com")).rejects.toThrow(/otp was not sent/);
  expect(calls[0]?.url).toBe("https://example.supabase.co/auth/v1/otp");
  expect(calls[0]?.body).toContain('"create_user":false');
  expect(calls[0]?.authorization).toBe("Bearer super-secret-anon");
  try {
    await provider.send("op@example.com");
  } catch (error) {
    expect(error instanceof Error ? error.message : "").not.toContain("super-secret-anon");
  }
});

it("does not send an OTP for an email that is not allowlisted", async () => {
  const provider = new MockOtpProvider(new Map());
  const result = await requestOperatorOtp(db(), provider, "stranger@example.com");
  expect(result.delivered).toBe(false);
  expect(provider.sent).toEqual([]);
});

async function seedClip(): Promise<{ operatorId: string; clipId: string; email: string }> {
  const operatorId = randomUUID();
  const email = `op-${operatorId.slice(0, 8)}@example.com`;
  const clientId = randomUUID();
  const clipId = randomUUID();
  const admin = new Client({ connectionString: database });
  await admin.connect();
  await admin.query("INSERT INTO operators (user_id, email) VALUES ($1, $2)", [operatorId, email]);
  await admin.query("INSERT INTO clients (id, name) VALUES ($1, 'auth client')", [clientId]);
  const asset = await admin.query<{ id: string }>(
    `INSERT INTO source_assets (client_id, sha256, storage_key, has_video, rights_confirmed_at, rights_confirmed_by)
     VALUES ($1, $2, 'sources/auth', true, now(), $3) RETURNING id`,
    [clientId, randomUUID().replaceAll("-", "") + randomUUID().replaceAll("-", "").slice(0, 32), operatorId],
  );
  const batch = await admin.query<{ id: string }>(
    "INSERT INTO batches (client_id, source_asset_id) VALUES ($1, $2) RETURNING id",
    [clientId, asset.rows[0]?.id],
  );
  await admin.query("INSERT INTO clips (id, batch_id, status, qa_run) VALUES ($1, $2, 'needs_review', 1)", [
    clipId,
    batch.rows[0]?.id,
  ]);
  await admin.query(
    "INSERT INTO qa_results (clip_id, qa_run, check_code, blocking, status) VALUES ($1, 1, 'B1', true, 'pass')",
    [clipId],
  );
  await admin.end();
  return { operatorId, clipId, email };
}

function reviewRequest(clipId: string, token: string, body: Record<string, unknown>, csrfHeader?: string): Request {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    cookie: `${SESSION_COOKIE}=${token}`,
  };
  if (csrfHeader) headers["x-csrf-token"] = csrfHeader;
  return new Request(`http://localhost/api/review/${clipId}`, { method: "POST", headers, body: JSON.stringify(body) });
}

it("approves as the session operator and ignores an operator id in the body", async () => {
  const seeded = await seedClip();
  const other = randomUUID();
  await db().query("INSERT INTO operators (user_id, email) VALUES ($1, $2)", [other, "other@example.com"]);
  const issued = issueSession(seeded.operatorId, SECRET);
  const response = await reviewPost(
    reviewRequest(seeded.clipId, issued.token, { decision: "approve", operatorId: other, csrf: issued.session.csrf }),
    { params: Promise.resolve({ clipId: seeded.clipId }) },
  );
  expect(response.status).toBe(200);
  const decided = await db().query<{ decided_by: string }>(
    "SELECT decided_by FROM approvals WHERE clip_id = $1 AND actor_role = 'operator'",
    [seeded.clipId],
  );
  expect(decided.rows[0]?.decided_by).toBe(seeded.operatorId);
});

it("rejects a non-allowlisted session, an expired session, and a missing CSRF token", async () => {
  const seeded = await seedClip();
  const outsider = issueSession(randomUUID(), SECRET);
  await expect(requireOperator(SECRET, reviewRequest(seeded.clipId, outsider.token, {}), outsider.session.csrf, db())).rejects.toMatchObject({
    message: "operator is not allowlisted",
    status: 403,
  });

  const expiredToken = signSession({ sub: seeded.operatorId, csrf: "csrf-token", exp: Date.now() - 1000 }, SECRET);
  await expect(requireOperator(SECRET, reviewRequest(seeded.clipId, expiredToken, {}), "csrf-token", db())).rejects.toMatchObject({
    message: "session is expired",
    status: 401,
  });

  const current = issueSession(seeded.operatorId, SECRET);
  const response = await reviewPost(
    reviewRequest(seeded.clipId, current.token, { decision: "approve" }),
    { params: Promise.resolve({ clipId: seeded.clipId }) },
  );
  expect(response.status).toBe(403);
  const payload = (await response.json()) as { error: string };
  expect(payload.error).toBe("csrf token is required");
  const rows = await db().query("SELECT id FROM approvals WHERE clip_id = $1", [seeded.clipId]);
  expect(rows.rowCount).toBe(0);
});
