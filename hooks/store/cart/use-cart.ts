import { toast } from "@/hooks/use-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type LeanProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  image: string;
};

type LeanVariant = {
  id: string;
  sku: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  optionValues: Record<string, string>;
};

export type CartItem = {
  id: string;
  product: LeanProduct;
  variant?: LeanVariant;
  hasVariants?: boolean;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  totalItemCount: number;
  subtotal: number;
};

type CartActions = {
  addItem: (itemData: Omit<CartItem, "id"> & { priceForTotal: number }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  hasItems: (itemId: string) => boolean;
};

const initialState: CartState = {
  items: [],
  totalItemCount: 0,
  subtotal: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const price = item?.product.price ?? 0;
    return sum + price * item.quantity;
  }, 0);
  return { totalItemCount, subtotal };
};

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      addItem: (itemData) => {
        const { product, variant, quantity, hasVariants: isVariant } = itemData;

        console.log("Adding item to cart:", isVariant, variant);

        const itemId = isVariant && variant ? variant.id : product.id;

        const items = get().items;

        const existingItem = items.find((item) => item.id === itemId);

        if (existingItem) {
          const updatedItems = items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          set({ items: updatedItems, ...calculateTotals(updatedItems) });
        } else {
          const newItem: CartItem = {
            ...itemData,
            id: itemId,
          };
          const newItems = [...items, newItem];
          set({ items: newItems, ...calculateTotals(newItems) });
        }
      },

      removeItem: (itemId) => {
        const updatedItems = get().items.filter((item) => item.id !== itemId);
        set({ items: updatedItems, ...calculateTotals(updatedItems) });
        toast({ title: "Item removed from cart." });
      },

      updateQuantity: (itemId, quantity) => {
        let updatedItems = get().items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );

        updatedItems = updatedItems.filter((item) => item.quantity > 0);
        set({ items: updatedItems, ...calculateTotals(updatedItems) });
      },

      clearCart: () => {
        set(initialState);
      },
      hasItems: (itemId: string) => {
        return !!get().items.find((item) => item.id === itemId);
      },
    }),
    {
      name: "cart-storage", // localStorage key
    }
  )
);
