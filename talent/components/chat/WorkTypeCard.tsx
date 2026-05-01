import { cn } from "@/lib/utils";

const TYPE_META = {
  Task: {
    icon: "⚡",
    description: "One deliverable. Fast payout.",
    range: "$50 – $2k",
  },
  Contract: {
    icon: "📋",
    description: "Scoped engagement. Written agreement.",
    range: "$2k – $20k",
  },
  Consult: {
    icon: "💡",
    description: "Knowledge session. Expert access.",
    range: "$100 – $2k",
  },
} as const;

type WorkType = keyof typeof TYPE_META;

interface WorkTypeCardProps {
  type: WorkType;
  selected: boolean;
  onToggle: (type: WorkType) => void;
}

export function WorkTypeCard({ type, selected, onToggle }: WorkTypeCardProps) {
  const meta = TYPE_META[type];
  return (
    <button
      type="button"
      onClick={() => onToggle(type)}
      className={cn(
        "flex flex-1 flex-col gap-2 rounded-[1.25rem] border p-4 text-left",
        "transition-all duration-200 active:scale-[0.98]",
        selected
          ? "border-cyan-400 bg-cyan-50/60 shadow-lg shadow-cyan-500/15"
          : "border-cyan-200/70 bg-white/85 hover:border-cyan-300 hover:shadow-md"
      )}
    >
      <span className="text-xl">{meta.icon}</span>
      <div>
        <p className={cn("text-sm font-bold", selected ? "text-cyan-700" : "text-slate-900")}>
          {type}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">{meta.description}</p>
      </div>
      <p className={cn("mt-auto text-xs font-semibold", selected ? "text-cyan-600" : "text-slate-400")}>
        {meta.range}
      </p>
    </button>
  );
}
