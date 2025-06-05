import axiosInstance, { setAuthToken } from "../axiosInstance";
import { getAdminToken, handleError } from "../../util";
import {
  AttributeType,
  CreateVariantAttribute,
} from "@/lib/react-query/query.type";

const token = getAdminToken();

export const addProductAttributes = async (data: CreateVariantAttribute) => {
  try {
    const res = await axiosInstance.post(`/admin/variant-attribute`, data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllAttributes = async () => {
  try {
    const res = await axiosInstance.get(`/admin/variant-attribute`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAttributeById = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/admin/variant-attribute/${id}`);

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const UpdateAttribute = async (data: AttributeType) => {
  try {
    setAuthToken(token);

    const res = await axiosInstance.patch(
      `/admin/variant-attribute/${data._id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
