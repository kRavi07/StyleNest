import { getAdminToken, handleError } from "../../util";
import axiosInstance, { setAuthToken } from "../axiosInstance";

export const loadAdmin = async () => {
  try {
    const token = getAdminToken();

    setAuthToken(token);

    const res = await axiosInstance.get(`/admin/load`);

    return res.data;
  } catch (error) {
    handleError(error);
  }
};
