"use client";

import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useProductImageUpload } from "@/lib/react-query/admin/query/product";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Upload, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageGrid } from "./image-grid";
import { ImageLightbox } from "./image-lightbox";

type ProductImageManagerProps = {
    name: string;
    folder?: string;
    label?: string;
};

export function ProductImageManager({
    name,
    // eslint-disable-next-line no-unused-vars
    folder = "products",
    label = "Product Images",
}: ProductImageManagerProps) {
    const { control } = useFormContext();
    const [selected, setSelected] = useState<number | null>(null);
    const [dragging, setDragging] = useState(false);
    const [uploadingPreviews, setUploadingPreviews] = useState<string[]>([]);
    const { mutateAsync: uploadImages } = useProductImageUpload();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange } }) => {
                const images: string[] = (value || []).filter(Boolean);

                const handleUpload = async (files: FileList | File[]) => {
                    if (!files.length) return;

                    // Local previews
                    const localPreviews = Array.from(files)
                        .map((f) => URL.createObjectURL(f))
                        .filter(Boolean) as string[];

                    setUploadingPreviews(localPreviews);
                    onChange([...images, ...localPreviews]);

                    try {
                        const uploaded = await uploadImages(Array.from(files));

                        // Safety: ensure array
                        const uploadedUrls = Array.isArray(uploaded.url) ? uploaded.url : [uploaded.url];

                        onChange([...images, ...uploadedUrls]);
                    } catch (err) {
                        console.error(err);
                        // remove previews on failure
                        onChange([...images]);
                    } finally {
                        setUploadingPreviews([]);
                    }
                };


                const removeImage = (index: number) => {
                    const updated = images.filter((_, i) => i !== index);
                    onChange(updated);
                    setSelected(null);
                };

                const setPrimary = (index: number) => {
                    const reordered = [...images];
                    const [img] = reordered.splice(index, 1);
                    onChange([img, ...reordered]);
                    setSelected(null);
                };

                const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    setDragging(false);
                    if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files);
                };

                return (
                    <Card className="p-4 border-muted">
                        <CardHeader>
                            <CardTitle>{label}</CardTitle>
                        </CardHeader>

                        <CardContent>
                            {/* Upload Area */}
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragging(true);
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    setDragging(false);
                                }}
                                onDrop={handleDrop}
                                className={cn(
                                    "relative border-2 border-dashed rounded-xl p-6 text-center transition-colors",
                                    dragging
                                        ? "border-primary/70 bg-primary/5"
                                        : "border-muted-foreground/20 hover:border-primary/40"
                                )}
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    id={`${name}-upload`}
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files?.length) handleUpload(e.target.files);
                                    }}
                                />
                                <label htmlFor={`${name}-upload`} className="cursor-pointer block">
                                    <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Drag & drop or click to upload
                                    </p>
                                </label>
                            </div>

                            {/* Image Grid */}
                            <div className="mt-5">
                                {images.length === 0 && uploadingPreviews.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                        <ImageIcon className="w-12 h-12 mb-3" />
                                        <p>No images uploaded</p>
                                    </div>
                                ) : (
                                    <ImageGrid
                                        images={images}
                                        uploadingImages={uploadingPreviews}
                                        onView={(i) => setSelected(i)}
                                        onRemove={removeImage}
                                    />
                                )}
                            </div>

                            {/* Lightbox */}
                            {selected !== null && (
                                <ImageLightbox
                                    images={[...images, ...uploadingPreviews]}
                                    index={selected}
                                    onClose={() => setSelected(null)}
                                    onDelete={removeImage}
                                    onSetPrimary={setPrimary}
                                />
                            )}

                            {/* Uploading Overlay */}
                            {uploadingPreviews.length > 0 && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                                    <div className="bg-background rounded-xl p-6 flex flex-col items-center gap-2">
                                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                        <p className="text-sm text-muted-foreground">
                                            Uploading images...
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            }}
        />
    );
}
