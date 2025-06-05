import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { sellerUpdateProduct } from "./api";

export const useSellerUpdateProduct = () => {
  return useMutation({
    mutationKey: ["sellerUpdateProduct"],
    mutationFn: sellerUpdateProduct,

    onSuccess: (data) => {
      toast.success("Product has been updated successfully");
      return data;
    },

    onError: (error) => {
      toast.error(error?.message);
    },
  });
};
