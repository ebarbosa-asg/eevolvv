export const WORK_TYPES = [
  {
    code: "TSK",
    name: "Task",
    plain: "One job. One deliverable.",
    long: "Discrete work with a clear output. Hours to days. Pays on delivery.",
    range: "$50 — $2,000",
    span: "Hours to days",
  },
  {
    code: "CTR",
    name: "Contract",
    plain: "Scoped. Written. Signed.",
    long: "Multi-deliverable engagements with a written scope and a payout schedule.",
    range: "$2k — $20k",
    span: "Weeks to months",
  },
  {
    code: "CSL",
    name: "Consult",
    plain: "Time with someone who's done it.",
    long: "Knowledge sessions. Pull a thread, get an answer, move on.",
    range: "$100 — $2,000",
    span: "30 min to 4 hrs",
  },
] as const;

export type WorkType = (typeof WORK_TYPES)[number];
