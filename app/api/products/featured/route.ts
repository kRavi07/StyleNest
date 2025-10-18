import Product from "@/lib/db/models/product";
import connectToDatabase from "@/lib/db/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    const [products] = await Promise.all([
      Product.find({ featured: true, isActive: true })
        .sort({ createdAt: -1 })
        .limit(15)
        .populate("category")
        .select(
          "-description  -specifications  -attributes -seo -archivedAt -createdAt -updatedAt -__v"
        )
        .lean()
        .exec(),
    ]);
    const responseData = {
      data: products,
    };

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Products API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
