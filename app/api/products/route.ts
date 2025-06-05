import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import Product from "@/lib/db/models/product";
// GET all products with pagination and filtering
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const category = url.searchParams.get("category");
    const featured = url.searchParams.get("featured");
    const inStock = url.searchParams.get("inStock");
    const isNewProduct = url.searchParams.get("isNewProduct");
    const isSale = url.searchParams.get("isSale");
    const search = url.searchParams.get("search");
    const sort = url.searchParams.get("sort") || "createdAt";
    const order = url.searchParams.get("order") || "desc";

    const skip = (page - 1) * limit;

    // Build filter query
    const query: any = {};
    if (category) query.category = category;
    if (featured === "true") query.featured = true;
    if (inStock === "true") query.inventory = { $gt: 0 };
    if (isNewProduct === "true") query.isNewProduct = true;
    if (isSale === "true") query.isSale = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Connect to the database
    await connectToDatabase();

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Get products with pagination, filtering, and sorting
    const products = await Product.find(query)
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
