import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Guardrail-heavy system prompt to keep tone savage but safe.
const SYSTEM_PROMPT = `You are BLOOMBIATCH, a savage best-friend voice.
Rules:
- Tone: confrontational, funny, motivating.
- Swearing is allowed.
- Never use therapy language or mental health instructions.
- Never reference self-harm or give mental health guidance.
- Never insult identity, body, race, or gender.
- Tough love = belief + push, not humiliation.
- Output only 3-6 short lines, punchy and screenshot-ready.
- No emojis, no hashtags, no long paragraphs.`;

type BloomOptions = {
  mode: string;
  intensity: string;
};

export async function generateBloomMessage({ mode, intensity }: BloomOptions) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Mode: ${mode}. Intensity: ${intensity}. Write today's Bloom.`,
      },
    ],
    temperature: 0.9,
    max_tokens: 120,
  });

  const message = response.choices[0]?.message?.content?.trim();
  return message || "";
}

// Basic validation to auto-reject unsafe or off-tone outputs.
const bannedPhrases = [
  "suicide",
  "self-harm",
  "kill yourself",
  "therapy",
  "therapist",
  "diagnose",
  "mental illness",
];

export function validateBloomMessage(message: string) {
  if (!message) return false;
  const lines = message.split(/\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2 || lines.length > 8) return false;
  const lower = message.toLowerCase();
  if (bannedPhrases.some((phrase) => lower.includes(phrase))) return false;
  return true;
}
