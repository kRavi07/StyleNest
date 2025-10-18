import { NextRequest, NextResponse } from "next/server";
import Order from "@/lib/db/models/order";
import { OrderService } from "@/lib/service/order/orderService";
import Payments from "@/lib/db/models/razorpay-payments";
import connectToDatabase, { toObjectId } from "@/lib/db/mongoose";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 404 });
    }

    const orders = await OrderService.findOne({
      _id: toObjectId(id),
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

export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const data = await req.json();

    await connectToDatabase();
    const order = await Order.findByIdAndUpdate(id, data, { new: true });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
