import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { approveBloomSend } from "@/lib/admin";

export async function POST(request: Request) {
  const isAuthed = cookies().get("bloombiatch-admin")?.value === "true";
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { logId, content } = await request.json();
  const parsedId = Number(logId);
  const parsedContent = String(content || "").trim();

  if (!parsedId || !parsedContent) {
    return NextResponse.json({ error: "Missing draft content." }, { status: 400 });
  }

  try {
    const result = await approveBloomSend(parsedId, parsedContent);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send to Kit.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
