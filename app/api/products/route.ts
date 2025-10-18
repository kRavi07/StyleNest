import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import Product, { IProduct } from "@/lib/db/models/product";
import { FilterQuery } from "mongoose";
import { formatProducts } from "./products.service";
interface ProductFilters {
  categories: string[];
  colors?: string[];
  sizes?: string[];
  specifications: Record<string, string[]>;
}

// Helper function to build MongoDB query from search params
function buildQuery(searchParams: URLSearchParams): FilterQuery<any> {
  const query: FilterQuery<any> = {};

  // Basic filters
  const category = searchParams.get("category");
  if (category && category !== "all") {
    query.category = category;
  }

  // Price range
  const priceRange = searchParams.get("priceRange")?.split(",").map(Number);
  if (priceRange?.length === 2) {
    query.price = { $gte: priceRange[0], $lte: priceRange[1] };
  }

  // Boolean filters
  const booleanFilters = {
    onlyInStock: "isInStock",
    onlySale: "isSale",
    onlyNew: "isNewProduct",
  };

  Object.entries(booleanFilters).forEach(([param, field]) => {
    if (searchParams.get(param) === "true") {
      query[field] = true;
    }
  });

  const colors = searchParams.get("colors")?.split(",").filter(Boolean) || [];
  const sizes = searchParams.get("sizes")?.split(",").filter(Boolean) || [];

  if (colors.length > 0 || sizes.length > 0) {
    query.$and = [];

    if (colors.length > 0) {
      query.$and.push({
        "variants.optionValues.color": { $in: colors },
      });
    }

    if (sizes.length > 0) {
      query.$and.push({
        "variants.optionValues.size": { $in: sizes },
      });
    }
  }

  return query;
}

// Helper function to get sort configuration
function getSortConfig(sortBy: string | null): Record<string, 1 | -1> {
  const sortOptions: Record<string, Record<string, 1 | -1>> = {
    "price-low-high": { price: 1 },
    "price-high-low": { price: -1 },
    newest: { createdAt: -1 },
    rating: { rating: -1 },
  };

  return sortOptions[sortBy || "newest"] || { createdAt: -1 };
}

export async function GET(req: NextRequest) {
  try {
    const startTotal = Date.now();

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(
      1,
      Math.min(100, parseInt(searchParams.get("limit") || "20"))
    );

    const query = buildQuery(searchParams);
    const sort = getSortConfig(searchParams.get("sortBy"));
    const skip = (page - 1) * limit;

    await connectToDatabase();

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("category", "name")
        .select(
          "-description  -specifications  -attributes -seo -archivedAt  -createdAt -updatedAt -__v"
        )
        .lean()
        .exec(),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    const responseData = {
      data: formatProducts(products),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
        hasPrevious: page > 1,
      },
    };

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Products API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
