"use client";
import { useTheme } from "next-themes";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Package } from "lucide-react";
import { Order } from "@/types";
import OrderCard from "./order-card";
import { useGetOrders } from "@/lib/react-query/order/query";
import OrderListSkeleton from "../skeleton/OrderList";
import { Button } from "../ui/button";
import usePagination from "@/hooks/use-pagination";

const OrderPage = () => {
    const { theme } = useTheme();
    const { pageIndex, pageSize, handlePageChange, handlePageSizeChange } =
        usePagination();

    const {
        isLoading: isLoadingOrders,
        data: orders,
        isFetching,
    } = useGetOrders({
        status: "all",
        page: pageIndex + 1,
        limit: pageSize,
    });

    const cardClasses =
        theme === "dark"
            ? "backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300"
            : "backdrop-blur-xl bg-white/80 border border-gray-200/50 hover:bg-white/90 transition-all duration-300";

    if (isLoadingOrders) {
        return <OrderListSkeleton />;
    }

    const pagination = orders?.pagination;
    const totalPages = pagination?.pages || 1;

    return (
        <Card className={cardClasses}>
            <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                        <Package className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold">Recent Orders</h2>
                </div>

                <div className="space-y-4">
                    {orders?.data?.length === 0 && (
                        <div className="flex items-center justify-center text-sm font-semibold text-gray-600">
                            You have no orders yet
                        </div>
                    )}
                    {orders?.data?.map((order: Order, index: number) => (
                        <OrderCard key={index} order={order} />
                    ))}
                </div>

                {/* Pagination Controls */}
                {pagination && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pageIndex === 0 || isFetching}
                                onClick={() => handlePageChange(pageIndex - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pageIndex + 1 >= totalPages || isFetching}
                                onClick={() => handlePageChange(pageIndex + 1)}
                            >
                                Next
                            </Button>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                                Page {pageIndex + 1} of {totalPages}
                            </span>
                            <span className="text-sm text-muted-foreground">|
                                showing
                            </span>
                            <select
                                title="Page Size"
                                value={pageSize}
                                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                className="border rounded-md px-2 py-1 text-sm"
                            >
                                {[5, 10, 20, 50].map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                            <span className="text-sm text-muted-foreground">orders</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderPage;
