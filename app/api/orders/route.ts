import { NextResponse } from "next/server";
import connectToDatabase, { toObjectId } from "@/lib/db/mongoose";
import Order from "@/lib/db/models/order";
import { resolveOrderItemsFromProduct } from "@/lib/utils/order-product-details";
import { createOrderSchema } from "@/lib/validation/order";
import { requireAuthUser } from "@/lib/auth/server-auth";
import { createOrder } from "@/lib/services/orderservices";
import Cart from "@/lib/db/models/cart";
export async function GET(req: Request) {
  try {
    // Verify authentication
    const user = await requireAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: userId, role } = user;
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const status = url.searchParams.get("status");
    const sort = url.searchParams.get("sort") || "createdAt";
    const order = url.searchParams.get("order") || "desc";

    const skip = (page - 1) * limit;

    // Build filter query
    const query: any = {};

    query["customer.id"] = userId;

    if (status && status !== "all") query.status = status;

    // Connect to the database
    await connectToDatabase();

    // Get total count for pagination
    const total = await Order.countDocuments(query);

    // Get orders with pagination, filtering, and sorting
    const orders = await Order.find(query)
      .select(
        "-shippingAddress -billingAddress -customer -billingAddress -notes -razorpayOrderId -razorpaySignature"
      )
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create a new order
export async function POST(req: Request) {
  try {
    const user = await requireAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId, role } = user;

    const body = await req.json();
    const { shippingAddress, billingAddress, notes, paymentMethod } = body;

    const cartId = await Cart.find({ user: toObjectId(userId) }).then(
      (cart) => {
        return cart[0]._id.toString();
      }
    );

    if (!cartId) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    //const resolvedItems = await resolveOrderItemsFromProduct(items);

    await connectToDatabase();

    const order = await createOrder({
      userId: user.id,
      cartId,
      paymentMethod,
      shippingAddress,
      billingAddress,
      notes,
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
