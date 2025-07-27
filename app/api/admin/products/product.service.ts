import connectToDatabase from "@/lib/db/mongoose";
import { processFileUpload } from "@/lib/services/file-services";
import { parseFormData } from "@/lib/services/form-parser";
import { CreateProductSchema } from "@/lib/validation/product";
import { NextRequest } from "next/server";
import Product from "@/lib/db/models/product";
export async function handleProductUpload(req: NextRequest) {
  const formData = await req.formData();

  const parsedFormData = parseFormData(formData, {
    jsonKeys: ["seo", "variants", "specifications"],
    numberKeys: ["price", "mrp", "inventory"],
    booleanKeys: [
      "hasVariants",
      "isNewProduct",
      "isSale",
      "featured",
      "isActive",
      "isArchived",
      "isDeleted",
    ],
  });

  const parsed = CreateProductSchema.safeParse(parsedFormData);
  if (!parsed.success) {
    return {
      status: 400,
      payload: {
        success: false,
        error: "Validation failed",
        issues: parsed.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path,
        })),
      },
    };
  }

  await connectToDatabase();

  const data = parsed.data;
  const imageFiles = formData
    .getAll("images")
    .filter((f) => f instanceof File) as File[];
  const productImages = await Promise.all(
    imageFiles.map((file) => processFileUpload(file, "products"))
  );

  const variants = Array.isArray(data.variants)
    ? data.variants
    : [data.variants];

  for (let i = 0; i < variants.length; i++) {
    const variantKey = `variants[${i}].images`;
    const files = formData
      .getAll(variantKey)
      .filter((f) => f instanceof File) as File[];
    const variantImages = await Promise.all(
      files.map((file) => processFileUpload(file, "products"))
    );
    variants[i].images = variantImages;
  }

  const product = new Product({
    ...data,
    images: productImages,
    variants,
  });

  await product.save();

  return {
    status: 201,
    payload: {
      success: true,
      product: {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
      },
      message: "Product uploaded successfully",
    },
  };
}
