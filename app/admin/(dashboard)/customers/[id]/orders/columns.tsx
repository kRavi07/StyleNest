"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/DataTableColumnHeader";
import { formatCurrency } from "@/lib/utils";
import { CustomerOrder } from "@/types/admin";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Icons } from "@/components/admin/icons";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<CustomerOrder>[] = [
    {
        accessorKey: "orderNumber",
        accessorFn: (row) => row._id,

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="#ID" />
        ),

        cell: ({ row }) => {
            const data = row.original;
            return (
                <Link href={`orders/${data._id}` as any}>
                    <p className="text-sm text-gray-900">{data.orderNumber}</p>
                </Link>
            );
        },
    },

    {
        accessorKey: "total",
        accessorFn: (row) => row.total,

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(data.total)}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",

        accessorFn: (row) => row.createdAt,

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Order Date" />
        ),

        cell: ({ row }) => {
            const data = row.original;
            return (
                <span>{format(new Date(data.createdAt), "PPP")}</span>
            );
        },

    },
    {
        accessorKey: "itemsCount",
        accessorFn: (row) => row.itemsCount,

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Items" />
        ),

        cell: ({ row }) => {
            const data = row.original;
            return (
                <span>{data.itemsCount}</span>
            );
        },

    },

    {
        accessorKey: "status",
        accessorFn: (row) => row.status,

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),

        sortingFn: "alphanumeric",

        cell: ({ row }) => {
            const order = row.original;
            return (
                <Badge
                    variant={
                        order.status === "delivered"
                            ? "default"
                            : order.status === "shipped"
                                ? "outline"
                                : order.status === "cancelled"
                                    ? "destructive"
                                    : order.status === "pending"
                                        ? "outline"
                                        : "secondary"
                    }
                >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
            );
        },
    },
    {
        accessorKey: "paymentStatus",
        accessorFn: (row) => row.paymentStatus,

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Payment Status" />
        ),

        sortingFn: "alphanumeric",
        cell: ({ row }) => {
            const order = row.original;
            <Badge
                variant={
                    order.paymentStatus === "paid"
                        ? "default"
                        : order.paymentStatus === "pending"
                            ? "secondary"
                            : "destructive"
                }
            >
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </Badge>
        }
    },
    {
        id: "Actions",
        header: () => <div className="font-bold">View</div>,
        accessorKey: "_id",
        accessorFn: (row) => row._id,
        cell: ({ row }) => {
            const order = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Icons.ellipsis className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <Link className="flex flex-row" href={`/admin/orders/${order._id}` as any}>

                                <Icons.view className="mr-2 h-4 w-4" />
                                <span>View details</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Icons.edit className="mr-2 h-4 w-4" />
                            <span>Update status</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Icons.shipping className="mr-2 h-4 w-4" />
                            <span>Ship order</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Icons.mail className="mr-2 h-4 w-4" />
                            <span>Email customer</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                            <Icons.trash className="mr-2 h-4 w-4" />
                            <span>Cancel order</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
