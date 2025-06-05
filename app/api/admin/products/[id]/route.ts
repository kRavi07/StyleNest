import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/db/models/product";
import connectToDatabase from "@/lib/db/mongoose";
import { UpdateProductSchema } from "@/lib/validation/product";

type Params = Promise<{ params: { id: string } }>;

export async function GET(req: Request, params: Params) {
  try {
    const p = (await params).params;
    await connectToDatabase();
    const product = await Product.findById(p.id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, params: Params) {
  try {
    const p = (await params).params;

    await connectToDatabase();
    const data = await req.json();
    const product = await Product.findByIdAndUpdate(p.id, data, {
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

export async function DELETE(req: Request, params: Params) {
  try {
    const p = (await params).params;

    await connectToDatabase();
    const product = await Product.findByIdAndDelete(p.id);
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

export async function PATCH(req: NextRequest, params: Params) {
  await connectToDatabase();

  try {
    const p = (await params).params;

    const id = p.id;
    if (!id) {
      return NextResponse.json(
        { error: "Missing product ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const parsed = UpdateProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updateData = parsed.data;

    const updated = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
