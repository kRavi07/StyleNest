// context/cart/CartContext.ts
"use client";

import { createContext, useContext } from "react";
import { Product } from "@/types";

export type CartItem = {
    product: Product;
    quantity: number;
    size?: string;
    color?: string;
};

export type Cart = {
    items: CartItem[];
    subtotal: number;
};

export type CartContextType = {
    cart: Cart;
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

export const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
