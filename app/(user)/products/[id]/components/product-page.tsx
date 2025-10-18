"use client"
import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "@/hooks/store/cart/use-cart";
import { toast } from "@/hooks/use-toast";
import { VariantSelector } from "@/components/shop/variant-selector";
import { useGetProduct } from "@/lib/react-query/public/query";
import { useProductVariants } from "../useProductVariants";
import { useQuantity } from "../useQuantity";
import { ProductImageGallery } from "./product-image-gallery";
import { ProductInfo } from "./product-info";
import AddToCartButton from "./add-to-cart";
import QuantitySelector from "./quantity-selector";
import ProductDetails from "../product-details";
import { Loader2Icon } from "lucide-react";


const ProductDetail = ({ id }: { id: string }) => {

    const { isLoading, isError, data, isFetched } = useGetProduct(id)
    const { addItem } = useCartStore((state) => state);
    const [selectedImage, setSelectedImage] = useState(0);

    const product = useMemo(() => {
        if (!data || !data.data) {
            return null;
        }
        return data.data;
    }, [data]);

    const {
        selectedVariant,
        attributes,
        handleVariantChange,
    } = useProductVariants(product);

    const stockAvailable = product && product.hasVariants ? selectedVariant?.stock || 0 : product?.stock || 0
    const {
        quantity,
        incrementQuantity,
        decrementQuantity,
        resetQuantity,
    } = useQuantity(stockAvailable);

    // Reset quantity and selected image when variant changes
    useEffect(() => {
        if (selectedVariant) {
            resetQuantity();
            setSelectedImage(0);
        }
    }, [selectedVariant?._id, resetQuantity, selectedVariant]);
    // Reset selected image when product changes
    useEffect(() => {
        setSelectedImage(0);
    }, [product]);

    const handleAddToCart = () => {
        if (product.hasVariants && !selectedVariant) {
            toast({
                title: "Please select a variant",
                description: "You need to choose a valid combination.",
                variant: "destructive",
            });
            return;
        }

        if (stockAvailable <= 0) {
            toast({
                title: "Out of stock",
                description: "This product is currently not available.",
                variant: "destructive",
            });
            return;
        }

        addItem({
            product: {
                id: product._id,
                name: product.name,
                image: product.images[0],
                price: product.price || 0,
                slug: "",
                mrp: product.mrp || 0,
            },
            variant: selectedVariant ? {
                id: selectedVariant._id.toString(),
                price: selectedVariant.price,
                image: selectedVariant.images?.[0] || product.images[0],
                stock: selectedVariant.stock,
                optionValues: selectedVariant.optionValues,
                name: selectedVariant.name,
                sku: selectedVariant.sku,
            } : undefined,
            quantity,
            priceForTotal: selectedVariant?.price || product.price || 0,
            hasVariants: product.hasVariants
        });

        toast({
            title: "Added to cart",
            description: `${quantity} x ${product.name}${selectedVariant ? ` (${selectedVariant.name})` : ""
                } added.`,
        });
    };

    if (!isLoading && !product) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center text-gray-500">Product not found</div>
            </div>
        );
    }
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2Icon className="animate-spin size-6" />
            </div>
        );
    }

    const images = selectedVariant?.images?.length
        ? selectedVariant.images
        : product.images;
    const price = selectedVariant?.price ?? product.price ?? 0;


    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center text-gray-500">Loading product...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center text-red-500">Error loading product</div>
            </div>
        );
    }

    if (isFetched && !product) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center text-gray-500">Product not found</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-2">
                {/* Image Gallery */}
                <div className="w-full">
                    <ProductImageGallery
                        images={images}
                        productName={product.name}
                        selectedImage={selectedImage}
                        onImageSelect={setSelectedImage}
                    />
                </div>

                {/* Product Details */}
                <div className="w-full space-y-6">
                    <ProductInfo
                        product={product}
                        selectedVariant={selectedVariant}
                        price={price}
                    />

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <QuantitySelector
                            quantity={quantity}
                            maxQuantity={stockAvailable}
                            onIncrement={incrementQuantity}
                            onDecrement={decrementQuantity}
                        />
                    </div>

                    {product.hasVariants && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <VariantSelector
                                attributes={attributes}
                                variants={product.variants}
                                selectedVariant={selectedVariant}
                                onVariantChange={handleVariantChange}
                                showPricing={false}
                                showStock
                            />
                        </div>
                    )}

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">

                        <AddToCartButton
                            product={product}
                            selectedVariant={selectedVariant}
                            quantity={quantity}
                            stockAvailable={stockAvailable}
                            onAddToCart={handleAddToCart}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-8">

                <ProductDetails product={product} selectedVariant={selectedVariant} />
            </div>
        </div>
    );
};

export default ProductDetail;