import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";


const ProductGridSkeleton = ({ count = 6 }) => {
    return (

        <div className="flex flex-col w-full px-4">
            <div className="flex items-center justify-center px-4">
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: count }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
};

const ProductCardSkeleton = () => {
    return (
        <Card className="overflow-hidden">
            {/* Image skeleton */}
            <div className="relative aspect-square overflow-hidden bg-secondary/20 dark:bg-secondary/10">
                <div className="h-full w-full relative">
                    <Skeleton className="h-full w-full bg-gray-200 dark:bg-gray-800" />

                    {/* Shimmer effect overlay - different for light and dark modes */}
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/10" />

                    {/* Badge skeletons */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <Skeleton className="h-5 w-12 bg-gray-300 dark:bg-gray-700" />
                    </div>
                </div>
            </div>

            <CardContent className="p-4">
                {/* Category skeleton */}
                <Skeleton className="h-4 w-20 mb-2" />

                {/* Product name skeleton */}
                <Skeleton className="h-5 w-full mb-2" />

                {/* Price and rating skeleton */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    );
};


export default ProductGridSkeleton;