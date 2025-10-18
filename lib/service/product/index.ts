import Product from "@/lib/db/models/product";
import _ from "lodash";
// 🔹 Helper: Validate uniqueness for slug and SKUs
export async function validateUniqueness(
  id: string,
  data: any,
  existingProduct: any
) {
  const checks: Promise<void>[] = [];

  if (data.slug && data.slug !== existingProduct.slug) {
    checks.push(
      Product.findOne({ slug: data.slug, _id: { $ne: id } }).then((exists) => {
        if (exists) throw new Error("Slug already exists");
      })
    );
  }

  if (data.variants?.length > 0) {
    const newSKUs = data.variants.map((v: any) => v.sku).filter(Boolean);
    const existingSKUs = existingProduct.variants?.map((v: any) => v.sku) || [];
    const changedSKUs = newSKUs.filter(
      (sku: string) => !existingSKUs.includes(sku)
    );

    if (changedSKUs.length > 0) {
      // Check duplicates in update
      if (new Set(changedSKUs).size !== changedSKUs.length) {
        throw new Error("Duplicate SKUs found in variants");
      }
      // Check against other products
      checks.push(
        Product.findOne({
          _id: { $ne: id },
          "variants.sku": { $in: changedSKUs },
        }).then((exists) => {
          if (exists) throw new Error("One or more variant SKUs already exist");
        })
      );
    }
  }

  await Promise.all(checks);
}
export function mergeArrayByKey(
  existingArray: any[] = [],
  updateArray: any[] = [],
  key: string
) {
  const mergedMap = new Map<string | number, any>();

  // Add all existing items (skip null/undefined safely)
  for (const item of existingArray) {
    if (item && item[key] != null) {
      mergedMap.set(item[key], { ...item });
    }
  }

  // Merge or add updated items
  for (const item of updateArray) {
    if (!item || item[key] == null) continue;

    const existing = mergedMap.get(item[key]);
    if (existing) {
      // Merge existing and updated item deeply but avoid undefined overwrites
      mergedMap.set(
        item[key],
        _.mergeWith({}, existing, item, (_obj, src) => {
          if (src === undefined) return _obj; // keep existing if update value is undefined
        })
      );
    } else {
      mergedMap.set(item[key], { ...item });
    }
  }

  return Array.from(mergedMap.values());
}

// 🔹 Smart merge product data
export function smartMerge(existing: any, updates: any) {
  const merged: any = _.cloneDeep(existing);

  // Handle hasVariants toggle
  if (updates.hasVariants === false) {
    merged.variants = [];
    delete updates.variants;
  }

  if (updates.variants?.length) {
    // detect merge key
    const hasIds = updates.variants.some((v: any) => v._id);
    const mergeKey = hasIds ? "_id" : "sku";

    // normalize ObjectId to string for comparison
    const normalizeKey = (val: any) => (val ? String(val) : undefined);

    const mergedMap = new Map<string, any>();

    // Add existing variants first
    for (const v of merged.variants || []) {
      const key = normalizeKey(v[mergeKey]);
      if (key) mergedMap.set(key, { ...v });
    }

    // Merge updates (replace existing, or add new)
    for (const v of updates.variants) {
      const key = normalizeKey(v[mergeKey]);
      if (key) {
        mergedMap.set(key, { ...mergedMap.get(key), ...v });
      } else {
        // fallback: push entirely new variant
        mergedMap.set(crypto.randomUUID(), v);
      }
    }

    merged.variants = Array.from(mergedMap.values());
  }

  // Merge specifications by name
  if (updates.specifications?.length) {
    merged.specifications = mergeArrayByKey(
      merged.specifications || [],
      updates.specifications,
      "name"
    );
  }

  // Merge images (simple dedupe)
  if (updates.images?.length) {
    merged.images = _.uniq([
      ...(updates.images || []),
      ...(merged.images || []),
    ]);
  }

  // Merge nested objects (seo, etc.)
  if (updates.seo) {
    merged.seo = _.merge({}, merged.seo, updates.seo);
  }

  // Merge other scalar fields
  const scalarFields = _.omit(updates, [
    "variants",
    "specifications",
    "images",
    "seo",
  ]);
  Object.assign(merged, scalarFields);

  return merged;
}
