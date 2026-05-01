import { cn } from "@/lib/utils";
import { TypingIndicator } from "./TypingIndicator";

interface ChatMessageProps {
  role: "system" | "user";
  content?: React.ReactNode;
  loading?: boolean;
}

export function ChatMessage({ role, content, loading = false }: ChatMessageProps) {
  const isSystem = role === "system";

  return (
    <div
      className={cn(
        "flex w-full animate-in slide-in-from-bottom-2 fade-in duration-300",
        isSystem ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isSystem
            ? "rounded-tl-sm bg-[#141413] text-[#faf7f0] shadow-sm"
            : "rounded-tr-sm bg-[#faf7f0] text-[#141413] border border-[rgba(20,20,19,0.2)] shadow-sm"
        )}
      >
        {loading ? <TypingIndicator /> : content}
      </div>
    </div>
  );
}
