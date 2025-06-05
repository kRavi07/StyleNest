// /api/products/slug-check/route.ts
import Product from "@/lib/db/models/product";
import connectToDatabase from "@/lib/db/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { slug } = await req.json();

  if (!slug)
    return NextResponse.json(
      { available: false, error: "Missing slug" },
      { status: 400 }
    );
  await connectToDatabase();

  const exists = await Product.exists({ slug });
  return NextResponse.json({ available: !exists });
}
