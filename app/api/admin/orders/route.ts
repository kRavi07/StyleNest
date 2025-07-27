import { NextRequest, NextResponse } from "next/server";
import Order from "@/lib/db/models/order";
import connectToDatabase from "@/lib/db/mongoose";

export async function GET() {
  try {
    await connectToDatabase();
    const orders = await Order.find({});
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const order = await Order.create(data);
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
