import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        marquee: "marquee 32s linear infinite",
        "float-1": "float-1 22s ease-in-out infinite",
        "float-2": "float-2 18s ease-in-out infinite",
        "float-3": "float-3 26s ease-in-out 2s infinite",
        "mesh-shift": "mesh-shift 20s ease-in-out infinite",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
        "shine-sweep": "shine-sweep 1.2s ease-out forwards",
        triad: "triad 5s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "float-1": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(12px, -18px) scale(1.04)" },
        },
        "float-2": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(-16px, 14px)" },
        },
        "float-3": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(8px, 20px) scale(0.98)" },
        },
        "mesh-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.85" },
        },
        "shine-sweep": {
          "0%": { transform: "translateX(-100%) skewX(-12deg)" },
          "100%": { transform: "translateX(200%) skewX(-12deg)" },
        },
        triad: {
          "0%, 100%": {
            boxShadow: "0 8px 32px -8px rgba(6, 182, 212, 0.2)",
          },
          "50%": {
            boxShadow: "0 14px 48px -6px rgba(20, 184, 166, 0.35)",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
