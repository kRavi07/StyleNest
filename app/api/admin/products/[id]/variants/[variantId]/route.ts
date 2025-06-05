// /api/products/[id]/variants/[variantId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/db/models/product";
import connectToDatabase from "@/lib/db/mongoose";
import { UpdateVariantSchema } from "@/lib/validation/product"; // Your Zod schema

type Params = Promise<{
  params: { id: string; variantId: string };
}>;

export async function PATCH(req: NextRequest, params: Params) {
  const param = (await params).params;
  if (!param || !param.id || !param.variantId) {
    return NextResponse.json(
      { error: "Product ID and variant ID are required" },
      { status: 400 }
    );
  }
  const { id, variantId } = param;

  await connectToDatabase();

  const body = await req.json();
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
  const parsed = UpdateVariantSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", message: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updateFields = parsed.data;

  const product = await Product.findOne({ _id: id });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const variant = product.variants.id(variantId);

  if (!variant) {
    return NextResponse.json({ error: "Variant not found" }, { status: 404 });
  }

  // Update only provided fields
  Object.assign(variant, updateFields);

  await product.save();

  return NextResponse.json({ success: true, variant });
}
