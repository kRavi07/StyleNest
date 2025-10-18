import type { NextRequest, NextFetchEvent } from "next/server";
import { createMiddlewareRunner } from "./lib/middleware/runner";
import { RateLimitMiddleware } from "./lib/middleware/ratelimiter";
import { AdminMiddleware } from "./lib/middleware/admin";
import { AuthMiddleware } from "./lib/middleware/auth";

const runMiddlewares = createMiddlewareRunner([
  RateLimitMiddleware,
  AdminMiddleware,
  AuthMiddleware,
]);

export function middleware(req: NextRequest, event: NextFetchEvent) {
  return runMiddlewares(req, event);
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/account/:path*", "/dashboard"],
};
