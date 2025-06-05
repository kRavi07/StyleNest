
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
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/admin/icons";

import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import AttributeSelecto from "./attribute-selecto";
import OptionValuesArray from "./optionValueArray";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const BasicDetails = ({ form }: {
    form: any
}) => {
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
                    <Label>Description</Label>
                    <Textarea {...form.register("description")} />
                    {form.formState.errors.description && (
                        <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
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
                        <Input {...form.register("category")} />
                        {form.formState.errors.category && (
                            <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Subcategory</Label>
                        <Input {...form.register("subcategory")} />
                        {form.formState.errors.subcategory && (
                            <p className="text-sm text-destructive">{form.formState.errors.subcategory.message}</p>
                        )}
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
                        <Label>Inventory Status</Label>
                        <Select
                            onValueChange={(value) => form.setValue("inventoryStatsus", value as "in-stock" | "out-of-stock" | "pre-order")}
                            defaultValue={form.getValues("inventoryStatsus")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="in-stock">In Stock</SelectItem>
                                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                                <SelectItem value="pre-order">Pre Order</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
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