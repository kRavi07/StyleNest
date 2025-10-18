import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createTicket,
  fetchSearchSuggestions,
  getAllAttributeType,
  getFeaturedProducts,
  getFeeds,
  getFilters,
  getProduct,
  getProductReviews,
  getSingleCategory,
  postRequirement,
  searchProduct,
} from "./api";
import axios from "axios";

export interface ProductQueryParams {
  filters: Record<string, any>;
  limit?: number;
}

export interface ProductsResponse {
  data: any[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
  nextPage: number | null;
  filters?: Record<string, any>;
}

export function useFetchProductsInfinite({
  filters,
  limit = 20,
}: ProductQueryParams) {
  return useInfiniteQuery<ProductsResponse>({
    queryKey: ["products", filters],
    queryFn: async ({ pageParam = 1 }) => {
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
    },
    getNextPageParam: (lastPage) => {
      // Use backend-provided nextPage if available
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 60 * 1000 * 10,
  });
}

export const useGetFilters = () => {
  return useQuery({
    queryKey: ["products-filter"],
    queryFn: () => getFilters(),

    staleTime: 1000 * 60 * 10 * 24,
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

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ["searchProduct", query],
    queryFn: () => searchProduct(query),
    staleTime: 60 * 1000 * 5,
  });
};

export const useGetSearchSuggestions = (query: string) => {
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
