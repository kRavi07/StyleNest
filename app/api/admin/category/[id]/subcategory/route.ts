// app/api/admin/category/[id]/subcategory/route.ts

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db/mongoose";
import category from "@/lib/db/models/category";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = (await params).id;

  if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const subcategories = await category
      .find({ parent: id, isActive: true })
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({ subcategories });
  } catch (err) {
    console.error("Error fetching subcategories:", err);
    return NextResponse.json(
      { error: "Failed to fetch subcategories" },
      { status: 500 }
    );
  }
}
