// app/api/filters/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import { IProduct } from "@/lib/db/models/product";
import { FilterQuery } from "mongoose";
import { getFilters } from "../products.service";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = req.nextUrl;

    const category = searchParams.get("category");
    const query: FilterQuery<IProduct> = {};
    if (category && category !== "all") {
      query.category = category;
    }

    const filters = await getFilters();

    return NextResponse.json({ filters });
  } catch (error) {
    console.error("Filters API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch filters" },
      { status: 500 }
    );
  }
}
