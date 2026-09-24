import { depsFromEnv } from "@/lib/deps";
import { handle, readJson } from "@/lib/http";
import { initUpload } from "@/lib/upload";

export async function POST(request: Request): Promise<Response> {
  return handle(async () => initUpload(depsFromEnv(), await readJson(request)));
}
