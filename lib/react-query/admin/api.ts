import { AxiosRequestConfig } from "axios";
import { createFormData, getAdminToken, handleError } from "../util";
import axiosInstance, { setAuthToken } from "./axiosInstance";
import { CategoryFormData } from "@/lib/validation/category";
import { CreateProductFormData } from "@/lib/validation/product";

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
  try {
    const { name, slug, parent, image } = data;

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
  name,
  slug,
  description,
  shortDescription,
  price,
  mrp,
  category,
  subcategory,
  images,
  inventory,
  featured,
  gender,
  rating,
  reviews,
  isNewProduct,
  isSale,
  isActive,
  hasVariants,
  variants,
  specifications,
  seo,
}: CreateProductFormData) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const variantsWithoutImages = variants.map(({ images, ...rest }) => rest);

    const attributesList = JSON.stringify(specifications);

    const formData = new FormData();

    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("shortDescription", shortDescription);
    if (price) {
      formData.append("price", price.toFixed(2));
    }
    if (mrp) {
      formData.append("mrp", mrp.toFixed(2));
    }
    if (rating) {
      formData.append("rating", rating.toFixed(2));
    }
    if (reviews) {
      formData.append("reviews", reviews.toFixed(2));
    }
    formData.append("category", category);
    if (gender) {
      formData.append("gender", gender);
    }
    if (subcategory) {
      formData.append("subcategory", subcategory);
    }
    formData.append("inventory", inventory.toFixed(2));
    formData.append("featured", featured.toString());
    formData.append("isNewProduct", isNewProduct.toString());
    formData.append("isSale", isSale.toString());
    formData.append("isActive", isActive.toString());
    formData.append("hasVariants", hasVariants.toString());
    formData.append("variants", JSON.stringify(variantsWithoutImages));

    variants.forEach((variant, i) => {
      if (variant.images && variant.images !== null) {
        for (let j = 0; j < variant.images.length; j++) {
          formData.append(`variants[${i}].images`, variant.images[j]);
        }
      }
    });

    formData.append("seo", JSON.stringify(seo));

    const filesArray = !images ? [] : Array.isArray(images) ? images : [images];

    if (filesArray.length < 1) {
      throw new Error("At least one image is required");
    }

    // Append to FormData
    filesArray.forEach((file) => {
      formData.append("images", file);
    });

    formData.append("specifications", attributesList);

    const res = await axiosInstance.post(`/admin/products`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
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

export const deleteProduct = async (id: string) => {
  try {
    const token = getAdminToken();
    setAuthToken(token);
    const res = await axiosInstance.delete(`/admin/delete-product?id=${id}`);
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
