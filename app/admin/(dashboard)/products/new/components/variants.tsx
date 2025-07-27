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

import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import AttributeSelector, {
    AttributeWithValues,
} from "./attribute-selecto";
import OptionValuesArray from "./optionValueArray";
import { Combination, generateCombinations } from "@/lib/utils/variant-combination";
import MultipleFileUploader from "@/components/ui/file-uploader";
import { Icons } from "@/components/admin/icons";

type VariantProps = {
    form: any,
    selected: AttributeWithValues[]
    setSelected: React.Dispatch<React.SetStateAction<AttributeWithValues[]>>
}


const Variants = ({ form, selected, setSelected }: VariantProps) => {
    const [combinations, setCombinations] = useState<Combination[]>([]);

    const {
        control,
        register,
        setValue,
        watch,
        formState: { errors },
    } = form;

    const {
        fields: variantFields,
        replace: replaceVariants,
        append: appendVariants,
        remove: removeVariants,
    } = useFieldArray({
        control,
        name: "variants",
    });

    const hasVariants = watch("hasVariants");

    const mainProductName = watch("name");

    useEffect(() => {
        if (hasVariants && selected.length > 0) {
            const attrValuesMap: Record<string, string[]> = {};

            selected.forEach((attr) => {
                if (attr.values.length > 0) {
                    attrValuesMap[attr.label] = attr.values;
                }
            });

            const variantAttribute = selected
                .filter((attr) => attr.values.length > 0)
                .map((attr) => attr.value);

            setValue("variantAttribute", variantAttribute);

            const combos = generateCombinations(attrValuesMap);
            console.log(combos);
            setCombinations(combos);

            replaceVariants(
                combos.map((combo) => ({
                    name: `${mainProductName}-${combo.name}`,
                    sku: "",
                    price: 0,
                    stock: 0,
                    mrp: 0,
                    optionValues: combo.optionValues?.reduce((acc, val) => {
                        acc[val.name] = val.value;
                        return acc;
                    }, {} as Record<string, string>),
                    attributes: {},
                    images: [],
                }))
            );
        } else {
            setCombinations([]);
            replaceVariants([]);
        }
    }, [selected, hasVariants]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Variants</CardTitle>
                <CardDescription>
                    Manage product variations like size, color, etc.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Controller
                        control={control}
                        name="hasVariants"
                        render={({ field }) => (
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="hasVariants"
                            />
                        )}
                    />
                    <Label htmlFor="has-variants">
                        This product has multiple variants
                    </Label>
                </div>

                {hasVariants && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Variant Attributes</Label>
                            <AttributeSelector selected={selected} setSelected={setSelected} />
                        </div>

                        {variantFields.map((field, index) => (
                            <Card key={field.id} className="border border-muted">
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Variant {index + 1}
                                    </CardTitle>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => removeVariants(index)}
                                    >
                                        <Icons.trash className="w-4 h-4" />
                                    </Button>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Variant Name</Label>
                                            <Input {...register(`variants.${index}.name`)} />
                                            {errors.variants?.[index]?.name && (
                                                <p className="text-red-500 text-sm">
                                                    {errors.variants[index].name.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>SKU</Label>
                                            <Input {...register(`variants.${index}.sku`)} />
                                            {errors.variants?.[index]?.sku && (
                                                <p className="text-red-500 text-sm">
                                                    {errors.variants[index].sku.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Price</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                {...register(`variants.${index}.price`, {
                                                    valueAsNumber: true,
                                                })}
                                            />
                                            {errors.variants?.[index]?.price && (
                                                <p className="text-red-500 text-sm">
                                                    {errors.variants[index].price.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>MRP</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                {...register(`variants.${index}.mrp`, {
                                                    valueAsNumber: true,
                                                })}
                                            />
                                            {errors.variants?.[index]?.mrp && (
                                                <p className="text-red-500 text-sm">
                                                    {errors.variants[index].mrp.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Stock</Label>
                                            <Input
                                                type="number"
                                                {...register(`variants.${index}.stock`, {
                                                    valueAsNumber: true,
                                                })}
                                            />
                                            {errors.variants?.[index]?.stock && (
                                                <p className="text-red-500 text-sm">
                                                    {errors.variants[index].stock.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <OptionValuesArray variantIndex={index} form={form} />

                                    <MultipleFileUploader
                                        acceptedFileType=".png,.jpg, .mp4 "
                                        name={`variants.${index}.images`}
                                        label={"Product Image"}
                                        control={control}
                                        errors={errors}
                                    />


                                </CardContent>
                            </Card>
                        ))}

                        <div className="flex items-center justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => appendVariants({
                                    name: "",
                                    sku: "",
                                    price: 0,
                                    mrp: 0,
                                    stock: 0,
                                    attributes: [],
                                    images: []
                                })}
                            >
                                Add New Variant <Icons.add className="w-4 h-4 mr-2" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default Variants;
