/* eslint-disable no-unused-vars */
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  X,
  RefreshCw
} from "lucide-react";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableExport } from "./data-table-export";
import { Badge } from "@/components/ui/badge";
import {
  DataTableConfig,
  DataTableFacetedFilter as FacetedFilterType,
  DataTableAction
} from "@/types/data-table";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  debouncedGlobalFilter: string;
  config: Required<DataTableConfig>;
  facetedFilters?: FacetedFilterType<TData>[];
  bulkActions?: DataTableAction<TData>[];
  selectedRows?: TData[];
  onRefresh?: () => void;
  onExport?: (data: TData[], format: 'csv' | 'excel' | 'pdf') => void;
  isLoading?: boolean;
  isFiltered?: boolean;
  resetFilters?: () => void;
  searchableColumns: string[]
}

export function DataTableToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter,
  debouncedGlobalFilter,
  config,
  facetedFilters,
  bulkActions = [],
  selectedRows = [],
  onRefresh,
  onExport,
  isLoading,
  isFiltered,
  resetFilters,
  searchableColumns
}: DataTableToolbarProps<TData>) {
  const isSearching = globalFilter !== debouncedGlobalFilter && globalFilter.length > 0;
  const hasSelectedRows = selectedRows.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Main toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">

          {config.enableFacetedFilters && facetedFilters?.map((filter) => (
            <DataTableFacetedFilter
              key={String(filter.column)}
              column={table.getColumn(String(filter.column))}
              title={filter.title}
              options={filter.options}
            />
          ))}

          {/* Reset filters */}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          {/* Refresh */}
          {config.enableRefresh && onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}

          {/* Export */}
          {config.enableExport && onExport && (
            <DataTableExport
              table={table}
              onExport={onExport}
            />
          )}



          {/* Column visibility */}
          {config.enableColumnVisibility && (
            <DataTableViewOptions table={table} />
          )}
        </div>
      </div>

      {/* Bulk actions bar */}
      {hasSelectedRows && config.enableBulkActions && bulkActions.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-2">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {selectedRows.length} selected
            </Badge>
            <div className="flex items-center space-x-1">
              {bulkActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "outline"}
                  size="sm"
                  onClick={() => action.onClick(selectedRows)}
                  disabled={action.disabled}
                  className="h-8"
                >
                  {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetRowSelection()}
            className="h-8"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear selection</span>
          </Button>
        </div>
      )}
    </div>
  );
}