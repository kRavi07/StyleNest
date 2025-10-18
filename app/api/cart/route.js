import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import { CartItemSchema, RemoveCartItemSchema } from "@/lib/validations";
import Cart from "@/lib/db/models/cart";
import Product from "@/lib/db/models/product";
import { handleAuthError } from "@/lib/auth/auth";
import { getAuthUserFromRequest } from "@/lib/auth/server-auth";

// GET /api/cart - Get user's cart
export async function GET() {
  try {
    await connectToDatabase();
    const user = await getAuthUserFromRequest();

    let cart = await Cart.findOne({ user: user.id }).populate("items.product");

    if (!cart) {
      cart = new Cart({ user: user.id, items: [] });
      await cart.save();
    }

    return NextResponse.json({
      success: true,
      data: {
        items: cart.items,
        totalAmount: cart.totalAmount,
        totalItems: cart.totalItems,
      },
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

// POST /api/cart - Add/Update item in cart
export async function POST(request) {
  try {
    await connectToDatabase();
    const user = await getAuthUserFromRequest();
    const body = await request.json();

    const validation = CartItemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { productId, quantity } = validation.data;

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, error: "Product not found or inactive" },
        { status: 404 }
      );
    }

    // Check stock availability
    if (product.inventory < quantity) {
      return NextResponse.json(
        {
          success: false,
          error: `Only ${product.stock} items available in stock`,
        },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ user: user.id });
    if (!cart) {
      cart = new Cart({ user: user.id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update existing item
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;

      if (newQuantity > product.stock) {
        return NextResponse.json(
          {
            success: false,
            error: `Cannot add more items. Only ${product.stock} available in stock`,
          },
          { status: 400 }
        );
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = product.price;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }

    await cart.save();
    await cart.populate("items.product");

    return NextResponse.json({
      success: true,
      data: {
        items: cart.items,
        totalAmount: cart.totalAmount,
        totalItems: cart.totalItems,
      },
    });
  } catch (error) {
    console.error("Cart add error:", error);
    return handleAuthError(error);
  }
}

// DELETE /api/cart - Remove item or clear cart
export async function DELETE(request) {
  try {
    await connectToDatabase();
    const user = await getAuthUserFromRequest();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      // Clear entire cart
      await Cart.findOneAndUpdate(
        { user: user.id },
        { items: [], totalAmount: 0, totalItems: 0 }
      );

      return NextResponse.json({
        success: true,
        data: { message: "Cart cleared successfully" },
      });
    }

    // Remove specific item
    const validation = RemoveCartItemSchema.safeParse({ productId });
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ user: user.id });
    if (!cart) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();
    await cart.populate("items.product");

    return NextResponse.json({
      success: true,
      data: {
        items: cart.items,
        totalAmount: cart.totalAmount,
        totalItems: cart.totalItems,
      },
    });
  } catch (error) {
    console.error("Cart remove error:", error);
    return handleAuthError(error);
  }
}
