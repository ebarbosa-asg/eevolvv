/**
 * Full-viewport decorative layer for /ai — mesh + slow-moving orbs.
 * pointer-events: none. Respects reduced motion in globals.
 */
export function PageBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-0 bg-gradient-to-b from-cyan-50/80 via-sky-50/40 to-teal-50/50"
        style={{
          backgroundImage: `
            linear-gradient(165deg, rgba(224, 242, 254, 0.95) 0%, rgba(236, 254, 255, 0.5) 35%, rgba(240, 253, 250, 0.6) 100%)
          `,
        }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 184, 166, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
      {/* Animated orbs */}
      <div className="absolute -left-20 top-0 h-[min(100vw,36rem)] w-[min(100vw,36rem)] animate-float-1 rounded-full bg-gradient-to-br from-cyan-400/30 to-transparent blur-3xl motion-reduce:animate-none" />
      <div className="absolute -right-24 top-1/4 h-80 w-80 animate-float-2 rounded-full bg-gradient-to-bl from-teal-400/25 to-cyan-300/20 blur-3xl motion-reduce:animate-none" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 -translate-x-1/2 animate-float-3 rounded-full bg-sky-300/20 blur-3xl motion-reduce:animate-none" />
      {/* Soft aurora band */}
      <div
        className="absolute left-0 right-0 top-0 h-[min(50vh,28rem)] animate-mesh-shift opacity-50 blur-3xl motion-reduce:animate-none"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(6,182,212,0.2), rgba(20,184,166,0.12), rgba(6,182,212,0.2))",
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}
