import { NextResponse } from "next/server";
import { generateBloomMessage, getFallbackBloomMessage, validateBloomMessage } from "@/lib/openai";

const MAX_ATTEMPTS = 3;

export async function GET(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY." }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") || "Daily";
  const intensity = searchParams.get("intensity") || "Hard";

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const message = await generateBloomMessage({ mode, intensity });
    if (validateBloomMessage(message)) {
      return NextResponse.json({ message });
    }
  }

  return NextResponse.json({ message: getFallbackBloomMessage() });
}
