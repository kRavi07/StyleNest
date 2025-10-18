import { NextRequest, NextResponse } from "next/server";

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY_V2;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token missing" },
        { status: 400 }
      );
    }

    const verificationResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${token}`,
      { method: "POST" }
    );

    const data = await verificationResponse.json();

    // data.success is boolean
    if (data.success) {
      return NextResponse.json({ success: true, score: data.score });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Captcha verification failed",
          detail: data["error-codes"],
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Captcha verification error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
