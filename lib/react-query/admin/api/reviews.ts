import { getAdminToken, handleError } from "../../util";
import axiosInstance, { setAuthToken } from "../axiosInstance";

export const getAllReviews = async () => {
  try {
    const token = getAdminToken();
    setAuthToken(token);

    const res = await axiosInstance.get(`admin/all-reviews`);

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const approveReview = async ({
  _id,
  status,
}: {
  _id: string;
  status: boolean;
}) => {
  try {
    const token = getAdminToken();
    setAuthToken(token);

    const res = await axiosInstance.post(
      `admin/approve-review/${_id}?status=${status}`
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getProductReview = async (product_id: string) => {
  try {
    const token = getAdminToken();
    setAuthToken(token);
    const res = await axiosInstance.get(`admin/product-reviews`, {
      params: {
        product_id,
      },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getReviewDetail = async (id: string) => {
  try {
    const token = getAdminToken();
    setAuthToken(token);
    const res = await axiosInstance.get(`admin/review/${id}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
