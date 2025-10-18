import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import Order from "@/lib/db/models/order";
import { requireAuthUser } from "@/lib/auth/server-auth";

type Params = {
  params: Promise<{
    id: string;
  }>;
};
// GET a single order by ID
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const authResult = await requireAuthUser();
    if (!authResult) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: userId, role } = authResult;

    const { id: orderId } = await params;

    const searchParams = req.nextUrl.searchParams;
    const paymentId = searchParams.get("paymentId");

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: "Payment ID not found" },
        { status: 404 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Regular users can only see their own orders
    if (role !== "admin" && order.customer.id.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: "Not authorized to access this order" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
