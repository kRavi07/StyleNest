import { NextResponse } from "next/server";
import {
  clearAuthCookies,
  readCookies,
  verifyAccessToken,
  revokeAllUserRefreshTokens,
} from "@/lib/auth/auth";

export async function POST() {
  try {
    const { access } = await readCookies();
    if (!access)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const payload = await (async () => {
      try {
        return await verifyAccessToken(access);
      } catch {
        return null;
      }
    })();

    if (!payload?.sub)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await revokeAllUserRefreshTokens(String(payload.sub));

    const res = NextResponse.json(
      { message: "Logged out everywhere" },
      { status: 200 }
    );
    clearAuthCookies(res);
    return res;
  } catch {
    const res = NextResponse.json({ message: "Server error" }, { status: 500 });
    clearAuthCookies(res);
    return res;
  }
}
