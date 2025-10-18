import { useMutation, useQuery } from "@tanstack/react-query";
import { createOrderApi, getOrderApi, getOrdersApi } from "./api";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: createOrderApi,
    mutationKey: ["createOrder"],
  });
};

export const useGetOrders = ({
  status,
  page,
  limit,
}: {
  status: string;
  page: number;
  limit: number;
}) => {
  return useQuery({
    queryFn: () => getOrdersApi({ status, page, limit }),
    queryKey: ["getOrders", status, page, limit],
    staleTime: 60 * 1000 * 10,
  });
};

export const useGetOrder = (id: string) => {
  return useQuery({
    queryKey: ["getOrder"],
    queryFn: () => getOrderApi(id),
    staleTime: 60 * 1000 * 10,
  });
};
