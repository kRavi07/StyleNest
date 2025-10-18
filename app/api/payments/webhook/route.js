import { NextResponse } from "next/server";
import crypto from "crypto";
import connectToDatabase from "@/lib/db/mongoose";
import Order from "@/lib/db/models/order";

// POST /api/payments/webhook - Razorpay webhook
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { success: false, error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    switch (event.event) {
      case "payment.captured":
        await handlePaymentCaptured(event.payload.payment.entity);
        break;

      case "payment.failed":
        await handlePaymentFailed(event.payload.payment.entity);
        break;

      default:
        console.error("Unhandled webhook event:", event.event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { success: false, error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentCaptured(payment) {
  try {
    const order = await Order.findOne({
      razorpayOrderId: payment.order_id,
    });

    if (order && order.paymentStatus !== "paid") {
      order.status = "paid";
      order.paymentStatus = "paid";
      order.razorpayPaymentId = payment.id;
      await order.save();

      console.info(`Payment captured for order: ${order.orderNumber}`);
    }
  } catch (error) {
    console.error("Error handling payment captured:", error);
  }
}

async function handlePaymentFailed(payment) {
  try {
    const order = await Order.findOne({
      razorpayOrderId: payment.order_id,
    });

    if (order) {
      order.paymentStatus = "failed";
      await order.save();

      console.log(`Payment failed for order: ${order.orderNumber}`);
    }
  } catch (error) {
    console.error("Error handling payment failed:", error);
  }
}
