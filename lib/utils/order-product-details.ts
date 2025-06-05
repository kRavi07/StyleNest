import Product from "@/lib/db/models/product";
export interface IncomingOrderItem {
  productId: string;
  quantity: number;
  sku?: string;
}

export interface ResolvedOrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
  variantInfo?: Record<string, string>;
}

export const resolveOrderItemsFromProduct = async (
  items: IncomingOrderItem[]
): Promise<ResolvedOrderItem[]> => {
  return await Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      let variant = undefined;
      if (item.sku && product.variants?.length) {
        variant = product.variants.find((v) => v.sku === item.sku);
      }

      return {
        productId: product._id.toString(),
        name: product.name,
        sku: variant?.sku ?? product.slug,
        price: variant?.price ?? product.price,
        quantity: item.quantity,
        image: (variant?.images ?? product.images)[0] ?? "",
        variantInfo:
          variant?.optionValues?.reduce((acc, cur) => {
            acc[cur.name] = cur.value;
            return acc;
          }, {} as Record<string, string>) ?? {},
      };
    })
  );
};
