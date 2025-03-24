import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const authStore = JSON.parse(localStorage.getItem("auth-store") || "{}");
  const user = authStore.state?.user;

  if (!user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const role = user.role;
  const pathname = req.nextUrl.pathname;

  if (role === "user" && pathname.startsWith("/ambassador-dashboard")) {
    return NextResponse.redirect(new URL("/admin-dashboard", req.url));
  }

  if (role === "ambassador" && pathname.startsWith("/admin-dashboard")) {
    return NextResponse.redirect(new URL("/ambassador-dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/admin-dashboard", "/ambassador-dashboard"],
};
