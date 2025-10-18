import Review from "@/lib/db/models/review";
import connectToDatabase from "@/lib/db/mongoose";
import { NextRequest, NextResponse } from "next/server";

// middleware or token check can be added here for admin authorization

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // optional: filter by product or user
    const productId = req.nextUrl.searchParams.get("productId");
    const userId = req.nextUrl.searchParams.get("userId");

    const query: any = {};
    if (productId) query.product = productId;
    if (userId) query.user = userId;

    const reviews = await Review.find(query)
      .populate("user", "name email")
      .populate("product", "name sku")
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // body: { reviewId, isApproved }
    const { reviewId, isApproved } = body;
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { isApproved },
      { new: true }
    );

    return NextResponse.json(review);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const reviewId = req.nextUrl.searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json({ error: "reviewId required" }, { status: 400 });
    }

    await Review.findByIdAndDelete(reviewId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
