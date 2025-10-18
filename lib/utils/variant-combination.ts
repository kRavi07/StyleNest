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
    attributes: optionValues.reduce(
      (acc, curr) => {
        acc[curr.name] = curr.value;
        return acc;
      },
      {} as Record<string, string>
    ),
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

export function buildAttributesFromOptionTypes(
  optionTypes: { name: string; values: string[] }[],
  variants: { optionValues: Record<string, string>; stock?: number }[]
) {
  if (!optionTypes || optionTypes.length === 0) return [];
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

/**
 * Finds a specific variant from an array of variants based on user selections.
 * @param variants - An array of all possible product variants.
 * @param selections - An object representing the user's selected options (e.g., { Color: 'Red', Size: 'M' }).
 * @returns The matching IVariant object, or undefined if no match is found.
 */
export const getVariantFromSelections = (
  variants: Variant[],
  selections: Record<string, string>
): Variant | undefined => {
  // Find the variant where every selection matches the variant's optionValues.
  return variants.find((variant) => {
    const { optionValues } = variant;

    // Check if the number of selected options matches the variant's options.
    // This is a quick check to filter out non-matches.
    if (Object.keys(selections).length !== Object.keys(optionValues).length) {
      return false;
    }

    // Use .every() to ensure all key-value pairs in 'selections'
    // exist and match in the variant's 'optionValues'.
    return Object.entries(selections).every(
      ([key, value]) => optionValues[key] === value
    );
  });
};
