import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IVariant } from '@/lib/db/models/product'
import { capitalizeFirstLetter } from '@/lib/utils'
import { Product } from '@/types'
import React from 'react'

const ProductDetails = ({ product, selectedVariant }: { product: Product, selectedVariant: IVariant | null }) => {

    const renderFeatures = () => {
        const features =
            selectedVariant?.attributes && selectedVariant?.attributes?.length > 0
                ? selectedVariant.attributes
                : product?.specifications?.length > 0
                    ? product.specifications
                    : null;

        if (!features) return null;

        return (
            <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {features.map((spec, index) => (
                        <li key={index}>
                            <span className="font-semibold">
                                {capitalizeFirstLetter(spec.name)}
                            </span>
                            <span className="ml-2">
                                {capitalizeFirstLetter(spec.value)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };


    return (
        <div className="mt-16">
            <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Product Details</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="p-6 border rounded-b-lg mt-2">
                    <div className="space-y-4">
                        {/* show html content */}
                        {product?.description && (
                            <div dangerouslySetInnerHTML={{ __html: product.description }} />
                        )}

                        {renderFeatures()}
                    </div>

                </TabsContent>
                <TabsContent value="reviews" className="p-6 border rounded-b-lg mt-2">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">Customer Reviews</h3>
                                <div className="flex items-center mt-1">
                                    <div className="flex items-center">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`h-5 w-5 ${i < Math.floor(product.rating)
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                                    }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="ml-2 text-sm text-muted-foreground">
                                        Based on {product.reviews} reviews
                                    </span>
                                </div>
                            </div>
                            <Button>Write a Review</Button>
                        </div>

                        <Separator />

                        {/* Mock reviews */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium">Excellent quality</h4>
                                    <div className="flex">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <svg
                                                key={i}
                                                className="h-4 w-4 text-yellow-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    by Michael S. on May 12, 2025
                                </div>
                                <p className="mt-3 text-muted-foreground">
                                    The quality of this product exceeded my expectations. The fabric is soft yet durable, and the fit is perfect.
                                    I have received several compliments when wearing it. Highly recommend!
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium">Great value for the price</h4>
                                    <div className="flex">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <svg
                                                key={i}
                                                className="h-4 w-4 text-yellow-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                        <svg
                                            className="h-4 w-4 text-gray-300"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    by Jennifer L. on April 28, 2025
                                </div>
                                <p className="mt-3 text-muted-foreground">
                                    This item is exactly as described. The material is good quality for the price point.
                                    Sizing runs slightly large, so I wouldd recommend ordering a size down if you are between sizes.
                                </p>
                            </div>

                            <div className="text-center mt-8">
                                <Button variant="outline">Read More Reviews</Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default ProductDetails