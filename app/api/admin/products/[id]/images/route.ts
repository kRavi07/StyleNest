// /api/products/[id]/images/route.ts

import Product from "@/lib/db/models/product";
import connectToDatabase from "@/lib/db/mongoose";
import { processFileUpload } from "@/lib/services/file-services";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{
    id: string;
  }>;
};
export async function POST(req: NextRequest, { params }: Params) {
  await connectToDatabase();
  const formData = await req.formData();
  const file = formData.get("image");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "No image file provided" },
      { status: 400 }
    );
  }

  const { id } = await params;

  const s3Key = await processFileUpload(file, "products");

  const updated = await Product.findByIdAndUpdate(
    id,
    { $addToSet: { images: s3Key } },
    { new: true }
  );

  return NextResponse.json({ success: true, data: updated });
}

// /api/products/[id]/images/route.ts

export async function DELETE(req: NextRequest, { params }: Params) {
  const { key } = await req.json();

  if (!key) {
    return NextResponse.json({ error: "Missing image key" }, { status: 400 });
  }

  const { id } = await params;
  await connectToDatabase();

  const updated = await Product.findByIdAndUpdate(
    id,
    { $pull: { images: key } },
    { new: true }
  );

  return NextResponse.json({ success: true, data: updated });
}
