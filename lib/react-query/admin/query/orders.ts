import { useQuery } from "@tanstack/react-query";
import { getAllOrders, getOrder } from "../api/orders";

export const useGetOrders = ({
  status,
  limit,
  page,
}: {
  status: string;
  limit: number;
  page: number;
}) => {
  return useQuery({
    queryKey: ["getOrders", status, limit, page],
    queryFn: () => getAllOrders({ status, limit, page }),
    staleTime: 1000 * 60 * 5 * 30,
  });
};

export const useGetOrder = (id: string) => {
  return useQuery({
    queryKey: ["getOrder", id],
    queryFn: () => getOrder(id),

    staleTime: 1000 * 60 * 5 * 30,
  });
};
