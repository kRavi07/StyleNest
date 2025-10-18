// /api/products/[id]/variants/route.ts
import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/db/models/product";
import connectToDatabase from "@/lib/db/mongoose";
import { processFileUpload } from "@/lib/services/file-services";
import { variantSchema } from "@/lib/validation/product";
import { parseFormData } from "@/lib/services/form-parser";
import mongoose from "mongoose";
type Params = {
  params: Promise<{
    id: string;
  }>;
};
export async function POST(req: NextRequest, { params }: Params) {
  await connectToDatabase();

  const { id } = await params;

  const formData = await req.formData();
  if (!formData) {
    return NextResponse.json(
      { success: false, error: "Form data is missing" },
      { status: 400 }
    );
  }

  const parsedFormData = parseFormData(formData, {
    jsonKeys: ["attributes", "optionValues"],
    numberKeys: ["price", "stock"],
  });

  const files = formData.getAll("images");

  const parsedData = variantSchema.safeParse(parsedFormData);
  if (!parsedData.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        issues: parsedData.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path,
        })),
      },
      {
        status: 400,
      }
    );
  }

  const uploadedUrls: string[] = [];

  await connectToDatabase();

  const imageFiles = Array.isArray(files) ? files : [files];
  for (const file of imageFiles) {
    if (file instanceof File) {
      const url = await processFileUpload(file, "products");
      uploadedUrls.push(url);
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid image file" },
        { status: 400 }
      );
    }
  }

  const product = await Product.findById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const variantId = new mongoose.Types.ObjectId();

  product.variants.push({
    ...parsedData.data,
    _id: variantId,
    images: uploadedUrls,
    stock: parsedData.data.stock ? parsedData.data.stock : 0,
  });
  await product.save();

  return NextResponse.json({ success: true, data: product });
}
