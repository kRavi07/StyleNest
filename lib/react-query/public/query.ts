import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { toast } from "sonner";
import {
  createTicket,
  fetchProducts,
  fetchSearchSuggestions,
  getAllAttributeType,
  getBlogsBySlug,
  getContentWithKey,
  getFeaturedProducts,
  getFeeds,
  getProduct,
  getProductReviews,
  getPublishedBlogs,
  getSingleCategory,
  postRequirement,
  searchProduct,
} from "./api";

export const useFetchProducts = (
  name?: string,
  category?: string,
  productname?: string
) => {
  return useQuery({
    queryKey: ["fetachProducts"],
    queryFn: () => fetchProducts({ name, category, productname }),
  });
};

//infinite query
export const useFetchProductsInfinite = (
  name?: string,
  category?: string,
  productname?: string,
  limit = 20 // Default limit to 20
) => {
  return useInfiniteQuery({
    queryKey: ["fetchProductsInfinite", name, category, productname],
    queryFn: ({ pageParam = 1 }) =>
      fetchProducts({
        name,
        category,
        productname,
        limit,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMore) {
        return lastPage.nextPage;
      } else {
        return undefined;
      }
    },
    initialPageParam: 1,
  });
};

export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: ["getProduct", id],
    queryFn: () => getProduct(id),
  });
};

export const usePostRequirement = () => {
  return useMutation({
    mutationKey: ["postRequirement"],
    mutationFn: postRequirement,

    onSuccess: (data) => {
      toast.success("Requirement sent successfully");
      return data;
    },

    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export const searchProducts = (query: string) => {
  return useQuery({
    queryKey: ["searchProduct", query],
    queryFn: () => searchProduct(query),
    staleTime: 60 * 1000 * 5,
  });
};

export const getSearchSuggestions = (query: string) => {
  return useQuery({
    queryKey: ["searchSuggestions", query],
    queryFn: () => fetchSearchSuggestions(query),
    staleTime: 60 * 1000 * 5,
  });
};

export const useGetProductReviews = (id: string) => {
  return useQuery({
    queryKey: ["getProductReviews", id],
    queryFn: () => getProductReviews(id),
    staleTime: 60 * 1000 * 5,
  });
};

export const useGetAllAttributeType = () => {
  return useQuery({
    queryKey: ["getAllAttributeType"],
    queryFn: () => getAllAttributeType(),
    staleTime: 60 * 1000 * 10,
  });
};

export const useGetAttributeTypeById = (id: string) => {
  return useQuery({
    queryKey: ["getAttributeTypeById", id],
    queryFn: () => getAllAttributeType(),
    staleTime: 60 * 1000 * 10,
  });
};

export const useGetFeeds = () => {
  return useQuery({
    queryKey: ["getFeeds"],
    queryFn: () => getFeeds(),
    staleTime: 60 * 1000 * 10,
  });
};

export const useGetSingleCategory = (id: string) => {
  return useQuery({
    queryKey: ["getSingleCategory", id],
    queryFn: () => getSingleCategory(id),
    staleTime: 60 * 1000 * 10,
  });
};

export const useCreateTicket = () => {
  return useMutation({
    mutationKey: ["createTicket"],
    mutationFn: createTicket,

    onSuccess: (data) => {
      toast.success("Ticket has been created successfully");
      return data;
    },

    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export const useGetFeaturedProducts = () => {
  return useQuery({
    queryKey: ["getFeaturedProducts"],
    queryFn: () => getFeaturedProducts(),
    staleTime: 60 * 1000 * 10,
    retry: 1,
  });
};

export const useGetBlogBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["getBlogsBySlug", slug],
    queryFn: () => getBlogsBySlug(slug),
    staleTime: 60 * 10 * 1000,
  });
};

export const useGetContentWithKey = (contentKey: string) => {
  return useQuery({
    queryKey: ["getContentWithKey", contentKey],
    queryFn: () => getContentWithKey(contentKey),

    staleTime: 60 * 1000 * 20,
  });
};
export const useGetPublishedBlogs = () => {
  return useQuery({
    queryKey: ["getPublished"],
    queryFn: getPublishedBlogs,
    staleTime: 60 * 10 * 1000,
  });
};
