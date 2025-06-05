import { getAdminToken, handleError } from "../../util";
import axiosInstance, { setAuthToken } from "../axiosInstance";

export const getAllProducts = async () => {
  try {
    const token = getAdminToken();
    const res = await axiosInstance.get("/admin/products", {
      headers: {
        token,
      },
    });

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const rejectProduct = async ({
  id,
  rejection_note,
}: {
  id: string;
  rejection_note: string;
}) => {
  try {
    const token = getAdminToken();
    setAuthToken(token);

    const formData = new FormData();

    formData.append("rejection_note", rejection_note);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const res = await axiosInstance.put(
      `/admin/reject-product/${id}`,
      formData,
      config
    );

    return res;
  } catch (error) {
    handleError(error);
  }
};

export const makeProductFeatured = async ({
  id,
  status,
}: {
  id: string;
  status: boolean;
}) => {
  try {
    const token = getAdminToken();
    setAuthToken(token);
    const res = await axiosInstance.post(
      `/admin/updat/product/featured/${id}?featured=${status}`
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteProductImage = async ({
  id,
  index,
}: {
  id: string;
  index: number;
}) => {
  try {
    const res = await axiosInstance.put(
      `/admin/product/remove-image/${id}?index=${index}`
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};
