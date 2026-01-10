import EmailSignup from "@/components/EmailSignup";

const manifesto = `I am not your therapist.
I am the friend who loves you enough to tell the truth.

You do hard things.
You survive what scares other people.

No soft lies.
No sugar-coating.
No hiding in your excuses.

You are allowed to feel the fear.
You are not allowed to stay there.

Get up.
Do the thing.
Bloom, bitch.`;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-start justify-center px-6 py-24">
        <p className="text-sm uppercase tracking-[0.4em] text-emerald-300">
          BLOOMBIATCH
        </p>
        <h1 className="mt-4 text-5xl font-semibold leading-tight sm:text-6xl">
          Bloom, bitch.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-neutral-300">
          Savage motivation for people doing hard things.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#signup"
            className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-300"
          >
            Bloom me daily
          </a>
          <a
            href="#manifesto"
            className="rounded-full border border-neutral-700 px-6 py-3 text-sm font-semibold text-neutral-100 transition hover:border-neutral-400"
          >
            Read the manifesto
          </a>
        </div>
      </section>

      <section
        id="manifesto"
        className="border-t border-neutral-800 bg-neutral-950 px-6 py-20"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold">The Bloombiatch Manifesto</h2>
          <pre className="mt-6 whitespace-pre-wrap text-lg leading-relaxed text-neutral-200">
            {manifesto}
          </pre>
        </div>
      </section>

      <section
        id="signup"
        className="border-t border-neutral-800 bg-neutral-950 px-6 py-20"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold">Get the daily Bloom</h2>
          <p className="mt-4 max-w-xl text-neutral-300">
            Short, savage, and ready to screenshot. We send one a day. No spam.
          </p>
          <EmailSignup />
        </div>
      </section>

      <section className="border-t border-neutral-800 bg-neutral-950 px-6 py-32">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
            No Signup
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            Or don’t sign up... I don’t care.
          </h2>
          <p className="mt-4 max-w-2xl text-neutral-300">
            Just take today’s kick in the ass and go. No commitment. No inbox. No
            excuses.
          </p>
          <button className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200">
            Generate today’s Bloom
          </button>
          <div className="mt-6 rounded-3xl border border-neutral-800 bg-neutral-950 p-6 text-sm text-neutral-200">
            <p>Listen up, legend.</p>
            <p>Hard mode means you don’t get to whine today.</p>
            <p>Get off your ass and prove you can handle it.</p>
            <p>Excuses are for rookies — let’s crush this.</p>
            <p>Now get moving and show the world who’s boss.</p>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-800 bg-neutral-950 px-6 py-32">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold">Still scrolling?</h2>
          <p className="mt-4 max-w-2xl text-neutral-300">
            If you’re trying to find a sign, scrolling will get you nowhere.
            Just sign up and bloom. Or you can always read the privacy and
            terms, they are pretty fun... kinda meditative! Enjoy your fabulous
            day!
          </p>
        </div>
      </section>

      <footer className="border-t border-neutral-800 px-6 py-10 text-sm text-neutral-500">
        <div className="mx-auto flex max-w-4xl flex-col gap-2 sm:flex-row sm:justify-between">
          <span>© 2024 Bloombiatch</span>
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
