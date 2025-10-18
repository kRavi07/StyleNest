import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { VariantOptionManager } from "./variant-option-manager";
import { VariantForm } from "./variant-form";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Variant } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { MissingCombinationDrawer } from "./add-missing-combination";
import { ProductImageManager } from "@/components/admin/products/images/image-manager";
import { Eye, PlusIcon } from "lucide-react";

export function VariantTableWithDrawer({
    variants,
    onChange,
    existingOptionTypes,
}: {
    variants: any[];
    onChange: (variants: any[]) => void;
    existingOptionTypes: any[];
}) {
    const [variantDrawer, setVariantDrawer] = useState(false);
    const [optionDrawer, setOptionDrawer] = useState(false);
    const [editing, setEditing] = useState(null);
    const [missingDrawer, setMissingDrawer] = useState(false);
    const [missingCombos, setMissingCombos] = useState<any[]>([]);
    const [editingCombo, setEditingCombo] = useState(null);
    const [activeVariantIndex, setActiveVariantIndex] = useState<number | null>(null);


    const handleSave = (variant: Variant) => {
        const exists = variants.some((v) => v._id === variant._id);
        const updated = exists
            ? variants.map((v) => (v._id === variant._id ? variant : v))
            : [...variants, variant];
        onChange(updated);
        setVariantDrawer(false);
    };

    function findMissingCombinations(optionTypes: any[], existingVariants: any[]) {
        if (!optionTypes?.length) return [];
        const validOptions = optionTypes
            .filter((o) => Array.isArray(o.values) && o.values.length > 0);

        if (!validOptions.length) return [];

        // Cartesian helper
        const cartesian = (arrays: any[][]) =>
            arrays.reduce(
                (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
                [[]]
            );

        // Build all possible combinations
        const allCombos = cartesian(
            validOptions.map((opt) =>
                opt.values.map((val: any) => ({ [opt.name]: val }))
            )
        ).map((combo) => Object.assign({}, ...combo));

        // Create lookup of existing option combinations
        const existingKeys = new Set(
            (existingVariants || []).map((v) =>
                JSON.stringify(v.optionValues || {})
            )
        );

        // Filter missing combinations
        const missing = allCombos.filter(
            (combo) => !existingKeys.has(JSON.stringify(combo))
        );

        return missing;
    }

    const handleAddVariant = () => {
        const missing = findMissingCombinations(existingOptionTypes, variants);
        if (missing.length === 0) {
            toast.info("All variant combinations already exist.", {
                duration: 5000,
                description: "Please add a new attribute to generate more variants.",
            });
            return;
        }
        setMissingCombos(missing);
        setMissingDrawer(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Variants</h3>
                <div className="space-x-2">
                    <Button variant="outline" type="button" onClick={() => setOptionDrawer(true)}>
                        Manage Options
                    </Button>
                    <Button onClick={handleAddVariant} type="button">Add Variant</Button>
                </div>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Images</TableHead>
                        <TableHead>Actions</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {variants?.length ? (
                        variants.map((v, index) => (
                            <TableRow key={v._id}>
                                <TableCell>{v.sku}</TableCell>
                                <TableCell>{v.name}</TableCell>
                                <TableCell>₹{v.price}</TableCell>
                                <TableCell>{v.stock}</TableCell>
                                <TableCell>
                                    {v.isActive ? (
                                        <span className="text-green-600">Active</span>
                                    ) : (
                                        <span className="text-red-600">Inactive</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2" onClick={() => setActiveVariantIndex(index)}>
                                        {v.images?.length > 0 ? (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                type="button"
                                            >
                                                <Eye className="h-4 w-4 text-gold-accent " />
                                            </Button>

                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                type="button"
                                            >
                                                <PlusIcon className="h-4 w-4 text-gold-accent " />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setEditing(v);
                                            setVariantDrawer(true);
                                        }}
                                        type="button"
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                                No variants added yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>



            <Drawer open={variantDrawer} onOpenChange={setVariantDrawer}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{editing ? "Edit Variant" : "Add Variant"}</DrawerTitle>
                    </DrawerHeader>
                    <VariantForm
                        initial={editing}
                        onSubmit={handleSave}
                        onCancel={() => setVariantDrawer(false)}
                    />
                </DrawerContent>
            </Drawer>

            <Dialog
                open={activeVariantIndex !== null}
                onOpenChange={(open) => !open && setActiveVariantIndex(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Product Images</DialogTitle>
                    </DialogHeader>
                    {activeVariantIndex !== null && (
                        <ProductImageManager
                            name={`variants.${activeVariantIndex}.images`}

                        />
                    )}
                </DialogContent>
            </Dialog>
            <MissingCombinationDrawer
                open={missingDrawer}
                onOpenChange={setMissingDrawer}
                missingCombinations={missingCombos}
                onGenerateAll={() => {
                    const newVariants = missingCombos.map((combo, index) => ({
                        _id: `temp-${Date.now()}-${index}`,
                        name: Object.values(combo).join(" "),
                        sku: Object.values(combo).join("-").toUpperCase(),
                        optionValues: combo,
                        price: 0,
                        stock: 0,
                        images: [],
                        isActive: true,
                    }));
                    onChange([...variants, ...newVariants]);
                    setMissingDrawer(false);
                }}
                onEdit={(combo) => {
                    setEditingCombo(combo);
                    setVariantDrawer(true);
                }}
            />
            {/* Option Manager Drawer */}
            <Dialog open={optionDrawer} onOpenChange={setOptionDrawer}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Variant Options</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                        <VariantOptionManager
                            existingOptionTypes={existingOptionTypes}
                            onGenerateVariants={(generated) => {
                                onChange(generated);
                                setOptionDrawer(false);
                            }}
                            existingVariants={variants}
                        />
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}
