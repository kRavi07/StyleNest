// context/cart/CartItemsCountContext.ts
"use client";

import { createContext, useContext } from "react";

export const CartItemsCountContext = createContext<number>(0);

export const useCartItemsCount = () => {
    return useContext(CartItemsCountContext);
};
