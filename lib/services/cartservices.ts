import Cart from "@/lib/db/models/cart";
import { toObjectId } from "@/lib/db/mongoose";

interface LocalCartItem {
  product: { id: string; name: string; price?: number; image: string };
  variant?: { id: string; price?: number };
  hasVariants?: boolean;
  quantity: number;
}

/** Map local cart payload to DB schema shape */
export function mapCartItems(localCart: LocalCartItem[]) {
  return localCart.map((item) => ({
    product: toObjectId(item.product.id),
    variantId:
      item.hasVariants && item.variant ? toObjectId(item.variant.id) : null,
    quantity: item.quantity,
    price: item.product.price ?? item.variant?.price ?? 0,
    title: item.product.name,
    image: item.product.image,
  }));
}

/** Merge local cart into dbCart */
function mergeCartItems(dbCart: any, newItems: any[]) {
  // For each local item → update or add
  newItems.forEach((item) => {
    const existing = dbCart.items.find(
      (i: any) =>
        i.product.toString() === item.product.toString() &&
        ((i.variantId &&
          item.variantId &&
          i.variantId.toString() === item.variantId.toString()) ||
          (!i.variantId && !item.variantId))
    );

    if (existing) {
      if (existing.quantity !== item.quantity) {
        existing.quantity = item.quantity;
      }
    } else {
      dbCart.items.push(item);
    }
  });

  // Remove items no longer present in local cart
  dbCart.items = dbCart.items.filter((i: any) =>
    newItems.some(
      (ni) =>
        ni.product.toString() === i.product.toString() &&
        ((ni.variantId &&
          i.variantId &&
          ni.variantId.toString() === i.variantId.toString()) ||
          (!ni.variantId && !i.variantId))
    )
  );

  return dbCart;
}

/** Recalculate subtotal and totalItems */
function recalcTotals(dbCart: any) {
  dbCart.totalItems = dbCart.items.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );
  dbCart.subtotal = dbCart.items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );
  return dbCart;
}

/** Sync local cart with DB */
export async function syncCart(userId: string, localCart: LocalCartItem[]) {
  if (!Array.isArray(localCart) || localCart.length === 0) {
    throw new Error("Invalid cart data");
  }

  const mappedItems = mapCartItems(localCart);

  let dbCart = await Cart.findOne({ user: userId });

  if (!dbCart) {
    // Create new cart
    dbCart = await Cart.create({
      user: toObjectId(userId),
      items: mappedItems,
      totalItems: mappedItems.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: mappedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    });
  } else {
    dbCart = mergeCartItems(dbCart, mappedItems);
    dbCart = recalcTotals(dbCart);
    await dbCart.save();
  }

  return dbCart;
}
