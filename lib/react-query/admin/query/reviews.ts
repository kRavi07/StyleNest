import { useMutation, useQuery } from "@tanstack/react-query";
import {
  approveReview,
  getAllReviews,
  getProductReview,
  getReviewDetail,
} from "../api/reviews";
import { toast } from "sonner";

export const useGetAllReviews = () => {
  return useQuery({
    queryKey: ["getAllReviews"],
    queryFn: () => getAllReviews(),
    staleTime: 60 * 1000 * 10,
  });
};

export const useApproveReview = () => {
  return useMutation({
    mutationKey: ["approveReview"],
    mutationFn: approveReview,

    onSuccess: (data) => {
      toast.success("Review has been approved successfully");
      return data;
    },

    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export const useGetProductReview = (product_id: string) => {
  return useQuery({
    queryKey: ["getProductReview"],
    queryFn: () => getProductReview(product_id),
    staleTime: 60 * 1000 * 10,
  });
};

export const useGetReviewDetail = (id: string) => {
  return useQuery({
    queryKey: ["getReviewDetail", id],
    queryFn: () => getReviewDetail(id),
    staleTime: 60 * 1000 * 10,
  });
};
