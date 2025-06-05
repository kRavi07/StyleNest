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
import { OptionType } from "@/components/ui/multi-select";

const Variants = ({ form }: { form: any }) => {
    const [hasVariants, setHasVariants] = useState(false);
    const [selected, setSelected] = useState<OptionType[]>([]);


    const {
        fields: variantFields,
        append: appendVariant,
        remove: removeVariant,
    } = useFieldArray({
        control: form.control,
        name: "variants",
    });

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
                    <Switch
                        checked={hasVariants}
                        onCheckedChange={setHasVariants}
                        id="has-variants"
                    />
                    <Label htmlFor="has-variants">This product has multiple variants</Label>
                </div>

                {hasVariants && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Variants Attributes</Label>
                            <AttributeSelecto
                                selected={selected}
                                setSelected={setSelected}
                            />
                        </div>

                        {variantFields.map((field, index) => (
                            <Card key={field.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg">Variant {index + 1}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Variant Name</Label>
                                            <Input {...form.register(`variants.${index}.name`)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>SKU</Label>
                                            <Input {...form.register(`variants.${index}.sku`)} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Price</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                {...form.register(`variants.${index}.price`, {
                                                    valueAsNumber: true,
                                                })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Stock</Label>
                                            <Input
                                                type="number"
                                                {...form.register(`variants.${index}.stock`, {
                                                    valueAsNumber: true,
                                                })}
                                            />
                                        </div>
                                    </div>

                                    <OptionValuesArray variantIndex={index} form={form} options={selected} />
                                </CardContent>
                            </Card>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                appendVariant({
                                    name: "",
                                    sku: "",
                                    price: 0,
                                    stock: 0,
                                    optionValues: [],
                                    attributes: {},
                                })
                            }
                        >
                            <Icons.add className="mr-2 h-4 w-4" />
                            Add Variant
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default Variants;
