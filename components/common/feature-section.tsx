"use client";

import Image from "next/image";

interface Feature {
    title: string;
    description: string;
    imageSrc: string; // URL or local path to your image
}

export default function FeaturesSection() {
    const features: Feature[] = [
        {
            title: "Made in India",
            description: "Proudly designed and manufactured in India.",
            imageSrc: "/images/made-india.png",
        },
        {
            title: "Free Shipping",
            description: "Free shipping on all orders.",
            imageSrc: "/images/free-delivery.png",
        },
        {
            title: "Eco-Friendly",
            description: "Sustainable and environmentally conscious materials.",
            imageSrc: "/images/eco-friendly.png",
        },
        {
            title: "7 Days Return",
            description: "Easy returns within 7 days of delivery.",
            imageSrc: "/images/7-days-return.png",
        },
    ];

    return (
        <section className="py-16">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-12">
                    Why Shop With Us
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center p-6  transition transform hover:-translate-y-1"
                        >
                            <div className="w-32 h-32 mb-4">
                                <Image
                                    src={feature.imageSrc}
                                    alt={feature.title}
                                    className="w-full h-full object-contain rounded-lg"
                                    width={100}
                                    height={100}
                                />
                            </div>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                                {feature.title}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-300 text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
