// hooks/useProductVariants.ts
import { useEffect, useState, useMemo } from "react";
import { Product, Variant } from "@/types";
import {
  buildAttributesFromOptionTypes,
  getVariantFromSelections,
} from "@/lib/utils/variant-combination";

export const useProductVariants = (product: Product) => {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const attributes = useMemo(
    () =>
      product
        ? buildAttributesFromOptionTypes(product.optionTypes, product.variants)
        : [],
    [product]
  );

  // Initialize selections based on product option types
  useEffect(() => {
    if (product?.hasVariants && product.optionTypes?.length > 0) {
      const initialSelections: Record<string, string> = {};
      for (const optionType of product.optionTypes) {
        if (optionType.values?.length > 0) {
          initialSelections[optionType.name] = optionType.values[0];
        }
      }
      setSelections(initialSelections);
    }
  }, [product]);

  // Update selected variant when selections change
  useEffect(() => {
    if (product?.hasVariants) {
      const variant = getVariantFromSelections(product.variants, selections);
      setSelectedVariant(variant || null);
    } else {
      setSelectedVariant(null);
    }
  }, [product, selections]);

  const handleVariantChange = (
    variant: Variant | null,
    newSelections: Record<string, string>
  ) => {
    setSelections(newSelections);
  };

  return {
    selections,
    selectedVariant,
    attributes,
    handleVariantChange,
  };
};
