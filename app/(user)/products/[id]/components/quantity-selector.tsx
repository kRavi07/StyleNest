// components/QuantitySelector.tsx
"use client";

import { FC, memo } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
    quantity: number;
    maxQuantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
}

const QuantitySelector: FC<QuantitySelectorProps> = ({
    quantity,
    maxQuantity,
    onIncrement,
    onDecrement,
}) => {
    return (
        <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDecrement}
                    disabled={quantity === 1}
                    aria-label="Decrease quantity"
                    className="h-10 w-10 p-0 rounded-l-lg rounded-r-none border-r border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="flex items-center justify-center h-10 w-16 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900">
                    {quantity}
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onIncrement}
                    disabled={quantity >= maxQuantity}
                    aria-label="Increase quantity"
                    className="h-10 w-10 p-0 rounded-r-lg rounded-l-none border-l border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default memo(QuantitySelector);