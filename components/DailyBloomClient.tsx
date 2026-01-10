"use client";

import { useState } from "react";

type DailyBloomClientProps = {
  kicker?: string;
  title?: string;
  description?: string;
};

export default function DailyBloomClient({
  kicker = "Daily Bloom",
  title = "Today’s Bloom",
  description = "Tap the button and we’ll generate a fresh Bloom right now.",
}: DailyBloomClientProps) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [error, setError] = useState("");

  const generate = async () => {
    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/bloom/today", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to generate Bloom.");
      }
      setMessage(payload.message);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to generate Bloom.");
    }
  };

  return (
    <div className="rounded-3xl border border-neutral-800 p-8">
      <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{kicker}</p>
      <h1 className="mt-2 text-4xl font-semibold uppercase">{title}</h1>
      <p className="mt-3 text-neutral-300">{description}</p>
      <button
        type="button"
        onClick={generate}
        className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase text-neutral-950"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Generating..." : "Generate today’s Bloom"}
      </button>

      {status === "error" ? (
        <p className="mt-4 text-sm text-red-400">{error}</p>
      ) : null}

      {message ? (
        <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6">
          <p className="whitespace-pre-line text-lg text-neutral-100">{message}</p>
        </div>
      ) : null}
    </div>
  );
}
