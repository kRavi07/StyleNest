export interface DataTableConfig {
  enableSearch?: boolean;
  enableColumnVisibility?: boolean;
  enableRowSelection?: boolean;
  enableBulkActions?: boolean;
  enableExport?: boolean;
  enableFacetedFilters?: boolean;
  enableDensity?: boolean;
  enableRefresh?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  pageSizeOptions?: number[];
}

export interface DataTableFacetedFilter<TData> {
  column: keyof TData;
  title: string;
  options: Array<{
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
}

export interface DataTableAction<TData> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  onClick: (rows: TData[]) => void;
  disabled?: boolean;
}

export type DataTableDensity = "compact" | "comfortable" | "spacious";

export interface DataTableProps<TData, TValue> {
  columns: import("@tanstack/react-table").ColumnDef<TData, TValue>[];
  data: TData[];
  config?: DataTableConfig;
  facetedFilters?: DataTableFacetedFilter<TData>[];
  bulkActions?: DataTableAction<TData>[];
  onRefresh?: () => void;
  onExport?: (data: TData[], format: "csv" | "excel" | "pdf") => void;
  isLoading?: boolean;
  error?: string;
  // Server-side pagination props
  pageIndex?: number;
  pageSize?: number;
  totalRows?: number;
  onPageChange?: (newPage: number) => void;
  onPageSizeChange?: (newPageSize: number) => void;
  // Optional row actions
  enableRowActions?: boolean;
  rowActions?: (row: TData) => Array<{
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    variant?: "default" | "destructive" | "ghost";
  }>;
  searchColumn: string[];
}
