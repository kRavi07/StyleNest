import formidable from "formidable";
import { NextRequest } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
 * Converts FormData into a plain JS object with support for JSON parsing on specific keys
 */
type FormDataParserOptions = {
  jsonKeys?: string[];
  numberKeys?: string[];
  booleanKeys?: string[];
};

export function parseFormData<T = Record<string, any>>(
  formData: FormData,
  options: FormDataParserOptions = {}
): T {
  const { jsonKeys = [], numberKeys = [], booleanKeys = [] } = options;
  const result: Record<string, any> = {};

  const entries = Array.from(formData.entries());

  for (const [key, value] of entries) {
    const val = typeof value === "string" ? value : (value as File); // preserve file if not a string

    if (result[key]) {
      result[key] = Array.isArray(result[key])
        ? [...result[key], val]
        : [result[key], val];
    } else {
      result[key] = val;
    }
  }

  for (const key of jsonKeys) {
    if (typeof result[key] === "string") {
      try {
        result[key] = JSON.parse(result[key]);
      } catch {
        throw new Error(`Invalid JSON in field "${key}"`);
      }
    }
  }

  for (const key of numberKeys) {
    if (typeof result[key] === "string") {
      const num = Number(result[key]);
      result[key] = isNaN(num) ? result[key] : num;
    }
  }

  for (const key of booleanKeys) {
    if (typeof result[key] === "string") {
      result[key] = result[key] === "true";
    }
  }

  return result as T;
}

export const getJSON = <T>(formData: FormData, key: string): T | undefined => {
  const val = formData.get(key);
  if (!val || typeof val !== "string") return undefined;
  try {
    return JSON.parse(val);
  } catch {
    return undefined;
  }
};
