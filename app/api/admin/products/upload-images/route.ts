import { mapImageKeys } from "@/app/api/products/products.service";
import { processFileUpload } from "@/lib/services/file-services";
import { NextRequest, NextResponse } from "next/server";

// POST /api/uploads
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const files = formData.getAll("images") as File[];
    if (!files.length) {
      return NextResponse.json(
        { success: false, message: "No files uploaded" },
        { status: 400 }
      );
    }

    const imageFiles = formData
      .getAll("images")
      .filter((f) => f instanceof File) as File[];
    const productImages = await Promise.all(
      imageFiles.map((file) => processFileUpload(file, "products"))
    );

    const url = mapImageKeys(productImages);

    return NextResponse.json({ success: true, url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}
