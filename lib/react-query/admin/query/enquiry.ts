import { useMutation, useQuery } from "@tanstack/react-query";
import { getSingleEnquiry, updateEnquiryStatus } from "../api/enquiry";
import { toast } from "sonner";

export const useGetEnquiry = (id: string) => {
  return useQuery({
    queryKey: ["getEnquiry", id],
    queryFn: () => getSingleEnquiry(id),

    staleTime: 60 * 5 * 1000,
  });
};

export const useUpdateStatus = () => {
  return useMutation({
    mutationKey: ["updateStatus"],
    mutationFn: updateEnquiryStatus,
    onSuccess: (data) => {
      toast.success("Status updated successfully");
      return data;
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
};
