"use client";

import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { X, Upload, Trash2, Eye, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useProductImageUpload } from "@/lib/react-query/admin/query/product";

type ProductImageManagerProps = {
    name: string; // field name in form, e.g., "images"
};

export default function ProductImageManager({ name }: ProductImageManagerProps) {
    const { control } = useFormContext();
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { mutateAsync: uloadImage } = useProductImageUpload();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { value, onChange } }) => {
                const images: string[] = value || [];

                // --- File Upload ---
                const handleFileUpload = async (files: FileList | File[]) => {
                    setIsUploading(true);
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    const newImages = Array.from(files).map((file) =>
                        URL.createObjectURL(file)
                    );
                    onChange([...images, ...newImages]); // update form
                    setIsUploading(false);
                };

                const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    setIsDragging(true);
                };
                const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    setIsDragging(false);
                };
                const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files.length > 0) {
                        handleFileUpload(e.dataTransfer.files);
                    }
                };

                const handleFileInputChange = (
                    e: React.ChangeEvent<HTMLInputElement>
                ) => {
                    if (e.target.files && e.target.files.length > 0)
                        handleFileUpload(e.target.files);
                };

                const removeImage = (index: number) => {
                    onChange(images.filter((_, i) => i !== index));
                    if (selectedImage === index) setSelectedImage(null);
                };

                const setPrimaryImage = (index: number) => {
                    const reordered = [...images];
                    const [primary] = reordered.splice(index, 1);
                    reordered.unshift(primary);
                    onChange(reordered);
                    setSelectedImage(null);
                };

                const goPrev = () => {
                    if (selectedImage !== null) {
                        setSelectedImage((selectedImage - 1 + images.length) % images.length);
                    }
                };

                const goNext = () => {
                    if (selectedImage !== null) {
                        setSelectedImage((selectedImage + 1) % images.length);
                    }
                };

                return (
                    <div className="space-y-6">
                        {/* Upload Area */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`mb-4 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragging
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                                : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
                                }`}
                        >
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileInputChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-300" />
                                <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">
                                    Drag & drop images or click to browse
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    PNG, JPG, WebP up to 10MB
                                </p>
                            </label>
                        </div>

                        {/* Image Grid */}
                        {images.length === 0 ? (
                            <div className="text-center py-12">
                                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-500" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    No images uploaded yet
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {images.map((img, index) => (
                                    <div
                                        key={index}
                                        className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-transparent hover:border-blue-500 transition-all cursor-pointer"
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        {index === 0 && (
                                            <span className="absolute top-2 left-2 z-10 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                                                Primary
                                            </span>
                                        )}
                                        <img
                                            src={img}
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedImage(index);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-full hover:bg-gray-100 transition-all"
                                            >
                                                <Eye className="w-5 h-5 text-gray-700 dark:text-gray-900" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeImage(index);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-2 bg-red-600 rounded-full hover:bg-red-700 transition-all"
                                            >
                                                <Trash2 className="w-5 h-5 text-white" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Fullscreen Image Dialog */}
                        {selectedImage !== null && (
                            <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
                                <div className="relative max-w-6xl w-full h-[90%] flex flex-col items-center">
                                    {/* Close Button */}
                                    <button
                                        className="absolute top-4 right-4 p-2 bg-black/60 rounded-full hover:bg-black/80"
                                        onClick={() => setSelectedImage(null)}
                                    >
                                        <X className="w-6 h-6 text-white" />
                                    </button>

                                    {/* Left Arrow */}
                                    {images.length > 1 && (
                                        <button
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/60 rounded-full hover:bg-black/80"
                                            onClick={goPrev}
                                        >
                                            <ChevronLeft className="w-8 h-8 text-white" />
                                        </button>
                                    )}

                                    {/* Right Arrow */}
                                    {images.length > 1 && (
                                        <button
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/60 rounded-full hover:bg-black/80"
                                            onClick={goNext}
                                        >
                                            <ChevronRight className="w-8 h-8 text-white" />
                                        </button>
                                    )}

                                    {/* Image */}
                                    <img
                                        src={images[selectedImage]}
                                        alt={`Preview ${selectedImage + 1}`}
                                        className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                                    />

                                    {/* Actions */}
                                    <div className="absolute bottom-6 flex gap-3">
                                        {selectedImage === 0 ? (
                                            <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded">
                                                Primary Image
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => setPrimaryImage(selectedImage)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                            >
                                                Set as Primary
                                            </button>
                                        )}
                                        <button
                                            onClick={() => removeImage(selectedImage)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Loading Overlay */}
                        {isUploading && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
                                    <p className="text-gray-700 dark:text-gray-200 font-medium">
                                        Processing images...
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                );
            }}
        />
    );
}
