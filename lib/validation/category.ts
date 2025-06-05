import { z } from "zod";

// Schema for creating/updating a category
export const CategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  parent: z.string().optional().nullable(), // MongoDB ObjectId as string (nullable for root categories)
  image: z.string().url("Must be a valid URL").optional().nullable(),
  isActive: z.boolean().default(true),
});

// Type for React Hook Form or API use
export type CategoryFormData = z.infer<typeof CategorySchema>;
