import { handleAuthError } from "@/lib/auth/auth";
import { getAuthUserFromRequest } from "@/lib/auth/server-auth";
import Order from "@/lib/db/models/order";
import Product from "@/lib/db/models/product";
import connectToDatabase from "@/lib/db/mongoose";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{
    id: string;
  }>;
};
// POST /api/orders/[id]/cancel - Cancel order
export async function POST(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    const order = await Order.findOne({
      _id: id,
      "customer.id": user.id,
    }).populate("items.product");

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "Order cannot be cancelled" },
        { status: 400 }
      );
    }

    // Update order status
    order.status = "cancelled";
    order.cancelledAt = new Date();
    order.cancellationReason = "Cancelled by customer";
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: item.quantity },
      });
    }

    return NextResponse.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    console.error("Order cancellation error:", error);
    return handleAuthError(error);
  }
}
