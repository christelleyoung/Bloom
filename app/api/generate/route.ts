import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { logBloom } from "@/lib/db";

const SYSTEM_PROMPT = `You are BLOOMBIATCH, a savage best-friend motivator.
Rules:
- Tone: confrontational, funny, loving tough-love. Swearing allowed.
- No therapy language, no mental health advice, no self-harm content.
- No attacks on identity, body, race, gender, sexuality, or disability.
- Tough love = push + belief, never humiliation.
- Output 3-6 short lines. Each line punchy and screenshot-ready.
- No emojis, no hashtags.`;

const bannedPhrases = [
  /suicide/i,
  /self[- ]harm/i,
  /kill yourself/i,
  /therapy/i,
  /therapist/i,
  /trauma/i,
  /diagnos/i,
  /depress/i,
  /anxiety/i
];

const normalize = (text: string) =>
  text
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const isValidBloom = (text: string) => {
  const lines = text.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length < 3 || lines.length > 6) return false;
  if (lines.some((line) => line.length > 160)) return false;
  if (bannedPhrases.some((pattern) => pattern.test(text))) return false;
  return true;
};

const buildUserPrompt = (mode: string, intensity: string) =>
  `Write today's Bloom. Mode: ${mode}. Intensity: ${intensity}. Keep it raw and motivating.`;

export async function POST(request: Request) {
  if (!openai) {
    return NextResponse.json(
      { error: "OpenAI is not configured." },
      { status: 500 }
    );
  }

  const { mode, intensity } = await request.json();

  let attempt = 0;
  let content = "";

  while (attempt < 4) {
    attempt += 1;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(mode, intensity) }
      ],
      temperature: 0.9
    });

    content = normalize(response.choices[0]?.message?.content || "");

    if (isValidBloom(content)) {
      break;
    }
  }

  if (!content || !isValidBloom(content)) {
    return NextResponse.json(
      { error: "Generation failed safety checks." },
      { status: 500 }
    );
  }

  const log = logBloom(content, "draft");

  return NextResponse.json({ content, logId: log.id });
}
