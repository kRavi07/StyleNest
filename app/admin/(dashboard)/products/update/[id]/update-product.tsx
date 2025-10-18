/* eslint-disable no-unused-vars */
"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, useFieldArray, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/admin/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { UpdateProductFormData, UpdateProductSchema } from "@/lib/validation/product";
import { useGetAttributes } from "@/lib/react-query/admin/query/attributes";
import { toast } from "sonner";
import { AttributeWithValues } from "../../new/components/attribute-selecto";
import BasicDetails from "../../new/components/basic-details";
import Specifications from "../../new/components/specifications";
import { useGetProductById, useUpdateProduct } from "@/lib/react-query/admin/query/product";
import { ProductImageManager } from "@/components/admin/products/images/image-manager";
import { VariantTableWithDrawer } from "./components/variant-viewer";

export default function UpdateProductPage() {
    const router = useRouter();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [selected, setSelected] = useState<AttributeWithValues[]>([]);

    const { data: attributes } = useGetAttributes();

    // Fetch product details
    const { data: product, isLoading: isProductLoading } = useGetProductById(id as string);

    // Update mutation
    const { mutateAsync: updateProduct } = useUpdateProduct();

    const form = useForm<UpdateProductFormData>({
        resolver: zodResolver(UpdateProductSchema),
        defaultValues: {
            name: "",
            slug: "",
            shortDescription: "",
            description: "",
            price: 0,
            mrp: 0,
            category: "",
            gender: "unisex",
            subcategory: "",
            images: [],
            inventory: 0,
            featured: false,
            isNewProduct: false,
            isSale: false,
            isActive: true,
            variants: [],
            specifications: [],
            seo: {
                title: "",
                description: "",
                keywords: "",
            },
        },
    });

    const { control, formState: { errors }, handleSubmit, reset } = form;
    const { fields, append, remove } = useFieldArray({ control, name: "variants" });

    // Prefill product data when fetched
    useEffect(() => {
        if (product) {
            const normalizedVariants = (product.variants || []).map((v: any) => ({
                _id: v._id,
                sku: v.sku || "",
                name: v.name || "",
                price: v.price || 0,
                mrp: v.mrp || 0,
                attributes: v.attributes || [],
                images: v.images || [],
                isActive: v.isActive ?? true,
                optionValues: v.optionValues || {},
            }));

            reset({
                ...product,
                images: product.images,
                variants: normalizedVariants
            });
        }
    }, [product, reset]);

    const name = form.watch("name");

    useEffect(() => {
        if (name) {
            const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
            form.setValue("slug", slug);
        }
    }, [name]);

    function getDirtyValues(dirty: any, values: any): any {
        if (typeof dirty !== "object" || dirty === null) return values;

        if (Array.isArray(values)) {
            // dirty keys might be index numbers
            return Object.keys(dirty).map((key) => {
                const index = Number(key);
                return getDirtyValues(dirty[key], values[index]);
            });
        }

        const result: any = {};
        for (const key in dirty) {
            if (values && key in values) {
                result[key] = getDirtyValues(dirty[key], values[key]);
            } else {
                result[key] = undefined;
            }
        }
        return result;
    }






    const onSubmit = async () => {
        try {
            setIsLoading(true);
            const dirtyData = getDirtyValues(form.formState.dirtyFields, form.getValues());

            toast.promise(
                updateProduct({ id: id as string, data: dirtyData }),
                {
                    loading: 'Updating product...',
                    success: 'Product updated successfully!',
                    error: 'Failed to update product. Please try again.',
                }
            );
        } finally {
            setIsLoading(false);
        }
    };


    if (isProductLoading) {
        return <p>Loading product...</p>;
    }


    return (
        <FormProvider {...form}>
            <div className="flex flex-col gap-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Icons.check className="mr-2 h-4 w-4" />
                                        Update Product
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    <Tabs defaultValue="basic" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger value="images">Images</TabsTrigger>
                            <TabsTrigger value="variants">Variants</TabsTrigger>
                            <TabsTrigger value="seo">SEO</TabsTrigger>
                            <TabsTrigger value="specifications">Specifications</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic">
                            <BasicDetails form={form} />
                        </TabsContent>

                        <TabsContent value="images">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Product Images</CardTitle>
                                    <CardDescription>Update images for your product</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <ProductImageManager name="images" />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="variants">
                            <Controller
                                name="variants"
                                key={product._id}
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <>

                                            <VariantTableWithDrawer
                                                existingOptionTypes={product.optionTypes}
                                                variants={field.value ?? []}
                                                onChange={field.onChange}
                                            />
                                        </>
                                    )
                                }}
                            />
                        </TabsContent>

                        <TabsContent value="seo">
                            <Card>
                                <CardHeader>
                                    <CardTitle>SEO Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>SEO Title</Label>
                                        <Input {...form.register("seo.title")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Meta Description</Label>
                                        <Textarea {...form.register("seo.description")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Keywords</Label>
                                        <Input {...form.register("seo.keywords")} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="specifications">
                            <Specifications form={form} />
                        </TabsContent>
                    </Tabs>
                </form>
            </div>
        </FormProvider>
    );
}
