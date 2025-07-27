// columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types";
import ActionMenu from "./table-action-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table/DataTableColumnHeader";
import Image from "next/image";



export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "image",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Image" />,
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex items-center space-x-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-md">
            <Image
              src={"https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
              alt={data.name}
              fill
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      );
    },

  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "category.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
  },
  {
    accessorKey: "price",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    cell: ({ row }) => {
      const data = row.original;
      const formattedPrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(data.price);
      return formattedPrice;
    },
  },
  {
    accessorKey: "inventory",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Inventory" />
  },
  {
    accessorKey: "_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,
    cell: ({ row }) => {
      const data = row.original;

      return (
        <ActionMenu />
      );
    },
  },
];
