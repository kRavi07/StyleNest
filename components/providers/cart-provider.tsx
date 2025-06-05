"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";

export type CartItem = {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
};

type CartContextType = {
  cart: {
    items: CartItem[];
    subtotal: number;
  };
  addItem: (product: Product, quantity: number, size?: string, color?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<{
    items: CartItem[];
    subtotal: number;
  }>({
    items: [],
    subtotal: 0,
  });
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Calculate subtotal whenever items change
  const calculateSubtotal = (items: CartItem[]) => {
    return items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  };

  const addItem = (product: Product, quantity: number, size?: string, color?: string) => {
    setCart((prevCart) => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.items.findIndex(
        (item) => item.product.id === product.id && item.size === size && item.color === color
      );

      let newItems;

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        newItems = [...prevCart.items];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        newItems = [...prevCart.items, { product, quantity, size, color }];
      }

      const newSubtotal = calculateSubtotal(newItems);

      return {
        items: newItems,
        subtotal: newSubtotal,
      };
    });
  };

  const removeItem = (productId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.product.id !== productId);
      const newSubtotal = calculateSubtotal(newItems);

      return {
        items: newItems,
        subtotal: newSubtotal,
      };
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      toast({
        title: "Error",
        description: "Quantity cannot be less than 1",
        variant: "destructive",
      });
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      const newSubtotal = calculateSubtotal(newItems);

      return {
        items: newItems,
        subtotal: newSubtotal,
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      subtotal: 0,
    });
  };

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext }