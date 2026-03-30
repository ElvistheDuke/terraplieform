import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, signPayload } from "@/lib/session";

export async function POST(request: NextRequest) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const body = await request.json();
  const { username, password } = body ?? {};

  if (username !== "admin" || password !== "bayo1234") {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const signed = await signPayload("admin", secret);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, signed, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
  return response;
}
