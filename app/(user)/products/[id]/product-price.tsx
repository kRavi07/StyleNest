"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";

interface Variant {
    price: number;
    mrp?: number;
}

interface Product {
    price: number;
    mrp?: number;
}

interface PriceWithDiscountProps {
    selectedVariant?: Variant | null;
    product: Product;
    currency?: string; // default "₹"
    className?: string;
}

const ProductPrice: React.FC<PriceWithDiscountProps> = ({
    selectedVariant,
    product,
    currency = "₹",
    className = "",
}) => {
    const price = selectedVariant?.price ?? product.price;
    const mrp = selectedVariant?.mrp ?? product.mrp;
    const showDiscount = mrp && mrp > price;
    const discountPercent = showDiscount
        ? Math.round(((mrp - price) / mrp) * 100)
        : 0;

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <span className="text-2xl font-bold">
                {currency}
                {price.toFixed(2)}
            </span>

            {showDiscount && (
                <>
                    <span className="text-muted-foreground line-through">
                        {currency}
                        {mrp.toFixed(2)}
                    </span>
                    <Badge className="bg-destructive text-destructive-foreground">
                        {discountPercent}% OFF
                    </Badge>
                </>
            )}
        </div>
    );
};

export default ProductPrice;
