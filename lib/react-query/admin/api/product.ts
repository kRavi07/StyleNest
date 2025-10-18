import { getAdminToken, handleError } from "../../util";
import axiosInstance, { setAuthToken } from "../axiosInstance";

export const fetchAllProducts = async ({
  page,
  search,
  status,
  category,
  limit = 20,
}: {
  page: number;
  search?: string;
  status?: string;
  category?: string;
  limit?: number;
}) => {
  try {
    const res = await axiosInstance.get("/admin/products", {
      params: {
        page,
        limit,
        search,
        status,
        category,
      },
    });

    return res.data;
  } catch (error) {
    handleError(error);
  }
};
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

export const getProdcutById = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/admin/products/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const uploadProductImages = async (files: File[]) => {
  try {
    const formData = new FormData();
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("images", file);
      });
    }
    const res = await axiosInstance.post(
      `/admin/products/upload-images`,
      formData
    );
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const updateProduct = async ({
  id,
  data,
}: {
  id: string;
  data: any;
}) => {
  try {
    const res = await axiosInstance.patch(`/admin/products/${id}`, data);
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
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
