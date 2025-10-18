import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/DataTableColumnHeader";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Icons } from "@/components/admin/icons";

import Link from "next/link";
import { Button } from "@/components/ui/button";


export interface UserList {
    status: string;           // "active"
    _id: string;              // MongoDB ObjectId as string
    name: string;             // "Ravi"
    email: string;            // "ravi@test.com"
    role: string;             // "admin"
    addresses: any[];         // empty array, can define a more specific type if needed
    createdAt: string;        // ISO date string
    updatedAt: string;        // ISO date string
}


export const columns: ColumnDef<UserList>[] = [

    {
        accessorFn: (row) => row.name,
        id: "name", // optional, used as column id
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => {
            const customer = row.original;
            return (
                <div className="flex flex-col">
                    <span>{customer.name}</span>

                </div>
            );
        },
    },
    {
        accessorKey: "email",
        accessorFn: (row) => row.email,

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {data.email}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",

        accessorFn: (row) => row.createdAt,

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),

        cell: ({ row }) => {
            const data = row.original;
            return (
                <span>{format(new Date(data.createdAt), "PPP")}</span>
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
                        order.status === "active" ? "default" : "destructive"
                    }
                >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
            );
        },
    },

    {
        id: "Actions",
        header: () => <div className="font-bold">View</div>,
        accessorKey: "_id",
        accessorFn: (row) => row._id,
        cell: ({ row }) => {
            const customer = row.original;

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
                        <DropdownMenuItem >
                            <Link href={`/admin/customers/${customer._id}/orders`}>

                                <Icons.view className="mr-2 h-4 w-4" />
                                <span>View Orders</span>
                            </Link>

                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Icons.edit className="mr-2 h-4 w-4" />
                            <span>Update status</span>
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

