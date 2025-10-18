"use server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function createRazorpayOrder(amount, orderId) {
  try {
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: orderId,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new Error("Failed to create Razorpay order");
  }
}

export const fetchPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error("Error fetching Razorpay payment details:", error);
    throw new Error("Failed to fetch Razorpay payment details");
  }
};

export async function verifyRazorpaySignature(
  razorpayOrderId,
  paymentId,
  signature
) {
  try {
    var {
      validatePaymentVerification,
    } = require("razorpay/dist/utils/razorpay-utils");

    if (!razorpayOrderId || !paymentId || !signature) {
      return false;
    }

    const isValidSignature = validatePaymentVerification(
      { order_id: razorpayOrderId, payment_id: paymentId },
      signature,
      process.env.RAZORPAY_KEY_SECRET
    );

    return isValidSignature;
  } catch (error) {
    console.error("Error verifying Razorpay signature:", error);
    throw new Error(error);
  }
}
