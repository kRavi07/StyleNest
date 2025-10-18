// lib/ratelimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Key = route pattern (exact or wildcard *)
 * Value = limiter config
 */
export const rateLimiters: Record<string, Ratelimit> = {
  "/api/auth/*": new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(5, "60 s"), // all auth routes share 5 req/min
  }),
  "/api/checkout": new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "60 s"), // 3 checkouts / 30 sec
  }),
};
