import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import Order from "@/lib/db/models/order";
import { verifyToken, isAdmin } from "@/lib/auth";
import { resolveOrderItemsFromProduct } from "@/lib/utils/order-product-details";
import { createOrderSchema } from "@/lib/validation/order";

export async function GET(req: Request) {
  try {
    // Verify authentication
    const authResult = await verifyToken(req);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id: userId, role } = authResult.user;
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const status = url.searchParams.get("status");
    const sort = url.searchParams.get("sort") || "createdAt";
    const order = url.searchParams.get("order") || "desc";

    const skip = (page - 1) * limit;

    // Build filter query
    const query: any = {};

    // Regular users can only see their own orders
    if (role !== "admin") {
      query.userId = userId;
    }

    if (status) query.status = status;

    // Connect to the database
    await connectToDatabase();

    // Get total count for pagination
    const total = await Order.countDocuments(query);

    // Get orders with pagination, filtering, and sorting
    const orders = await Order.find(query)
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
    // Verify authentication
    const authResult = await verifyToken(req);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id: userId, role } = authResult.user;

    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.format() }), {
        status: 400,
      });
    }

    const { items, ...rest } = parsed.data;
    const resolvedItems = await resolveOrderItemsFromProduct(items);

    await connectToDatabase();

    const orderData = await Order.create({
      ...rest,
      items: resolvedItems,
    });

    return NextResponse.json(
      { success: true, data: orderData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
