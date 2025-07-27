"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/components/shop/ProductGrid";
import ProductFilters from "@/components/shop/ProductFilters";
import { Product } from "@/types";
import { useFetchProductsInfinite } from "@/lib/react-query/public/query";

type FilterState = {
  category: string;
  priceRange: [number, number];
  sortBy: string;
  onlyInStock: boolean;
  onlySale: boolean;
  onlyNew: boolean;
  colors: string[];
  sizes: string[];
  [key: string]: any
};

const defaultFilters: FilterState = {
  category: "all",
  priceRange: [0, 5000],
  sortBy: "featured",
  onlyInStock: false,
  onlySale: false,
  onlyNew: false,
  colors: [],
  sizes: [],
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useFetchProductsInfinite(undefined, categoryParam || "all", undefined, 20);

  console.log("ProductsPage data:", data);

  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    category: categoryParam || "all",
  });

  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [categoryParam]);

  const allProducts: Product[] = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const filterAtrributes = useMemo(() => {

    return data?.pages.flatMap((page) => page.filters) || [];
  }, [data]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (filters.category !== "all") {
      result = result.filter((product) =>
        typeof product.category === "object"
          ? product.category._id === filters.category
          : product.category === filters.category
      );
    }

    if (filters.onlyInStock) result = result.filter((p) => p.inventory > 0);
    if (filters.onlySale) result = result.filter((p) => p.isSale);
    if (filters.onlyNew) result = result.filter((p) => p.isNewProduct);

    filterAtrributes?.[0] &&
      Object.keys(filterAtrributes[0]).forEach(key => {
        const values = filters[key];
        if (Array.isArray(values) && values.length > 0) {
          result = result.filter((p) => {
            const attrValues = p?.?.[key] || p?.[key] || [];
            console.log("Filtering by key:", key, "with values:", values, "attrValues:", attrValues);
            return values.some((v: string) => attrValues.includes(v));
          });
        }
      });

    switch (filters.sortBy) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [allProducts, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => {
      const current = prev[key] || [];

      const updated = current.includes(value)
        ? current.filter((v: string) => v !== value)
        : [...current, value];

      return { ...prev, [key]: updated };
    });
  };


  const clearFilters = () => setFilters(defaultFilters);

  const hasActiveFilters = useMemo(() => {
    const {
      category,
      priceRange,
      sortBy,
      onlyInStock,
      onlySale,
      onlyNew,
      colors,
      sizes,
    } = filters;
    return (
      category !== "all" ||
      priceRange[0] > 0 ||
      priceRange[1] < 500 ||
      onlyInStock ||
      onlySale ||
      onlyNew ||
      colors.length > 0 ||
      sizes.length > 0 ||
      sortBy !== "featured"
    );
  }, [filters]);

  // 👇 Intersection Observer for infinite scroll
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!bottomRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "100px",
      }
    );

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [bottomRef, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="text-muted-foreground mt-2">
            Browse our collection of premium clothing and accessories.
          </p>
        </header>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
                <X className="ml-1 h-4 w-4" />
              </Button>
            )}
            <p className="text-muted-foreground text-sm">
              Showing {filteredProducts.length} products
            </p>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <ProductFilters
                filters={filters}
                onChange={handleFilterChange}
                onClear={clearFilters}
                filterAtrributes={filterAtrributes}

              />
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block">
            <ProductFilters
              filters={filters}
              onChange={handleFilterChange}
              onClear={clearFilters}
              filterAtrributes={filterAtrributes}
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            {isLoading && <p className="text-muted">Loading products...</p>}
            <ProductGrid products={filteredProducts} />
            {isFetchingNextPage && <p className="text-sm text-center">Loading more...</p>}
            <div ref={bottomRef} className="h-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
