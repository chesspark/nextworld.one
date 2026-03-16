import { NextRequest, NextResponse } from "next/server";

const ADMIN_USER = "admin";
const ADMIN_PASS = "damienbzh";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("nw_auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("nw_auth");
  return response;
}
