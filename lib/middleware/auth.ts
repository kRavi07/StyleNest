import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

const publicPathPatterns = [
  /^\/$/,
  /^\/auth\/(login|register)$/,
  /^\/products(\/.*)?$/,
  /^\/cart$/,
  /^\/api\/auth\/(login|register)$/,
  /^\/api\/products(\/.*)?$/,
  /^\/api\/search-product$/,
  /^\/api\/captcha-verify(\/.*)?$/,
];

export async function AuthMiddleware(
  req: NextRequest,
  _event: NextFetchEvent,
  next: () => Promise<NextResponse>
) {
  const { pathname } = req.nextUrl;

  const isPublicPath = publicPathPatterns.some((pattern) =>
    pattern.test(pathname)
  );

  console.log("Middleware running on:", pathname, "Is public:", isPublicPath);

  if (!isPublicPath) {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return next();
}
