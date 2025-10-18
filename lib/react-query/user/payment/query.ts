import { useMutation } from "@tanstack/react-query";
import { createPaymentOrder } from "./api";

export const useCreatePaymentOrder = () => {
  return useMutation({
    mutationFn: createPaymentOrder,
    mutationKey: ["createPaymentOrder"],
  });
};
