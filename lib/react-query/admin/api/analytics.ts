import { getAdminToken, handleError } from "../../util";
import axiosInstance, { setAuthToken } from "../axiosInstance";

export const getDashboardAnalytics = async (days: number) => {
  try {
    const token = getAdminToken();

    setAuthToken(token);

    const res = await axiosInstance.get(
      `/admin/dashboard/analytics?days=${days}`
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const downloadCsv = async (collectionName: string) => {
  try {
    const token = getAdminToken();

    setAuthToken(token);

    const res = await axiosInstance.get(`/admin/get-csv`, {
      params: {
        collection: collectionName,
      },
    });

    return res.data;
  } catch (error) {
    handleError(error);
  }
};
