/* eslint-disable @next/next/no-img-element */
"use client";

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ImageLightbox({
    images,
    index,
    onClose,
    onDelete,
    onSetPrimary,
}: {
    images: string[];
    index: number;
    onClose: () => void;
    onDelete: (i: number) => void;
    onSetPrimary: (i: number) => void;
}) {
    const [current, setCurrent] = useState(index);

    const goPrev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
    const goNext = () => setCurrent((c) => (c + 1) % images.length);

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
            <div className="relative max-w-6xl w-full h-[90%] flex flex-col items-center">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                >
                    <X className="w-6 h-6 text-white" />
                </button>

                {/* Left Arrow */}
                {images.length > 1 && (
                    <button
                        onClick={goPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                    >
                        <ChevronLeft className="w-8 h-8 text-white" />
                    </button>
                )}

                {/* Right Arrow */}
                {images.length > 1 && (
                    <button
                        onClick={goNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                    >
                        <ChevronRight className="w-8 h-8 text-white" />
                    </button>
                )}

                {/* Image */}
                <img
                    src={images[current]}
                    alt={`Preview ${current + 1}`}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-lg select-none"
                />

                {/* Actions */}
                <div className="absolute bottom-6 flex gap-3">
                    {current === 0 ? (
                        <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded">
                            Primary Image
                        </span>
                    ) : (
                        <Button
                            onClick={() => onSetPrimary(current)}
                            className="bg-blue-600 text-white hover:bg-blue-700 font-medium rounded-lg"
                        >
                            Set as Primary
                        </Button>
                    )}
                    <Button
                        variant="destructive"
                        onClick={() => onDelete(current)}
                        className="bg-red-600 hover:bg-red-700 font-medium rounded-lg"
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}
