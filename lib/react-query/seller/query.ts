import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  UpdateProfileOwnerDetails,
  addProduct,
  confirmSellerPassword,
  getAllProducts,
  getSellerSupportTickets,
  updateSellerBusinessDetails,
  updateSellerPassword,
  verifySellerOtp,
  sendSellerTicketChatMessage,
  toggleConsent,
} from "./api";

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

export const getSellerAllProducts = () => {
  return useQuery({
    queryKey: ["sellerallproducts"],
    queryFn: () => getAllProducts(),
  });
};

export const useUpdateSellerBusinessDetails = () => {
  return useMutation({
    mutationKey: ["updateSellerProfile"],
    mutationFn: updateSellerBusinessDetails,

    onSuccess: (data, variables, context) => {
      toast.success("Business details have been updated");
      return data;
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useConfirmSellerPassword = () => {
  return useMutation({
    mutationKey: ["confirmSellerPassword"],
    mutationFn: confirmSellerPassword,

    onSuccess: (data) => {
      return true;
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateSellerPassword = () => {
  return useMutation({
    mutationKey: ["changeSellerPassword"],
    mutationFn: updateSellerPassword,

    onSuccess: (data) => {
      toast.success("Password has been updated successfully");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationKey: ["verifyotp"],
    mutationFn: verifySellerOtp,
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateSellerProfileOwnerDetails = () => {
  return useMutation({
    mutationKey: ["updateSellerProfileOwnerDetails"],
    mutationFn: UpdateProfileOwnerDetails,

    onSuccess: (data) => {
      toast.success("Business details have been updated");
      return data;
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useGetSellerSupportTickets = () => {
  return useQuery({
    queryKey: ["sellerSupportTickets"],
    queryFn: () => getSellerSupportTickets(),

    staleTime: 60 * 1000 * 10,
  });
};

export const sendSellerChatSupportMessage = () => {
  return useMutation({
    mutationKey: ["sendChatSupportMessage"],
    mutationFn: sendSellerTicketChatMessage,
    onSuccess: (data) => {
      toast.success("Message sent successfully");

      return data;
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useToggleAdminConsent = () => {
  return useMutation({
    mutationKey: ["toggleAdminConsent"],
    mutationFn: toggleConsent,

    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      return error;
    },
  });
};
