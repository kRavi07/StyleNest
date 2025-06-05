import { useQuery } from "@tanstack/react-query";

import { fetchCategory, getCategoriesList, getFeaturedCategory } from "./api";

export const useFetchCategory = () => {
  return useQuery({
    queryKey: ["getcategories"],
    queryFn: fetchCategory,
    staleTime: 60 * 1000 * 5,
  });
};

export const useGetCategoryList = () => {
  return useQuery({
    queryKey: ["getCategoryList"],
    queryFn: () => getCategoriesList(),
    staleTime: 60 * 1000 * 5,
  });
};

//get featured category
export const useGetFeaturedCategory = () => {
  return useQuery({
    queryKey: ["getFeaturedCategory"],
    queryFn: () => getFeaturedCategory(),
    staleTime: 60 * 1000 * 5,
  });
};
