"use client";

import { FC, memo } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, AlertCircle } from "lucide-react";
import { Product, Variant } from "@/types";

interface AddToCartButtonProps {
    product: Product;
    selectedVariant: Variant | null;
    quantity: number;
    stockAvailable: number;
    onAddToCart: () => void;
}

const AddToCartButton: FC<AddToCartButtonProps> = ({
    product,
    selectedVariant,
    quantity,
    stockAvailable,
    onAddToCart,
}) => {
    const isOutOfStock = stockAvailable <= 0;
    const isVariantRequired = product.hasVariants && !selectedVariant;

    let buttonText = "Add to Cart";
    let icon = <ShoppingCart className="w-5 h-5" />;

    if (isOutOfStock) {
        buttonText = "Out of Stock";
        icon = <AlertCircle className="w-5 h-5" />;
    } else if (isVariantRequired) {
        buttonText = "Please Select Options";
        icon = <AlertCircle className="w-5 h-5" />;
    }

    return (
        <Button
            size="lg"
            className="w-full h-12 text-base font-semibold bg-gold-accent dark:bg-gold disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 transition-colors duration-200"
            onClick={onAddToCart}
            disabled={isOutOfStock || isVariantRequired}
        >
            <div className="flex items-center justify-center space-x-2">
                {icon}
                <span>{buttonText}</span>

            </div>
        </Button>
    );
};

export default memo(AddToCartButton);