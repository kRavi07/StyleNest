"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { Product } from "@/types";

import { useFetchProductsInfinite } from "@/lib/react-query/admin/query/product";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/admin/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { productColumns } from "./columns";
import usePagination from "@/hooks/use-pagination";
import { DataTable } from "@/components/ui/data-table/data-table";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { ref, inView } = useInView();

  const { pageIndex, pageSize, handlePageChange, handlePageSizeChange } = usePagination();


  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
  } = useFetchProductsInfinite(searchQuery, categoryFilter, undefined, pageSize);

  const products: Product[] = useMemo(
    () => data?.pages.flatMap((page: any) => page.data) || [],
    [data]
  );

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category?.name).filter(Boolean))),
    [products]
  );


  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Button asChild>
          <Link href="/products/new">
            <Icons.add className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            Manage your product catalog, inventory, and pricing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={productColumns}
            data={products}
            filterColumn="name"
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange} />
        </CardContent>
      </Card>
    </div>
  );
}
