// /api/products/[id]/images/route.ts

import Product from "@/lib/db/models/product";
import connectToDatabase from "@/lib/db/mongoose";
import {
  isFileExist,
  processFileUpload,
  uploadFileAndSaveMetadata,
} from "@/lib/services/file-services";
import { hashFile } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const formData = await req.formData();
  const file = formData.get("image");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "No image file provided" },
      { status: 400 }
    );
  }

  const hash = await hashFile(file);
  const existingFile = await isFileExist(hash);
  let s3Key: string;

  s3Key = await processFileUpload(file, "products");

  const updated = await Product.findByIdAndUpdate(
    params.id,
    { $addToSet: { images: s3Key } },
    { new: true }
  );

  return NextResponse.json({ success: true, data: updated });
}

// /api/products/[id]/images/route.ts

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const { key } = await req.json();

  if (!key) {
    return NextResponse.json({ error: "Missing image key" }, { status: 400 });
  }

  const updated = await Product.findByIdAndUpdate(
    params.id,
    { $pull: { images: key } },
    { new: true }
  );

  return NextResponse.json({ success: true, data: updated });
}
