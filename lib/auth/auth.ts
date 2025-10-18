import dotenv from "dotenv";
import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import RefreshToken from "@/lib/db/models/refresh-token";
dotenv.config();

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET!
);

const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || "1d";
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || "7d";

function ttlToMs(ttl: string): number {
  // supports "15m", "7d", "3600" (seconds)
  const m = /^(\d+)([smhd])?$/.exec(ttl);
  if (!m) throw new Error("Bad TTL: " + ttl);
  const n = parseInt(m[1], 10);
  const unit = m[2] || "s";
  const mult =
    unit === "s"
      ? 1000
      : unit === "m"
        ? 60000
        : unit === "h"
          ? 3600000
          : 86400000;
  return n * mult;
}

export async function signAccessToken(payload: object) {
  const expMs = ttlToMs(ACCESS_TOKEN_TTL);
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor((Date.now() + expMs) / 1000))
    .sign(ACCESS_SECRET);
}

export async function signRefreshToken(payload: object) {
  const expMs = ttlToMs(REFRESH_TOKEN_TTL);
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor((Date.now() + expMs) / 1000))
    .sign(REFRESH_SECRET);
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, ACCESS_SECRET);
  return payload;
}

export async function verifyRefreshToken(token: string) {
  const { payload } = await jwtVerify(token, REFRESH_SECRET);
  return payload;
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function cookieOptions(maxAgeSeconds: number) {
  // Secure cookie defaults
  return {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    path: "/",
    maxAge: maxAgeSeconds,
    ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
  };
}

export function setAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken: string
) {
  const accessMaxAge = Math.floor(ttlToMs(ACCESS_TOKEN_TTL) / 1000);
  const refreshMaxAge = Math.floor(ttlToMs(REFRESH_TOKEN_TTL) / 1000);
  res.cookies.set("access_token", accessToken, cookieOptions(accessMaxAge));
  res.cookies.set("refresh_token", refreshToken, cookieOptions(refreshMaxAge));
}

export function clearAuthCookies(res: NextResponse) {
  const base = cookieOptions(0);
  res.cookies.set("access_token", "", { ...base, maxAge: 0 });
  res.cookies.set("refresh_token", "", { ...base, maxAge: 0 });
}

export async function readCookies() {
  const jar = await cookies();
  return {
    access: jar.get("access_token")?.value,
    refresh: jar.get("refresh_token")?.value,
  };
}

export async function persistRefreshToken(
  userId: string,
  refreshToken: string,
  meta?: { userAgent?: string; ip?: string }
) {
  const expiresMs = ttlToMs(REFRESH_TOKEN_TTL);
  const doc = await RefreshToken.create({
    userId,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + expiresMs),
    userAgent: meta?.userAgent,
    ipAddress: meta?.ip,
  });
  return doc;
}

export async function revokeRefreshToken(userId: string, refreshToken: string) {
  const tokenHash = hashToken(refreshToken);
  await RefreshToken.deleteOne({ userId, tokenHash });
}

export async function revokeAllUserRefreshTokens(userId: string) {
  await RefreshToken.deleteMany({ userId });
}

export async function isStoredRefreshTokenValid(
  userId: string,
  refreshToken: string
) {
  const tokenHash = hashToken(refreshToken);
  const doc = await RefreshToken.findOne({
    userId,
    tokenHash,
    expiresAt: { $gt: new Date() },
  }).lean();
  return !!doc;
}

export function handleAuthError(error: any) {
  if (
    error.message === "Authentication failed" ||
    error.message === "No token provided"
  ) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { success: false, error: "Internal server error" },
    { status: 500 }
  );
}
