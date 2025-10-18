/* eslint-disable no-unused-vars */
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";

interface DataTableSearchProps<TData> {
    table: any;
    filterColumns: string[];
    debounceMs?: number;
}

function DataTableSearch<TData>({
    table,
    filterColumns,
    debounceMs = 300,
}: DataTableSearchProps<TData>) {
    const [search, setSearch] = useState("");

    // Debounced effect to update filters
    useEffect(() => {
        const handler = setTimeout(() => {
            filterColumns.forEach((col) => {
                const column = table.getColumn(col);
                if (column) column.setFilterValue(search || undefined); // clear filter when empty
            });
        }, debounceMs);

        return () => clearTimeout(handler);
    }, [search, table, filterColumns, debounceMs]);

    return (
        <Input
            placeholder={`Search ${filterColumns.join(", ")}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
        />
    );
}

export default DataTableSearch;
