import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteProductImage,
  getAllProducts,
  makeProductFeatured,
  rejectProduct,
} from "../api/product";
import { toast } from "sonner";

export const fetchAllProducts = () => {
  return useQuery({
    queryKey: ["getAllProducts"],
    queryFn: () => getAllProducts(),
    staleTime: 60 * 1000 * 10,
  });
};

export const useRejectProduct = () => {
  return useMutation({
    mutationKey: ["rejectProduct"],
    mutationFn: rejectProduct,
    onSuccess: (data) => {
      toast.success("Product rejected successfully");
      return data;
    },
    onError: (error) => {
      toast.error(error?.message);
    },
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
