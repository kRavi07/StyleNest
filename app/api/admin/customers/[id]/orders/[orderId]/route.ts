import { NextRequest, NextResponse } from "next/server";
import connectToDatabase, { toObjectId } from "@/lib/db/mongoose";
import { OrderService } from "@/lib/service/order/orderService";
import Payments from "@/lib/db/models/razorpay-payments";

type Params = {
  params: Promise<{
    id: string;
    orderId: string;
  }>;
};

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id, orderId } = await params;

    if (!id || !orderId) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await connectToDatabase();

    const orders = await OrderService.findOne({
      "customer.id": id,
      _id: toObjectId(orderId),
    });
    if (!orders) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const payment = await Payments.findOne({
      id: orders.razorpayPaymentId,
      order_id: orders.razorpayOrderId,
    });

    const order = {
      ...orders.toObject(),
      payment,
    };

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch customer orders" },
      { status: 500 }
    );
  }
}
