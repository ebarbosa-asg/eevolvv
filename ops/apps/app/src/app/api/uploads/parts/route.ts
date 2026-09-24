import { depsFromEnv } from "@/lib/deps";
import { handle, readJson } from "@/lib/http";
import { uploadPart } from "@/lib/upload";

export async function POST(request: Request): Promise<Response> {
  return handle(async () => uploadPart(depsFromEnv(), await readJson(request)));
}
