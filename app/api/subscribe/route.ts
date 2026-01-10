import { NextResponse } from "next/server";
import { subscribeEmail } from "@/lib/convertkit";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  try {
    await subscribeEmail(email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
