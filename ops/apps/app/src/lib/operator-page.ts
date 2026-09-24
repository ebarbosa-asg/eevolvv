import { cookies } from "next/headers";

import { isAllowlisted } from "./operator-auth";
import { authConfigured, openSession, sessionSecret, SESSION_COOKIE } from "./session";
import { reviewPoolFromEnv } from "./review";

export type OperatorPage =
  | { state: "unconfigured" }
  | { state: "anonymous" }
  | { state: "denied" }
  | { state: "ok"; userId: string; csrf: string };

export async function operatorPage(): Promise<OperatorPage> {
  if (!authConfigured() || !process.env.DATABASE_URL) {
    return { state: "unconfigured" };
  }
  const jar = await cookies();
  const opened = openSession(jar.get(SESSION_COOKIE)?.value ?? "", sessionSecret());
  if (!opened.ok) {
    return { state: "anonymous" };
  }
  const allowed = await isAllowlisted(reviewPoolFromEnv(), opened.session.sub);
  if (!allowed) {
    return { state: "denied" };
  }
  return { state: "ok", userId: opened.session.sub, csrf: opened.session.csrf };
}
