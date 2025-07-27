import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import Product, { IProduct } from "@/lib/db/models/product";
import { generatePresignedUrl } from "@/lib/services/s3-services";
import { getAllProductFilters } from "./products.service";
// GET all products with pagination and filtering
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

    const filters = getAllProductFilters(products);

    return NextResponse.json({
      data: products,
      filters,
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
