import product, { IProduct } from "@/lib/db/models/product";

export function getAllProductFilters(products: any[]) {
  const filters: Record<string, Set<string>> = {};

  for (const product of products) {
    // 🔹 Variant option filters
    for (const variant of product.variants || []) {
      const optionValues = variant.optionValues || {};
      const entries = Object.entries(optionValues);
      for (const [key, value] of entries) {
        if (!filters[key]) filters[key] = new Set();
        if (
          value &&
          value != "" &&
          value != null &&
          typeof value === "string"
        ) {
          filters[key].add(value as string);
        }
      }
    }

    // 🔸 Product-level specification filters
    const specifications = product.specifications || {};
    for (const [key, value] of Object.entries(specifications)) {
      if (typeof value === "string") {
        if (!filters[key]) filters[key] = new Set();
        filters[key].add(value);
      } else if (Array.isArray(value) && value.length > 0) {
        for (const val of value) {
          if (!filters[key]) filters[key] = new Set();
          filters[key].add(val);
        }
      }
    }
  }

  // Convert sets to arrays
  const result: Record<string, string[]> = {};
  for (const key in filters) {
    if (filters[key].size > 0) {
      result[key] = Array.from(filters[key]).sort();
    }
  }

  return result;
}
