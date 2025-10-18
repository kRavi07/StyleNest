"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Variant } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface VariantFormProps {
    initial?: Variant | null;
    onSubmit: (data: Variant) => void;
    onCancel: () => void;
}

export const VariantForm: React.FC<VariantFormProps> = ({
    initial,
    onSubmit,
    onCancel,
}) => {
    const { register, handleSubmit, reset } = useForm<Variant>({
        defaultValues:
            initial || {
                _id: crypto.randomUUID(),
                name: "",
                sku: "",
                price: 0,
                mrp: 0,
                stock: 0,
                images: [],
                optionValues: {},
                attributes: [],
                isActive: true,
            },
    });

    const submitHandler = handleSubmit((data) => {
        onSubmit(data);
        reset();
    });

    return (
        <form onSubmit={submitHandler} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label>Name</label>
                    <Input {...register("name", { required: true })} />
                </div>
                <div>
                    <label>SKU</label>
                    <Input {...register("sku", { required: true })} />
                </div>
                <div>
                    <label>Price</label>
                    <Input type="number" {...register("price", { required: true, valueAsNumber: true })} />
                </div>
                <div>
                    <label>MRP</label>
                    <Input type="number" {...register("mrp", { required: true, valueAsNumber: true })} />
                </div>
                <div>
                    <label>Stock</label>
                    <Input type="number" {...register("stock", { required: true, valueAsNumber: true })} />
                </div>
                <div className="flex items-center space-x-2">
                    <Switch {...register("isActive")} />
                    <span>Active</span>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">Save Variant</Button>
            </div>
        </form>
    );
};
