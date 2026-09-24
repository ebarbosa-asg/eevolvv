"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const TranscriptRain = dynamic(() => import("@/components/site/TranscriptRain").then((mod) => mod.TranscriptRain), {
  ssr: false,
});

export function HeroRain({ source }: { source: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    const start = () => {
      if (!cancelled) setReady(true);
    };
    let observer: PerformanceObserver | undefined;
    try {
      observer = new PerformanceObserver((list) => {
        if (list.getEntries().length > 0) start();
      });
      observer.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      observer = undefined;
    }
    const onLoad = () => {
      const idle = window.requestIdleCallback?.(start, { timeout: 1200 });
      if (idle === undefined) window.setTimeout(start, 400);
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => {
      cancelled = true;
      observer?.disconnect();
      window.removeEventListener("load", onLoad);
    };
  }, []);

  if (!ready) return null;
  return <TranscriptRain source={source} />;
}
