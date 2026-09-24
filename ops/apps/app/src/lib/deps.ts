import { PostgresUploadDb, poolFromEnv } from "./postgres";
import { S3Store, s3ClientFromEnv } from "./s3";
import type { UploadDeps } from "./upload";

let cached: UploadDeps | undefined;

export function depsFromEnv(): UploadDeps {
  if (!cached) {
    const bucket = process.env.S3_BUCKET;
    if (!bucket) {
      throw new Error("S3_BUCKET is required");
    }
    cached = {
      store: new S3Store(s3ClientFromEnv(), bucket),
      db: new PostgresUploadDb(poolFromEnv()),
    };
  }
  return cached;
}
