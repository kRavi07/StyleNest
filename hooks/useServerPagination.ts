import { useEffect, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, any>;
}

interface PaginationResponse<T> {
  data: T[];
  total: number;
}

interface UseServerPaginationOptions<T> {
  queryKey: (string | number)[];
  queryFn: (params: PaginationParams) => Promise<PaginationResponse<T>>;
  queryParams: PaginationParams;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export function useServerPagination<T>({
  queryKey,
  queryFn,
  queryParams,
  enabled = true,
  staleTime = 1000 * 60, // 1 min
  gcTime = 1000 * 60 * 5, // 5 min
}: UseServerPaginationOptions<T>) {
  const queryClient = useQueryClient();

  // ✅ stable queryKey
  const fullQueryKey = useMemo(
    () => [
      ...queryKey,
      queryParams.page,
      queryParams.limit,
      queryParams.search ?? "",
      queryParams.sortBy ?? "",
      queryParams.sortOrder ?? "",
      JSON.stringify(queryParams.filters ?? {}),
    ],
    [
      queryKey,
      queryParams.page,
      queryParams.limit,
      queryParams.search,
      queryParams.sortBy,
      queryParams.sortOrder,
      queryParams.filters,
    ]
  );

  const query = useQuery<PaginationResponse<T>>({
    queryKey: fullQueryKey,
    queryFn: () => queryFn(queryParams),
    enabled,
    staleTime,
    gcTime,
    placeholderData: (prev) => prev, // ✅ replaces keepPreviousData
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: (failureCount, error: any) => {
      if (error?.status >= 400 && error?.status < 500) return false;
      return failureCount < 2;
    },
  });

  // ✅ prefetch next/prev pages
  const prefetchAdjacentPages = useCallback(
    (data: PaginationResponse<T>) => {
      const totalPages = Math.ceil(data.total / queryParams.limit);

      if (queryParams.page < totalPages) {
        queryClient.prefetchQuery({
          queryKey: [
            ...queryKey,
            queryParams.page + 1,
            queryParams.limit,
            queryParams.search ?? "",
            queryParams.sortBy ?? "",
            queryParams.sortOrder ?? "",
            JSON.stringify(queryParams.filters ?? {}),
          ],
          queryFn: () =>
            queryFn({ ...queryParams, page: queryParams.page + 1 }),
        });
      }

      if (queryParams.page > 1) {
        queryClient.prefetchQuery({
          queryKey: [
            ...queryKey,
            queryParams.page - 1,
            queryParams.limit,
            queryParams.search ?? "",
            queryParams.sortBy ?? "",
            queryParams.sortOrder ?? "",
            JSON.stringify(queryParams.filters ?? {}),
          ],
          queryFn: () =>
            queryFn({ ...queryParams, page: queryParams.page - 1 }),
        });
      }
    },
    [queryClient, queryFn, queryKey, queryParams]
  );

  useEffect(() => {
    if (query.isSuccess && query.data) {
      prefetchAdjacentPages(query.data);
    }
  }, [query.isSuccess, query.data, prefetchAdjacentPages]);

  return query;
}
