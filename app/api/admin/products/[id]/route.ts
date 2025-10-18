import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/db/models/product";
import connectToDatabase from "@/lib/db/mongoose";

import z from "zod";
import { formatProduct } from "@/app/api/products/products.service";
import { errorResponse } from "@/lib/utils";
import { smartMerge, validateUniqueness } from "@/lib/service/product";
type Params = {
  params: Promise<{
    id: string;
  }>;
};
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const product = await Product.findById(id).lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(formatProduct(product));
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params;

    await connectToDatabase();
    const data = await req.json();
    const product = await Product.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { id } = await params;

    await connectToDatabase();
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const body = await req.json();
    const validatedData = body;

    if (validatedData.images) {
      //remove R2 URL from images
      for (let i = 0; i < validatedData.images.length; i++) {
        if (typeof validatedData.images[i] === "string") {
          const url = validatedData.images[i] as string;
          validatedData.images[i] = url.split(
            process.env.R2_PUBLIC_BASE_URL + "/"
          )[1];
        }
      }
    }

    // Fetch existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) return errorResponse("Product not found", 404);

    // Validate uniqueness
    await validateUniqueness(id, validatedData, existingProduct);

    // Smart merge
    const mergedData = smartMerge(existingProduct.toObject(), validatedData);

    // Apply merged data
    Object.assign(existingProduct, mergedData);

    // Mark nested arrays as modified
    for (const field of ["variants", "specifications", "images", "seo"]) {
      if (validatedData[field as keyof typeof validatedData]) {
        existingProduct.markModified(field);
      }
    }

    const updatedProduct = await existingProduct.save();

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);

    if (error instanceof z.ZodError) {
      return errorResponse(
        "Validation error",
        400,
        error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }))
      );
    }

    if ((error as any).name === "ValidationError") {
      return errorResponse(
        "Database validation error",
        400,
        Object.values((error as any).errors).map((e: any) => ({
          field: e.path,
          message: e.message,
        }))
      );
    }

    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }

    return errorResponse("Failed to update product", 500);
  }
}
