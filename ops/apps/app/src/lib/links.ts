import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function approvalSecretFromEnv(): string {
  const secret = process.env.APPROVAL_LINK_SECRET;
  if (!secret) {
    throw new Error("APPROVAL_LINK_SECRET is required");
  }
  return secret;
}

export function signApprovalToken(linkId: string, secret: string): string {
  if (!UUID_RE.test(linkId)) {
    throw new Error("link id must be a uuid");
  }
  if (!secret) {
    throw new Error("APPROVAL_LINK_SECRET is required");
  }
  const mac = createHmac("sha256", secret).update(linkId).digest("base64url");
  return `${linkId}.${mac}`;
}

export function hashApprovalToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Returns the link id when the HMAC matches. A tampered token returns null. */
export function verifyApprovalToken(token: string, secret: string): string | null {
  const dot = token.indexOf(".");
  if (dot < 0 || !secret) {
    return null;
  }
  const linkId = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  if (!UUID_RE.test(linkId) || mac.length === 0) {
    return null;
  }
  const expected = createHmac("sha256", secret).update(linkId).digest();
  const given = Buffer.from(mac, "base64url");
  if (given.length !== expected.length) {
    return null;
  }
  if (!timingSafeEqual(given, expected)) {
    return null;
  }
  return linkId;
}
