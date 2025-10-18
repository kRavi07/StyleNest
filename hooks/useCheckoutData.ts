import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShippingAddress,
  ShippingRate,
  CheckoutFormData,
} from "@/types/checkout";

export function useCheckoutData() {
  const router = useRouter();
  const abortControllerRef = useRef<AbortController | null>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingRate | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Clean up abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchShippingRates = useCallback(async (pinCode: string) => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/shipping/rates?pinCode=${pinCode}`, {
        signal: abortControllerRef.current.signal,
      });

      if (response.ok) {
        const data = await response.json();
        setShippingRates(data.data.rates);
        setSelectedShipping(data.data.rates[0] || null);
      } else {
        throw new Error("Failed to fetch shipping rates");
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Failed to fetch shipping rates:", error);
        setError("Failed to load shipping options. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateTotal = useCallback(
    (subtotal: number, taxRate: number = 0.18) => {
      if (!selectedShipping) return subtotal;

      const tax = Math.round(subtotal * taxRate);
      const shippingCost = selectedShipping.rate;
      return subtotal + tax + shippingCost;
    },
    [selectedShipping]
  );

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(1, Math.min(step, 3)));
  }, []);

  return {
    currentStep,
    shippingRates,
    selectedShipping,
    isLoading,
    isProcessing,
    error,
    setSelectedShipping,
    setIsProcessing,
    setError,
    fetchShippingRates,
    calculateTotal,
    nextStep,
    prevStep,
    goToStep,
  };
}
