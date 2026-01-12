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
  const fallbackMessage =
    "Still counts. Still showed up. Still dangerous. Now go.";
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const generate = async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({})
      });
      const rawText = await response.text();
      let payload: { content?: string } | null = null;
      try {
        payload = rawText ? JSON.parse(rawText) : null;
      } catch (parseError) {
        console.error("[daily bloom] non-JSON response", parseError, rawText);
      }

      if (!response.ok || !payload?.content) {
        setMessage(fallbackMessage);
        setStatus("success");
        return;
      }

      setMessage(payload.content);
      setStatus("success");
    } catch (err) {
      console.error("[daily bloom] failed to generate", err);
      setMessage(fallbackMessage);
      setStatus("success");
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

      {message ? (
        <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6">
          <p className="whitespace-pre-line text-lg text-neutral-100">{message}</p>
        </div>
      ) : null}
    </div>
  );
}
