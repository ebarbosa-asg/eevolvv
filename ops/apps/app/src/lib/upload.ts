import { randomUUID } from "node:crypto";

import { sha256Hex } from "./memory";
import { probeBytes } from "./probe";
import { UploadError, type ObjectStore, type UploadDb } from "./types";

export const PART_SIZE = 5 * 1024 * 1024;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface UploadDeps {
  store: ObjectStore;
  db: UploadDb;
  probe?: typeof probeBytes;
}

export interface InitResult {
  uploadId: string;
  key: string;
  partSize: number;
}

export interface CompleteResult {
  assetId: string;
  deduped: boolean;
  jobId: string;
  idempotencyKey: string;
}

function requireUuid(value: unknown, label: string): string {
  if (typeof value !== "string" || !UUID_RE.test(value)) {
    throw new UploadError(`${label} must be a uuid`, 400);
  }
  return value;
}

function requireRights(rightsConfirmed: unknown, confirmedBy: unknown): string {
  if (rightsConfirmed !== true) {
    throw new UploadError("rights checkbox required", 400);
  }
  return requireUuid(confirmedBy, "confirmedBy");
}

function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}

export async function initUpload(
  deps: UploadDeps,
  body: {
    clientId?: unknown;
    filename?: unknown;
    contentType?: unknown;
    rightsConfirmed?: unknown;
    confirmedBy?: unknown;
  },
): Promise<InitResult> {
  const clientId = requireUuid(body.clientId, "clientId");
  requireRights(body.rightsConfirmed, body.confirmedBy);
  const filename = typeof body.filename === "string" && body.filename.trim() ? body.filename.trim() : "source";
  const contentType = typeof body.contentType === "string" ? body.contentType : "application/octet-stream";
  const key = `sources/${clientId}/${randomUUID()}/${filename.replaceAll("/", "_")}`;
  const uploadId = await deps.store.createMultipart(key, contentType);
  return { uploadId, key, partSize: PART_SIZE };
}

export async function uploadPart(
  deps: UploadDeps,
  body: { key?: unknown; uploadId?: unknown; partNumber?: unknown; bodyBase64?: unknown },
): Promise<{ etag: string; partNumber: number }> {
  if (typeof body.key !== "string" || !body.key.startsWith("sources/")) {
    throw new UploadError("key is required", 400);
  }
  if (typeof body.uploadId !== "string" || !body.uploadId) {
    throw new UploadError("uploadId is required", 400);
  }
  if (typeof body.partNumber !== "number" || !Number.isInteger(body.partNumber) || body.partNumber < 1) {
    throw new UploadError("partNumber must be a positive integer", 400);
  }
  if (typeof body.bodyBase64 !== "string" || body.bodyBase64.length === 0) {
    throw new UploadError("bodyBase64 is required", 400);
  }
  const bytes = Buffer.from(body.bodyBase64, "base64");
  if (bytes.byteLength === 0) {
    throw new UploadError("part body is empty", 400);
  }
  const etag = await deps.store.uploadPart(body.key, body.uploadId, body.partNumber, bytes);
  return { etag, partNumber: body.partNumber };
}

export async function completeUpload(
  deps: UploadDeps,
  body: {
    clientId?: unknown;
    key?: unknown;
    uploadId?: unknown;
    parts?: unknown;
    filename?: unknown;
    rightsConfirmed?: unknown;
    confirmedBy?: unknown;
  },
): Promise<CompleteResult> {
  const clientId = requireUuid(body.clientId, "clientId");
  const confirmedBy = requireRights(body.rightsConfirmed, body.confirmedBy);
  if (typeof body.key !== "string" || !body.key.startsWith(`sources/${clientId}/`)) {
    throw new UploadError("key is required", 400);
  }
  if (typeof body.uploadId !== "string" || !body.uploadId) {
    throw new UploadError("uploadId is required", 400);
  }
  if (!Array.isArray(body.parts) || body.parts.length === 0) {
    throw new UploadError("parts are required", 400);
  }
  const parts = body.parts.map((part) => {
    if (typeof part !== "object" || part === null) {
      throw new UploadError("invalid part", 400);
    }
    const record = part as { partNumber?: unknown; etag?: unknown };
    if (typeof record.partNumber !== "number" || typeof record.etag !== "string") {
      throw new UploadError("invalid part", 400);
    }
    return { partNumber: record.partNumber, etag: record.etag };
  });
  const filename = typeof body.filename === "string" && body.filename.trim() ? body.filename.trim() : "source";
  try {
    await deps.store.completeMultipart(body.key, body.uploadId, parts);
  } catch (error) {
    await deps.store.abortMultipart(body.key, body.uploadId).catch(() => undefined);
    throw error;
  }
  const bytes = await deps.store.getBytes(body.key);
  const digest = sha256Hex(bytes);
  const existing = await deps.db.findAssetByHash(clientId, digest);
  if (existing) {
    await deps.store.deleteObject(body.key);
    const job = await deps.db.enqueueTranscribe(existing.id, clientId);
    return {
      assetId: existing.id,
      deduped: true,
      jobId: job.id,
      idempotencyKey: job.idempotencyKey,
    };
  }
  const probe = await (deps.probe ?? probeBytes)(bytes);
  let asset;
  try {
    asset = await deps.db.insertAsset({
      clientId,
      sha256: digest,
      storageKey: body.key,
      filename,
      durationMs: Math.round(probe.durationS * 1000),
      width: probe.width,
      height: probe.height,
      confirmedBy,
    });
  } catch (error) {
    if (!isUniqueViolation(error)) {
      throw error;
    }
    const raced = await deps.db.findAssetByHash(clientId, digest);
    if (!raced) {
      throw error;
    }
    await deps.store.deleteObject(body.key);
    const job = await deps.db.enqueueTranscribe(raced.id, clientId);
    return { assetId: raced.id, deduped: true, jobId: job.id, idempotencyKey: job.idempotencyKey };
  }
  const job = await deps.db.enqueueTranscribe(asset.id, clientId);
  return { assetId: asset.id, deduped: false, jobId: job.id, idempotencyKey: job.idempotencyKey };
}
