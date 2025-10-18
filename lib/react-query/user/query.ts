import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addAddress,
  deleteAddress,
  getAddresses,
  getProfile,
  loadUser,
  postReview,
  syncCart,
  updateAddress,
  updateProfile,
} from "./api";
import { toast } from "sonner";

export const useSyncCart = () => {
  return useMutation({
    mutationKey: ["syncCart"],
    mutationFn: syncCart,
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

export const useAddAddress = () => {
  return useMutation({
    mutationKey: ["addAddress"],
    mutationFn: addAddress,
  });
};

export const useGetAddresses = () => {
  return useQuery({
    queryKey: ["getAddresses"],
    queryFn: () => getAddresses(),
    staleTime: 60 * 1000 * 10,
  });
};

export const useUpdateAddress = () => {
  return useMutation({
    mutationKey: ["updateAddress"],
    mutationFn: updateAddress,
  });
};

export const useDeleteAddress = () => {
  return useMutation({
    mutationKey: ["deleteAddress"],
    mutationFn: deleteAddress,
  });
};

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["getProfile"],
    queryFn: () => getProfile(),
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: updateProfile,
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
