"use client";

import { useState } from "react";

export default function EmailSignup() {
  const problemOptions = [
    "Uni",
    "Work",
    "Health",
    "Relationships",
    "Money",
    "Confidence",
    "Rebuild",
    "Angry",
  ];
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [bloomProblem, setBloomProblem] = useState(problemOptions[0]);
  const [bloomIntensity, setBloomIntensity] = useState("Hard");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          bloomProblem,
          bloomIntensity,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Something went wrong.");
      }

      setStatus("success");
      setMessage("Good. You’re in. Check your inbox, bitch.");
      setEmail("");
      setFirstName("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
      <input
        className="w-full rounded-full border border-neutral-700 bg-neutral-950 px-5 py-3 text-sm text-neutral-100 placeholder:text-neutral-600"
        type="text"
        name="firstName"
        placeholder="What should we call you? (optional)"
        value={firstName}
        onChange={(event) => setFirstName(event.target.value)}
      />
      <input
        className="w-full rounded-full border border-neutral-700 bg-neutral-950 px-5 py-3 text-sm text-neutral-100 placeholder:text-neutral-600"
        type="email"
        name="email"
        placeholder="you@domain.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <label className="text-xs uppercase text-neutral-400">
        What’s your blooming problem?
        <select
          name="bloomProblem"
          className="mt-2 w-full rounded-full border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm text-neutral-100"
          value={bloomProblem}
          onChange={(event) => setBloomProblem(event.target.value)}
        >
          {problemOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs uppercase text-neutral-400">
        Intensity
        <select
          name="bloomIntensity"
          className="mt-2 w-full rounded-full border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm text-neutral-100"
          value={bloomIntensity}
          onChange={(event) => setBloomIntensity(event.target.value)}
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
        className="rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase text-neutral-950"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Adding you..." : "Bloom me daily"}
      </button>
      {message ? (
        <p
          className={`text-sm ${
            status === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
