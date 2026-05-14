import { NextRequest, NextResponse } from "next/server";
import {
  syncMemoriesFromBridge,
  getClientMemories,
} from "@/lib/clientMemory";

// TODO: add session auth (matches pattern of other /os/* routes)

export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get("client_id") ?? "";
  if (!clientId) {
    return NextResponse.json({ error: "client_id required" }, { status: 400 });
  }
  const memories = await getClientMemories(clientId);
  return NextResponse.json({ memories });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const clientId: string = body.client_id ?? "";
  if (!clientId) {
    return NextResponse.json({ error: "client_id required" }, { status: 400 });
  }
  const result = await syncMemoriesFromBridge(clientId);
  return NextResponse.json(result);
}
