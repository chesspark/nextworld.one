import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const auth = request.cookies.get("nw_auth");

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!auth || auth.value !== "authenticated") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
