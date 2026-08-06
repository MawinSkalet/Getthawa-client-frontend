// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  let isAuth = false;
  const token = req.cookies.get("info")?.value;
  const pathname = req.nextUrl.pathname;

  // Skip auth check if no token
  if (!token) {
    // Continue with isAuth = false
  } else {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );

      if (payload && payload.id) {
        isAuth = true;
      }
    } catch {
      // If auth API fails, assume not authenticated for security
      isAuth = false;
    }
  }

  const protectedRoutes = ["/booking", "/profile"];

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected && !isAuth) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_API_URL}/line/authentication`
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/booking/:path*", "/profile/:path*"],
};
