import { NextRequest, NextResponse } from "next/server";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_KEY_V3;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, action } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token missing" },
        { status: 400 }
      );
    }

    const request = JSON.stringify({
      event: {
        token,
        expectedAction: action || "verify",
        siteKey: SITE_KEY,
      },
    });

    const verificationResponse = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/drimcot-1760268383782/assessments?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: request,
      }
    );

    const data = await verificationResponse.json();
    console.log("Captcha verification response:", data);

    // data.success is boolean
    if (data && data?.riskAnalysis?.score) {
      return NextResponse.json({
        success: true,
        score: data.riskAnalysis.score,
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Captcha verification failed" },
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
