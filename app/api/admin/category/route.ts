// app/api/category/route.ts
import { NextRequest, NextResponse } from "next/server";
import category from "@/lib/db/models/category";
import connectToDatabase from "@/lib/db/mongoose";
import { isAdmin } from "@/lib/auth";
import { hashFile } from "@/lib/utils";
import {
  isFileExist,
  processFileUpload,
  uploadFileAndSaveMetadata,
} from "@/lib/services/file-services";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const authResult = await isAdmin(req);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const formData = await req.formData();

    // Access fields
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const parentCategory = formData.get("parentCategory") as string;

    const isExist = await category.findOne({ slug });
    if (isExist) {
      return NextResponse.json(
        {
          success: false,
          error: "Category already exist with this slug" + `: ${slug}`,
        },
        { status: 400 }
      );
    }

    // Access files
    const uploadedUrls: string[] = [];

    const images = formData.getAll("image");
    const imageFiles = Array.isArray(images) ? images[0] : images;
    if (imageFiles instanceof File) {
      const url = await processFileUpload(imageFiles, "category");
      uploadedUrls.push(url);
    }

    const categoryData = {
      name,
      slug,
      parent: parentCategory ? parentCategory : null,
      image: uploadedUrls.length > 0 ? uploadedUrls[0] : "",
    };
    console.log("Category Data:", categoryData);

    const r = await category.create(categoryData);
    return NextResponse.json({ success: true, data: r }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET() {
  await connectToDatabase();
  try {
    const categories = await category
      .find({ isActive: true })
      .sort({ createdAt: -1 });
    return NextResponse.json(categories);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
