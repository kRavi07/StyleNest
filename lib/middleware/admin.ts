import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { getAuthUserFromRequest } from "../auth/server-auth";

export async function AdminMiddleware(
  req: NextRequest,
  _event: NextFetchEvent,
  next: () => Promise<NextResponse>
) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/admin") || pathname.startsWith("/admin")) {
    const token = req.cookies.get("access_token")?.value;

    if (!token && pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (!token && pathname.startsWith("/api/admin")) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized, no token" },
        { status: 401 }
      );
    }

    const user = await getAuthUserFromRequest(req);

    if (!user)
      return NextResponse.json(
        { error: "Unauthorized, no user" },
        { status: 401 }
      );

    if (!user || (user.role !== "admin" && pathname.startsWith("/admin"))) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    if (!user || (user.role !== "admin" && pathname.startsWith("/api/admin"))) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }
  }

  return next();
}
