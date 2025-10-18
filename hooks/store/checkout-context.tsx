"use client";
import { createContext, useContext, ReactNode } from "react";
import { useCheckoutData } from "../useCheckoutData";

type CheckoutContextType = ReturnType<typeof useCheckoutData>;

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const checkout = useCheckoutData();
  return (
    <CheckoutContext.Provider value={checkout}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used inside CheckoutProvider");
  return ctx;
};
