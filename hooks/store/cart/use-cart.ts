import { StateCreator, create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { Product } from "@/types";

export type CartItem = {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
};

type CartStore = {
  items: CartItem[];
  subtotal: number;
  count: number;
  addItem: (
    product: Product,
    quantity: number,
    size?: string,
    color?: string
  ) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

export const cartMiddleware = (f: StateCreator<CartStore>) =>
  devtools(
    persist(f, {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    })
  );

export const useCartStore = create<CartStore>()(
  cartMiddleware((set, get) => ({
    items: [],
    subtotal: 0,
    count: 0,

    addItem: (product, quantity, size, color) => {
      const existingIndex = get().items.findIndex(
        (item) =>
          item.product._id === product._id &&
          item.size === size &&
          item.color === color
      );

      let newItems = [...get().items];
      if (existingIndex !== -1) {
        newItems[existingIndex].quantity += quantity;
      } else {
        newItems.push({ product, quantity, size, color });
      }

      set({
        items: newItems,
        subtotal: calculateSubtotal(newItems),
        count: calculateCount(newItems),
      });
    },

    removeItem: (productId) => {
      const newItems = get().items.filter(
        (item) => item.product._id !== productId
      );
      set({
        items: newItems,
        subtotal: calculateSubtotal(newItems),
        count: calculateCount(newItems),
      });
    },

    updateQuantity: (productId, quantity) => {
      if (quantity < 1) return;

      const newItems = get().items.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      );

      set({
        items: newItems,
        subtotal: calculateSubtotal(newItems),
        count: calculateCount(newItems),
      });
    },

    clearCart: () => {
      set({ items: [], subtotal: 0, count: 0 });
    },
  }))
);

// Helper functions
function calculateSubtotal(items: CartItem[]) {
  return items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
}

function calculateCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
