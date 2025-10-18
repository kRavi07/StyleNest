import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search, Loader2 } from "lucide-react";
import {
    DataTableConfig,

} from "@/types/data-table";
import { DataTableViewOptions } from "./DataTableViewOption";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    globalFilter: string;
    // eslint-disable-next-line no-unused-vars
    setGlobalFilter: (value: string) => void;
    debouncedSearch: string;
    config: Required<DataTableConfig>;
    searchableColumns?: (keyof TData)[];
    isLoading?: boolean;
}

export function DataTableToolbar<TData>({
    table,
    globalFilter,
    setGlobalFilter,
    debouncedSearch,
    config,
    searchableColumns,
    isLoading,
}: DataTableToolbarProps<TData>) {
    const isFiltered = debouncedSearch.length > 0;
    const isSearching = globalFilter !== debouncedSearch && globalFilter.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                {config.enableSearch && (
                    <div className="relative max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={config.searchPlaceholder}
                            value={globalFilter}
                            onChange={(event) => setGlobalFilter(event.target.value)}
                            className="pl-8 pr-10"
                        />
                        {(isLoading || isSearching) && (
                            <Loader2 className="absolute right-8 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                        {isFiltered && !isSearching && (
                            <Button
                                variant="ghost"
                                onClick={() => setGlobalFilter("")}
                                className="absolute right-0 top-0 h-full px-3 py-0 hover:bg-transparent"
                            >
                                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                <span className="sr-only">Clear search</span>
                            </Button>
                        )}
                    </div>
                )}

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => setGlobalFilter("")}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            {config.enableColumnVisibility && <DataTableViewOptions table={table} />}
        </div>
    );
}