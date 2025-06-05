import axios from "axios";
import { handleError } from "../util";
import { FetchProductProps, TicketProps } from "../query.type";
import { API_URL } from "@/lib/constants";

type FetchProductsFunction = () => Promise<FetchProductProps[]>;

export const fetchProducts = async ({
  name,
  category,
  productname,
  limit,
  page,
}: {
  name?: string;
  category?: string;
  productname?: string;
  limit?: number;
  page?: number;
}) => {
  try {
    const res = await axios.get(
      `${API_URL}/product?name=${name}&category=${category}&productname=${productname}&limit=${limit}&page=${page}`
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getProduct = async (id: string) => {
  try {
    const res = await axios.get(`${API_URL}/getproduct`, {
      params: { productId: id },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const postRequirement = async (data: any) => {
  try {
    const res = await axios.post(`${API_URL}/post-requirement`, data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const searchProduct = async (query: string) => {
  try {
    const res = await axios.get(API_URL + `/search-product?query=${query}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchSearchSuggestions = async (query: string) => {
  try {
    const res = await axios.get(API_URL + `/search-suggestions?query=${query}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getProductReviews = async (id: string) => {
  try {
    const res = await axios.get(`${API_URL}/approved-product-reviews`, {
      params: { product_id: id },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllAttributeType = async () => {
  try {
    const res = await axios.get(`${API_URL}/all-attributesType`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAttributeById = async (id: string) => {
  try {
    const res = await axios.get(`${API_URL}/get-attributeType`, {
      params: { id: id },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getFeeds = async () => {
  try {
    const res = await axios.get(`${API_URL}/get-feeds`);

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getSingleCategory = async (id: string) => {
  try {
    const res = await axios.get(`${API_URL}/category?id=${id}`);

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

    const res = await axios.post(`${API_URL}/create-ticket`, formData, config);
    return res.data;
  } catch (error) {
    console.log(error);
    handleError(error);
  }
};

export const getFeaturedProducts = async () => {
  try {
    const res = await axios.get(`${API_URL}/featured-products`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getBlogsBySlug = async (slug: string) => {
  try {
    const res = await axios.get(`${API_URL}/blog/get/${slug}`);
    return res.data?.data;
  } catch (error) {
    handleError(error);
  }
};

export const getPublishedBlogs = async () => {
  try {
    const res = await axios.get(`${API_URL}/blogs`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getContentWithKey = async (contentKey: string) => {
  try {
    const res = await axios.get(`${API_URL}/content/get-by-key/${contentKey}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
