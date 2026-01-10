import { cookies } from "next/headers";
import AdminClient from "@/components/AdminClient";
import { listBlooms } from "@/lib/db";
import { login } from "./actions";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const isAuthed = cookies().get("bloombiatch-admin")?.value === "true";
  const logs = listBlooms(10);
  const sequenceId = process.env.CONVERTKIT_SEQUENCE_ID || "Not set";

  if (!isAuthed) {
    return (
      <main className="min-h-screen bg-neutral-950 px-6 py-20 text-neutral-100">
        <div className="mx-auto max-w-md rounded-3xl border border-neutral-800 bg-neutral-900/60 p-10">
          <h1 className="text-2xl font-semibold uppercase">Admin Access</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Enter the admin password to generate and approve Blooms.
          </p>
          <form action={login} className="mt-6 flex flex-col gap-4">
            <input
              type="password"
              name="password"
              placeholder="Admin password"
              className="rounded-full border border-neutral-700 bg-neutral-950 px-5 py-3 text-sm text-neutral-100 placeholder:text-neutral-600"
              required
            />
            <button
              type="submit"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase text-neutral-950"
            >
              Enter
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-neutral-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header>
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">Admin</p>
          <h1 className="text-4xl font-semibold uppercase">Daily Bloom Generator</h1>
          <p className="mt-3 text-neutral-300">
            Generate, edit, and approve the savage daily Bloom. Nothing sends without your click.
          </p>
        </header>
        <AdminClient sequenceId={sequenceId} />
        <section className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-8">
          <h2 className="text-xl font-semibold uppercase">Recent Logs</h2>
          <div className="mt-4 space-y-4">
            {logs.length === 0 ? (
              <p className="text-sm text-neutral-400">No blooms yet. Generate the first one.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="rounded-2xl border border-neutral-800 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase text-neutral-400">
                    <span>{log.createdAt}</span>
                    <span>{log.status}</span>
                    <span>{log.mode} · {log.intensity}</span>
                  </div>
                  <p className="mt-3 whitespace-pre-line text-sm text-neutral-200">{log.content}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
