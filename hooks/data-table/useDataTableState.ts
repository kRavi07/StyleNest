// hooks/useDataTableState.ts
import { useState, useCallback, useMemo } from "react";
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  PaginationState,
} from "@tanstack/react-table";

interface UseDataTableStateOptions {
  initialPageSize?: number;
  initialSorting?: SortingState;
  initialColumnFilters?: ColumnFiltersState;
  initialColumnVisibility?: VisibilityState;
  initialGlobalFilter?: string;
  onStateChange?: (state: any) => void;
}

export function useDataTableState({
  initialPageSize = 10,
  initialSorting = [],
  initialColumnFilters = [],
  initialColumnVisibility = {},
  initialGlobalFilter = "",
  onStateChange,
}: UseDataTableStateOptions = {}) {
  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  // Sorting state
  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  // Filter states
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters);
  const [globalFilter, setGlobalFilter] = useState(initialGlobalFilter);

  // Column visibility
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility
  );

  // Derived values
  const sortField = sorting[0]?.id;
  const sortOrder = sorting[0]?.desc ? "desc" : "asc";

  // Reset pagination when filters change
  const resetPagination = useCallback(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  // Page change handlers
  const goToPage = useCallback((pageIndex: number) => {
    setPagination((prev) => ({ ...prev, pageIndex }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setPagination((prev) => ({
      pageIndex: 0, // Reset to first page
      pageSize,
    }));
  }, []);

  // Combined state for external consumption
  const tableState = useMemo(
    () => ({
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    }),
    [pagination, sorting, columnFilters, columnVisibility, globalFilter]
  );

  // Notify parent of state changes
  useMemo(() => {
    onStateChange?.(tableState);
  }, [tableState, onStateChange]);

  return {
    // States
    pagination,
    sorting,
    columnFilters,
    columnVisibility,
    globalFilter,

    // Derived values
    sortField,
    sortOrder,

    // Setters
    setPagination,
    setSorting,
    setColumnFilters,
    setColumnVisibility,
    setGlobalFilter,

    // Helper methods
    resetPagination,
    goToPage,
    setPageSize,

    // Combined state
    tableState,
  };
}
