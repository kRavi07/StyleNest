import { requireAuthUser } from "@/lib/auth/server-auth";
import Review from "@/lib/db/models/review";
import connectToDatabase from "@/lib/db/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // optional: filter by product
    const productId = req.nextUrl.searchParams.get("productId");

    const query: any = { isApproved: true };
    if (productId) query.product = productId;

    const reviews = await Review.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const user = await requireAuthUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    body.user = user._id;

    if (!body.user || !body.product || !body.rating || !body.comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const review = await Review.create({
      ...body,
      isApproved: false,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
