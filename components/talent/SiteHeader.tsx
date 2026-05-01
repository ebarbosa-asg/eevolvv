"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/talent/LogoMark";

const NAV_LINKS: [string, string][] = [
  ["#work", "WORK"],
  ["#pool", "THE POOL"],
  ["#how", "PROCESS"],
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          borderColor: "var(--rule)",
          background: "rgba(250,247,240,0.9)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          className="mx-auto flex items-center justify-between"
          style={{ maxWidth: 1280, padding: "10px 24px" }}
        >
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="shrink-0 leading-none"
              style={{ textDecoration: "none", color: "inherit" }}
              aria-label="eevolvv/talent home"
            >
              <LogoMark />
            </Link>
            <span
              className="mono min-w-0"
              style={{
                fontSize: "clamp(10px, 2.9vw, 12px)",
                letterSpacing: "0.18em",
                fontWeight: 600,
              }}
            >
              <a href="https://eevolvv.com" style={{ color: "inherit", textDecoration: "none" }}>EEVOLVV</a>
              {" "}
              <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>/ TALENT</Link>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-7 mono" style={{ fontSize: 11, letterSpacing: "0.16em" }}>
            {NAV_LINKS.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="link-rule"
                style={{ color: "var(--ink)", opacity: 0.65, textDecoration: "none" }}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/join"
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.16em",
                padding: "8px 14px",
                border: "1px solid var(--ink)",
                background: "var(--ink)",
                color: "var(--paper)",
                textDecoration: "none",
              }}
            >
              JOIN THE POOL →
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/join"
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.16em",
                padding: "8px 14px",
                border: "1px solid var(--ink)",
                background: "var(--ink)",
                color: "var(--paper)",
                textDecoration: "none",
              }}
            >
              JOIN →
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              style={{
                background: "transparent",
                border: "1px solid var(--rule)",
                padding: "8px 10px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <span style={{ display: "block", width: 18, height: 1.5, background: "var(--ink)", transition: "transform 0.2s" }} />
              <span style={{ display: "block", width: 18, height: 1.5, background: "var(--ink)", opacity: menuOpen ? 0 : 1, transition: "opacity 0.2s" }} />
              <span style={{ display: "block", width: menuOpen ? 18 : 12, height: 1.5, background: "var(--ink)", transition: "width 0.2s" }} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 39,
            background: "var(--paper)",
            padding: "80px 24px 40px",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column" }}>
            {NAV_LINKS.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="mono"
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: 28,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  color: "var(--ink)",
                  textDecoration: "none",
                  padding: "18px 0",
                  borderBottom: "1px solid var(--rule)",
                }}
              >
                {label}
              </a>
            ))}
          </nav>
          <div style={{ marginTop: "auto", paddingTop: 32, display: "flex", flexDirection: "column", gap: 10 }}>
            <Link
              href="/join"
              className="mono"
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: 13,
                letterSpacing: "0.16em",
                padding: "16px",
                background: "var(--ink)",
                color: "var(--paper)",
                textDecoration: "none",
                textAlign: "center",
                display: "block",
              }}
            >
              JOIN THE POOL →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
