import { getAdminToken, handleError } from "../../util";
import axiosInstance, { setAuthToken } from "../axiosInstance";

export const getDashboardAnalytics = async (days: number) => {
  try {
    const token = getAdminToken();

    setAuthToken(token);

    const res = await axiosInstance.get(`/admin/analytics?days=${days}`);

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const salesReportAnalytics = async ({
  startDate,
  endDate,
  type,
}: {
  startDate: string;
  endDate: string;
  type: string;
}) => {
  try {
    const res = await axiosInstance.get(`/admin/analytics/sales`, {
      params: {
        start: startDate,
        end: endDate,
        type,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
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
