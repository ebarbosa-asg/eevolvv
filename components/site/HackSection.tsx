"use client";

import { useEffect, useState } from "react";

const TITLE = "HACK THE ALGORITHM*";
const FOOTNOTE =
  "Legally. There's no secret setting. The hack is showing up every day with clips worth watching, then turning viewers into people you can reach again.";

const chips = ["No bots", "No fake views", "No reposting strangers' content"];

export function HackSection() {
  const [glitch, setGlitch] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOpen(true);
      return;
    }
    setGlitch(true);
    const timer = window.setTimeout(() => setGlitch(false), 400);
    return () => window.clearTimeout(timer);
  }, []);

  const label = TITLE.slice(0, -1);
  const star = TITLE.slice(-1);

  return (
    <section className="hack" aria-labelledby="hack-title">
      <h2 id="hack-title" className={glitch ? "hack-title glitch" : "hack-title"}>
        <button
          type="button"
          className="hack-trigger"
          aria-expanded={open}
          aria-describedby="hack-note"
          onClick={() => setOpen((value) => !value)}
          onFocus={() => setOpen(true)}
        >
          {label}
          <span className="hack-star">{star}</span>
        </button>
      </h2>
      <p id="hack-note" className={open ? "hack-note open" : "hack-note"}>
        *{FOOTNOTE}
      </p>
      <ul className="hack-chips">
        {chips.map((chip) => (
          <li key={chip}>{chip}</li>
        ))}
      </ul>
    </section>
  );
}
