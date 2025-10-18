"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/components/shop/ProductGrid";
import ProductFilters from "@/components/shop/ProductFilters";
import { Product } from "@/types";
import { useFetchProductsInfinite, useGetFilters } from "@/lib/react-query/public/query";
import ProductGridSkeleton from "@/components/skeleton/ProductList";
import ComingSoonPage from "@/components/common/coming-soon";
import { ComingSoonHero } from "@/components/home/women-section-hero";

type BaseFilterState = {
    category: string;
    priceRange: [number, number];
    sortBy: string;
    onlySale: boolean;
    onlyNew: boolean;
    onlyInStock?: boolean;
    colors: string[];
    sizes: string[];
};

type FilterState = BaseFilterState & {
    page: number;
    limit: number;
    [key: string]: string | number | boolean | string[] | [number, number];
};

const defaultFilters: FilterState = {
    category: "all",
    priceRange: [0, 5000],
    sortBy: "featured",
    onlySale: false,
    onlyNew: false,
    onlyInStock: false,
    colors: [],
    sizes: [],
    page: 1,
    limit: 20,
};

export default function ProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category") || "all";
    const forParam = searchParams.get("for") || "all";

    const [filters, setFilters] = useState<FilterState>({
        ...defaultFilters,
        category: categoryParam,
    });

    // --- localFilters reflect immediate UI state (no debounce) ---
    const [localFilters, setLocalFilters] = useState<FilterState>(filters);

    // timer ref for debounce
    const debounceRef = useRef<number | null>(null);

    // Sync URL -> both applied and local filters (handles back/forward, direct links)
    useEffect(() => {
        const params = new URLSearchParams(String(window.location.search));
        const urlFilters: Partial<FilterState> = {};

        params.forEach((value, key) => {
            if (key === "priceRange") urlFilters[key] = (value.split(",").map(Number) as unknown) as [number, number];
            else if (["colors", "sizes"].includes(key)) urlFilters[key] = value.split(",");
            else if (["onlySale", "onlyNew", "onlyInStock"].includes(key)) urlFilters[key] = value === "true";
            else if (key === "page" || key === "limit") {
                const n = Number(value);
                if (!Number.isNaN(n)) urlFilters[key] = n as any;
            } else {
                urlFilters[key] = value as any;
            }
        });

        const merged = { ...defaultFilters, ...urlFilters } as FilterState;

        // Only update if actually different (prevents loops)
        if (JSON.stringify(merged) !== JSON.stringify(filters)) {
            setFilters(merged);
        }
        if (JSON.stringify(merged) !== JSON.stringify(localFilters)) {
            setLocalFilters(merged);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]); // react to url changes

    // keep category in sync if it's changed separately
    useEffect(() => {
        setLocalFilters(prev => ({ ...prev, category: categoryParam }));
        setFilters(prev => ({ ...prev, category: categoryParam }));
    }, [categoryParam]);

    // Fetch products (uses applied `filters`)
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useFetchProductsInfinite({ filters, limit: filters.limit });

    // Fetch cached filter options (useGetFilters should be cached/staleTime-aware)
    const { data: filtersData, isLoading: filterLoading } = useGetFilters();

    // Flatten products
    const allProducts: Product[] = useMemo(() => data?.pages.flatMap(p => p.data) || [], [data]);

    // Normalize attributes for the ProductFilters component
    const filterAttributes = useMemo(() => {
        const raw = filtersData?.filters || {};
        return Object.fromEntries(
            Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v : Object.keys(v || {})])
        ) as Record<string, string[]>;
    }, [filtersData]);

    // ---- UI change handler (immediate) ----
    const handleFilterChange = useCallback((key: string, value: any) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
        // debounce applied filters -> see effect below
    }, []);

    // ---- Debounce: apply localFilters to applied `filters` and push URL ----
    useEffect(() => {
        // If identical, nothing to do
        if (JSON.stringify(localFilters) === JSON.stringify(filters)) return;

        // clear any pending timer
        if (debounceRef.current) {
            window.clearTimeout(debounceRef.current);
            debounceRef.current = null;
        }

        // schedule apply
        debounceRef.current = window.setTimeout(() => {
            const toApply = { ...localFilters, page: 1 }; // reset page
            setFilters(toApply);

            // build URL params from toApply
            const params = new URLSearchParams();
            Object.entries(toApply).forEach(([k, v]) => {
                if (k === "page" || k === "limit") {
                    if (typeof v === "number") params.set(k, String(v));
                    return;
                }
                if (Array.isArray(v) && v.length > 0) params.set(k, v.join(","));
                else if (typeof v === "boolean") {
                    if (v) params.set(k, "true");
                } else if (v !== "" && v !== null && v !== undefined) {
                    params.set(k, String(v));
                }
            });

            const qs = params.toString();
            // IMPORTANT: prevent scrolling to top on filter apply
            router.push(qs ? `/products?${qs}` : "/products", { scroll: false });

            debounceRef.current = null;
        }, 350); // 350ms debounce

        return () => {
            if (debounceRef.current) {
                window.clearTimeout(debounceRef.current);
                debounceRef.current = null;
            }
        };
    }, [localFilters, filters, router]);

    // Clear filters immediately (no debounce)
    const clearFilters = useCallback(() => {
        setLocalFilters(defaultFilters);
        setFilters(defaultFilters);
        router.push("/products", { scroll: false });
    }, [router]);

    // Determine if any filters active (UI)
    const hasActiveFilters = useMemo(() => {
        const { category, priceRange, sortBy, onlySale, onlyNew, onlyInStock, colors, sizes } = localFilters;
        return (
            category !== "all" ||
            priceRange[0] > 0 ||
            priceRange[1] < 5000 ||
            onlySale ||
            onlyNew ||
            onlyInStock ||
            (colors && colors.length > 0) ||
            (sizes && sizes.length > 0) ||
            sortBy !== "featured"
        );
    }, [localFilters]);

    // Infinite scroll: increase applied `filters.page` and keep localFilters page in sync
    const bottomRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!bottomRef.current || !hasNextPage) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    setFilters(prev => {
                        const next = { ...prev, page: (prev.page || 1) + 1 };
                        // keep UI in sync so page param shown in URL on next apply if needed
                        setLocalFilters(l => ({ ...l, page: next.page }));
                        return next;
                    });
                    fetchNextPage();
                }
            },
            { rootMargin: "200px" }
        );

        observer.observe(bottomRef.current);
        return () => observer.disconnect();
    }, [bottomRef, fetchNextPage, hasNextPage, isFetchingNextPage]);


    // Example: check if categoryParam is neither "all" nor "men"
    if (forParam && forParam !== "all" && forParam !== "men") {
        return <ComingSoonHero />
    }


    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-6">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
                    <p className="text-muted-foreground mt-2">Browse our collection of premium clothing and accessories.</p>
                </header>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {hasActiveFilters && (
                            <Button variant="outline" size="sm" onClick={clearFilters}>
                                Clear Filters
                                <X className="ml-1 h-4 w-4" />
                            </Button>
                        )}
                        <p className="text-muted-foreground text-sm">Showing {allProducts.length} products</p>
                    </div>

                    {/* Mobile Filters */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="lg:hidden">
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                Filters
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <ProductFilters filters={localFilters} onChange={handleFilterChange} onClear={clearFilters} filterAttributes={filterAttributes} />
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="hidden lg:block">
                        <ProductFilters filters={localFilters} onChange={handleFilterChange} onClear={clearFilters} filterAttributes={filterAttributes} />
                    </div>

                    <div className="lg:col-span-3 space-y-6 relative">

                        {(isLoading || filterLoading) ? (
                            <ProductGridSkeleton />

                        ) : <ProductGrid products={allProducts} />
                        }

                        {isFetchingNextPage && <p className="text-sm text-center">Loading more...</p>}
                        <div ref={bottomRef} className="h-1" />
                    </div>
                </div>
            </div>
        </div>
    );
}
