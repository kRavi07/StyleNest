import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteProductImage,
  fetchAllProducts,
  getProdcutById,
  makeProductFeatured,
  updateProduct,
  uploadProductImages,
} from "../api/product";
import { toast } from "sonner";
import { Product } from "@/types";

export type ProductResponse = {
  items: Product[];
  total: number;
  totalPages: number;
};

export const useFetchProductsInfinite = (
  name?: string,
  category?: string,
  productname?: string,
  limit = 20 // Default limit to 20
) => {
  return useInfiniteQuery({
    queryKey: ["fetchProductsInfinite", name, category, productname],
    queryFn: ({ pageParam = 1 }) =>
      fetchAllProducts({
        category,
        search: name,
        limit,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMore) {
        return lastPage.nextPage;
      } else {
        return undefined;
      }
    },
    initialPageParam: 1,
  });
};

export const useGetProductById = (id: string) => {
  return useQuery({
    queryKey: ["getProductById", id],
    queryFn: () => getProdcutById(id),
  });
};

export const useProductImageUpload = () => {
  return useMutation({
    mutationKey: ["uploadProductImage"],
    mutationFn: uploadProductImages,
  });
};

export const useMakeProductFeatured = () => {
  return useMutation({
    mutationKey: ["makeProductFeatured"],
    mutationFn: makeProductFeatured,
    onSuccess: (data) => {
      toast.success("Product has been updated successfully");
      return data;
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: updateProduct,
  });
};

export const useDeleteProductImage = () => {
  return useMutation({
    mutationKey: ["deleteProductImage"],
    mutationFn: deleteProductImage,
    onSuccess: (data) => {
      toast.success("Product image has been deleted successfully");
      return data;
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
};
