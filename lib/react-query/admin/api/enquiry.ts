import { getAdminToken, handleError } from "../../util";
import axiosInstance, { setAuthToken } from "../axiosInstance";

export const getSingleEnquiry = async (id: string) => {
  try {
    const token = getAdminToken();
    setAuthToken(token);

    const res = await axiosInstance.get(`/admin/enquiry/${id}`);

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateEnquiryStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  try {
    const token = getAdminToken();
    setAuthToken(token);
    const res = await axiosInstance.post(
      `/admin/enquiry/update/status/${id}?status=${status}`
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};
