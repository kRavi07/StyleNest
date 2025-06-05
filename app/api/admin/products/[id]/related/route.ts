// /api/products/[id]/related/route.ts
import Product from "@/lib/db/models/product";
import connectToDatabase from "@/lib/db/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  const product = await Product.findById(params.id);
  if (!product)
    return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const related = await Product.find({
    _id: { $ne: params.id },
    category: product.category,
  })
    .limit(6)
    .lean();

  return NextResponse.json({ related });
}
