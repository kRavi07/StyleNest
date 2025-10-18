// /api/products/[id]/related/route.ts
import Product from "@/lib/db/models/product";
import connectToDatabase from "@/lib/db/mongoose";
import { NextRequest, NextResponse } from "next/server";
type Params = {
  params: Promise<{
    id: string;
  }>;
};
export async function GET(req: NextRequest, { params }: Params) {
  await connectToDatabase();
  const { id } = await params;
  const product = await Product.findById(id);
  if (!product)
    return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const related = await Product.find({
    _id: { $ne: id },
    category: product.category,
  })
    .limit(6)
    .lean();

  return NextResponse.json({ related });
}
