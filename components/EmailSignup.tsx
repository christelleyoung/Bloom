"use client";

import { useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Signup failed.");
      }

      setStatus("success");
      setMessage("Good. You’re in. Check your inbox, bitch.");
      setEmail("");
    } catch (error) {
      const err = error as Error;
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="mt-8 flex w-full max-w-xl flex-col gap-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@domain.com"
          className="flex-1 rounded-full border border-neutral-700 bg-neutral-900 px-5 py-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Blooming..." : "Bloom me daily"}
        </button>
      </div>
      {message ? (
        <p
          className={`text-sm ${
            status === "success" ? "text-emerald-300" : "text-red-300"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
