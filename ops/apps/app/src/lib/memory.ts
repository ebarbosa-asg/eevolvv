import { createHash, randomUUID } from "node:crypto";

import type { EnqueuedJob, ObjectPart, ObjectStore, SourceAsset, UploadDb } from "./types";

export class MemoryStore implements ObjectStore {
  private readonly uploads = new Map<string, Map<number, Uint8Array>>();
  private readonly objects = new Map<string, Uint8Array>();

  async createMultipart(key: string, _contentType: string): Promise<string> {
    const uploadId = randomUUID();
    this.uploads.set(`${key}:${uploadId}`, new Map());
    return uploadId;
  }

  async uploadPart(key: string, uploadId: string, partNumber: number, body: Uint8Array): Promise<string> {
    const parts = this.uploads.get(`${key}:${uploadId}`);
    if (!parts) {
      throw new Error("unknown upload");
    }
    parts.set(partNumber, body);
    return `"mem-${partNumber}-${body.byteLength}"`;
  }

  async completeMultipart(key: string, uploadId: string, parts: ObjectPart[]): Promise<void> {
    const stored = this.uploads.get(`${key}:${uploadId}`);
    if (!stored) {
      throw new Error("unknown upload");
    }
    const ordered = [...parts].sort((a, b) => a.partNumber - b.partNumber);
    const chunks: Uint8Array[] = [];
    for (const part of ordered) {
      const body = stored.get(part.partNumber);
      if (!body || part.etag !== `"mem-${part.partNumber}-${body.byteLength}"`) {
        throw new Error("missing part");
      }
      chunks.push(body);
    }
    const total = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
    const merged = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      merged.set(chunk, offset);
      offset += chunk.byteLength;
    }
    this.objects.set(key, merged);
    this.uploads.delete(`${key}:${uploadId}`);
  }

  async abortMultipart(key: string, uploadId: string): Promise<void> {
    this.uploads.delete(`${key}:${uploadId}`);
  }

  async getBytes(key: string): Promise<Uint8Array> {
    const body = this.objects.get(key);
    if (!body) {
      throw new Error("missing object");
    }
    return body;
  }

  async deleteObject(key: string): Promise<void> {
    this.objects.delete(key);
  }
}

export class MemoryUploadDb implements UploadDb {
  readonly assets: SourceAsset[] = [];
  readonly jobs: EnqueuedJob[] = [];

  async findAssetByHash(clientId: string, sha256: string): Promise<SourceAsset | null> {
    return this.assets.find((asset) => asset.clientId === clientId && asset.sha256 === sha256) ?? null;
  }

  async insertAsset(input: {
    clientId: string;
    sha256: string;
    storageKey: string;
    filename: string;
    durationMs: number;
    width: number | null;
    height: number | null;
    confirmedBy: string;
  }): Promise<SourceAsset> {
    const existing = await this.findAssetByHash(input.clientId, input.sha256);
    if (existing) {
      const error = new Error("duplicate sha256") as Error & { code?: string };
      error.code = "23505";
      throw error;
    }
    const asset = {
      id: randomUUID(),
      clientId: input.clientId,
      sha256: input.sha256,
      storageKey: input.storageKey,
    };
    this.assets.push(asset);
    return asset;
  }

  async enqueueTranscribe(assetId: string, clientId: string): Promise<EnqueuedJob> {
    const idempotencyKey = `transcribe:${assetId}`;
    const existing = this.jobs.find((job) => job.idempotencyKey === idempotencyKey);
    if (existing) {
      return { ...existing, created: false };
    }
    const job = { id: randomUUID(), idempotencyKey, created: true, clientId };
    this.jobs.push(job);
    return { id: job.id, idempotencyKey, created: true };
  }
}

export function sha256Hex(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}
