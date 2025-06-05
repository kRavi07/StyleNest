import { useMutation, useQuery } from "@tanstack/react-query";
import {
  GetAllCategories,
  approveCategory,
  handleFeaturedCategory,
} from "../api/category";
import { toast } from "sonner";

export const useGetAllCatgeories = () => {
  return useQuery({
    queryKey: ["adminAllCategories"],
    queryFn: GetAllCategories,

    staleTime: 60 * 1000 * 5,
  });
};

export const refetchCategories = () => {
  useGetAllCatgeories().refetch();
};

export const useApproveCategory = () => {
  return useMutation({
    mutationKey: ["approveCategory"],
    mutationFn: approveCategory,

    onSuccess: (data) => {
      toast.success("Category has been approved successfully");
      return data;
    },

    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export const useHandleFeatured = ({
  id,
  status,
}: {
  id: string;
  status: boolean;
}) => {
  return useMutation({
    mutationKey: ["handleFeatured", id],

    mutationFn: () => handleFeaturedCategory({ id, status }),

    onSuccess: (data: string) => {
      toast.success(data);
      return data;
    },

    onError: (error) => {
      toast.error(error?.message);
    },
  });
};
