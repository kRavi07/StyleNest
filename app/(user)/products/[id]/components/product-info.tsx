// components/ProductInfo.tsx
"use client";

import { FC } from "react";
import { Product, Variant } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ProductInfoProps {
    product: Product;
    selectedVariant: Variant | null;
    price: number;
}

export const ProductInfo: FC<ProductInfoProps> = ({
    product,
    selectedVariant,
    price,
}) => {
    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">{product.name}</h1>
                {selectedVariant && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedVariant.name}</p>
                )}
                {product.description && (
                    <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
                )}
            </div>

            <div className="flex items-center space-x-3">
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(price)}
                </p>
                {product.mrp && product.mrp > price && (
                    <>
                        <p className="text-lg text-gray-400 dark:text-gray-500 line-through">
                            {formatCurrency(product.mrp)}
                        </p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Save {Math.round(((product.mrp - price) / product.mrp) * 100)}%
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};