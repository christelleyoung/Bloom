import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { generateBloomDraft } from "@/lib/admin";

export async function POST(request: Request) {
  const isAuthed = cookies().get("bloombiatch-admin")?.value === "true";
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY." }, { status: 500 });
  }

  const { mode, intensity } = await request.json();
  const result = await generateBloomDraft(String(mode || "Work"), String(intensity || "Hard"));
  return NextResponse.json(result);
}
