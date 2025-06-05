import { useMutation, useQuery } from "@tanstack/react-query";
import {
  UpdateAttribute,
  addProductAttributes,
  getAllAttributes,
  getAttributeById,
} from "../api/attributes";
import { toast } from "sonner";

export const useGetAttributes = () => {
  return useQuery({
    queryKey: ["getAttributes"],
    queryFn: () => getAllAttributes(),

    staleTime: 60 * 1000 * 10,
  });
};

export const useAddAttributeType = () => {
  return useMutation({
    mutationFn: addProductAttributes,
    mutationKey: ["addAttributeType"],

    onSuccess: (data) => {
      toast.success("Attribute type has been added successfully");
      return data;
    },

    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export const useUpdateAttributeType = () => {
  return useMutation({
    mutationKey: ["updateAttributeType"],
    mutationFn: UpdateAttribute,
    onSuccess: (data) => {
      toast.success("Attribute type has been updated successfully");
      return data;
    },

    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export const useGetAttributeById = (id: string) => {
  return useQuery({
    queryKey: ["getAttributeById"],
    queryFn: () => getAttributeById(id),

    staleTime: 60 * 1000 * 10,
  });
};
