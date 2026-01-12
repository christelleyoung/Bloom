"use client";

import { useMemo, useState } from "react";

type LogEntry = {
  id: number;
  created_at: string;
  content: string;
  status: string;
};

const modes = ["Uni", "Work", "Heartbreak", "Rebuild", "Angry"] as const;
const intensities = ["Gentle", "Hard", "No Mercy"] as const;

export default function AdminDashboard({ initialLogs }: { initialLogs: LogEntry[] }) {
  const [mode, setMode] = useState<(typeof modes)[number]>("Work");
  const [intensity, setIntensity] = useState<(typeof intensities)[number]>("Hard");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "approved">("idle");
  const [logId, setLogId] = useState<number | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [error, setError] = useState("");
  const [delivery, setDelivery] = useState<"broadcast" | "sequence">("broadcast");

  const canApprove = useMemo(
    () => content.trim().length > 0 && status !== "loading",
    [content, status]
  );

  const generate = async () => {
    setStatus("loading");
    setError("");
    setContent("");

    try {
      console.log("[admin] generate bloom request", { mode, intensity });
      const response = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, intensity })
      });

      const rawText = await response.text();
      console.log("[admin] generate bloom response", {
        status: response.status,
        ok: response.ok,
        body: rawText
      });
      let data: any = null;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch (parseError) {
        console.error("[admin] generate bloom non-JSON response", parseError);
        throw new Error("Unexpected response from server. Check console for details.");
      }

      if (!response.ok) {
        throw new Error(data?.error || "Generation failed.");
      }
      if (!data?.message || !data?.logId) {
        throw new Error("Generation succeeded but response payload is missing.");
      }

      setContent(data.message);
      setLogId(data.logId);
      setStatus("idle");
      setLogs((prev) => [
        {
          id: data.logId,
          created_at: new Date().toISOString(),
          content: data.message,
          status: "draft"
        },
        ...prev
      ]);
    } catch (err) {
      setStatus("idle");
      setError((err as Error).message);
    }
  };

  const approve = async () => {
    if (!canApprove) return;
    setStatus("loading");
    setError("");

    try {
      console.log("[admin] approve bloom request", { logId, delivery });
      const response = await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, logId, delivery })
      });
      const rawText = await response.text();
      console.log("[admin] approve bloom response", {
        status: response.status,
        ok: response.ok,
        body: rawText
      });
      let data: any = null;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch (parseError) {
        console.error("[admin] approve bloom non-JSON response", parseError);
        throw new Error("Unexpected response from server. Check console for details.");
      }
      if (!response.ok) {
        throw new Error(data?.error || "Approval failed.");
      }
      setStatus("approved");
      setLogs((prev) =>
        prev.map((entry) =>
          entry.id === logId
            ? { ...entry, status: "sent", content }
            : entry
        )
      );
    } catch (err) {
      setStatus("idle");
      setError((err as Error).message);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
              Internal
            </p>
            <h1 className="mt-2 text-2xl font-semibold">
              Bloombiatch Content Generator
            </h1>
          </div>
          <button
            onClick={generate}
            disabled={status === "loading"}
            className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? "Generating..." : "Generate today's Bloom"}
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-neutral-300">
            Bloom Mode
            <select
              value={mode}
              onChange={(event) =>
                setMode(event.target.value as (typeof modes)[number])
              }
              className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-neutral-100"
            >
              {modes.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-neutral-300">
            Intensity
            <select
              value={intensity}
              onChange={(event) =>
                setIntensity(event.target.value as (typeof intensities)[number])
              }
              className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-neutral-100"
            >
              {intensities.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6">
          <label className="text-sm text-neutral-300">Generated Bloom</label>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Generate a Bloom to edit or approve."
            rows={8}
            className="mt-2 w-full rounded-2xl border border-neutral-700 bg-neutral-950 p-4 text-sm text-neutral-100"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={approve}
            disabled={!canApprove}
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Approve & Schedule
          </button>
          <button
            onClick={generate}
            disabled={status === "loading"}
            className="rounded-full border border-neutral-700 px-5 py-2 text-sm font-semibold text-neutral-100 hover:border-neutral-400"
          >
            Regenerate
          </button>
          <label className="flex items-center gap-2 text-sm text-neutral-300">
            Delivery
            <select
              value={delivery}
              onChange={(event) =>
                setDelivery(event.target.value as "broadcast" | "sequence")
              }
              className="rounded-full border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
            >
              <option value="broadcast">Broadcast</option>
              <option value="sequence">Sequence</option>
            </select>
          </label>
        </div>

        {status === "approved" ? (
          <p className="mt-4 text-sm text-emerald-300">
            Approved. Sent to Kit.
          </p>
        ) : null}
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      </div>

      <aside className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
        <h2 className="text-lg font-semibold">Recent Sends</h2>
        <div className="mt-4 space-y-4">
          {logs.length === 0 ? (
            <p className="text-sm text-neutral-400">No blooms logged yet.</p>
          ) : (
            logs.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-xs text-neutral-300"
              >
                <p className="text-emerald-300">{entry.status.toUpperCase()}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-200">
                  {entry.content}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  {new Date(entry.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
