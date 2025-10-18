"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { ShoppingBag, Eye, X, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/hooks/store/cart/use-cart"
import { useProductVariants } from "@/app/(user)/products/[id]/useProductVariants"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import type { Product } from "@/types"

export const ProductCard = ({ product }: { product: Product }) => {
    const { addItem } = useCartStore((state) => state)
    const { toast } = useToast()
    const [isHovered, setIsHovered] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [isAdded, setIsAdded] = useState(false)

    const { attributes, selections, selectedVariant, handleVariantChange } = useProductVariants(product)

    const currentPrice = selectedVariant?.price || product.price || 0
    const currentMrp = selectedVariant?.mrp || product.mrp || 0

    const handleAddToCart = () => {
        if (product.hasVariants && !selectedVariant) {
            toast({
                title: "Select variant",
                description: "Please select all options before adding to cart.",
                variant: "destructive",
            })
            return
        }

        addItem({
            product: {
                id: product._id,
                name: product.name,
                image: product.images[0],
                price: currentPrice,
                slug: "",
                mrp: currentMrp,
            },
            variant: {
                id: selectedVariant?._id || product._id,
                name: selectedVariant?.name || product.name,
                image: selectedVariant?.images[0] || product.images[0],
                price: currentPrice,
                optionValues: selectedVariant?.optionValues || {},
                stock: selectedVariant?.stock || 0,
                sku: selectedVariant?.sku || "",
            },
            hasVariants: product.hasVariants,
            quantity: 1,
            priceForTotal: currentPrice,
        })

        toast({
            title: "Added to cart",
            description: `1 x ${product.name} added to cart.`,
        })

        setIsDrawerOpen(false)
    }

    const handleAddToCartClick = async () => {
        if (!product.hasVariants && product.variants?.length === 0) {
            setIsAddingToCart(true)
            handleAddToCart()

            setTimeout(() => {
                setIsAddingToCart(false)
                setIsAdded(true)
                setTimeout(() => setIsAdded(false), 2000)
            }, 600)
        } else {
            setIsDrawerOpen(true)
        }
    }

    return (
        <>
            <Card className="overflow-hidden group relative">
                {/* Product Image & Quick Actions */}
                <div
                    className="relative aspect-square overflow-hidden bg-secondary/20"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <Link href={`/products/${product._id}`} className="block h-full">
                        <div
                            className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: `url(${product.images[0]})` }}
                        />

                        {/* Product badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.isNewProduct && <Badge className="bg-primary text-primary-foreground">New</Badge>}
                            {product.isSale && <Badge className="bg-destructive text-destructive-foreground">Sale</Badge>}
                        </div>

                        {/* Quick action buttons (hover overlay) */}
                        <div
                            className={`absolute inset-0 bg-black/30 flex items-center justify-center gap-3 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            <Button
                                className="inline-flex items-center justify-center rounded-full p-2 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                aria-label="Quick view product"
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        </div>
                    </Link>
                </div>

                {/* Product Info */}
                <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">{product?.category?.name}</div>
                    <h3 className="font-medium mt-1 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                            {product.mrp ? (
                                <>
                                    <span className="font-semibold text-lg">{formatCurrency(product.price)}</span>
                                    <span className="text-muted-foreground line-through text-sm">{formatCurrency(product.mrp)}</span>
                                </>
                            ) : (
                                <span className="font-semibold text-lg">{formatCurrency(product.price)}</span>
                            )}
                        </div>
                        {product.rating && product.reviews && (
                            <div className="text-sm text-muted-foreground">
                                ★ {product.rating} ({product.reviews})
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                    <Button
                        variant="outline"
                        className="w-full transition-all hover:bg-yellow-400 hover:text-black bg-transparent"
                        onClick={handleAddToCartClick}
                        disabled={isAddingToCart || isAdded}
                        aria-label="Add to cart"
                    >
                        <AnimatePresence mode="wait">
                            {isAdded ? (
                                <motion.div
                                    key="added"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    className="flex items-center"
                                >
                                    <Check className="h-4 w-4 mr-2" />
                                    Added!
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="add"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center"
                                >
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Button>
                </CardFooter>
            </Card>

            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetContent
                    side="right"
                    className="w-full sm:max-w-md flex flex-col"
                    aria-describedby="variant-selection-description"
                >
                    <SheetHeader className="space-y-4">
                        <SheetTitle className="text-2xl font-semibold text-balance">Select Options</SheetTitle>
                        <SheetDescription id="variant-selection-description">
                            Choose your preferred options for this product
                        </SheetDescription>

                        {/* Product preview in drawer */}
                        <div className="flex gap-4 p-4 bg-secondary/30 rounded-lg">
                            <div
                                className="w-20 h-20 rounded-md bg-cover bg-center flex-shrink-0"
                                style={{ backgroundImage: `url(${product.images[0]})` }}
                                role="img"
                                aria-label={product.name}
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium line-clamp-2 text-sm">{product.name}</h4>
                                <div className="text-sm text-muted-foreground mt-1">{product?.category?.name}</div>
                            </div>
                        </div>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto py-6 space-y-6">
                        {attributes.length > 0 ? (
                            attributes.map((attr) => (
                                <div key={attr.name} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-semibold capitalize">{attr.name}</label>
                                        {selections[attr.name] && (
                                            <span className="text-xs text-muted-foreground">Selected: {selections[attr.name]}</span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {attr.options.map((opt) => {
                                            const isSelected = selections[attr.name] === opt.value
                                            const isDisabled = opt.stock <= 0

                                            return (
                                                <Button
                                                    key={opt.value}
                                                    size="sm"
                                                    variant={isSelected ? "default" : "outline"}
                                                    disabled={isDisabled}
                                                    className={`
                            relative transition-all duration-200
                            ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}
                            ${isDisabled ? "opacity-40 cursor-not-allowed" : "hover:scale-105"}
                            ${attr.type === "color" ? "w-10 h-10 p-0 rounded-full" : "min-w-[60px]"}
                          `}
                                                    style={
                                                        attr.type === "color"
                                                            ? {
                                                                backgroundColor: opt.color,
                                                                border: isSelected ? "2px solid currentColor" : "1px solid #e5e7eb",
                                                            }
                                                            : {}
                                                    }
                                                    onClick={() =>
                                                        !isDisabled &&
                                                        handleVariantChange(selectedVariant, {
                                                            ...selections,
                                                            [attr.name]: opt.value,
                                                        })
                                                    }
                                                    aria-label={`${attr.name}: ${opt.label}${isDisabled ? " (out of stock)" : ""}`}
                                                    aria-pressed={isSelected}
                                                >
                                                    {attr.type === "color" ? (
                                                        <>
                                                            {isSelected && <Check className="h-4 w-4 text-white drop-shadow-md" />}
                                                            {isDisabled && <X className="h-4 w-4 text-white drop-shadow-md" />}
                                                        </>
                                                    ) : (
                                                        <span className="text-sm">{opt.label}</span>
                                                    )}
                                                </Button>
                                            )
                                        })}
                                    </div>

                                    {/* Stock indicator */}
                                    {selections[attr.name] && (
                                        <div className="text-xs text-muted-foreground">
                                            {attr.options.find((o) => o.value === selections[attr.name])?.stock || 0} in stock
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-muted-foreground py-8">No variants available for this product</div>
                        )}
                    </div>

                    <SheetFooter className="border-t pt-4 space-y-4">
                        {/* Price display with animation */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPrice}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center justify-between w-full"
                            >
                                <span className="text-sm text-muted-foreground">Total Price:</span>
                                <div className="flex items-center gap-2">
                                    {currentMrp > currentPrice && (
                                        <span className="text-sm text-muted-foreground line-through">{formatCurrency(currentMrp)}</span>
                                    )}
                                    <span className="text-2xl font-bold">{formatCurrency(currentPrice)}</span>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Add to cart button */}
                        <Button
                            className="w-full h-12 text-base font-semibold"
                            onClick={handleAddToCart}
                            disabled={product.hasVariants && !selectedVariant}
                            aria-label="Confirm and add to cart"
                        >
                            <ShoppingBag className="h-5 w-5 mr-2" />
                            {product.hasVariants && !selectedVariant ? "Select All Options" : "Add to Cart"}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    )
}
