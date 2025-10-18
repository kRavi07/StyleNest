"use client"

import { DataTable } from "@/components/ui/data-table/data-table"
import { useGetOrders } from "@/lib/react-query/admin/query/orders"
import { columns } from "./columns"
import usePagination from "@/hooks/use-pagination"
import { toast } from "sonner"
import { OrderSummary } from "@/types/admin"
import { Edit, Eye, Trash2 } from "lucide-react"

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/admin/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react"
import DataTableSkeleton from "@/components/ui/data-table/DataTableSkeleton"


const OrderList = () => {
    const { pageIndex, pageSize, handlePageChange, handlePageSizeChange } = usePagination()

    const { data, isLoading } = useGetOrders({
        status: "",
        limit: pageSize,
        page: pageIndex,

    })

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");


    // Faceted filters
    const facetedFilters = [

        {
            column: "status" as keyof OrderSummary,
            title: "Status",
            options: [
                { label: "Pending", value: "pending" },
                { label: "Inactive", value: "inactive" }
            ],
        },
    ];

    // Bulk actions
    const bulkActions = [
        {
            label: "Delete Users",
            icon: Trash2,
            variant: "destructive" as const,
            onClick: (selectedUsers: OrderSummary[]) => {
                const userNames = selectedUsers.map(u => u._id).join(', ');
                toast.success(`Deleted ${selectedUsers.length} user(s): ${userNames}`);
            },
        },

    ];

    // Row actions
    const rowActions = (order: OrderSummary) => [
        {
            label: "View Details",
            icon: Eye,
            onClick: () => toast.info(`Viewing details for ${order.orderNumber}`),
        },
        {
            label: "Edit User",
            icon: Edit,
            onClick: () => toast.info(`Editing ${order.orderNumber}`),
        },


    ];

    // Event handlers
    const handleRefresh = () => {
        toast.success("Refreshing data...");
    };

    const handleExport = (data: OrderSummary[], format: 'csv' | 'excel' | 'pdf') => {


        toast.success(`Exported ${data.length} records as ${format.toUpperCase()}`);
    };


    if (isLoading) {
        return <DataTableSkeleton />
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>
                    View and manage customer orders, track statuses, and process fulfillments.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative w-full sm:w-96">
                            <Icons.search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by order #, customer name, or email..."
                                className="w-full pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="refunded">Refunded</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <DataTable
                            columns={columns}
                            data={data?.data || []}
                            pageIndex={pageIndex}
                            pageSize={pageSize}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                            config={{
                                enableSearch: true,
                                enableColumnVisibility: true,
                                enableRowSelection: true,
                                enableBulkActions: true,
                                enableExport: true,
                                enableFacetedFilters: true,
                                enableDensity: true,
                                enableRefresh: true,
                                searchPlaceholder: "Search users...",
                                pageSize: 10,
                                pageSizeOptions: [5, 10, 20, 30, 50],
                            }}
                            facetedFilters={facetedFilters}
                            bulkActions={bulkActions}
                            enableRowActions={true}
                            rowActions={rowActions}
                            onRefresh={handleRefresh}
                            onExport={handleExport}
                            isLoading={isLoading}
                            searchColumn={["orderNumber", "status", "customer"]}
                            totalRows={data?.pagination?.total}

                        />
                    </div>
                </div>
            </CardContent>
        </Card>

    )
}

export default OrderList