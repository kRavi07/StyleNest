"use client";

import { FC } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
    selectedImage: number;
    onImageSelect: (index: number) => void;
}

export const ProductImageGallery: FC<ProductImageGalleryProps> = ({
    images,
    productName,
    selectedImage,
    onImageSelect,
}) => {
    if (!images || images.length === 0) {
        return (
            <div className="space-y-4">
                <div className="relative aspect-square w-full max-w-lg mx-auto overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Image
                        src="https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt={productName}
                        fill
                        className="object-cover object-center"
                        priority
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative aspect-square w-full max-w-lg mx-auto overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <Image
                    src={"https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                    alt={productName}
                    fill
                    className="object-cover object-center"
                    priority
                />
            </div>

            {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-w-lg mx-auto">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg border transition-all duration-200 hover:opacity-75 ${selectedImage === index
                                ? "border-blue-500 ring-2 ring-blue-500 dark:border-blue-400 dark:ring-blue-400"
                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                }`}
                            onClick={() => onImageSelect(index)}
                        >
                            <Image
                                src={"https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                                alt={`${productName} - Image ${index + 1}`}
                                fill
                                className="object-cover object-center"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};