// context/cart/CartProvider.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types";
import { CartContext, CartContextType, CartItem } from "@/hooks/context/cart/cart-context";
import { CartItemsCountContext } from "@/hooks/context/cart/cart-item-context";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<{
    items: CartItem[];
    subtotal: number;
  }>({
    items: [],
    subtotal: 0,
  });

  const { toast } = useToast();

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

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const calculateSubtotal = (items: CartItem[]) => {
    return items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  const addItem = (
    product: Product,
    quantity: number,
    size?: string,
    color?: string
  ) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.items.findIndex(
        (item) =>
          item.product._id === product._id &&
          item.size === size &&
          item.color === color
      );

      const newItems =
        existingIndex >= 0
          ? prevCart.items.map((item, i) =>
            i === existingIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
          : [...prevCart.items, { product, quantity, size, color }];

      return {
        items: newItems,
        subtotal: calculateSubtotal(newItems),
      };
    });
  };

  const removeItem = (productId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter(
        (item) => item.product._id !== productId
      );
      return {
        items: newItems,
        subtotal: calculateSubtotal(newItems),
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
        item.product._id === productId ? { ...item, quantity } : item
      );
      return {
        items: newItems,
        subtotal: calculateSubtotal(newItems),
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      subtotal: 0,
    });
  };

  const contextValue: CartContextType = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart }}>
      <CartItemsCountContext.Provider
        value={cart.items.reduce((acc, item) => acc + item.quantity, 0)}
      >
        {children}
      </CartItemsCountContext.Provider>
    </CartContext.Provider>
  );
};
