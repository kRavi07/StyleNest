import { useQuery } from "@tanstack/react-query";
import {
  getCustomer,
  getCustomerOrder,
  getCustomerOrders,
  getCustomers,
} from "../api/customer";
import { PaginationParams } from "@/lib/utils/pagination";
import { CustomerOrdersParams } from "../../query.type";

export const useGetCustomers = (param: PaginationParams) => {
  return useQuery({
    queryKey: ["getCustomers"],
    queryFn: () => getCustomers(param),
  });
};

export const useGetCustomer = (id: string) => {
  return useQuery({
    queryKey: ["getCustomer", id],
    queryFn: () => getCustomer(id),
  });
};

export const useGetCustomerOrders = (data: CustomerOrdersParams) => {
  return useQuery({
    queryKey: ["getCustomerOrders", data.id],
    queryFn: () => getCustomerOrders(data),
  });
};

export const useGetCustomerOrder = (id: string, orderId: string) => {
  return useQuery({
    queryKey: ["getCustomerOrder", id, orderId],
    queryFn: () => getCustomerOrder(id, orderId),
  });
};
