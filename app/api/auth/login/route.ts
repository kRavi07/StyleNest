import { NextResponse } from "next/server";
import User from "@/lib/db/models/user";
import {
  signAccessToken,
  signRefreshToken,
  persistRefreshToken,
  setAuthCookies,
} from "@/lib/auth/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.validatePassword(password))) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const payload = {
      id: String(user._id),
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken(payload),
      signRefreshToken(payload),
    ]);

    const ua = req.headers.get("user-agent") || undefined;
    const ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
      (req as any).ip ||
      undefined;

    await persistRefreshToken(String(user._id), refreshToken, {
      userAgent: ua,
      ip,
    });

    const res = NextResponse.json(
      {
        message: "Logged in",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
    setAuthCookies(res, accessToken, refreshToken);
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
