import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sendTestBloomEmail } from "@/lib/admin";

export async function POST(request: Request) {
  const isAuthed = cookies().get("bloombiatch-admin")?.value === "true";
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { email, content } = await request.json();
  const parsedEmail = String(email || "").trim();
  const parsedContent = String(content || "").trim();

  if (!parsedEmail || !parsedContent) {
    return NextResponse.json({ error: "Test email and content are required." }, { status: 400 });
  }

  try {
    const result = await sendTestBloomEmail(parsedEmail, parsedContent);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send test email.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
