import connectToDatabase from "@/lib/db/mongoose";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/lib/db/models/order";
import { createRazorpayOrder } from "@/lib/razorpay";
import { handleAuthError } from "@/lib/auth/auth";
import { requireAuthUser } from "@/lib/auth/server-auth";
import RazorpayOrder from "@/lib/db/models/razorpay-order";

// Ensure Razorpay is configured

/**
 * Creates a new payment order using Razorpay.
 * This endpoint is called when the user initiates a payment for an order.
 * It creates a Razorpay order and returns the necessary details for the frontend to proceed with the payment.
 */

// POST /api/payments/create - Create Razorpay order
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const user = await requireAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId } = body;
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await Order.findOne({
      _id: orderId,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "Order is not eligible for payment" },
        { status: 400 }
      );
    }

    const razorpayOrder = await RazorpayOrder.findOne({
      razorpayOrderId: order.razorpayOrderId,
    });

    if (razorpayOrder) {
      return NextResponse.json(
        { success: false, error: "Order id already exists" },
        { status: 402 }
      );
    }

    // Create Razorpay order
    const razpayOrder = await createRazorpayOrder(
      order.total,
      order.orderNumber
    );
    console.log(razpayOrder);

    // Update order with Razorpay order ID
    order.razorpayOrderId = razpayOrder.id;
    await order.save();

    const newRazorpayOrder = new RazorpayOrder({
      razorpayOrderId: order.razorpayOrderId,
      amount: razpayOrder.amount,
      currency: razpayOrder.currency,
      status: razpayOrder.status,
      created_at: razpayOrder.created_at,
      attempts: razpayOrder.attempts,
      amount_due: razpayOrder.amount_due,
    });
    await newRazorpayOrder.save();

    return NextResponse.json({
      success: true,
      data: {
        orderId: razpayOrder.id,
        amount: razpayOrder.amount,
        currency: razpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
        orderDetails: {
          id: order._id,
          orderNumber: order.orderNumber,
          totalAmount: order.finalAmount,
        },
      },
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return handleAuthError(error);
  }
}
