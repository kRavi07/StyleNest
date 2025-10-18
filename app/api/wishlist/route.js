import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import { WishlistItemSchema } from "@/lib/validations";
import Wishlist from "@/lib/db/models/Wishlist";
import Product from "@/lib/db/models/product";
import { handleAuthError } from "@/lib/auth/auth";
import { getAuthUserFromRequest } from "@/lib/auth/server-auth";
// GET /api/wishlist - Get user's wishlist
export async function GET() {
  try {
    await connectToDatabase();
    const user = await getAuthUserFromRequest();

    let wishlist = await Wishlist.findOne({ user: user.id }).populate("items");

    if (!wishlist) {
      wishlist = new Wishlist({ user: user.id, items: [] });
      await wishlist.save();
    }

    return NextResponse.json({
      success: true,
      data: {
        items: wishlist.items,
        totalItems: wishlist.items.length,
      },
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

// POST /api/wishlist - Add item to wishlist
export async function POST(request) {
  try {
    await connectToDatabase();
    const user = await getAuthUserFromRequest();
    const body = await request.json();

    const validation = WishlistItemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { productId } = validation.data;

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, error: "Product not found or inactive" },
        { status: 404 }
      );
    }

    let wishlist = await Wishlist.findOne({ user: user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: user.id, items: [] });
    }

    // Check if item already exists in wishlist
    if (wishlist.items.includes(productId)) {
      return NextResponse.json(
        { success: false, error: "Item already in wishlist" },
        { status: 400 }
      );
    }

    wishlist.items.push(productId);
    await wishlist.save();
    await wishlist.populate("items");

    return NextResponse.json({
      success: true,
      data: {
        items: wishlist.items,
        totalItems: wishlist.items.length,
      },
    });
  } catch (error) {
    console.error("Wishlist add error:", error);
    return handleAuthError(error);
  }
}

// DELETE /api/wishlist - Remove item from wishlist
export async function DELETE(request) {
  try {
    const user = await getAuthUserFromRequest();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const wishlist = await Wishlist.findOne({ user: user.id });
    if (!wishlist) {
      return NextResponse.json(
        { success: false, error: "Wishlist not found" },
        { status: 404 }
      );
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.toString() !== productId
    );
    await wishlist.save();
    await wishlist.populate("items");

    return NextResponse.json({
      success: true,
      data: {
        items: wishlist.items,
        totalItems: wishlist.items.length,
      },
    });
  } catch (error) {
    console.error("Wishlist remove error:", error);
    return handleAuthError(error);
  }
}
