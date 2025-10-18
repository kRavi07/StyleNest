import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/db/models/product";
import connectToDatabase from "@/lib/db/mongoose";
import { handleProductUpload } from "./product.service";
import { requireAuthAdmin } from "@/lib/auth/server-auth";
import { formatProducts } from "../../products/products.service";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const category = searchParams.get("category") || "all";
    const gender = searchParams.get("for");

    const query: any = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (gender) {
      query.gender = gender;
    }

    if (status !== "all") {
      query.status = status;
    }

    if (category !== "all") {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "-description -variants -optionTypes -specifications -variants -attributes -seo -archivedAt -hasVariants -createdAt -updatedAt -__v"
        )
        .populate({
          path: "category",
          select: "_id name",
        })
        .lean(),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    const hasMore = page < totalPages;
    const nextPage = hasMore ? page + 1 : null;

    const formattedProduct = formatProducts(products);

    return NextResponse.json({
      data: formattedProduct,
      total,
      totalPages,
      currentPage: page,
      hasMore,
      nextPage,
    });
  } catch (error) {
    console.error("Product fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuthAdmin();
    if (!authResult) {
      return NextResponse.json(
        { success: false, error: authResult },
        { status: 401 }
      );
    }

    const result = await handleProductUpload(req);

    return NextResponse.json(result.payload, { status: result.status });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload product" },
      { status: 500 }
    );
  }
}
