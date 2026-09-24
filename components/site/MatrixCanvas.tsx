"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "01eevolvv⟨⟩/[]{}#$%*+-=アイウエオカキ";

export function MatrixCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let drops: number[] = [];
    let visible = true;
    const fontSize = 14;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const columns = Math.ceil(width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * (height / fontSize));
    };

    const draw = () => {
      if (!visible || document.visibilityState !== "visible") return;
      if (canvas.parentElement?.classList.contains("has-3d")) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#3DFF8A";
      ctx.font = `${fontSize}px ui-monospace, monospace`;
      for (let i = 0; i < drops.length; i++) {
        const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "0";
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);
    const timer = window.setInterval(draw, 33);

    return () => {
      window.clearInterval(timer);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="matrix-canvas" aria-hidden="true" />;
}
