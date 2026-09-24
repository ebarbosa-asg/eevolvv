export interface ObjectPart {
  partNumber: number;
  etag: string;
}

export interface ObjectStore {
  createMultipart(key: string, contentType: string): Promise<string>;
  uploadPart(key: string, uploadId: string, partNumber: number, body: Uint8Array): Promise<string>;
  completeMultipart(key: string, uploadId: string, parts: ObjectPart[]): Promise<void>;
  abortMultipart(key: string, uploadId: string): Promise<void>;
  getBytes(key: string): Promise<Uint8Array>;
  deleteObject(key: string): Promise<void>;
}

export interface SourceAsset {
  id: string;
  clientId: string;
  sha256: string;
  storageKey: string;
}

export interface EnqueuedJob {
  id: string;
  idempotencyKey: string;
  created: boolean;
}

export interface UploadDb {
  findAssetByHash(clientId: string, sha256: string): Promise<SourceAsset | null>;
  insertAsset(input: {
    clientId: string;
    sha256: string;
    storageKey: string;
    filename: string;
    durationMs: number;
    width: number | null;
    height: number | null;
    confirmedBy: string;
  }): Promise<SourceAsset>;
  enqueueTranscribe(assetId: string, clientId: string): Promise<EnqueuedJob>;
}

export interface ProbeResult {
  durationS: number;
  width: number | null;
  height: number | null;
  videoCodec: string | null;
}

export class UploadError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}
