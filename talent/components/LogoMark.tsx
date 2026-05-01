import Image from "next/image";

/** eevolvv/talent header mark — same pixel mascot as the main site (`/public/mascot.png`). */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/mascot.png"
      alt="eevolvv/talent"
      width={338}
      height={338}
      className={className}
      style={{ width: 28, height: 28, imageRendering: "pixelated", objectFit: "contain" }}
      priority
    />
  );
}
