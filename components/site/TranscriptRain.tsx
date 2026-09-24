"use client";

import { useEffect, useRef } from "react";

const MAX_DPR = 1.5;
const FRAME_MS = 1000 / 30;

function tokensFrom(source: string) {
  const tokens: string[] = [];
  for (const line of source.split("\n")) {
    const match = line.match(/^(\d{2}:\d{2}:\d{2}\.\d{3})\s+(.+)$/);
    if (!match) continue;
    tokens.push(match[1].slice(3, 8));
    for (const word of match[2].split(/\s+/)) {
      if (word.length > 1 && word.length < 16) tokens.push(word.replace(/[.,]/g, ""));
    }
  }
  return tokens.length ? tokens : ["00:04", "hook", "caption", "eevolvv"];
}

export function TranscriptRain({ source }: { source: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const glyphs = tokensFrom(source);
    const mono = getComputedStyle(canvas).getPropertyValue("--font-mono").trim() || "ui-monospace";
    let width = 0;
    let height = 0;
    let columns: { y: number; speed: number; token: string }[] = [];
    let raf = 0;
    let running = false;
    let inView = false;
    let last = 0;
    const fontSize = 13;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(6, Math.floor(width / 88));
      columns = Array.from({ length: count }, (_, index) => ({
        y: Math.random() * height,
        speed: 18 + (index % 3) * 10,
        token: glyphs[index % glyphs.length],
      }));
    };

    const draw = (time: number) => {
      const dt = Math.min(0.05, (time - last) / 1000 || 0.016);
      ctx.fillStyle = "rgba(10, 12, 11, 0.18)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `500 ${fontSize}px ${mono}, ui-monospace, monospace`;
      ctx.textBaseline = "top";
      columns.forEach((column, index) => {
        column.y += column.speed * dt;
        if (column.y > height) {
          column.y = -18;
          column.token = glyphs[Math.floor(Math.random() * glyphs.length)];
        }
        ctx.fillStyle = index % 3 === 0 ? "rgba(61, 255, 138, 0.55)" : "rgba(111, 128, 118, 0.85)";
        ctx.fillText(column.token, 12 + index * ((width - 24) / columns.length), column.y);
      });
    };

    const loop = (time: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (time - last < FRAME_MS) return;
      last = time;
      draw(time);
    };

    const sync = () => {
      const next = inView && document.visibilityState === "visible";
      if (next === running) return;
      running = next;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(loop);
    };

    resize();
    const observer = new IntersectionObserver((entries) => {
      inView = entries.some((entry) => entry.isIntersecting);
      sync();
    });
    observer.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", resize);
    };
  }, [source]);

  return <canvas ref={ref} className="rain-canvas" aria-hidden="true" />;
}
