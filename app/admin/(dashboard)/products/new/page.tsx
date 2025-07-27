"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/admin/icons";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateProductFormData, CreateProductSchema } from "@/lib/validation/product";
import MultipleFileUploader from "@/components/ui/file-uploader";
import { useGetAllAttributeType } from "@/lib/react-query/public/query";
import { useGetAttributes } from "@/lib/react-query/admin/query/attributes";
import CreatableAsyncMultiSelect from "@/components/ui/multi-select";
import AttributeSelector, { AttributeWithValues } from "./components/attribute-selecto";
import Variants from "./components/variants";
import BasicDetails from "./components/basic-details";
import { useAddProduct } from "@/lib/react-query/admin/queries";
import { AddProductProps } from "@/lib/react-query/query.type";
import { useGetAllCatgeories } from "@/lib/react-query/admin/query/category";
import Specifications from "./components/specifications";


export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hasVariants, setHasVariants] = useState(false);
  const [selected, setSelected] = useState<AttributeWithValues[]>([]);


  const { data } = useGetAttributes();


  const { mutateAsync: addProduct, isPending: isAddProductPending } = useAddProduct()

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(CreateProductSchema),
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
      variants: [{
        name: "",
        sku: "",
        price: 0,
        stock: 0,
        mrp: 0,
        images: [],
        optionValues: {},
        attributes: [],
      }],
      specifications: [
        {
          name: "",
          value: ""
        }
      ],
      seo: {
        title: "",
        description: "",
        keywords: "",
      },
    },
  });

  const { control, formState: { errors }, handleSubmit } = form;

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




  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const onSubmit = async (data: CreateProductFormData) => {
    try {
      console.log(data);
      setIsLoading(true);


      await addProduct(data);

      toast({
        title: "Product created",
        description: "Your new product has been created successfully.",
      });



    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create product. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (errors) {
      //iterate over errors
      for (const [key, value] of Object.entries(errors)) {
        console.log(key, value);
      }
    }
  }, [errors]);

  return (
    <div className="flex flex-col gap-4">

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Icons.check className="mr-2 h-4 w-4" />
                  Create Product
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
                <CardDescription>Add images for your product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <MultipleFileUploader
                  acceptedFileType=".png,.jpg, .mp4 "
                  name={"images"}
                  label={"Product Image"}
                  control={control}
                  errors={errors}
                />

                {form.formState.errors.images && (
                  <p className="text-sm text-destructive">At least one image is required</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="variants">
            <Variants form={form} selected={selected} setSelected={setSelected} />
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Optimize your product for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>SEO Title</Label>
                  <Input {...form.register("seo.title")} />
                  {form.formState.errors.seo?.title && (
                    <p className="text-sm text-destructive">{form.formState.errors.seo.title.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea {...form.register("seo.description")} />
                  {form.formState.errors.seo?.description && (
                    <p className="text-sm text-destructive">{form.formState.errors.seo.description.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Keywords</Label>
                  <Input {...form.register("seo.keywords")} />
                  {form.formState.errors.seo?.keywords && (
                    <p className="text-sm text-destructive">{form.formState.errors.seo.keywords.message}</p>
                  )}
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
  );
}


function mergeRecordArray(
  attributes: (Record<string, string>)[]
): Record<string, string> {
  if (!attributes) return {};

  return attributes.reduce((acc, record) => {
    if (!record) return acc;
    return { ...acc, ...record };
  }, {});
}
