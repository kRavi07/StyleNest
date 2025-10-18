import { protectedAxios } from "../../axiosInstances";
import { handleError } from "../../util";

export const createPaymentOrder = async (orderId: string) => {
  try {
    const res = await protectedAxios.post(
      `/payments/create`,
      { orderId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
