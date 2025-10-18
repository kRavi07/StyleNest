import { NextResponse } from "next/server";
import {
  readCookies,
  verifyRefreshToken,
  isStoredRefreshTokenValid,
  revokeRefreshToken,
  signAccessToken,
  signRefreshToken,
  setAuthCookies,
  persistRefreshToken,
} from "@/lib/auth/auth";

export async function POST(req: Request) {
  try {
    const { refresh } = await readCookies();
    if (!refresh) {
      return NextResponse.json(
        { message: "No refresh token" },
        { status: 401 }
      );
    }

    // Verify signature & expiry
    const payload = await verifyRefreshToken(refresh);
    const userId = String(payload.sub);

    // Match against DB (revocable)
    const isValid = await isStoredRefreshTokenValid(userId, refresh);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid or revoked refresh token" },
        { status: 401 }
      );
    }

    // Rotate: revoke old, issue new
    await revokeRefreshToken(userId, refresh);

    const newPayload = { id: userId, email: payload.email };
    const [newAccess, newRefresh] = await Promise.all([
      signAccessToken(newPayload),
      signRefreshToken(newPayload),
    ]);

    const ua = req.headers.get("user-agent") || undefined;
    const ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
      (req as any).ip ||
      undefined;

    await persistRefreshToken(userId, newRefresh, { userAgent: ua, ip });

    const res = NextResponse.json({ message: "Refreshed" }, { status: 200 });
    setAuthCookies(res, newAccess, newRefresh);
    return res;
  } catch {
    // Signature/expiry errors land here
    return NextResponse.json(
      { message: "Invalid or expired refresh token" },
      { status: 401 }
    );
  }
}
