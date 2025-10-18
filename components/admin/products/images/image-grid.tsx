/* eslint-disable no-unused-vars */
"use client";

import { Eye, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageGridProps = {
    images: string[];
    uploadingImages?: string[];
    onView: (i: number) => void;
    onRemove: (i: number) => void;
};

export function ImageGrid({
    images,
    uploadingImages = [],
    onView,
    onRemove,
}: ImageGridProps) {
    const displayImages = [...images, ...uploadingImages];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {displayImages.map((img, i) => {
                const isUploading = i >= images.length;

                return (
                    <div
                        key={i}
                        className="relative group aspect-square rounded-lg overflow-hidden border bg-muted/30 flex items-center justify-center"
                    >
                        {i === 0 && !isUploading && (
                            <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                                Primary
                            </span>
                        )}

                        <img
                            src={img}
                            alt={`Product ${i + 1}`}
                            className={cn("w-full h-full object-cover", isUploading && "opacity-50")}
                        />

                        {isUploading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                        )}

                        {!isUploading && (
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2">
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="opacity-0 group-hover:opacity-100"
                                    onClick={() => onView(i)}
                                    type="button"
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="opacity-0 group-hover:opacity-100"
                                    onClick={() => onRemove(i)}
                                    type="button"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
