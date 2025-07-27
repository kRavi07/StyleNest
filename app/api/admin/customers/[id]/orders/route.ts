import { NextResponse } from "next/server";
import Order from "@/lib/db/models/order";
import connectToDatabase from "@/lib/db/mongoose";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(req: Request, { params }: Params) {
  try {
    await connectToDatabase();

    const { id } = params;

    const orders = await Order.find({ userId: id });

    if (!orders) {
      return NextResponse.json(
        { error: "No orders found for this customer" },
        { status: 404 }
      );
    }

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch customer orders" },
      { status: 500 }
    );
  }
}
