import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import { rateLimiters } from "../rateLimit";

function matchLimiter(path: string) {
  for (const pattern in rateLimiters) {
    if (pattern.endsWith("*")) {
      const base = pattern.replace("*", "");
      if (path.startsWith(base)) return rateLimiters[pattern];
    }
    if (pattern === path) return rateLimiters[pattern];
  }
  return null;
}

export async function RateLimitMiddleware(
  req: NextRequest,
  _event: NextFetchEvent,
  next: () => Promise<NextResponse>
) {
  const { pathname } = req.nextUrl;
  const limiter = matchLimiter(pathname);

  if (limiter) {
    const ip =
      req.headers.get("x-real-ip") ??
      req.headers.get("x-forwarded-for") ??
      "unknown";

    const { success, limit, remaining, reset } = await limiter.limit(
      ip + pathname
    );

    if (!success) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests, slow down." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }
  }

  return next();
}
