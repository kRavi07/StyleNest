import { useState, useCallback, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export const useQuantity = (maxQuantity: number) => {
  const [quantity, setQuantity] = useState(1);

  // Reset quantity when maxQuantity changes (e.g., variant change)
  useEffect(() => {
    if (quantity > maxQuantity && maxQuantity > 0) {
      setQuantity(Math.min(quantity, maxQuantity));
    }
  }, [maxQuantity, quantity]);

  const incrementQuantity = useCallback(() => {
    if (quantity < maxQuantity && maxQuantity > 0) {
      setQuantity((prev) => prev + 1);
    } else {
      toast({
        title: "Maximum quantity reached",
        description: `Only ${maxQuantity} items available in stock.`,
        variant: "destructive",
      });
    }
  }, [quantity, maxQuantity]);

  const decrementQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  }, [quantity]);

  const resetQuantity = useCallback(() => {
    setQuantity(1);
  }, []);

  const setSpecificQuantity = useCallback(
    (newQuantity: number) => {
      if (newQuantity >= 1 && newQuantity <= maxQuantity) {
        setQuantity(newQuantity);
      }
    },
    [maxQuantity]
  );

  return {
    quantity,
    incrementQuantity,
    decrementQuantity,
    resetQuantity,
    setSpecificQuantity,
  };
};
