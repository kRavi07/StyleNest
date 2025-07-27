import { z } from "zod";

// 🔹 OptionType schema
const optionTypeSchema = z.object({
  name: z.string().min(1, { message: "Option name is required" }),
  values: z
    .array(z.string().min(1, { message: "Option value cannot be empty" }))
    .min(1),
});

// 🔹 Attribute schema (used for specifications and variant attributes)
const attributeSchema = z.object({
  name: z.string(),
  value: z.string(),
});

// 🔹 SEO schema
const seoSchema = z.object({
  title: z.string().min(1, { message: "SEO title is required" }),
  description: z.string().min(1, { message: "SEO description is required" }),
  keywords: z.string().min(1, { message: "SEO keywords are required" }),
});

// 🔹 Variant schema
const variantSchema = z.object({
  name: z.string().min(1, { message: "Variant name is required" }),
  sku: z.string().min(1, { message: "SKU is required" }),
  price: z.number().nonnegative({ message: "Price cannot be negative" }),
  mrp: z.number().nonnegative({ message: "MRP cannot be negative" }),
  stock: z
    .number()
    .int()
    .nonnegative({ message: "Stock must be a non-negative integer" }),
  images: z
    .array(z.union([z.string().url(), z.instanceof(File)]))
    .optional()
    .default([]),
  optionValues: z.record(z.string(), z.string()).optional().default({}), // { name, value }
  attributes: z.array(attributeSchema).optional().default([]), //
  isActive: z.boolean().optional().default(true),
});

// 🔹 Main Product schema
export const BaseProductSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  shortDescription: z.string().min(3).max(200),
  description: z.string().min(1),
  price: z
    .number()
    .nonnegative({ message: "Price cannot be negative" })
    .optional(),
  mrp: z.number().nonnegative({ message: "MRP cannot be negative" }).optional(),
  category: z.string().min(1, { message: "Category is required" }),
  subcategory: z.string().optional(),

  images: z
    .array(z.union([z.string().url(), z.instanceof(File)]))
    .optional()
    .default([]),
  inventory: z.number().int().nonnegative().default(0),
  featured: z.boolean().default(false),
  rating: z.number().min(0).max(5).default(0),
  reviews: z.number().int().nonnegative().default(0),
  isNewProduct: z.boolean().default(false),
  isSale: z.boolean().default(false),
  isActive: z.boolean().default(true),
  gender: z.enum(["male", "female", "unisex"]).optional().default("unisex"),
  hasVariants: z.boolean().default(false),
  variants: z.array(variantSchema).optional().default([]),
  specifications: z.array(attributeSchema).optional().default([]),
  seo: seoSchema,
  deletedAt: z.coerce.date().optional(),
  archivedAt: z.coerce.date().optional(),
});

// 🔹 Create Product Schema with preprocessor for `hasVariants`
export const CreateProductSchema = z.preprocess((input) => {
  if (typeof input === "object" && input !== null) {
    const data = { ...(input as any) };
    if (!data.hasVariants) {
      data.variants = [];
    } else {
      //set variants attribute empty array if not present
      for (let i = 0; i < data.variants.length; i++) {
        if (
          !data.variants[i].attributes ||
          data.variants[i].attributes.length === 0 ||
          data.variants[i].attributes === undefined ||
          typeof data.variants[i].attributes === "object"
        ) {
          data.variants[i].attributes = [];
        }
      }
    }

    return data;
  }
  return input;
}, BaseProductSchema);

// 🔹 Partial schemas for update
export const UpdateProductSchema = BaseProductSchema.partial();
export const UpdateVariantSchema = variantSchema.partial();

// 🔹 Types
export type CreateProductFormData = z.infer<typeof CreateProductSchema>;
export type VariantFormData = z.infer<typeof variantSchema>;
