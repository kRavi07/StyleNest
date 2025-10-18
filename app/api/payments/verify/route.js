import connectToDatabase from "@/lib/db/mongoose";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/lib/db/models/order";
import { fetchPaymentDetails, verifyRazorpaySignature } from "@/lib/razorpay";
import { handleAuthError } from "@/lib/auth/auth";
import { requireAuthUser } from "@/lib/auth/server-auth";

import { PaymentVerificationSchema } from "@/lib/validations";
import Payments from "@/lib/db/models/razorpay-payments";
// POST /api/payments/verify - Verify Razorpay payment
export async function POST(request) {
  try {
    await connectToDatabase();
    const user = await requireAuthUser();
    const body = await request.json();

    const validation = PaymentVerificationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { orderId, paymentId, signature, razorpayOrderId } = validation.data;

    const order = await Order.findOne({
      _id: orderId,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Verify Razorpay signature
    const isValidSignature = verifyRazorpaySignature(
      razorpayOrderId,
      paymentId,
      signature
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    order.status = "pending";
    order.paymentStatus = "paid";
    order.razorpayPaymentId = paymentId;
    order.razorpaySignature = signature;
    order.razorpayOrderId = razorpayOrderId;
    await order.save();

    const payment = await fetchPaymentDetails(paymentId);

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch payment details" },
        { status: 400 }
      );
    }

    if (payment.method) {
      order.paymentMethod = payment.method;
      await order.save();
    }

    await Payments.create(payment);

    return NextResponse.json({
      success: true,
      data: {
        message: "Payment verified successfully",
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
        },
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return handleAuthError(error);
  }
}
