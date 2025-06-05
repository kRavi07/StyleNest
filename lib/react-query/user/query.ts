import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getUserEnquiries,
  loadUser,
  postReview,
  sendProductEnquiry,
  updateProfile,
  updateUserDetails,
} from "./api";
import { toast } from "sonner";
import { getUserToken, handleError } from "../util";

export const useSendProductEnquiry = () => {
  const addProductMutation = useMutation({
    mutationKey: ["sendProductEnquiry"],
    mutationFn: sendProductEnquiry,

    onSuccess: (data) => {
      toast.success("Product enquiry has been sent successfully");
      return data;
    },

    onError: (error) => {
      toast.error(error?.message);
    },
  });

  return addProductMutation;
};

export const useUpdateUserDetails = () => {
  return useMutation({
    mutationKey: ["updateUserDetails"],
    mutationFn: updateUserDetails,

    onSuccess: (data) => {
      toast.success("User details has been updated successfully");
      return data;
    },

    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export const useGetUserEnquiries = () => {
  return useQuery({
    queryKey: ["getUserEnquiries"],
    queryFn: () => getUserEnquiries(),

    staleTime: 60 * 1000 * 10,
  });
};

export const useLoadUser = () => {
  return useQuery({
    queryKey: ["loadUser"],
    queryFn: () => loadUser(),
    retry: 1,
    staleTime: 60 * 1000 * 10,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: updateProfile,

    onSuccess: (data) => {
      toast.success("User details has been updated successfully");
      return data;
    },

    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export const usePostReview = () => {
  return useMutation({
    mutationKey: ["postReview"],
    mutationFn: postReview,

    onSuccess: (data) => {
      toast.success("Review has been posted successfully");
      return data;
    },

    onError: (error) => {
      toast.error(error?.message);
    },
  });
};
