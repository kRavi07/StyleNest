import { NextResponse } from "next/server";
import {
  clearAuthCookies,
  readCookies,
  verifyRefreshToken,
  revokeRefreshToken,
} from "@/lib/auth/auth";

export async function POST() {
  try {
    const { refresh } = await readCookies();
    const res = NextResponse.json({ message: "Logged out" }, { status: 200 });

    if (refresh) {
      try {
        const payload = await verifyRefreshToken(refresh);
        const userId = String(payload.sub);
        await revokeRefreshToken(userId, refresh);
      } catch {}
    }

    clearAuthCookies(res);
    return res;
  } catch {
    const res = NextResponse.json({ message: "Server error" }, { status: 500 });
    clearAuthCookies(res);
    return res;
  }
}
