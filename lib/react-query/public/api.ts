import axios from "axios";
import { handleError } from "../util";
import { TicketProps } from "../query.type";
import qs from "qs";
import { ProductsResponse } from "./query";

export const fetchProducts = async ({
  filters = {},
  limit = 20,
  page = 1,
}: {
  filters?: Record<string, string | number | (string | number)[]>;
  limit?: number;
  page?: number;
}) => {
  try {
    const query = qs.stringify(
      {
        ...filters,
        limit,
        page,
      },
      { skipNulls: true, arrayFormat: "comma" }
    );

    const res = await axios.get(`/products?${query}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getProductsInfinite = async ({
  filters,
  limit,
  pageParam,
}: {
  filters: Record<string, any>;
  limit?: number;
  pageParam: any;
}) => {
  try {
    const params = new URLSearchParams();

    // Pagination
    params.append("page", String(pageParam));
    params.append("limit", String(limit));

    // Add dynamic filters
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.append(key, value.join(","));
      } else if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== false
      ) {
        params.append(key, String(value));
      }
    });

    const { data } = await axios.get<ProductsResponse>(
      `/api/products?${params.toString()}`
    );

    return data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getFilters = async () => {
  try {
    const res = await axios.get(`/products/filter`);
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getFeaturedProducts = async () => {
  try {
    const res = await axios.get(`/products/featured `);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getProduct = async (id: string) => {
  try {
    const res = await axios.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const postRequirement = async (data: any) => {
  try {
    const res = await axios.post(`/post-requirement`, data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const searchProduct = async (query: string) => {
  try {
    const res = await axios.get(`/search-product?query=${query}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchSearchSuggestions = async (query: string) => {
  try {
    const res = await axios.get(`/search-suggestions?query=${query}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getProductReviews = async (id: string) => {
  try {
    const res = await axios.get(`/approved-product-reviews`, {
      params: { product_id: id },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllAttributeType = async () => {
  try {
    const res = await axios.get(`/all-attributesType`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAttributeById = async (id: string) => {
  try {
    const res = await axios.get(`/get-attributeType`, {
      params: { id: id },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getFeeds = async () => {
  try {
    const res = await axios.get(`/get-feeds`);

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getSingleCategory = async (id: string) => {
  try {
    const res = await axios.get(`/category?id=${id}`);

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const createTicket = async ({
  email,
  subject,
  message,
  name,
  mobileno,
  attachments,
}: TicketProps) => {
  try {
    const formData = new FormData();

    formData.append("email", email);
    formData.append("subject", subject);
    formData.append("message", message);
    formData.append("name", name);
    formData.append("mobileno", mobileno);
    if (attachments !== undefined && attachments !== null) {
      for (var i = 0; i < attachments.length; i++) {
        formData.append("attachments", attachments[i]);
      }
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const res = await axios.post(`/create-ticket`, formData, config);
    return res.data;
  } catch (error) {
    console.log(error);
    handleError(error);
  }
};

export const getBlogsBySlug = async (slug: string) => {
  try {
    const res = await axios.get(`/blog/get/${slug}`);
    return res.data?.data;
  } catch (error) {
    handleError(error);
  }
};

export const getPublishedBlogs = async () => {
  try {
    const res = await axios.get(`/blogs`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getContentWithKey = async (contentKey: string) => {
  try {
    const res = await axios.get(`/content/get-by-key/${contentKey}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
