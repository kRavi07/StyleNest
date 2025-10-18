"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

type OptionType = {
    name: string;
    values: string[];
};

type VariantOptionManagerProps = {
    existingOptionTypes: OptionType[];
    existingVariants: any[];
    onGenerateVariants: (variants: any[]) => void;
};

export const VariantOptionManager: React.FC<VariantOptionManagerProps> = ({
    existingOptionTypes,
    existingVariants,
    onGenerateVariants
}) => {
    const [optionTypes, setOptionTypes] = useState<OptionType[]>(
        existingOptionTypes || []
    );

    const [mode, setMode] = useState<"new" | "existing">("new");
    const [selectedOptionType, setSelectedOptionType] = useState("");
    const [newOption, setNewOption] = useState<{ name: string; values: string[] }>({
        name: "",
        values: [],
    });

    const [newValue, setNewValue] = useState("");

    // 🧠 Add new value to current selection (new or existing type)
    const addValue = () => {
        if (!newValue.trim()) return toast.warning("Enter a value first");

        if (mode === "existing" && selectedOptionType) {
            setOptionTypes((prev) => {
                const existing = prev.find((o) => o.name === selectedOptionType);
                if (!existing) return prev;

                if (existing.values.includes(newValue.trim())) {
                    toast.warning("Value already exists in this option");
                    return prev;
                }

                const updated = {
                    ...existing,
                    values: [...existing.values, newValue.trim()],
                };

                toast.success(`Added "${newValue}" to ${selectedOptionType}`);
                return prev.map((o) =>
                    o.name === selectedOptionType ? updated : o
                );
            });
        } else if (mode === "new") {
            if (!newOption.name.trim())
                return toast.warning("Enter a name for the new option type");

            if (newOption.values.includes(newValue.trim())) {
                toast.warning("Value already exists in this new option");
                return;
            }

            setNewOption((prev) => ({
                ...prev,
                values: [...prev.values, newValue.trim()],
            }));
        }

        setNewValue("");
    };

    // 🧠 Add new option type to the main list
    const addNewOptionType = () => {
        if (!newOption.name.trim()) {
            toast.warning("Option name is required");
            return;
        }

        if (optionTypes.some((o) => o.name === newOption.name.trim())) {
            toast.warning("Option type already exists");
            return;
        }

        if (!newOption.values.length) {
            toast.warning("Add at least one value");
            return;
        }

        setOptionTypes([...optionTypes, newOption]);
        setNewOption({ name: "", values: [] });
        toast.success("New option type added");
    };

    // 🧠 Remove option type
    const removeOptionType = (name: string) => {
        setOptionTypes(optionTypes.filter((o) => o.name !== name));
    };

    // 🧮 Generate variant combinations
    const generateCombinations = () => {
        if (!optionTypes.length) {
            toast.error("Add at least one option type to generate variants");
            return;
        }

        const combinations = cartesianProduct(
            optionTypes.map((o) => o.values.map((v) => ({ [o.name]: v })))
        );

        const newVariants = combinations.map((combo, index) => {
            const optionValues = Object.assign({}, ...combo);
            return {
                _id: `temp-${Object.values(optionValues).join("-")}`,
                sku: Object.values(optionValues).join("-").toUpperCase(),
                name: Object.values(optionValues).join(" "),
                price: 0,
                mrp: 0,
                stock: 0,
                images: [],
                optionValues,
                attributes: [],
                isActive: true,
            };
        });

        // Merge with existing variants
        const merged = [...(existingVariants || [])];

        newVariants.forEach((variant) => {
            const exists = merged.some((v) =>
                Object.keys(variant.optionValues).every(
                    (key) => v.optionValues[key] === variant.optionValues[key]
                )
            );
            if (!exists) merged.push(variant);
        });

        onGenerateVariants(merged);
        toast.success(`Added ${merged.length - (existingVariants?.length || 0)} new variants`);
    };


    return (
        <div className="space-y-6">
            {/* Existing Options */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Current Option Types</CardTitle>
                </CardHeader>
                <CardContent>
                    {optionTypes.length ? (
                        <div className="space-y-3">
                            {optionTypes.map((opt, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start justify-between border p-2 rounded-md"
                                >
                                    <div>
                                        <p className="font-medium">{opt.name}</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {opt.values.map((val) => (
                                                <Badge key={val} variant="outline">
                                                    {val}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => removeOptionType(opt.name)}
                                    >
                                        <Trash className="w-4 h-4 text-muted-foreground" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No option types defined yet.
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Add / Update Option */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Add or Update Option</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex gap-2 items-center">
                        <Button
                            type="button"
                            variant={mode === "existing" ? "default" : "outline"}
                            onClick={() => setMode("existing")}
                        >
                            Existing Type
                        </Button>
                        <Button
                            type="button"
                            variant={mode === "new" ? "default" : "outline"}
                            onClick={() => setMode("new")}
                        >
                            New Type
                        </Button>
                    </div>

                    {mode === "existing" ? (
                        <Select
                            value={selectedOptionType}
                            onValueChange={setSelectedOptionType}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select existing option type" />
                            </SelectTrigger>
                            <SelectContent>
                                {optionTypes.map((o) => (
                                    <SelectItem key={o.name} value={o.name}>
                                        {o.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <Input
                            placeholder="New option type name (e.g. Size)"
                            value={newOption.name}
                            onChange={(e) =>
                                setNewOption((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                        />
                    )}

                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Add value (e.g. XL)"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addValue()}
                        />
                        <Button variant="outline" onClick={addValue}>
                            <Plus className="w-4 h-4 mr-1" /> Add
                        </Button>
                    </div>

                    {mode === "new" && newOption.values.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {newOption.values.map((v) => (
                                <Badge key={v} variant="outline">
                                    {v}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {mode === "new" && (
                        <div className="pt-3">
                            <Button
                                onClick={addNewOptionType}
                                disabled={!newOption.name.trim() || !newOption.values.length}
                            >
                                Add New Option Type
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="flex justify-end">
                <Button onClick={generateCombinations}>Generate Variants</Button>
            </div>
        </div>
    );
};

// 🧮 Cartesian product helper
function cartesianProduct(arr: any[][]): any[][] {
    return arr.reduce(
        (acc, curr) =>
            acc
                .map((x) => curr.map((y) => [...x, y]))
                .reduce((a, b) => a.concat(b), []),
        [[]]
    );
}
