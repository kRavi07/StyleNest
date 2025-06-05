import { getAdminToken, handleError } from "../../util";
import axiosInstance, { setAuthToken } from "../axiosInstance";

export const getAllRequirementMessages = async () => {
  try {
    const token = getAdminToken();
    setAuthToken(token);

    const res = await axiosInstance.get("admin/requirement-messages");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getRequirementMessage = async (id: string) => {
  try {
    const token = getAdminToken();
    setAuthToken(token);

    const res = await axiosInstance.get(`admin/requirement-message/${id}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
