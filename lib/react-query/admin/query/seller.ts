import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addProductForSeller,
  downloadSellerDocs,
  getProducts,
} from "../api/seller";
import { toast } from "sonner";

export const useGetSellerProducts = (id: string) => {
  return useQuery({
    queryKey: ["getSellerProductsForAdmin", id],
    queryFn: () => getProducts(id),

    retry: 1,

    staleTime: 60 * 1000 * 10,
  });
};

export const useAddProductForSeller = () => {
  return useMutation({
    mutationKey: ["addProductForSeller"],
    mutationFn: addProductForSeller,

    onSuccess: (data) => {
      toast.success("Product has been added successfully");
      return data;
    },

    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export const useDownloadSellerDocs = (
  id: string,
  doc: string,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["downloadSellerDocs"],
    queryFn: () =>
      downloadSellerDocs({
        sellerId: id,
        docType: doc,
      }),
    enabled: enabled,

    staleTime: 60 * 1000 * 10,
  });
};
