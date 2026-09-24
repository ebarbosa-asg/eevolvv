"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LeverCanvas = dynamic(() => import("@/components/site/LeverCanvas"), { ssr: false });

function canRender3D() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(max-width: 900px)").matches) return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return false;
  if ((navigator.hardwareConcurrency || 8) < 4) return false;
  const probe = document.createElement("canvas");
  const gl = probe.getContext("webgl2");
  if (!gl) return false;
  return true;
}

export function LeverUpgrade() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!canRender3D()) return;
    const start = () => setOn(true);
    window.addEventListener("pointermove", start, { once: true, passive: true });
    return () => window.removeEventListener("pointermove", start);
  }, []);

  useEffect(() => {
    if (!on) return;
    const art = document.querySelector(".hero-art");
    art?.classList.add("has-3d");
    return () => art?.classList.remove("has-3d");
  }, [on]);

  if (!on) return null;
  return (
    <div className="lever-3d">
      <LeverCanvas />
    </div>
  );
}
