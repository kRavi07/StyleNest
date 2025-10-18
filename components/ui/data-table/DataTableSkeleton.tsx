import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Enhanced Skeleton component with dark mode support and Tailwind animations
const Skeleton = ({ className = "", ...props }) => {
    return (
        <div
            className={`animate-pulse rounded-md bg-muted-foreground/10 ${className}`}
            {...props}
        />
    );
};

// Table skeleton row component for reusability
const TableRowSkeleton = () => {
    const widths = [
        ['w-24', 'w-20'], // Order number
        ['w-36', 'w-28'], // Customer
        ['w-20', 'w-16'], // Status
        ['w-24', 'w-18'], // Total
        ['w-28', 'w-20'], // Date
        ['w-20', 'w-16'], // Actions
    ];

    return (
        <div className="grid grid-cols-6 gap-4 p-4 border-b border-border/50 hover:bg-muted/30 transition-colors">
            {widths.map((width, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-2">
                    {colIndex === 2 ? (
                        // Status badge skeleton
                        <Skeleton className={`h-6 ${width[0]} rounded-full`} />
                    ) : colIndex === 5 ? (
                        // Action buttons skeleton
                        <div className="flex items-center gap-1">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    ) : (
                        // Regular content skeleton
                        <>
                            <Skeleton className={`h-4 ${width[0]}`} />
                            {colIndex < 2 && <Skeleton className={`h-3 ${width[1]} opacity-60`} />}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

const DataTableSkeleton = () => {
    return (
        <Card className="w-full">
            <CardHeader className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-96" />
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search Input with Icon */}
                    <div className="relative w-full sm:w-96">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Skeleton className="h-4 w-4 rounded-sm" />
                        </div>
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>

                    {/* Status Filter Dropdown */}
                    <div className="relative w-full sm:w-[180px]">
                        <Skeleton className="h-10 w-full rounded-md" />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Skeleton className="h-4 w-4 rounded-sm" />
                        </div>
                    </div>
                </div>

                {/* Data Table Container */}
                <div className="rounded-md border border-border overflow-hidden">
                    {/* Table Toolbar */}
                    <div className="flex items-center justify-between p-4 bg-muted/20 border-b border-border/50">
                        <div className="flex items-center gap-3">
                            {/* Search in table */}
                            <div className="relative">
                                <Skeleton className="h-8 w-64 rounded-md" />
                                <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                    <Skeleton className="h-3 w-3 rounded-sm" />
                                </div>
                            </div>

                            {/* Filter buttons */}
                            <Skeleton className="h-8 w-24 rounded-md" />
                            <Skeleton className="h-8 w-20 rounded-md" />
                            <Skeleton className="h-8 w-16 rounded-md" />
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Export and other actions */}
                            <Skeleton className="h-8 w-20 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </div>

                    {/* Table Headers */}
                    <div className="grid grid-cols-6 gap-4 p-4 bg-muted/10 border-b border-border/50">
                        {['Order #', 'Customer', 'Status', 'Total', 'Date', 'Actions'].map((_, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Skeleton className="h-4 w-16" />
                                {index < 5 && <Skeleton className="h-3 w-3 rounded-sm" />}
                            </div>
                        ))}
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y divide-border/50">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <TableRowSkeleton key={index} />
                        ))}
                    </div>

                    {/* Empty state for variety */}
                    <div className="p-8 text-center border-t border-border/50 bg-muted/5">
                        <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                        <Skeleton className="h-5 w-48 mx-auto mb-2" />
                        <Skeleton className="h-4 w-32 mx-auto" />
                    </div>

                    {/* Table Footer/Pagination */}
                    <div className="flex items-center justify-between p-4 bg-muted/20 border-t border-border/50">
                        {/* Results info */}
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-8" />
                            <Skeleton className="h-4 w-12" />
                        </div>

                        {/* Page size selector */}
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-8 w-16 rounded-md" />
                        </div>

                        {/* Pagination controls */}
                        <div className="flex items-center gap-1">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <div className="flex gap-1 mx-2">
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md bg-primary/20" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-4 w-6" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </div>
                </div>

                {/* Bulk Actions Bar (conditionally shown) */}
                <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-md">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-sm" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-20 rounded-md" />
                        <Skeleton className="h-8 w-24 rounded-md" />
                        <Skeleton className="h-8 w-16 rounded-md" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DataTableSkeleton;