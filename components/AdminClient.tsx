"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { approveBloom, generateBloom, sendTestEmail } from "@/app/admin/actions";

const initialGenerateState = {
  message: "",
  logId: null as number | null,
  error: "",
};

const initialApproveState = {
  message: "",
  details: "",
};

const initialTestState = {
  message: "",
  details: "",
};

type AdminClientProps = {
  sequenceId: string;
};

export default function AdminClient({ sequenceId }: AdminClientProps) {
  const [generateState, generateAction] = useFormState(generateBloom, initialGenerateState);
  const [approveState, approveAction] = useFormState(approveBloom, initialApproveState);
  const [testState, testAction] = useFormState(sendTestEmail, initialTestState);
  const [draft, setDraft] = useState("");
  const [logId, setLogId] = useState<number | null>(null);
  const [testEmail, setTestEmail] = useState("");

  useEffect(() => {
    if (generateState.message) {
      setDraft(generateState.message);
      setLogId(generateState.logId ?? null);
    }
  }, [generateState.message, generateState.logId]);

  return (
    <section className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-8">
      <h2 className="text-xl font-semibold uppercase">Generate today’s Bloom</h2>
      <form action={generateAction} className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-2 text-xs uppercase text-neutral-400">
          Bloom Mode
          <select
            name="mode"
            className="rounded-full border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm text-neutral-100"
            defaultValue="Work"
          >
            {["Uni", "Work", "Heartbreak", "Rebuild", "Angry"].map((option) => (
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
            defaultValue="Hard"
          >
            {["Gentle", "Hard", "No Mercy"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="h-10 self-end rounded-full bg-white px-6 text-sm font-semibold uppercase text-neutral-950"
        >
          Generate today’s Bloom
        </button>
      </form>

      {generateState.error ? (
        <p className="mt-4 text-sm text-red-400">{generateState.error}</p>
      ) : null}

      <div className="mt-8 grid gap-4">
        <label className="text-xs uppercase text-neutral-400">Draft</label>
        <textarea
          className="min-h-[160px] w-full rounded-2xl border border-neutral-700 bg-neutral-950 p-4 text-sm text-neutral-100"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Generate a Bloom to edit here."
        />
        <form action={approveAction} className="flex flex-wrap gap-4">
          <input type="hidden" name="logId" value={logId ?? ""} />
          <input type="hidden" name="content" value={draft} />
          <button
            type="submit"
            className="rounded-full bg-emerald-400 px-6 py-3 text-xs font-semibold uppercase text-neutral-950"
            disabled={!draft || !logId}
          >
            Approve &amp; Schedule
          </button>
          <button
            type="button"
            className="rounded-full border border-neutral-700 px-6 py-3 text-xs font-semibold uppercase text-neutral-100"
            onClick={() => setDraft(generateState.message || "")}
            disabled={!generateState.message}
          >
            Reset Draft
          </button>
          <span className="text-xs text-neutral-400">
            Approving sends the message to Kit. Target: sequence {sequenceId}.
          </span>
        </form>
        {approveState.message ? (
          <p className="text-sm text-emerald-300">
            {approveState.message}
            {approveState.details ? ` (${approveState.details})` : ""}
          </p>
        ) : null}
        <div className="mt-4 border-t border-neutral-800 pt-4">
          <p className="text-xs uppercase text-neutral-400">Send test email</p>
          <p className="mt-2 text-sm text-neutral-400">
            Sends a test broadcast to a single address via Kit.
          </p>
          <form action={testAction} className="mt-4 flex flex-col gap-3">
            <input
              type="email"
              name="email"
              placeholder="test@domain.com"
              className="w-full rounded-full border border-neutral-700 bg-neutral-950 px-5 py-3 text-sm text-neutral-100 placeholder:text-neutral-600"
              value={testEmail}
              onChange={(event) => setTestEmail(event.target.value)}
              required
            />
            <input type="hidden" name="content" value={draft} />
            <button
              type="submit"
              className="w-fit rounded-full border border-neutral-700 px-6 py-3 text-xs font-semibold uppercase text-neutral-100"
              disabled={!draft}
            >
              Send test email
            </button>
          </form>
          {testState.message ? (
            <p className="mt-3 text-sm text-emerald-300">
              {testState.message}
              {testState.details ? ` (${testState.details})` : ""}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
