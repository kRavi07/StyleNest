import Order from "@/lib/db/models/order";
import Cart from "@/lib/db/models/cart";
import { toObjectId } from "@/lib/db/mongoose";
import User from "@/lib/db/models/user";
import { Address } from "@/types";
import Product from "@/lib/db/models/product";
import { generateRandomUUID } from "../utils";
interface CreateOrderInput {
  userId: string;
  cartId: string;
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress?: Address;
  notes?: string;
}

export async function createOrder({
  userId,
  cartId,
  paymentMethod,
  shippingAddress,
  billingAddress,
  notes,
}: CreateOrderInput) {
  const cart = await Cart.findOne({ _id: toObjectId(cartId), user: userId });
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty or not found");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const orderItems = await Promise.all(
    cart.items.map(async (item: any) => {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }

      // If variantId exists, pull variant details
      const variant = item.isVaeriant
        ? product.variants.find((v: any) => v._id.toString() === item.variantId)
        : null;

      return {
        productId: product._id,
        variantId: variant?._id?.toString() ?? null,
        name: product.name,
        sku: variant?.sku ?? "test-sku",
        price: variant?.price ?? product.price,
        quantity: item.quantity,
        image: variant?.images[0] ?? product.images[0] ?? "",
        mrp: variant?.mrp ?? product.mrp,
        variantInfo: variant?.optionValues ?? {},
      };
    })
  );

  const subtotal = cart.totalAmount;
  const tax = 0;
  const shipping = 0;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const order = await Order.create({
    orderNumber: generateRandomUUID("DM").toLowerCase(),
    customer: {
      id: userId,
      name: user.name,
      email: user.email,
    },
    status: "pending",
    paymentStatus: "pending",
    paymentMethod,
    subtotal,
    tax,
    shipping,
    discount,
    total,
    items: orderItems,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    notes,
  });

  return order;
}
