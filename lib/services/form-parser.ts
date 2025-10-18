import formidable from "formidable";
import { NextRequest } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Parses form data using formidable
 */
export function parseForm(
  req: NextRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((resolve, reject) => {
    const form = formidable({ keepExtensions: true, multiples: true });
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

/**
 * Options for parsing FormData
 */
type ParseOptions = {
  /** Keys to parse as JSON with intelligent handling */
  jsonKeys?: string[];
  /** Keys to convert to numbers */
  numberKeys?: string[];
  /** Keys to convert to booleans */
  booleanKeys?: string[];
  /** Keys to filter empty values from */
  filterEmptyKeys?: string[];
  /** Filter empty values from all fields */
  filterAllEmpty?: boolean;
};

/**
 * Converts FormData to a typed object with intelligent type conversions
 *
 * @example
 * const data = parseFormData(formData, {
 *   jsonKeys: ['specifications'],  // Auto-converts [{name:'CPU',value:'Intel'}] to {CPU:'Intel'}
 *   numberKeys: ['price', 'stock'],
 *   booleanKeys: ['inStock']
 * });
 */
export function parseFormData<T = Record<string, any>>(
  formData: FormData,
  options: ParseOptions = {}
): T {
  const {
    jsonKeys = [],
    numberKeys = [],
    booleanKeys = [],
    filterEmptyKeys = [],
    filterAllEmpty = false,
  } = options;

  const result: Record<string, any> = {};

  // Collect entries and handle duplicates
  for (const [key, value] of formData.entries()) {
    const val = typeof value === "string" ? value : (value as File);

    if (key in result) {
      result[key] = Array.isArray(result[key])
        ? [...result[key], val]
        : [result[key], val];
    } else {
      result[key] = val;
    }
  }

  // Parse JSON with intelligent array-to-object conversion
  for (const key of jsonKeys) {
    if (typeof result[key] !== "string") continue;

    try {
      const parsed = JSON.parse(result[key]);
      result[key] = processJSONValue(parsed);

      // Remove field if empty after processing
      if (result[key] === undefined) {
        delete result[key];
      }
    } catch {
      throw new Error(`Invalid JSON in field "${key}"`);
    }
  }

  // Convert numbers
  for (const key of numberKeys) {
    result[key] = convertToNumber(result[key]);
  }

  // Convert booleans
  for (const key of booleanKeys) {
    result[key] = convertToBoolean(result[key]);
  }

  // Filter empty values for specific keys
  for (const key of filterEmptyKeys) {
    if (Array.isArray(result[key])) {
      result[key] = result[key].filter((v: any) => !isEmpty(v));
      if (result[key].length === 0) delete result[key];
    } else if (isEmpty(result[key])) {
      delete result[key];
    }
  }

  // Filter all empty values if requested
  if (filterAllEmpty) {
    for (const key in result) {
      if (Array.isArray(result[key])) {
        result[key] = result[key].filter((v: any) => !isEmpty(v));
        if (result[key].length === 0) delete result[key];
      } else if (isEmpty(result[key])) {
        delete result[key];
      }
    }
  }

  return result as T;
}

/**
 * Intelligently processes JSON values:
 * - Detects key-value arrays and converts to objects for Mongoose Map
 * - Filters empty entries
 * - Preserves other structures
 */
function processJSONValue(value: any): any {
  if (!Array.isArray(value) || value.length === 0) {
    return value;
  }

  // Check if it's a key-value array structure
  const firstItem = value[0];
  if (!firstItem || typeof firstItem !== "object") {
    return value;
  }

  const hasNameValue = "name" in firstItem && "value" in firstItem;
  const hasKeyValue = "key" in firstItem && "value" in firstItem;

  if (!hasNameValue && !hasKeyValue) {
    return value;
  }

  // It's a key-value array - convert to object
  const keyField = hasNameValue ? "name" : "key";
  const obj: Record<string, any> = {};

  for (const item of value) {
    if (!item || typeof item !== "object") continue;

    const k = item[keyField];
    const v = item.value;

    // Only include if both key and value are non-empty
    if (!isEmpty(k) && v !== undefined && v !== null) {
      obj[k] = v;
    }
  }

  // Return undefined if no valid entries
  return Object.keys(obj).length > 0 ? obj : undefined;
}

/**
 * Converts value to number, handles arrays
 */
function convertToNumber(value: any): any {
  if (typeof value === "string") {
    const num = Number(value);
    return isNaN(num) ? value : num;
  }

  if (Array.isArray(value)) {
    return value.map((v) => {
      if (typeof v === "string") {
        const num = Number(v);
        return isNaN(num) ? v : num;
      }
      return v;
    });
  }

  return value;
}

/**
 * Converts value to boolean, handles arrays
 */
function convertToBoolean(value: any): any {
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  if (Array.isArray(value)) {
    return value.map((v) =>
      typeof v === "string" ? v.toLowerCase() === "true" : v
    );
  }

  return value;
}

/**
 * Checks if a value is empty
 */
function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object" && Object.keys(value).length === 0) return true;
  return false;
}

/**
 * Helper: Get and parse JSON from FormData
 */
export function getJSON<T>(formData: FormData, key: string): T | undefined {
  const val = formData.get(key);
  if (!val || typeof val !== "string") return undefined;
  try {
    return JSON.parse(val) as T;
  } catch {
    return undefined;
  }
}

/**
 * Helper: Get string value from FormData
 */
export function getString(
  formData: FormData,
  key: string,
  defaultValue: string = ""
): string {
  const val = formData.get(key);
  return typeof val === "string" ? val : defaultValue;
}

/**
 * Helper: Get number value from FormData
 */
export function getNumber(
  formData: FormData,
  key: string,
  defaultValue?: number
): number | undefined {
  const val = formData.get(key);
  if (typeof val === "string") {
    const num = Number(val);
    return isNaN(num) ? defaultValue : num;
  }
  return defaultValue;
}

/**
 * Helper: Get boolean value from FormData
 */
export function getBoolean(
  formData: FormData,
  key: string,
  defaultValue: boolean = false
): boolean {
  const val = formData.get(key);
  return typeof val === "string" ? val.toLowerCase() === "true" : defaultValue;
}
