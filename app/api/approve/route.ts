import { NextResponse } from "next/server";
import { sendBroadcast, sendSequenceStep } from "@/lib/convertkit";
import { logBloom, updateBloomStatus } from "@/lib/db";

export async function POST(request: Request) {
  const { content, logId, delivery } = await request.json();

  if (!content) {
    return NextResponse.json({ error: "Content is required." }, { status: 400 });
  }

  const subject = "Bloom, bitch.";
  const finalId = logId
    ? Number(logId)
    : logBloom(content, "approved").id;

  if (!logId) {
    updateBloomStatus(finalId, "approved");
  }

  try {
    if (delivery === "sequence") {
      await sendSequenceStep(subject, content);
    } else {
      await sendBroadcast(subject, content);
    }
    updateBloomStatus(finalId, "sent");
    return NextResponse.json({ ok: true });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
