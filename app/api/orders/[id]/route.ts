import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import Order from "@/lib/db/models/order";
import { requireAuthUser } from "@/lib/auth/server-auth";
import Payments from "@/lib/db/models/razorpay-payments";
import { mapPaymentToResponse } from "@/lib/service/order";

type Params = {
  params: Promise<{
    id: string;
  }>;
};
// GET a single order by ID
export async function GET(req: Request, { params }: Params) {
  try {
    const authResult = await requireAuthUser();
    if (!authResult) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: userId } = authResult;

    const { id: orderId } = await params;
    // Connect to the database
    await connectToDatabase();

    // Find order by ID
    const order = await Order.findOne({
      _id: orderId,
      "customer.id": userId,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    const payment = await Payments.findOne({
      id: order.razorpayPaymentId,
      order_id: order.razorpayOrderId,
    }).select("method amount card wallet bank vpa upi international");

    const updatedOrder = {
      ...order.toObject(),
      payment: payment && mapPaymentToResponse(payment),
    };

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
