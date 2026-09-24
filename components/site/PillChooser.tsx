"use client";

import { useState } from "react";
import { PackageCards } from "@/components/site/PackageCards";

const steps = [
  "Record the episode you were already going to record.",
  "Choose moments that make sense if the viewer never hears the intro.",
  "Cut each one 9:16, with captions and a title written for that platform.",
  "Post on accounts you own. You are the approval.",
  "Do it again the next day. The cost is your weekends.",
];

type Choice = "diy" | "eevolvv";

export function PillChooser() {
  const [choice, setChoice] = useState<Choice>("eevolvv");
  const [checklist, setChecklist] = useState(false);

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const order: Choice[] = ["diy", "eevolvv"];
    const index = order.indexOf(choice);
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      const next = order[Math.min(order.length - 1, index + 1)];
      setChoice(next);
      document.getElementById(`pill-${next}`)?.focus();
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      const next = order[Math.max(0, index - 1)];
      setChoice(next);
      document.getElementById(`pill-${next}`)?.focus();
    }
  }

  return (
    <div className="chooser">
      <div role="radiogroup" aria-label="Pick your pill" className="capsules" onKeyDown={onKeyDown}>
        <button
          id="pill-diy"
          type="button"
          role="radio"
          aria-checked={choice === "diy"}
          tabIndex={choice === "diy" ? 0 : -1}
          className="capsule capsule-diy"
          onClick={() => setChoice("diy")}
        >
          Do it yourself
        </button>
        <button
          id="pill-eevolvv"
          type="button"
          role="radio"
          aria-checked={choice === "eevolvv"}
          tabIndex={choice === "eevolvv" ? 0 : -1}
          className="capsule capsule-eevolvv"
          onClick={() => setChoice("eevolvv")}
        >
          eevolvv
        </button>
      </div>

      <div hidden={choice !== "diy"} className="diy-panel">
        <p>Keep clipping it yourself. Free. Costs your weekends.</p>
        <button type="button" className="btn btn-secondary" onClick={() => setChecklist(true)}>
          Get the DIY checklist
        </button>
        {checklist ? (
          <ol className="diy-list">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        ) : null}
      </div>

      <div hidden={choice !== "eevolvv"}>
        <p className="lever-line">Let the lever do it.</p>
        <PackageCards />
      </div>
    </div>
  );
}
