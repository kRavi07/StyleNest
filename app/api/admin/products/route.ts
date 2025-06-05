import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/db/models/product";
import connectToDatabase from "@/lib/db/mongoose";
import { CreateProductSchema } from "@/lib/validation/product";
import { parseFormData } from "@/lib/services/form-parser";
import { isAdmin } from "@/lib/auth";
import { processFileUpload } from "@/lib/services/file-services";

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await isAdmin(req);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const formData = await req.formData();
    if (!formData) {
      return NextResponse.json(
        { success: false, error: "Form data is missing" },
        { status: 400 }
      );
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);

    const parsedFormData = parseFormData(formData, {
      jsonKeys: ["seo", "variants", "attributes", "variantAttribute"],
      numberKeys: ["price", "mrp", "inventory"],
      booleanKeys: [
        "isNewProduct",
        "isSale",
        "featured",
        "isActive",
        "isArchived",
        "isDeleted",
      ],
    });

    const files = formData.getAll("images");

    const parsedData = CreateProductSchema.safeParse(parsedFormData);

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

    const createData = {
      ...parsedData.data,
      images: uploadedUrls,
    };

    const res = await Product.create(createData);

    return NextResponse.json(
      {
        success: true,
        product: {
          id: res._id,
          name,
          description,
          price,
        },
        message: "Product uploaded successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to upload product" },
      { status: 500 }
    );
  }
}
