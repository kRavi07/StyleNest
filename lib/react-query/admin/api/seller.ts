import { AddProductForSellerProps, AddProductProps } from "../../query.type";
import { getAdminToken, handleError } from "../../util";
import axiosInstance, { setAuthToken } from "../axiosInstance";

export const getProducts = async (id: string) => {
  try {
    const token = getAdminToken();

    setAuthToken(token);

    const res = await axiosInstance.get(`/admin/seller/products/${id}`);

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const addProductForSeller = async ({
  product_name,
  discription,
  price,
  quantity,
  category,
  files,
  attributes,
  priceRange,
  sellerId,
}: AddProductForSellerProps) => {
  try {
    const token = getAdminToken();

    if (!token) {
      throw new Error("Token not found");
    }
    setAuthToken(token);

    const attributesList = JSON.stringify(attributes);
    const priceRangeJson = JSON.stringify(priceRange);

    const formData = new FormData();

    if (sellerId !== "") {
      formData.append("sellerId", sellerId);
    }

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

    const res = await axiosInstance.post(
      `/admin/add-product/seller`,
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

export const downloadSellerDocs = async ({
  sellerId,
  docType,
}: {
  sellerId: string;
  docType: string;
}) => {
  try {
    const token = getAdminToken();

    if (!token) {
      throw new Error("Token not found");
    }

    setAuthToken(token);

    const res = await axiosInstance.get(
      `/admin/seller/doc/download?sellerId=${sellerId}&doc=${docType}`,
      {
        responseType: "blob",
      }
    );

    return res.data;
  } catch (error) {
    console.log(error);
    handleError(error);
  }
};
