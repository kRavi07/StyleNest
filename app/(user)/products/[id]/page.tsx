"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  ArrowLeftRight,
  Minus,
  Plus,
  Heart,
  Share2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product, Variant } from "@/types";
import ProductGrid from "@/components/shop/ProductGrid";
import { useGetProduct } from "@/lib/react-query/public/query";
import { VariantSelector } from "@/components/shop/variant-selector";
import { buildAttributesFromOptionTypes } from "@/lib/utils/variant-combination";
import ProductPrice from "./product-price";
import ProductDetails from "./product-details";
import { useCartStore } from "@/hooks/store/cart/use-cart";



export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { addItem } = useCartStore((state) => state)

  const productId = params.id as string;
  const { data, isLoading } = useGetProduct(productId);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);



  const product = data && data.data ? data.data[0] : null;


  const handleVariantChange = (variant: Variant | null, selections: Record<string, string>) => {
    setSelectedVariant(variant);
    setSelections(selections);
  };

  const attributes = useMemo(
    () => product && buildAttributesFromOptionTypes(product?.optionTypes, product?.variants),
    [product]
  );


  const defaultSelections = useMemo(() => {
    const selections: Record<string, string> = {};
    if (attributes) {
      for (const attr of attributes) {
        const available = attr.options.find(opt => opt.stock !== 0);
        if (available) selections[attr.name] = available.value;
      }
      return selections;
    }
  }, [attributes]);

  const [selections, setSelections] = useState<Record<string, string>>(defaultSelections);









  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );

  // If product doesn't exist, show not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button onClick={() => router.push('/products')}>
          Back to Products
        </Button>
      </div>
    );
  }

  const incrementQuantity = () => {
    if (quantity < product.inventory) {
      setQuantity(quantity + 1);
    } else {
      toast({
        title: "Maximum quantity reached",
        description: `Only ${product.inventory} items available in stock.`,
        variant: "destructive",
      });
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedColor && product.colors.length > 0) {
      toast({
        title: "Please select a color",
        description: "You need to select a color before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    addItem(product, quantity, selectedSize, selectedColor);
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
  };

  // Related products (excluding current product)
  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p._id !== product.id)
    .slice(0, 4);

  console.log(product);

  if (isLoading && !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  if (!product && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button onClick={() => router.push('/products')}>
          Back to Products
        </Button>
      </div>
    );
  }



  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted/20">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{
                backgroundImage: `url( "https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")`
              }}
            />
          </div>

          {/* Image gallery */}
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md ${selectedImage === index ? "ring-2 ring-primary" : "ring-1 ring-muted"
                    }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url( "https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")`
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              {product.isNewProduct && (
                <Badge className="bg-primary text-primary-foreground">New</Badge>
              )}
              {product.isSale && (
                <Badge className="bg-destructive text-destructive-foreground">Sale</Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold">{product.name}</h1>

            <div className="flex items-center space-x-2 mt-2">
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
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <div className="mt-4">

              <ProductPrice selectedVariant={selectedVariant} product={product} />

              <div className="text-sm text-muted-foreground mt-1">
                {product.inventory > 0 ? (
                  product.inventory < 10 ? (
                    <span className="text-amber-600">Only {product.inventory} left in stock</span>
                  ) : (
                    <span className="text-green-600">In Stock</span>
                  )
                ) : (
                  <span className="text-destructive">Out of Stock</span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <VariantSelector
                attributes={attributes}
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantChange={handleVariantChange}
                showPricing={false}
                showStock
              />
            </div>

            {/* Size selector 
            {product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Size</h3>
                  <button className="text-sm text-primary hover:underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      type="button"
                      variant={selectedSize === size ? "default" : "outline"}
                      className="h-10 w-14"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      type="button"
                      variant={selectedColor === color ? "default" : "outline"}
                      className="h-10"
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            Quantity selector */}
            <div>
              <h3 className="text-sm font-medium mb-2">Quantity</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.inventory}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="flex-1 bg-gold hover:bg-gold-soft"

              onClick={handleAddToCart}
              disabled={product.inventory <= 0}
            >
              Add to Cart
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-gold-soft hover:bg-gold-soft hover:text-black"
            >
              <Heart className="mr-2 h-4 w-4" />
              Add to Wishlist
            </Button>
          </div>

          <Separator />

          {/* Shipping and returns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-2">
              <Truck className="h-5 w-5 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Free Shipping</h4>
                <p className="text-xs text-muted-foreground">
                  Free standard shipping on orders over $100
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <ArrowLeftRight className="h-5 w-5 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Free Returns</h4>
                <p className="text-xs text-muted-foreground">
                  Return within 30 days for a full refund
                </p>
              </div>
            </div>
          </div>

          {/* Share buttons */}
          <div className="flex items-center space-x-4">
            <span className="text-sm">Share:</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product tabs */}

      <ProductDetails product={product} />

      {/* Related products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
        <ProductGrid products={relatedProducts} />
      </div>
    </div>
  );
}