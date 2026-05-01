import Image from "next/image";

/**
 * eevolvv/talent mascot — the smallest monkey from the eevolvv evolution strip.
 * Replaces the former geometric-A Archimedes mark.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/mascot.png"
      alt="eevolvv/talent"
      width={28}
      height={28}
      className={className}
      style={{ imageRendering: "pixelated", objectFit: "contain" }}
      priority
    />
  );
}
