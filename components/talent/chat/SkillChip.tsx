import { cn } from "@/lib/talent/utils";

interface SkillChipProps {
  skill: string;
  selected: boolean;
  onToggle: (skill: string) => void;
  variant?: "confirm" | "suggest";
}

export function SkillChip({ skill, selected, onToggle, variant = "confirm" }: SkillChipProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(skill)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
        "transition-all duration-150 active:scale-95",
        selected
          ? "bg-[#141413] text-[#faf7f0]"
          : variant === "suggest"
          ? "border border-dashed border-[rgba(20,20,19,0.3)] bg-[#faf7f0] text-[#141413]/70 hover:border-[rgba(20,20,19,0.5)] hover:bg-[rgba(20,20,19,0.05)]"
          : "border border-[rgba(20,20,19,0.2)] bg-[#faf7f0] text-[#141413]/80 hover:border-[rgba(20,20,19,0.4)] hover:bg-[rgba(20,20,19,0.05)]"
      )}
    >
      {variant === "suggest" && !selected && (
        <span className="text-[#141413]/50">+</span>
      )}
      {skill}
    </button>
  );
}
