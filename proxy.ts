import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as JWT | null;

  const path = req.nextUrl.pathname;

  // Public routes - allow access
  const publicRoutes = ["/", "/auth", "/properties", "/blog", "/contact"];

  const isPublicRoute =
    publicRoutes.includes(path) || path.startsWith("/property/");

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected routes require authentication
  if (!token) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // Admin routes - check role
  if (path.startsWith("/admin")) {
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Agent routes - check role
  if (path.startsWith("/agent")) {
    if (token.role !== "AGENT") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/agent/:path*",
    "/api/protected/:path*",
  ],
};
