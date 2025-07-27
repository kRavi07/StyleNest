"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

import React, { useEffect } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { productDescription } from "./description-data";
import dynamic from "next/dynamic";
import DocumentEditor from "@/components/text-editor/text-editor";
import { useEditor } from "@tiptap/react";
import { extensions } from "@/components/text-editor/text-editor-extension";
import { Controller } from "react-hook-form";
import { RichTextEditorField } from "@/components/common/tiptap-editor";
import { useGetAllCatgeories, useGetSubCategories } from "@/lib/react-query/admin/query/category";
import { CategoryProps } from "@/lib/react-query/query.type";
import { CategoryFormData } from "@/lib/validation/category";



const BasicDetails = ({ form }: {
    form: any
}) => {


    const editor = useEditor({
        extensions,
        content: "",
        immediatelyRender: false,

    });

    const {
        register,
        formState: { errors },
        setValue,
    } = form;

    const { data: categories } = useGetAllCatgeories();
    const { data: subcategories, isFetched } = useGetSubCategories(form.watch("category"));






    return (
        <Card>
            <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                    Enter the basic details of your product
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input {...form.register("name")} />
                    {form.formState.errors.name && (
                        <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input {...form.register("slug")} />
                    {form.formState.errors.slug && (
                        <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>Short Description</Label>
                    <Input {...form.register("shortDescription")} />
                    {form.formState.errors.shortDescription && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.shortDescription.message}
                        </p>
                    )}
                </div>


                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Price</Label>
                        <Input
                            type="number"
                            step="0.01"
                            {...form.register("price", { valueAsNumber: true })}
                        />
                        {form.formState.errors.price && (
                            <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>MRP</Label>
                        <Input
                            type="number"
                            step="0.01"
                            {...form.register("mrp", { valueAsNumber: true })}
                        />
                        {form.formState.errors.mrp && (
                            <p className="text-sm text-destructive">{form.formState.errors.mrp.message}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Controller
                            name="category"
                            control={form.control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.map((category: CategoryProps) => (
                                            <SelectItem key={category._id} value={category._id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {form.formState.errors.category && (
                            <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Subcategory</Label>
                        {
                            (
                                <Controller
                                    name="subcategory"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            disabled={!form.watch("category") && !isFetched}
                                        >
                                            <SelectTrigger>
                                                {isFetched ? (
                                                    <SelectValue placeholder="Select a subcategory" />
                                                ) : (
                                                    <SelectValue placeholder="Select a category first" />
                                                )}
                                            </SelectTrigger>

                                            <SelectContent>
                                                {subcategories && subcategories.length > 0 ? (
                                                    subcategories.map((category: CategoryProps) => (
                                                        <SelectItem key={category._id} value={category._id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="px-2 py-1 text-sm text-destructive">
                                                        No subcategory found
                                                    </div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            )
                        }
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Inventory</Label>
                        <Input
                            type="number"
                            {...form.register("inventory", { valueAsNumber: true })}
                        />
                        {form.formState.errors.inventory && (
                            <p className="text-sm text-destructive">{form.formState.errors.inventory.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Best Suited For</Label>
                        <Controller
                            name="gender"
                            control={form.control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select best suited for" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Men</SelectItem>
                                        <SelectItem value="female">Women</SelectItem>
                                        <SelectItem value="boys">Boys</SelectItem>
                                        <SelectItem value="girls">Girls</SelectItem>
                                        <SelectItem value="unisex">Unisex</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>



                <div className="space-y-2">
                    <Label>Description</Label>
                    <Controller
                        name="description"
                        control={form.control}
                        render={({ field }) => (
                            <RichTextEditorField field={field} editor={editor} />
                        )}
                    />

                    {form.formState.errors.description && (
                        <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                    )}
                </div>


                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="featured"
                            checked={form.watch("featured")}
                            onCheckedChange={(checked) => form.setValue("featured", checked)}
                        />
                        <Label htmlFor="featured">Featured Product</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="isNewProduct"
                            checked={form.watch("isNewProduct")}
                            onCheckedChange={(checked) => form.setValue("isNewProduct", checked)}
                        />
                        <Label htmlFor="isNewProduct">New Product</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="isSale"
                            checked={form.watch("isSale")}
                            onCheckedChange={(checked) => form.setValue("isSale", checked)}
                        />
                        <Label htmlFor="isSale">On Sale</Label>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default BasicDetails