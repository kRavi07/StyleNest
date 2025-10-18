import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Minimal Skeleton component with Tailwind animate-pulse and dark mode
const Skeleton = ({ className = "", ...props }) => {
    return (
        <div
            className={`animate-pulse bg-muted ${className}`}
            {...props}
        />
    );
};

// Individual Order Card Skeleton
const OrderCardSkeleton = () => {
    return (
        <div className="flex items-center gap-4 p-6 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors border border-border/50">
            {/* Product Image */}
            <Skeleton className="w-12 h-12 rounded-lg" />

            {/* Order Details */}
            <div className="flex-1 space-y-2">
                {/* Order ID and Status */}
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Date, Items and Total */}
                <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-32 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                </div>
            </div>

            {/* Action Button */}
            <Skeleton className="w-8 h-8 rounded-md" />
        </div>
    );
};

// Main Order List Skeleton Component
const OrderListSkeleton = ({ orderCount = 6 }) => {
    return (
        <Card className="border-border">
            <CardContent className="p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                        <Skeleton className="w-5 h-5 rounded-sm bg-white/20" />
                    </div>
                    <Skeleton className="h-6 w-32 rounded" />
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {Array.from({ length: orderCount }).map((_, index) => (
                        <OrderCardSkeleton key={index} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderListSkeleton;