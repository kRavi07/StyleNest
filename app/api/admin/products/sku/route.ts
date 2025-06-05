// /api/products/sku/route.ts
import Product from "@/lib/db/models/product";
import connectToDatabase from "@/lib/db/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { sku } = await req.json();

  if (!sku) {
    return NextResponse.json(
      { available: false, error: "Missing SKU" },
      { status: 400 }
    );
  }

  await connectToDatabase();

  const exists = await Product.exists({
    $or: [
      { sku: { $regex: `^${sku}$`, $options: "i" } }, // case-insensitive match
      { "variants.sku": { $regex: `^${sku}$`, $options: "i" } },
    ],
  });

  return NextResponse.json({ available: !exists });
}
