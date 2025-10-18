// File: /app/api/checkout/create-order/route.ts

import connectToDatabase from "@/lib/db/mongoose";
import { createRazorpayOrder } from "@/lib/razorpay";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/lib/db/models/order";
import PaymentOrder from "@/lib/db/models/paymentOrder";
import { generateRandomUUID } from "@/lib/utils";
import { createOrderSchema } from "@/lib/validation/order";
import Cart from "@/lib/db/models/cart";
import { requireAuthUser } from "@/lib/auth/server-auth";
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const user = await requireAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    const parsedData = await createOrderSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.flatten() },
        { status: 400 }
      );
    }

    const {
      customer,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      discount,
      notes,
    } = parsedData.data;

    if (!customer || !items || !shippingAddress || !billingAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ user: user.id });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const cartItems = cart.items;
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty. Please add items to the cart." },
        { status: 400 }
      );
    }

    //get the total amount from the cart
    cart.calculateTotals();
    if (cart.totalAmount <= 0) {
      return NextResponse.json(
        { error: "Cart is empty. Please add items to the cart." },
        { status: 400 }
      );
    }
    if (subtotal !== cart.totalAmount) {
      return NextResponse.json(
        { error: "Subtotal does not match cart total" },
        { status: 400 }
      );
    }

    const total = subtotal + shipping - discount;

    // Step 1: Create Order document in DB
    const newOrder = await Order.create({
      orderNumber: generateRandomUUID("ORDER"),
      customer,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      notes,
    });

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder({
      amount: Math.round(total * 100), // in paise
      currency: "INR",
      receipt: newOrder._id.toString(),
      notes: [newOrder.orderNumber],
    });

    // Store Razorpay order info in DB
    await PaymentOrder.create({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      amount_due: razorpayOrder.amount_due,
      amount_paid: razorpayOrder.amount_paid,
      attempts: razorpayOrder.attempts,
      created_at: razorpayOrder.created_at,
      currency: razorpayOrder.currency,
      entity: razorpayOrder.entity,
      notes: razorpayOrder.notes,
      offer_id: razorpayOrder.offer_id,
      receipt: razorpayOrder.receipt,
      status: razorpayOrder.status,
    });

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      orderNumber: newOrder.orderNumber,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
