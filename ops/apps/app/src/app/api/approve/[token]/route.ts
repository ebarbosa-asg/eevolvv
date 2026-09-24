import { approvalSecretFromEnv } from "@/lib/links";
import { reviewPoolFromEnv, submitClientDecisions } from "@/lib/review";
import { handleReview, readClientDecisions } from "@/lib/review-http";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ token: string }> }): Promise<Response> {
  const { token } = await context.params;
  return handleReview(
    request,
    async () =>
      submitClientDecisions(reviewPoolFromEnv(), {
        token,
        secret: approvalSecretFromEnv(),
        decisions: await readClientDecisions(request),
      }),
    `/a/${token}?done=1`,
  );
}
