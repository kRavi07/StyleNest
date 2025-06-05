import { z } from "zod";

// Zod schema for SEO object
const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  keywords: z.string().min(1),
});

const optionValueSchema = z.object({
  name: z.string().min(1, { message: "Option name is required" }),
  value: z.string().min(1, { message: "Option value is required" }),
});

export const variantSchema = z.object({
  name: z.string().min(1, { message: "Variant name is required" }),
  sku: z.string().min(1, { message: "SKU is required" }),
  price: z.preprocess((val) => {
    const n = Number(val);
    return isNaN(n) ? val : n;
  }, z.number({ invalid_type_error: "Price must be a number" }).nonnegative({ message: "Price cannot be negative" })),
  mrp: z.preprocess((val) => {
    const n = Number(val);
    return isNaN(n) ? val : n;
  }, z.number({ invalid_type_error: "MRP must be a number" }).nonnegative({ message: "MRP cannot be negative" })),
  stock: z.preprocess((val) => {
    const n = Number(val);
    return isNaN(n) ? val : n;
  }, z.number({ invalid_type_error: "Stock must be a number" }).int({ message: "Stock must be an integer" }).nonnegative({ message: "Stock cannot be negative" })),
  isActive: z.preprocess((val) => {
    if (typeof val === "string") {
      return val.toLowerCase() === "true";
    }
    return Boolean(val);
  }, z.boolean({ invalid_type_error: "isActive must be a boolean" }).optional()),
  images: z
    .array(z.string().url({ message: "Each image must be a valid URL" }))
    .optional()
    .default([]),
  optionValues: z.array(optionValueSchema).optional().default([]),
  attributes: z.record(z.string()).optional().default({}),
});

// Main Product schema
export const CreateProductSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  slug: z.string().min(1, { message: "Product slug is required" }),
  description: z
    .string()
    .min(1, { message: "Product description is required" }),
  price: z
    .number()
    .nonnegative({ message: "Price must be a non-negative number" }),
  sku: z.string().optional(),
  mrp: z.number().nonnegative(),
  category: z.string().min(1, { message: "Category is required" }),
  subcategory: z.string().optional(),
  images: z
    .union([z.instanceof(File), z.array(z.string().url())])
    .optional()
    .default([]),
  inventory: z.number().int().nonnegative().optional().default(0),
  inventoryStatsus: z
    .enum(["in-stock", "out-of-stock", "pre-order"])
    .optional()
    .default("in-stock"),
  featured: z.boolean().default(false),
  rating: z.number().min(0).max(5).default(0),
  reviews: z.number().int().nonnegative().default(0),
  isNewProduct: z.boolean().default(false),
  isSale: z.boolean().default(false),
  isActive: z.boolean().default(true),
  variantAttribute: z.array(z.string()).optional().default([]),
  variants: z.array(variantSchema).optional().default([]),
  attributes: z.record(z.string()).optional().default({}),
  seo: seoSchema,
  isArchivred: z.boolean().optional().default(false),
  isDeleted: z.boolean().optional().default(false),
  deletedAt: z.coerce.date().optional(),
  archivedAt: z.coerce.date().optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial();
export const UpdateVariantSchema = variantSchema.partial();

export type CreateProductFormData = z.infer<typeof CreateProductSchema>;
