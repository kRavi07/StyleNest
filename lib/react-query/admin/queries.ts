import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addCategory,
  addProduct,
  adminRegister,
  approveProduct,
  deleteProduct,
  getAllUsers,
  getEnquiryList,
  getSellers,
  updateProduct,
} from "./api";
import { toast } from "sonner";

export const useRegisterAdmin = () => {
  return useMutation({
    mutationKey: ["addAdmin"],
    mutationFn: adminRegister,

    onSuccess: (data) => {
      toast.success("Admin has been added successfully");
      return data;
    },

    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export const useAddCategory = () => {
  return useMutation({
    mutationKey: ["addCategory"],
    mutationFn: addCategory,
    onSuccess: () => {
      toast.success("Category has been added successfully");
    },

    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export const useAddProduct = () => {
  return useMutation({
    mutationKey: ["addProduct"],
    mutationFn: addProduct,

    onSuccess: (data) => {
      toast.success("Product has been added successfully");
      return data;
    },

    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export const useGetEnquiryList = () => {
  return useQuery({
    queryKey: ["getEnquiryList"],
    queryFn: getEnquiryList,

    staleTime: 60 * 1000 * 5,
  });
};

export const useGetSellers = ({ id }: { id?: string }) => {
  return useQuery({
    queryKey: ["getSellers", id],
    queryFn: () => getSellers({ id }),
    staleTime: 60 * 1000 * 5,
  });
};
export const useApproveProduct = (id: string) => {
  return useMutation({
    mutationKey: ["approveProduct", id],
    mutationFn: () => approveProduct(id),
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: updateProduct,
    onSuccess: (data) => {
      toast.success("Product has been updated successfully");
      return data;
    },

    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export const useDeleteProduct = (id: string) => {
  return useMutation({
    mutationKey: ["deleteProduct", id],
    mutationFn: () => deleteProduct(id),

    onSuccess: (data) => {
      toast.success("Product has been deleted successfully");
      return data;
    },

    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["getAllUsers"],
    queryFn: () => getAllUsers(),
    staleTime: 60 * 1000 * 10,
  });
};
