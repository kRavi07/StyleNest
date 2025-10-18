import { flexRender } from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableProps } from "@/types/data-table";

export function DataTable<TData, TValue>({
    columns,
    data,
    config,
    facetedFilters,
    bulkActions,
    onRefresh,
    onExport,
    isLoading = false,
    error,
    pageIndex = 0,
    pageSize = 10,
    totalRows,
    onPageChange,
    onPageSizeChange,
    searchColumn
}: DataTableProps<TData, TValue>) {
    const {
        table,
        config: resolvedConfig,
        globalFilter,
        setGlobalFilter,
        debouncedGlobalFilter,
        density,
        selectedRows,
        resetFilters,
        isFiltered,
        isLoading: isSearching,
    } = useDataTable({
        data,
        columns,
        config,
        pageIndex,
        pageSize,
        totalRows,
        onPageChange,
        onPageSizeChange,
    });




    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <DataTableToolbar
                table={table}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                debouncedGlobalFilter={debouncedGlobalFilter}
                config={resolvedConfig}
                facetedFilters={facetedFilters}
                bulkActions={bulkActions}
                selectedRows={selectedRows}
                onRefresh={onRefresh}
                onExport={onExport}
                isLoading={isLoading || isSearching}
                isFiltered={isFiltered}
                resetFilters={resetFilters}
                searchableColumns={searchColumn}
            />

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? null : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={`
                    hover:bg-muted/50 transition-colors
                    ${density === 'compact' ? 'h-8' : density === 'spacious' ? 'h-16' : 'h-12'}
                  `}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={density === 'compact' ? 'py-1' : density === 'spacious' ? 'py-4' : 'py-2'}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {isFiltered ? "No results match your search." : "No data available."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <DataTablePagination
                table={table}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                pageSizeOptions={resolvedConfig.pageSizeOptions}
            />
        </div>
    );
}