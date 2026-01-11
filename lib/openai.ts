import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

export const openai = apiKey
  ? new OpenAI({ apiKey })
  : null;
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Guardrail-heavy system prompt to keep tone savage but safe.
const SYSTEM_PROMPT = `You are BLOOMBIATCH, a savage best-friend voice.
Rules:
- Tone: confrontational, funny, motivating, kind but in a savage way. 
- Swearing is allowed.
- Never use therapy language or mental health instructions.
- Never reference self-harm or give mental health guidance.
- Never insult identity, body, race, or gender.
- Tough love = belief + push, not humiliation.
- Output 3-6 short lines, punchy and screenshot-ready.
- Each line should be under 80 characters.
- No emojis, no hashtags, no long paragraphs.`;

type BloomOptions = {
  mode: string;
  intensity: string;
};

const fallbackLines = [
  "Stand up. Lock in.",
  "Do the next hard thing.",
  "Stop negotiating with excuses.",
  "You said you wanted this. Prove it.",
  "Bloom, biatch.",
];

function coerceBloomMessage(message: string) {
  if (!message) return fallbackLines.join("\n");
  const cleaned = message
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (cleaned.length === 0) return fallbackLines.join("\n");
  if (cleaned.length > 8) return cleaned.slice(0, 8).join("\n");
  if (cleaned.length < 2) {
    return [...cleaned, ...fallbackLines].slice(0, 3).join("\n");
  }

  return cleaned.join("\n");
}

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

  const message = response.choices[0]?.message?.content?.trim() || "";
  return coerceBloomMessage(message);
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

export function getFallbackBloomMessage() {
  return fallbackLines.join("\n");
}
