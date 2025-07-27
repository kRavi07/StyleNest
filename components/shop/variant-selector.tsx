"use client";

import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle } from "lucide-react";
import { Variant } from "@/types";

export interface AttributeOption {
    value: string;
    label: string;
    color?: string;
    stock?: number;
    disabled?: boolean;
    premium?: boolean;
}

export interface Attribute {
    name: string,
    type: string,
    required: boolean,
    options: AttributeOption[]

}


interface VariantSelectorProps {
    attributes: Attribute[];
    variants: Variant[];
    selectedVariant?: Variant | null;
    onVariantChange?: (variant: Variant | null, selections: Record<string, string>) => void;
    onSelectionChange?: (selections: Record<string, string>) => void;
    showPricing?: boolean;
    showStock?: boolean;
    className?: string;
}

export function VariantSelector({
    attributes,
    variants,
    selectedVariant,
    onVariantChange,
    onSelectionChange,
    showPricing = false,
    showStock = false,
    className,
}: VariantSelectorProps) {
    const [selections, setSelections] = useState<Record<string, string>>({});

    useEffect(() => {
        if (selectedVariant?.optionValues) {
            setSelections(selectedVariant.optionValues);
        }
    }, [selectedVariant]);

    const findMatchingVariant = (selection: Record<string, string>): Variant | null => {
        return (
            variants.find((variant) =>
                Object.entries(selection).every(
                    ([key, value]) => variant.optionValues?.[key] === value
                )
            ) || null
        );
    };

    const getAvailableOptions = (attrName: string): string[] => {
        const otherSelections = { ...selections };
        delete otherSelections[attrName];

        const validVariants = variants.filter((variant) =>
            Object.entries(otherSelections).every(
                ([key, value]) => variant.optionValues?.[key] === value
            )
        );

        return [
            ...new Set(validVariants.map((v) => v.optionValues?.[attrName])),
        ].filter(Boolean);
    };

    const handleSelection = (attrName: string, optionValue: string) => {
        const newSelections = { ...selections, [attrName]: optionValue };
        setSelections(newSelections);

        const variant = findMatchingVariant(newSelections);
        onVariantChange?.(variant, newSelections);
        onSelectionChange?.(newSelections);
    };

    const currentVariant = findMatchingVariant(selections);

    const renderColorOption = (
        attr: Attribute,
        option: AttributeOption
    ) => {
        const selected = selections[attr.name] === option.value;
        const available = getAvailableOptions(attr.name).includes(option.value);
        const disabled =
            option.disabled ||
            !available ||
            (option.stock !== undefined && option.stock <= 0);

        return (
            <button
                key={option.value}
                onClick={() =>
                    !disabled && handleSelection(attr.name, option.value)
                }
                disabled={disabled}
                className={cn(
                    "relative w-10 h-10 rounded-full border-2 transition-all duration-200",
                    "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                    selected ? "border-blue-900 shadow-lg" : "border-gray-200",
                    disabled && "opacity-40 cursor-not-allowed hover:scale-100"
                )}
                style={{ backgroundColor: option.color }}
                title={`${option.label}${showStock && option.stock !== undefined ? ` (${option.stock} left)` : ''}`}
            >
                {selected && (
                    <Check className="w-4 h-4 text-slate-800 absolute inset-0 m-auto drop-shadow-sm" />
                )}
                {option.premium && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-white" />
                )}
            </button>
        );
    };

    const renderButtonOption = (
        attr: Attribute,
        option: AttributeOption
    ) => {
        const selected = selections[attr.name] === option.value;
        const available = getAvailableOptions(attr.name).includes(option.value);
        const disabled =
            option.disabled ||
            !available ||
            (option.stock !== undefined && option.stock <= 0);

        return (
            <Button
                key={option.value}
                variant={selected ? "default" : "outline"}
                size="sm"
                onClick={() =>
                    !disabled && handleSelection(attr.name, option.value)
                }
                disabled={disabled}
                className={cn(
                    "relative transition-all duration-200 hover:scale-105",
                    selected && "shadow-md",
                    disabled && "opacity-40 cursor-not-allowed hover:scale-100"
                )}
            >
                {option.label}
                {option.premium && <span className="ml-1 text-amber-500">✨</span>}
                {showStock &&
                    option.stock !== undefined &&
                    option.stock <= 5 &&
                    option.stock > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs px-1 py-0">
                            {option.stock}
                        </Badge>
                    )}
            </Button>
        );
    };

    return (
        <div className={cn("space-y-6", className)}>
            {attributes.map((attr) => (
                <div key={attr.name} className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {attr.name}
                            {attr.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {selections[attr.name] && (
                            <span className="text-xs text-gray-500">
                                {
                                    attr.options.find(
                                        (o) => o.value === selections[attr.name]
                                    )?.label
                                }
                            </span>
                        )}
                    </div>

                    <div
                        className={cn(
                            "flex flex-wrap",
                            attr.type === "color" ? "gap-3" : "gap-2"
                        )}
                    >
                        {attr.options.map((option) =>
                            attr.type === "color"
                                ? renderColorOption(attr, option)
                                : renderButtonOption(attr, option)
                        )}
                    </div>
                </div>
            ))}

            {currentVariant && (showPricing || showStock) && (
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        {showPricing && currentVariant.price && (
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold text-gray-900">
                                    ₹{currentVariant.price.toFixed(2)}
                                </span>
                                {currentVariant.mrp &&
                                    currentVariant.mrp > currentVariant.price && (
                                        <span className="text-sm text-gray-500 line-through">
                                            ₹{currentVariant.mrp.toFixed(2)}
                                        </span>
                                    )}
                            </div>
                        )}
                        {showStock && currentVariant.stock !== undefined && (
                            <div className="flex items-center gap-1 text-sm">
                                {currentVariant.stock > 0 ? (
                                    <>
                                        <div
                                            className={cn(
                                                "w-2 h-2 rounded-full",
                                                currentVariant.stock > 10
                                                    ? "bg-green-500"
                                                    : currentVariant.stock > 5
                                                        ? "bg-yellow-500"
                                                        : "bg-orange-500"
                                            )}
                                        />
                                        <span className="text-gray-600">
                                            {currentVariant.stock > 10
                                                ? "In Stock"
                                                : `${currentVariant.stock} left`}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                        <span className="text-red-600">Out of Stock</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>


                </div>
            )}
        </div>
    );
}
