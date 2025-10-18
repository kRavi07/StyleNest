import Product from "@/lib/db/models/product";
import connectToDatabase from "@/lib/db/mongoose";
import { processFileUpload } from "@/lib/services/file-services";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{
    id: string;
    variantId: string;
  }>;
};
export async function POST(req: NextRequest, { params }: Params) {
  const param = await params;
  if (!param || !param.id || !param.variantId) {
    return NextResponse.json(
      { error: "Product ID and variant ID are required" },
      { status: 400 }
    );
  }
  const { id, variantId } = param;
  await connectToDatabase();

  const formData = await req.formData();
  const file = formData.get("image");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "No image file provided" },
      { status: 400 }
    );
  }

  let s3Key: string;

  s3Key = await processFileUpload(file, "products");

  // Update the variant's images array
  const updated = await Product.findOneAndUpdate(
    {
      _id: id,
      "variants._id": variantId,
    },
    {
      $addToSet: {
        "variants.$.images": s3Key,
      },
    },
    {
      new: true,
    }
  );

  if (!updated) {
    return NextResponse.json(
      { error: "Product or variant not found" },
      { status: 404 }
    );
  }

  const updatedVariant = updated.variants.find(
    (variant: any) => variant._id.toString() === variantId
  );

  return NextResponse.json({ success: true, variant: updatedVariant });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const param = await params;
  if (!param || !param.id || !param.variantId) {
    return NextResponse.json(
      { error: "Product ID and variant ID are required" },
      { status: 400 }
    );
  }
  const { id, variantId } = param;
  await connectToDatabase();

  const body = await req.json();
  const { s3Key } = body;

  if (!s3Key || typeof s3Key !== "string") {
    return NextResponse.json({ error: "s3Key is required" }, { status: 400 });
  }

  const product = await Product.findOne({ _id: id });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const variant = product.variants.find(
    (variant: any) => variant._id.toString() === variantId
  );

  if (!variant) {
    return NextResponse.json({ error: "Variant not found" }, { status: 404 });
  }

  const originalLength = variant.images.length;
  variant.images = variant.images.filter(
    (key: string | File) => typeof key === "string" && key !== s3Key
  );

  if (variant.images.length === originalLength) {
    return NextResponse.json(
      { error: "Image not found in variant" },
      { status: 404 }
    );
  }

  await product.save();

  return NextResponse.json({ success: true, variant });
}
