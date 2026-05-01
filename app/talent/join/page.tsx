import { ChatIntake } from "@/components/talent/chat/ChatIntake";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join the pool — eevolvv/talent",
  description: "Get matched to real paid work. Drop your background. We do the rest.",
};

export default function JoinPage() {
  return (
    <div className="min-h-screen px-4 pt-20 pb-32 sm:px-6">
      <div className="mx-auto mb-10 max-w-2xl">
        <p className="mono mb-4 text-[10px] tracking-[0.22em] opacity-50">
          JOIN THE POOL
        </p>
        <h1
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          What can you{" "}
          <em
            className="serif"
            style={{ fontStyle: "italic", color: "var(--accent)" }}
          >
            do?
          </em>
        </h1>
        <p
          style={{
            fontSize: 16,
            opacity: 0.65,
            marginTop: 16,
            lineHeight: 1.6,
            maxWidth: 480,
          }}
        >
          No 47-field form. Tell us who you are, confirm your skills, and we&apos;ll
          reach out when real scope fits.
        </p>
      </div>

      <ChatIntake />
    </div>
  );
}
