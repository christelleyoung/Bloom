import DailyBloomClient from "@/components/DailyBloomClient";
import EmailSignup from "@/components/EmailSignup";

const manifesto = `You want the glow? Earn it.

We don't do whisper-soft pep talks.
We do pressure, purpose, and proof.

You are not fragile.
You are under-trained.

So show up.
Do the rep.
Speak the truth.

Burn the excuses.
Keep the standards.

Bloom, biatch.`;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-10 px-6 py-24">
        <div className="space-y-6">
          <h1 className="text-5xl font-semibold uppercase leading-tight md:text-6xl">
            <span className="gradient-text">Bloom, biatch.</span>
          </h1>
          <p className="max-w-2xl text-xl text-neutral-300">
            Savage motivation for people doing hard things.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase text-neutral-950"
              href="#signup"
            >
              Bloom me daily
            </a>
            <a
              className="rounded-full border border-neutral-700 px-6 py-3 text-sm font-semibold uppercase text-neutral-100"
              href="#manifesto"
            >
              Read the manifesto
            </a>
          </div>
        </div>
      </section>

      <section id="manifesto" className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-8 text-3xl font-semibold uppercase">Manifesto</h2>
          <pre className="whitespace-pre-wrap text-lg text-neutral-200">
            {manifesto}
          </pre>
        </div>
      </section>

      <section id="signup" className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-3xl border border-neutral-800 p-10">
            <h2 className="text-3xl font-semibold uppercase">Get the daily Bloom</h2>
            <p className="mt-3 text-neutral-300">
              No crappy newsletter. Just short, sharp inspiration. That’s it.
            </p>
            <EmailSignup />
          </div>
        </div>
      </section>

      <section id="daily" className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <DailyBloomClient
            kicker="No signup"
            title="Or don’t sign up... I don’t care."
            description="Just take today’s kick in the ass and go. No commitment. No inbox. No excuses."
          />
        </div>
      </section>

      <section className="pb-40 pt-56">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Still scrolling?</p>
          <p className="mt-4 text-lg text-neutral-400">
            If you’re trying to find a sign, scrolling will get you nowhere. Just sign up and bloom.
          </p>
        </div>
      </section>

      <footer className="border-t border-neutral-800 px-6 py-10 text-sm text-neutral-500">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>© 2024 Bloombiatch</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-neutral-200">
              Privacy
            </a>
            <a href="/terms" className="hover:text-neutral-200">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
