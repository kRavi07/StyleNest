// lib/server-auth.ts
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);

export type AuthUser = {
  sub: string;
  email?: string;
  [k: string]: any;
  role: string;
  id: string;
};

export async function getAuthUserFromRequest(
  req: NextRequest
): Promise<AuthUser | null> {
  const token = req.cookies.get("access_token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);

    return payload as AuthUser;
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    // shape: { sub, email, iat, exp, ... }
    return payload as AuthUser;
  } catch {
    return null;
  }
}

export async function requireAuthUser(): Promise<AuthUser | null> {
  const user = await getAuthUser();
  if (!user) return null;
  return user;
}

export async function requireAuthAdmin(): Promise<AuthUser | null> {
  const user = await requireAuthUser();
  if (!user || user.role.toLowerCase() !== "admin") return null;
  return user;
}

export async function requireRole(role: string) {
  const user = await getAuthUser();
  if (!user || user.role !== role) {
    throw new Error("Unauthorized");
  }
  return user;
}
