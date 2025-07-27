import { Variant } from "@/types";

export type Combination = {
  name: string;
  sku: string;
  price: number;
  stock: number;
  optionValues: { name: string; value: string }[];
  attributes: Record<string, string>;
};

export function generateCombinations(
  attributes: Record<string, string[]>
): Combination[] {
  const keys = Object.keys(attributes);
  if (keys.length === 0) return [];

  // Create all combinations of attribute values
  const combinations = cartesianProduct(
    keys.map((key) => attributes[key].map((value) => ({ name: key, value })))
  );

  // Map each combination to a variant structure
  return combinations.map((optionValues) => ({
    name: optionValues.map((ov) => ov.value).join("-"),
    sku: "",
    price: 0,
    stock: 0,
    optionValues,
    attributes: optionValues.reduce((acc, curr) => {
      acc[curr.name] = curr.value;
      return acc;
    }, {} as Record<string, string>),
  }));
}

// Helper: Cartesian product generator
function cartesianProduct<T>(arrays: T[][]): T[][] {
  return arrays.reduce<T[][]>(
    (acc, curr) =>
      acc
        .map((a) => curr.map((b) => [...a, b]))
        .reduce((a, b) => [...a, ...b], []),
    [[]]
  );
}

//get variant attributes details
export function getOptionMap(variants: Variant[]) {
  const map: Record<string, Set<string>> = {};

  for (const variant of variants) {
    const entries = Object.entries(variant.optionValues);
    for (const [key, value] of entries) {
      if (!map[key]) {
        map[key] = new Set();
      }
      map[key].add(value);
    }
  }

  // Convert Set -> Sorted Array
  const optionMap: Record<string, string[]> = {};
  for (const [key, valueSet] of Object.entries(map)) {
    optionMap[key] = Array.from(valueSet).sort();
  }

  return optionMap;
}

export function getValidOptions(optionTypes, variants, selectedOptions) {
  const result = {};
  for (const type of optionTypes) {
    const validValues = new Set();

    for (const variant of variants) {
      const matches = Object.entries(selectedOptions).every(([k, v]) => {
        return k === type || variant.optionValues[k] === v;
      });

      if (matches) validValues.add(variant.optionValues[type]);
    }

    result[type] = [...validValues];
  }
  return result;
}

export function buildAttributesFromOptionTypes(
  optionTypes: { name: string; values: string[] }[],
  variants: { optionValues: Record<string, string>; stock?: number }[]
) {
  return optionTypes.map(({ name, values }) => {
    const valueMap = new Map<string, number>();

    for (const value of values) {
      valueMap.set(value, 0); // initialize
    }

    for (const variant of variants) {
      const val = variant.optionValues?.[name];
      if (val && valueMap.has(val)) {
        const current = valueMap.get(val) ?? 0;
        valueMap.set(val, current + (variant.stock ?? 0));
      }
    }

    return {
      name,
      type: name.toLowerCase() === "color" ? "color" : "button",
      required: true,
      options: Array.from(valueMap.entries()).map(([value, stock]) => ({
        value,
        label: value,
        stock,
        color: getColorHex(value), // optional for color swatches
      })),
    };
  });
}

// Optional: color mapping for swatches

// Optional: Add basic color mapping (can expand)
function getColorHex(value: string): string | undefined {
  const lower = value.toLowerCase();
  const colorMap: Record<string, string> = {
    red: "#f00",
    blue: "#00f",
    black: "#000",
    white: "#fff",
    green: "#0f0",
    yellow: "#ff0",
    orange: "#ffa500",
  };
  return colorMap[lower];
}
