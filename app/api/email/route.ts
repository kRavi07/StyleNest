import { registrationEmailHtml } from "@/lib/service/email-sender";
import { sendEmail } from "@/lib/service/email/nodemailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const { name, email, subject } = data;

  try {
    const emailHtml = await registrationEmailHtml(email, name, "123456");

    await sendEmail({ to: email, html: emailHtml, subject });

    return NextResponse.json({
      status: 200,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Failed to send email",
      },
      {
        status: 500,
      }
    );
  }
}
