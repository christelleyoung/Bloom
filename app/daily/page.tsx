import DailyBloomClient from "@/components/DailyBloomClient";

export const dynamic = "force-dynamic";

export default function DailyBloomPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-20 text-neutral-100">
      <div className="mx-auto max-w-3xl">
        <DailyBloomClient />
      </div>
    </main>
  );
}
