import Order from "@/lib/db/models/order";
import { AppError } from "@/lib/error/AppError";
import { PaymentResponse } from "@/types";
import { ORDER_STATUS } from "@/types/order";

export const updateOrderStatus = async (id: string, status: ORDER_STATUS) => {
  try {
    const res = await Order.findByIdAndUpdate(id, { status: status });
    if (!res) {
      return new AppError("Order not found", 404);
    }

    return res;
  } catch (error) {
    throw new Error("Failed to update order status");
  }
};

export function mapOrderFilters(query: Record<string, any> | undefined) {
  const filters: Record<string, any> = {};

  if (!query) return filters;

  if (query.customerId) filters.customerId = query.customerId;
  if (query.status) filters.status = query.status.toUpperCase();
  if (query.minTotal) filters.total = { $gte: Number(query.minTotal) };
  if (query.maxTotal)
    filters.total = { ...filters.total, $lte: Number(query.maxTotal) };

  return filters;
}

export const mapPaymentToResponse = (payment: any): PaymentResponse => {
  let method: string | undefined;
  let card, upi, wallet;

  switch (payment.method) {
    case "card":
      method = "Card";
      card = {
        last4: payment.card?.last4 || "",
        network: payment.card?.network || "",
        name: payment.card?.name || undefined,
        issuer: payment.card?.issuer || undefined,
        type: payment.card?.type || undefined,
      };
      break;
    case "upi":
      method = "UPI";
      upi = { vpa: payment.vpa || "" };
      break;
    case "wallet":
      method = "Wallet";
      wallet = { name: payment.wallet?.name || "" };
      break;
    case "netbanking":
      method = "Netbanking";
      break;
    default:
      method = "Other";
  }

  return {
    method,
    card,
    upi,
    wallet,
    createdAt: payment.createdAt || new Date(),
    updatedAt: payment.updatedAt || new Date(),
  };
};
