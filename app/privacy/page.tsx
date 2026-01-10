export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-20 text-neutral-100">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-4xl font-semibold uppercase">Privacy</h1>
        <hr className="border-neutral-800" />
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold uppercase">Privacy (the no-bullshit version)</h2>
          <p className="text-neutral-300">
            We respect your privacy. Not in a creepy, “we read everything” way — in a <em>mind your business</em> way.
          </p>
          <p className="text-neutral-300">Here’s the deal.</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold uppercase">What we collect</h3>
          <ul className="list-disc space-y-2 pl-6 text-neutral-300">
            <li>Your <strong>email address</strong> (if you give it to us)</li>
            <li>That’s basically it</li>
          </ul>
          <p className="text-neutral-300">We don’t ask for:</p>
          <ul className="list-disc space-y-2 pl-6 text-neutral-300">
            <li>your life story</li>
            <li>your trauma</li>
            <li>your star sign</li>
            <li>your search history</li>
          </ul>
          <p className="text-neutral-300">Just your email, so we can send you a Bloom.</p>
        </div>

        <hr className="border-neutral-800" />

        <div className="space-y-4">
          <h3 className="text-xl font-semibold uppercase">What we do with it</h3>
          <p className="text-neutral-300">We use your email to:</p>
          <ul className="list-disc space-y-2 pl-6 text-neutral-300">
            <li>send you Bloombiatch content</li>
            <li>deliver daily (or occasional) motivational messages</li>
            <li>run the site without it falling over</li>
          </ul>
          <p className="text-neutral-300">That’s it.</p>
          <p className="text-neutral-300">We do <strong>not</strong>:</p>
          <ul className="list-disc space-y-2 pl-6 text-neutral-300">
            <li>sell your data</li>
            <li>rent your data</li>
            <li>trade your data</li>
            <li>stalk you across the internet</li>
          </ul>
          <p className="text-neutral-300">If that ever changes, we’ll say so. Loudly.</p>
        </div>

        <hr className="border-neutral-800" />

        <div className="space-y-4">
          <h3 className="text-xl font-semibold uppercase">Emails &amp; unsubscribing</h3>
          <p className="text-neutral-300">Every email we send includes an <strong>unsubscribe link</strong>.</p>
          <p className="text-neutral-300">Click it. You’re out. No guilt. No drama.</p>
          <p className="text-neutral-300">We don’t chase people who leave. That’s weird.</p>
        </div>

        <hr className="border-neutral-800" />

        <div className="space-y-4">
          <h3 className="text-xl font-semibold uppercase">Third-party services</h3>
          <p className="text-neutral-300">
            We use a small number of trusted tools to keep this thing running (like email delivery and hosting).
          </p>
          <p className="text-neutral-300">They:</p>
          <ul className="list-disc space-y-2 pl-6 text-neutral-300">
            <li>only get what they need to function</li>
            <li>don’t get permission to do shady shit</li>
          </ul>
        </div>

        <hr className="border-neutral-800" />

        <div className="space-y-4">
          <h3 className="text-xl font-semibold uppercase">Cookies (the boring bit)</h3>
          <p className="text-neutral-300">Yes, the site may use basic cookies or analytics so we know:</p>
          <ul className="list-disc space-y-2 pl-6 text-neutral-300">
            <li>if the site works</li>
            <li>if people actually show up</li>
          </ul>
          <p className="text-neutral-300">No invasive tracking. No creepy profiling.</p>
        </div>

        <hr className="border-neutral-800" />

        <div className="space-y-4">
          <h3 className="text-xl font-semibold uppercase">Security</h3>
          <p className="text-neutral-300">We take reasonable steps to keep your information safe.</p>
          <p className="text-neutral-300">
            That said, the internet is the internet. Nothing is 100% bulletproof. We do our best.
          </p>
        </div>

        <hr className="border-neutral-800" />

        <div className="space-y-4">
          <h3 className="text-xl font-semibold uppercase">Changes</h3>
          <p className="text-neutral-300">If we update this policy, we’ll update this page.</p>
          <p className="text-neutral-300">No sneaky retroactive nonsense.</p>
        </div>

        <hr className="border-neutral-800" />

        <div className="space-y-4">
          <h3 className="text-xl font-semibold uppercase">Questions?</h3>
          <p className="text-neutral-300">
            If you have a genuine question about privacy, you can contact us via the site.
          </p>
          <p className="text-neutral-300">
            If you’re looking for a 40-page legal document full of jargon — this isn’t that.
          </p>
        </div>

        <hr className="border-neutral-800" />

        <div className="space-y-4">
          <p className="text-neutral-300">
            <strong>Short version:</strong> We don’t want your data. We don’t sell your data. We just want to send you something that kicks you forward.
          </p>
          <p className="text-neutral-300">Bloom on, biatch. 🌸</p>
        </div>
      </div>
    </main>
  );
}
