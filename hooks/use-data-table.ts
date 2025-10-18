import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
  Table,
} from "@tanstack/react-table";
import { DataTableConfig, DataTableDensity } from "@/types/data-table";

/**
 * Lightweight debounce hook
 */
function useDebounce<T>(value: T, ms = 300) {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

export interface UseDataTableOptions<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  config?: DataTableConfig;

  // Server-side controls (optional)
  pageIndex?: number; // 0-based
  pageSize?: number;
  totalRows?: number; // presence toggles server-side mode
  onPageChange?: (pageIndex: number) => void; // 0-based
  onPageSizeChange?: (pageSize: number) => void;

  // callbacks for server interactions
  onSearchChange?: (search: string) => void; // debounced
  onSortingChange?: (sorting: SortingState) => void;
  onStateChange?: (state: {
    pagination?: { pageIndex: number; pageSize: number };
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
    columnVisibility: VisibilityState;
    globalFilter: string;
    rowSelection: RowSelectionState;
  }) => void;

  // optional external loading override
  externalIsLoading?: boolean;
}

export function useDataTable<TData, TValue>(
  props: UseDataTableOptions<TData, TValue>
) {
  const {
    data,
    columns,
    config = {},
    pageIndex = 0,
    pageSize = 10,
    totalRows,
    onPageChange,
    onPageSizeChange,
    onSearchChange,
    onSortingChange,
    onStateChange,
    externalIsLoading,
  } = props;

  const defaultConfig: Required<DataTableConfig> = {
    enableSearch: true,
    enableColumnVisibility: true,
    enableRowSelection: false,
    enableBulkActions: false,
    enableExport: false,
    enableFacetedFilters: false,
    enableDensity: true,
    enableRefresh: false,
    searchPlaceholder: "Search...",
    pageSize: 10,
    pageSizeOptions: [5, 10, 20, 30, 40, 50],
    ...config,
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [density, setDensity] = useState<DataTableDensity>(
    defaultConfig.enableDensity ? "comfortable" : "compact"
  );

  // Internal pagination state for client-side mode
  const [internalPageIndex, setInternalPageIndex] = useState(pageIndex);
  const [internalPageSize, setInternalPageSize] = useState(pageSize);

  // Debounced search
  const debouncedGlobalFilter = useDebounce(globalFilter, 300);

  // Determine server-side mode
  const isServerSide = typeof totalRows === "number" && totalRows >= 0;

  // Use external pagination for server-side, internal for client-side
  const currentPageIndex = isServerSide ? pageIndex : internalPageIndex;
  const currentPageSize = isServerSide ? pageSize : internalPageSize;

  // Memoize table options to avoid recreating on each render
  const tableOptions = useMemo(() => {
    const options = {
      data,
      columns,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
        globalFilter: isServerSide ? "" : debouncedGlobalFilter,
        pagination: {
          pageIndex: currentPageIndex,
          pageSize: currentPageSize,
        },
      },
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      onGlobalFilterChange: setGlobalFilter,
      onPaginationChange: (updater: any) => {
        if (typeof updater === "function") {
          const newPagination = updater({
            pageIndex: currentPageIndex,
            pageSize: currentPageSize,
          });
          if (isServerSide) {
            // For server-side, notify parent via callbacks
            if (newPagination.pageIndex !== currentPageIndex && onPageChange) {
              onPageChange(newPagination.pageIndex);
            }
            if (
              newPagination.pageSize !== currentPageSize &&
              onPageSizeChange
            ) {
              onPageSizeChange(newPagination.pageSize);
            }
          } else {
            // For client-side, update internal state
            setInternalPageIndex(newPagination.pageIndex);
            setInternalPageSize(newPagination.pageSize);
          }
        } else {
          // Handle direct object updates
          if (isServerSide) {
            if (updater.pageIndex !== currentPageIndex && onPageChange) {
              onPageChange(updater.pageIndex);
            }
            if (updater.pageSize !== currentPageSize && onPageSizeChange) {
              onPageSizeChange(updater.pageSize);
            }
          } else {
            setInternalPageIndex(updater.pageIndex);
            setInternalPageSize(updater.pageSize);
          }
        }
      },
      manualPagination: isServerSide,
      manualFiltering: false,
      manualSorting: false,
      rowCount: totalRows,
      pageCount:
        isServerSide && totalRows !== undefined
          ? Math.max(1, Math.ceil(totalRows / currentPageSize))
          : undefined,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: !isServerSide
        ? getPaginationRowModel()
        : undefined,
      getFacetedRowModel: defaultConfig.enableFacetedFilters
        ? getFacetedRowModel<TData>()
        : undefined,
      getFacetedUniqueValues: defaultConfig.enableFacetedFilters
        ? getFacetedUniqueValues<TData>()
        : undefined,
    };

    return options;
  }, [
    data,
    columns,
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    debouncedGlobalFilter,
    currentPageIndex,
    currentPageSize,
    isServerSide,
    totalRows,
    defaultConfig.enableFacetedFilters,
    onPageChange,
    onPageSizeChange,
  ]);

  const table = useReactTable<TData>(tableOptions);

  // Sync external page changes with internal state for client-side mode
  useEffect(() => {
    if (!isServerSide) {
      if (pageIndex !== internalPageIndex) {
        setInternalPageIndex(pageIndex);
      }
      if (pageSize !== internalPageSize) {
        setInternalPageSize(pageSize);
      }
    }
  }, [pageIndex, pageSize, isServerSide, internalPageIndex, internalPageSize]);

  // --- Derived values / helpers exposed to caller ---

  // selectedRows (array of original objects)
  const selectedRows = useMemo(() => {
    const model = table.getFilteredSelectedRowModel
      ? table.getFilteredSelectedRowModel()
      : table.getSelectedRowModel();
    return model.rows.map((r) => r.original);
  }, [table, rowSelection]);

  const resetFilters = useCallback(() => {
    table.resetColumnFilters();
    setGlobalFilter("");
    setSorting([]);
    setRowSelection({});
  }, [table]);

  const resetColumnVisibility = useCallback(() => {
    table.resetColumnVisibility();
  }, [table]);

  const isFiltered = useMemo(() => {
    return (
      (debouncedGlobalFilter && debouncedGlobalFilter.trim().length > 0) ||
      (columnFilters && columnFilters.length > 0)
    );
  }, [debouncedGlobalFilter, columnFilters]);

  // isSearching: true while user types (globalFilter !== debouncedGlobalFilter)
  const isSearching = useMemo(() => {
    return globalFilter !== debouncedGlobalFilter && globalFilter.length > 0;
  }, [globalFilter, debouncedGlobalFilter]);

  // allow parent-controlled loading override otherwise use searching for local loading
  const isLoading = externalIsLoading ?? isSearching;

  // --- Effects: server-side callbacks and state change emitter ---

  // Debounced search -> notify parent (server)
  useEffect(() => {
    if (!isServerSide || typeof onSearchChange !== "function") return;
    onSearchChange(debouncedGlobalFilter);
  }, [debouncedGlobalFilter, isServerSide, onSearchChange]);

  // Sorting changed -> notify parent (server)
  useEffect(() => {
    if (!isServerSide || typeof onSortingChange !== "function") return;
    onSortingChange(sorting);
  }, [sorting, isServerSide, onSortingChange]);

  // Emit state changes to parent
  useEffect(() => {
    if (typeof onStateChange !== "function") return;
    onStateChange({
      pagination: { pageIndex: currentPageIndex, pageSize: currentPageSize },
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      rowSelection,
    });
  }, [
    currentPageIndex,
    currentPageSize,
    sorting,
    columnFilters,
    columnVisibility,
    globalFilter,
    rowSelection,
    onStateChange,
  ]);

  // Reset selection when data changes (with ref check to avoid unnecessary resets)
  const dataRef = useMemo(() => data, [data]);
  useEffect(() => {
    setRowSelection({});
  }, [dataRef]);

  return {
    table: table as Table<TData>,
    config: defaultConfig,
    globalFilter,
    setGlobalFilter,
    debouncedGlobalFilter,
    density,
    setDensity,
    selectedRows,
    resetFilters,
    resetColumnVisibility,
    isFiltered,
    isLoading,
  };
}
