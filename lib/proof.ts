import { z } from "zod";

export const STALE_AFTER_MS = 48 * 60 * 60 * 1000;

export const kpiSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    unit: z.enum(["count", "cents"]),
    value: z.number().int(),
    source: z.string().min(1),
    asOf: z.string().datetime({ offset: true }),
  })
  .strict();

export const snapshotSchema = z
  .object({
    kpis: z.array(kpiSchema),
  })
  .strict();

export type ProofKpi = z.infer<typeof kpiSchema>;
export type ProofSnapshot = z.infer<typeof snapshotSchema>;

export function parseSnapshot(input: unknown): { ok: true; data: ProofSnapshot } | { ok: false; error: string } {
  const parsed = snapshotSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ") };
  }
  return { ok: true, data: parsed.data };
}

export function isStale(asOf: string, now = Date.now()) {
  const time = Date.parse(asOf);
  if (Number.isNaN(time)) return true;
  return now - time > STALE_AFTER_MS;
}

export function formatCents(cents: number) {
  const negative = cents < 0;
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  return `${negative ? "-" : ""}$${dollars.toLocaleString("en-US")}.${String(remainder).padStart(2, "0")}`;
}

export function formatKpiValue(kpi: ProofKpi) {
  if (kpi.unit === "cents") return formatCents(kpi.value);
  return kpi.value.toLocaleString("en-US");
}
