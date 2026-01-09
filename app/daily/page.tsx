import { getLatestBloom } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function DailyBloomPage() {
  const latest = getLatestBloom("sent") ?? getLatestBloom("approved");

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-20 text-neutral-100">
      <div className="mx-auto max-w-3xl space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">Daily Bloom</p>
        <h1 className="text-4xl font-semibold uppercase">Today’s Bloom</h1>
        {latest ? (
          <div className="rounded-3xl border border-neutral-800 p-8">
            <p className="whitespace-pre-line text-lg text-neutral-100">{latest.content}</p>
            <p className="mt-4 text-xs uppercase text-neutral-500">{latest.createdAt}</p>
          </div>
        ) : (
          <p className="text-neutral-300">No Blooms yet. Check back soon.</p>
        )}
      </div>
    </main>
  );
}
