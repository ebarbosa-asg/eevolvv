import { requestOperatorOtp, providerFromEnv } from "@/lib/operator-auth";
import { reviewPoolFromEnv } from "@/lib/review";
import { reviewJson, wantsHtml } from "@/lib/review-http";
import { AuthError, requireAuthEnv } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    requireAuthEnv();
    const email = await readEmail(request);
    await requestOperatorOtp(reviewPoolFromEnv(), providerFromEnv(), email);
    if (wantsHtml(request)) {
      const url = new URL("/login/verify", request.url);
      url.searchParams.set("email", email);
      return Response.redirect(url, 303);
    }
    return reviewJson({ ok: true });
  } catch (error) {
    const auth = error instanceof AuthError ? error : new AuthError("sign in failed", 500);
    if (wantsHtml(request)) {
      const url = new URL("/login", request.url);
      url.searchParams.set("error", auth.message);
      return Response.redirect(url, 303);
    }
    return reviewJson({ error: auth.message }, auth.status);
  }
}

async function readEmail(request: Request): Promise<string> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const payload: unknown = await request.json();
    if (typeof payload === "object" && payload !== null && typeof (payload as { email?: unknown }).email === "string") {
      return (payload as { email: string }).email;
    }
    return "";
  }
  const form = await request.formData();
  return String(form.get("email") ?? "");
}
