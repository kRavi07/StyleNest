import { getAdminToken, handleError } from "../../util";
import axiosInstance, { setAuthToken } from "../axiosInstance";

export const getAllOrders = async ({
  status,
  page,
  limit,
  search,
}: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const res = await axiosInstance.get(`/admin/orders`, {
      params: {
        status,
        page,
        limit,
        search,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getOrder = async (id: string) => {
  try {
    const token = getAdminToken();
    setAuthToken(token);

    const res = await axiosInstance.get(`/admin/orders/${id}`);

    return res.data;
  } catch (error) {
    handleError(error);
  }
};
