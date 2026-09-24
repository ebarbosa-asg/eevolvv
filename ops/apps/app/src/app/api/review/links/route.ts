import { approvalSecretFromEnv } from "@/lib/links";
import { ReviewError, issueApprovalLink, reviewPoolFromEnv } from "@/lib/review";
import { escapeHtml, reviewJson, wantsHtml } from "@/lib/review-http";

export const dynamic = "force-dynamic";

async function readLinkRequest(request: Request): Promise<{ operatorId: string; clientId: string; batchId: string }> {
  const contentType = request.headers.get("content-type") ?? "";
  let operatorId = request.headers.get("x-operator-id") ?? "";
  let clientId = "";
  let batchId = "";
  if (contentType.includes("application/json")) {
    const payload: unknown = await request.json();
    if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
      throw new ReviewError("json object required", 400);
    }
    const body = payload as Record<string, unknown>;
    if (!operatorId && typeof body.operatorId === "string") {
      operatorId = body.operatorId;
    }
    if (typeof body.clientId === "string") {
      clientId = body.clientId;
    }
    if (typeof body.batchId === "string") {
      batchId = body.batchId;
    }
  } else {
    const form = await request.formData();
    if (!operatorId) {
      operatorId = String(form.get("operatorId") ?? "");
    }
    clientId = String(form.get("clientId") ?? "");
    batchId = String(form.get("batchId") ?? "");
  }
  return { operatorId, clientId, batchId };
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await readLinkRequest(request);
    const issued = await issueApprovalLink(reviewPoolFromEnv(), {
      ...body,
      secret: approvalSecretFromEnv(),
    });
    const path = `/a/${issued.token}`;
    if (wantsHtml(request)) {
      const safe = escapeHtml(path);
      return new Response(
        `<!doctype html><html lang="en"><meta charset="utf-8"><title>eevolvv ops</title><body><p>Client link, shown once.</p><p><a href="${safe}">${safe}</a></p><p>Expires ${escapeHtml(issued.expiresAt)}. Email delivery is not wired.</p></body></html>`,
        { status: 200, headers: { "content-type": "text/html; charset=utf-8" } },
      );
    }
    return reviewJson({ path, expiresAt: issued.expiresAt });
  } catch (error) {
    const review = error instanceof ReviewError ? error : new ReviewError(error instanceof Error ? error.message : "review failed", 500);
    if (wantsHtml(request)) {
      const url = new URL("/review", request.url);
      url.searchParams.set("error", review.message);
      return Response.redirect(url, 303);
    }
    return reviewJson({ error: review.message }, review.status);
  }
}
