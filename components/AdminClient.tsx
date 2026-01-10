"use client";

import { useState } from "react";

type AdminClientProps = {
  sequenceId: string;
};

const modeOptions = [
  "Uni",
  "Work",
  "Health",
  "Relationships",
  "Money",
  "Confidence",
  "Rebuild",
  "Angry",
];

export default function AdminClient({ sequenceId }: AdminClientProps) {
  const [draft, setDraft] = useState("");
  const [lastGenerated, setLastGenerated] = useState("");
  const [logId, setLogId] = useState<number | null>(null);
  const [mode, setMode] = useState("Work");
  const [intensity, setIntensity] = useState("Hard");
  const [testEmail, setTestEmail] = useState("");
  const [generateError, setGenerateError] = useState("");
  const [approveStatus, setApproveStatus] = useState("");
  const [approveDetails, setApproveDetails] = useState("");
  const [testStatus, setTestStatus] = useState("");
  const [testDetails, setTestDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setGenerateError("");
    setApproveStatus("");
    setApproveDetails("");
    try {
      const response = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, intensity }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to generate Bloom.");
      }
      setDraft(payload.message);
      setLastGenerated(payload.message);
      setLogId(payload.logId ?? null);
    } catch (error) {
      setGenerateError(error instanceof Error ? error.message : "Failed to generate Bloom.");
    } finally {
      setLoading(false);
    }
  };

  const approve = async () => {
    if (!logId || !draft) return;
    setLoading(true);
    setApproveStatus("");
    setApproveDetails("");
    try {
      const response = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId, content: draft }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to approve Bloom.");
      }
      setApproveStatus(payload.message || "Approved and scheduled in Kit.");
      setApproveDetails(payload.details || "");
    } catch (error) {
      setApproveStatus(error instanceof Error ? error.message : "Failed to approve Bloom.");
    } finally {
      setLoading(false);
    }
  };

  const sendTest = async () => {
    if (!testEmail || !draft) return;
    setLoading(true);
    setTestStatus("");
    setTestDetails("");
    try {
      const response = await fetch("/api/admin/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail, content: draft }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to send test email.");
      }
      setTestStatus(payload.message || "Test email sent.");
      setTestDetails(payload.details || "");
    } catch (error) {
      setTestStatus(error instanceof Error ? error.message : "Failed to send test email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-8">
      <h2 className="text-xl font-semibold uppercase">Generate today’s Bloom</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-2 text-xs uppercase text-neutral-400">
          Bloom Mode
          <select
            name="mode"
            className="rounded-full border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm text-neutral-100"
            value={mode}
            onChange={(event) => setMode(event.target.value)}
          >
            {modeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-xs uppercase text-neutral-400">
          Intensity
          <select
            name="intensity"
            className="rounded-full border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm text-neutral-100"
            value={intensity}
            onChange={(event) => setIntensity(event.target.value)}
          >
            {["Gentle", "Hard", "No Mercy"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="h-10 self-end rounded-full bg-white px-6 text-sm font-semibold uppercase text-neutral-950"
          onClick={generate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate today’s Bloom"}
        </button>
      </div>

      {generateError ? <p className="mt-4 text-sm text-red-400">{generateError}</p> : null}

      <div className="mt-8 grid gap-4">
        <label className="text-xs uppercase text-neutral-400">Draft</label>
        <p className="text-xs text-neutral-500">
          Tip: personalize with <span className="text-neutral-300">{"{{ subscriber.first_name }}"}</span> or{" "}
          <span className="text-neutral-300">{"{{ subscriber.bloom_problem }}"}</span>.
        </p>
        <textarea
          className="min-h-[160px] w-full rounded-2xl border border-neutral-700 bg-neutral-950 p-4 text-sm text-neutral-100"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Generate a Bloom to edit here."
        />
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            className="rounded-full bg-emerald-400 px-6 py-3 text-xs font-semibold uppercase text-neutral-950"
            disabled={!draft || !logId}
            onClick={approve}
          >
            Approve &amp; Schedule
          </button>
          <button
            type="button"
            className="rounded-full border border-neutral-700 px-6 py-3 text-xs font-semibold uppercase text-neutral-100"
            onClick={() => setDraft(lastGenerated)}
            disabled={!lastGenerated}
          >
            Reset Draft
          </button>
          <span className="text-xs text-neutral-400">
            Approving sends the message to Kit. Target: sequence {sequenceId}.
          </span>
        </div>
        {approveStatus ? (
          <p className="text-sm text-emerald-300">
            {approveStatus}
            {approveDetails ? ` (${approveDetails})` : ""}
          </p>
        ) : null}
        <div className="mt-4 border-t border-neutral-800 pt-4">
          <p className="text-xs uppercase text-neutral-400">Send test email</p>
          <p className="mt-2 text-sm text-neutral-400">
            Sends a test broadcast to a single address via Kit.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <input
              type="email"
              name="email"
              placeholder="test@domain.com"
              className="w-full rounded-full border border-neutral-700 bg-neutral-950 px-5 py-3 text-sm text-neutral-100 placeholder:text-neutral-600"
              value={testEmail}
              onChange={(event) => setTestEmail(event.target.value)}
              required
            />
            <button
              type="button"
              className="w-fit rounded-full border border-neutral-700 px-6 py-3 text-xs font-semibold uppercase text-neutral-100"
              disabled={!draft}
              onClick={sendTest}
            >
              Send test email
            </button>
          </div>
          {testStatus ? (
            <p className="mt-3 text-sm text-emerald-300">
              {testStatus}
              {testDetails ? ` (${testDetails})` : ""}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
