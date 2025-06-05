import axios, { AxiosRequestConfig } from "axios";
import { AddProductProps, CategoryProps } from "../query.type";
import { createFormData, getAdminToken, handleError } from "../util";
import axiosInstance, { setAuthToken } from "./axiosInstance";
import { CategoryFormData } from "@/lib/validation/category";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const config: AxiosRequestConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const adminRegister = async (data: any) => {
  try {
    const res = await axiosInstance.post(`/add-admin`, data, config);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const addCategory = async (data: CategoryFormData) => {
  console.log(data);
  try {
    const { name, slug, parent, image, isActive } = data;

    const formData = new FormData();

    formData.append("name", name);
    formData.append("slug", slug);
    if (parent) {
      formData.append("parent", parent);
    }
    if (image) {
      formData.append("image", image);
    }
    const token = getAdminToken();
    const res = await axiosInstance.post(`/admin/category`, formData, {
      headers: {
        token,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const addProduct = async ({
  product_name,
  discription,
  price,
  quantity,
  category,
  files,
  attributes,
  priceRange,
}: AddProductProps) => {
  try {
    const token = getAdminToken();

    if (!token) {
      throw new Error("Token not found");
    }
    setAuthToken(token);

    const attributesList = JSON.stringify(attributes);
    const priceRangeJson = JSON.stringify(priceRange);

    const formData = new FormData();

    formData.append("product_name", product_name);
    formData.append("discription", discription);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("category", category);

    if (files !== null) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }

    formData.append("attributes", attributesList);
    formData.append("priceRange", priceRangeJson);

    const res = await axiosInstance.post(`/admin/add-product`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getEnquiryList = async () => {
  try {
    const token = getAdminToken();
    setAuthToken(token);

    const res = await axiosInstance.get(`/admin/get-enquiry`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getSellers = async ({ id }: { id?: string }) => {
  try {
    const token = getAdminToken();
    setAuthToken(token);
    const res = await axiosInstance.get(`/admin/getseller`, {
      params: { sellerId: id },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const approveProduct = async (id: string) => {
  try {
    const token = getAdminToken();
    setAuthToken(token);
    const res = await axiosInstance.get(`/admin/approve-product?id=${id}`);
    return res;
  } catch (error) {
    handleError(error);
  }
};

export const approveSeller = async (id: string) => {
  try {
    const token = getAdminToken();

    setAuthToken(token);

    const res = await axiosInstance.post(
      `/admin/approveSeller `,
      createFormData(["sellerid", "approved"], [id, "approved"]),
      {
        headers: {
          token: token,
        },
      }
    );
    return res;
  } catch (error) {
    handleError(error);
  }
};

export const updateProduct = async ({
  Product_ID,
  product_name,
  discription,
  price,
  category,
  sku,
  files,
  attributes,
  priceRange,
}: AddProductProps) => {
  try {
    const token = getAdminToken();

    setAuthToken(token);

    //check if attributes array contains "" empty string
    if (attributes.includes("")) {
      attributes = "";
    }

    //check if priceRange array contains

    const formData = new FormData();

    if (product_name !== undefined) {
      formData.append("product_name", product_name);
    }
    if (discription !== undefined) {
      formData.append("discription", discription);
    }
    if (price !== undefined) {
      formData.append("price", price);
    }
    if (category !== undefined) {
      formData.append("category", category);
    }
    if (sku !== undefined) {
      formData.append("sku", sku);
    }

    if (files !== undefined && files !== null) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }
    if (attributes !== undefined && attributes !== null) {
      const attributesList = JSON.stringify(attributes);
      formData.append("attributes", attributesList);
    }

    if (priceRange !== undefined && priceRange !== null) {
      const priceRangeJson = JSON.stringify(priceRange);

      formData.append("priceRange", priceRangeJson);
    }

    const res = await axiosInstance.put(
      `admin/update-product/${Product_ID}`,
      formData,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const token = getAdminToken();
    setAuthToken(token);
    const res = await axiosInstance.delete(
      `${API_URL}/admin/delete-product?id=${id}`
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllUsers = async () => {
  try {
    const token = getAdminToken();
    setAuthToken(token);
    const res = await axiosInstance.get("/admin/all-users");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
