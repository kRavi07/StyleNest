import { NextResponse } from "next/server";

import { UpdateOrderStatusSchema } from "@/lib/validations";
import connectToDatabase from "@/lib/db/mongoose";
import Order from "@/lib/db/models/order";
import { handleAuthError } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/server-auth";

// PUT /api/orders/[id]/status - Update order status (Admin only)
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const authResult = await requireRole(["admin"])(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = params;
    const body = await request.json();

    const validation = UpdateOrderStatusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { status } = validation.data;

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Update status and related fields
    order.status = status;

    if (status === "delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();

    return NextResponse.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    console.error("Order status update error:", error);
    return handleAuthError(error);
  }
}
