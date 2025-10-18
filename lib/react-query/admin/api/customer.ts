import { PaginationParams } from "@/lib/utils/pagination";
import { handleError } from "../../util";
import axiosInstance from "../axiosInstance";
import { CustomerOrdersParams } from "../../query.type";

export const getCustomers = async ({
  page,
  limit,
  search,
  sort,
  filters,
}: PaginationParams) => {
  try {
    const res = await axiosInstance.get(`/admin/customers`, {
      params: {
        page,
        limit,
        search,
        sort,
        filters,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getCustomer = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/admin/customers/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getCustomerOrders = async ({
  id,
  page,
  limit,
  search,
  sort,
  filters,
}: CustomerOrdersParams) => {
  try {
    const res = await axiosInstance.get(`/admin/customers/${id}/orders`, {
      params: {
        page,
        limit,
        search,
        sort,
        filters,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getCustomerOrder = async (id: string, orderId: string) => {
  try {
    const res = await axiosInstance.get(
      `/admin/customers/${id}/orders/${orderId}`
    );
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
