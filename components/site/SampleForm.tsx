"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "sending" | "delivered" | "held" | "error";

export function SampleForm({ booking }: { booking: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const url = String(data.get("url") || "").trim();
    if (!name || !email || !url) {
      setError("Name, email, and an episode link are required.");
      return;
    }
    try {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("bad");
    } catch {
      setError("Use a full http or https link to the episode.");
      return;
    }
    setError("");
    setStatus("sending");
    try {
      const response = await fetch("/api/sample", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, url }),
      });
      const payload = (await response.json()) as { delivered?: boolean; error?: string };
      if (!response.ok) {
        setStatus("error");
        setError(payload.error || "Could not send that. Try the booking link.");
        return;
      }
      setStatus(payload.delivered ? "delivered" : "held");
    } catch {
      setStatus("error");
      setError("Network error. Try again, or book the fit call.");
    }
  }

  if (status === "delivered" || status === "held") {
    return (
      <div className="dropzone">
        <div>
          <p className="eyebrow">Sample</p>
          <h2>Request received</h2>
          <p className="lead">
            {status === "delivered"
              ? "It’s in the inbox. Next, book the fit call so we can look at the episode together."
              : "This preview can’t deliver email yet. Book the fit call so a person actually sees the episode."}
          </p>
          <div className="btn-row" style={{ justifyContent: "center" }}>
            <a className="btn btn-primary" href={booking || "/#book"}>
              Book a call
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <label>
        Name
        <input name="name" autoComplete="name" required />
      </label>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Episode URL
        <input name="url" type="url" inputMode="url" placeholder="https://" required />
      </label>
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}
      <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Request a sample cut"}
      </button>
    </form>
  );
}
