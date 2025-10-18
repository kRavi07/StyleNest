import { NextRequest, NextResponse } from "next/server";
import { Waitlist } from "@/lib/db/models/waitlist";
import connectToDatabase from "@/lib/db/mongoose";
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: 3,
  duration: 600, // 3 requests / 10 min
});

async function rateLimit(clientId: string) {
  try {
    await rateLimiter.consume(clientId);
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, mobile, clientId } = body;

  if (!clientId || typeof clientId !== "string")
    return NextResponse.json(
      { message: "Missing client identifier" },
      { status: 400 }
    );

  if (!(await rateLimit(clientId)))
    return NextResponse.json(
      { message: "Too many requests. Try again later" },
      { status: 429 }
    );

  if (!name || typeof name !== "string" || name.length < 2)
    return NextResponse.json({ message: "Invalid name" }, { status: 400 });

  if (!email || typeof email !== "string")
    return NextResponse.json({ message: "Invalid email" }, { status: 400 });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return NextResponse.json(
      { message: "Invalid email format" },
      { status: 400 }
    );

  // Mobile: optional, but if present, must be 10 digits
  if (mobile && !/^\d{10}$/.test(mobile))
    return NextResponse.json(
      { message: "Mobile number must be exactly 10 digits" },
      { status: 400 }
    );

  await connectToDatabase();

  try {
    const existing = await Waitlist.findOne({ email });
    if (existing)
      return NextResponse.json(
        { message: "Email already subscribed" },
        { status: 400 }
      );

    await Waitlist.create({ name, email, mobile, clientId });
    return NextResponse.json(
      { message: "Subscribed successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
