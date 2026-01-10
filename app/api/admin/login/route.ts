import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = formData.get("password");

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.redirect(new URL("/admin", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  response.cookies.set("bloombiatch-admin", "true", {
    httpOnly: true,
    sameSite: "strict",
  });
  return response;
}
