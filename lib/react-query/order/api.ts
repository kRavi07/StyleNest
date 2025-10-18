import { protectedAxios } from "../axiosInstances";
import { handleError } from "../util";

export const createOrderApi = async (formData: any) => {
  try {
    const response = await protectedAxios.post(
      "/orders",
      JSON.stringify(formData)
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getOrdersApi = async ({
  status,
  page,
  limit,
}: {
  status: string;
  page: number;
  limit: number;
}) => {
  try {
    const response = await protectedAxios.get("/orders", {
      params: {
        status,
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getOrderApi = async (id: string) => {
  try {
    const response = await protectedAxios.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
