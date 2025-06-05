import { getAdminToken, handleError } from "../../util";
import axiosInstance, { setAuthToken } from "../axiosInstance";

export const GetAllCategories = async () => {
  try {
    const token = getAdminToken();
    setAuthToken(token);
    const res = await axiosInstance.get(`admin/categories`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const approveCategory = async ({
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
      `admin/category/approve/${id}?status=${status}`
    );
    return res.data;
  } catch (err) {
    console.log(err);
    handleError(err);
  }
};

export const handleFeaturedCategory = async ({
  id,
  status,
}: {
  id: string;
  status: boolean;
}) => {
  try {
    const token = getAdminToken();
    setAuthToken(token);

    const res = await axiosInstance.put(
      `admin/category/make-featured/${id}?state=${status}`
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};
