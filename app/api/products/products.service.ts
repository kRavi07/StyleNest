import Product from "@/lib/db/models/product";

interface ProductFilters {
  categories: string[];
  colors?: string[];
  sizes?: string[];
  materials: string[];
  specifications: Record<string, string[]>;
}

export async function getFilters(): Promise<ProductFilters> {
  const [result] = await Product.aggregate([
    {
      $facet: {
        // Categories
        categories: [
          { $match: { category: { $ne: null } } },
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "cat",
            },
          },
          { $unwind: "$cat" },
          { $group: { _id: null, values: { $addToSet: "$cat.name" } } },
        ],

        // Variants (colors, sizes, etc.)
        variants: [
          {
            $project: {
              variantKeys: {
                $reduce: {
                  input: "$variants",
                  initialValue: [],
                  in: {
                    $concatArrays: [
                      "$$value",
                      {
                        $cond: [
                          { $and: [{ $isArray: ["$$this.optionValues"] }] },
                          [],
                          {
                            $map: {
                              input: { $objectToArray: "$$this.optionValues" },
                              as: "opt",
                              in: "$$opt",
                            },
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
          { $unwind: "$variantKeys" },
          {
            $group: {
              _id: "$variantKeys.k",
              values: { $addToSet: "$variantKeys.v" },
            },
          },
        ],

        // Specifications
        specifications: [
          {
            $project: {
              specEntries: {
                $cond: [
                  { $eq: [{ $type: "$specifications" }, "object"] },
                  { $objectToArray: "$specifications" },
                  [],
                ],
              },
            },
          },
          { $unwind: "$specEntries" },
          {
            $group: {
              _id: "$specEntries.k",
              values: { $addToSet: "$specEntries.v" },
            },
          },
        ],
      },
    },
  ]);

  const filters: ProductFilters = {
    categories: result?.categories?.[0]?.values || [],
    colors: [],
    sizes: [],
    materials: [],
    specifications: {},
  };

  // Map variant options to colors and sizes
  result?.variants?.forEach(
    ({ _id, values }: { _id: string; values: string[] }) => {
      const key = _id.toLowerCase();
      if (key === "color") filters.colors = values;
      else if (key === "size") filters.sizes = values;
    }
  );

  // Map specifications
  result?.specifications?.forEach(
    ({ _id, values }: { _id: string; values: string[] }) => {
      if (_id && values.length > 0) {
        filters.specifications[_id] = values;
      }
    }
  );

  return filters;
}

export function mapImageKeys(keys?: string[]) {
  if (!keys) return [];
  const result = keys.map((key) => `${process.env.R2_PUBLIC_BASE_URL}/${key}`);
  console.log(result);
  return result;
}

export function formatProduct(product: any) {
  return {
    ...product,
    images: mapImageKeys(product.images),
    variants:
      product.variants?.map((variant: any) => ({
        ...variant,
        images: mapImageKeys(variant.images),
      })) || [],
  };
}

export function formatProducts(products: any[]) {
  return products.map((p) => formatProduct(p));
}
