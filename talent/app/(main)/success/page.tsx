import { Suspense } from "react";
import { SuccessContent } from "@/components/SuccessContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You're in — eevolvv/talent",
  robots: { index: false },
};

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-sky-50">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
