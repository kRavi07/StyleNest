import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types";
import Image from "next/image";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import ActionMenu from "./table-action-menu";

export const productColumns: ColumnDef<Product>[] = [
  {
    id: "image",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Image" />,
    cell: ({ row }) => {
      const imageName = row.original.images[0]; // Use row.original to access the data
      return (
        <div className="flex items-center space-x-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-md">
            <Image
              src={imageName || "https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
              alt={row.original.name || "Product Image"}
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
      const price = row.getValue("price") as number;
      const formattedPrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(price);
      return formattedPrice;
    },
  },
  {
    accessorKey: "inventory",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Inventory" />
  },
  {
    id: "actions",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,
    cell: ({ row }) => {
      const id = row.original._id;
      return <ActionMenu id={id} />;
    },
  },
];