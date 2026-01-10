import { NextResponse } from "next/server";
import { subscribeToKit } from "@/lib/convertkit";

export async function POST(request: Request) {
  const { email, firstName, bloomProblem, bloomIntensity } = await request.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  try {
    await subscribeToKit({
      email,
      firstName,
      bloomProblem,
      bloomIntensity,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to subscribe.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
