import { AuthError } from "./session";

export type VerifiedOperator = {
  userId: string;
  email: string;
};

export interface OtpProvider {
  send(email: string): Promise<void>;
  verify(email: string, token: string): Promise<VerifiedOperator>;
}

/** In-memory OTP. Nothing is emailed. */
export class MockOtpProvider implements OtpProvider {
  readonly sent: string[] = [];
  private readonly codes = new Map<string, string>();

  constructor(private readonly users: Map<string, string>) {}

  async send(email: string): Promise<void> {
    const code = "424242";
    this.codes.set(email.toLowerCase(), code);
    this.sent.push(email.toLowerCase());
  }

  async verify(email: string, token: string): Promise<VerifiedOperator> {
    const key = email.toLowerCase();
    const expected = this.codes.get(key);
    if (!expected || expected !== token) {
      throw new AuthError("otp is not valid", 401);
    }
    this.codes.delete(key);
    const userId = this.users.get(key);
    if (!userId) {
      throw new AuthError("otp is not valid", 401);
    }
    return { userId, email: key };
  }

  codeFor(email: string): string | undefined {
    return this.codes.get(email.toLowerCase());
  }
}

type FetchImpl = (input: string, init?: RequestInit) => Promise<Response>;

export class SupabaseOtpProvider implements OtpProvider {
  constructor(
    private readonly url: string,
    private readonly anonKey: string,
    private readonly fetchImpl: FetchImpl = fetch,
  ) {}

  async send(email: string): Promise<void> {
    const response = await this.fetchImpl(this.endpoint("/auth/v1/otp"), {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ email, create_user: false }),
    });
    if (!response.ok) {
      throw new AuthError("otp was not sent", 502);
    }
  }

  async verify(email: string, token: string): Promise<VerifiedOperator> {
    const response = await this.fetchImpl(this.endpoint("/auth/v1/verify"), {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ email, token, type: "email" }),
    });
    if (!response.ok) {
      throw new AuthError("otp is not valid", 401);
    }
    const payload: unknown = await response.json();
    const userId = readUserId(payload);
    if (!userId) {
      throw new AuthError("otp is not valid", 401);
    }
    return { userId, email: email.toLowerCase() };
  }

  private endpoint(path: string): string {
    return `${this.url.replace(/\/$/, "")}${path}`;
  }

  private headers(): Record<string, string> {
    return {
      apikey: this.anonKey,
      authorization: `Bearer ${this.anonKey}`,
      "content-type": "application/json",
    };
  }
}

function readUserId(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }
  const user = (payload as { user?: unknown }).user;
  if (typeof user !== "object" || user === null) {
    return null;
  }
  const id = (user as { id?: unknown }).id;
  return typeof id === "string" && id.length > 0 ? id : null;
}
