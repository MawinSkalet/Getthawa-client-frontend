import { NextRequest, NextResponse } from "next/server";
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("info")?.value;
  let authenticated = false;
  if (token) {
    try {
      const base = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://backend:8000";
      const response = await fetch(base + "/userinfo/me", {headers:{Cookie: "info=" + token},cache:"no-store",signal:AbortSignal.timeout(5000)});
      authenticated = response.ok;
    } catch { authenticated = false; }
  }
  if (!authenticated) {
    const url = new URL("/login",req.url);
    url.searchParams.set("next",req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = {matcher:["/booking/:path*","/profile/:path*"]};
