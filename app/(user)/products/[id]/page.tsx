"use client";

import { useState } from "react";
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
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/types";
import ProductGrid from "@/components/shop/ProductGrid";

// Mock product data - would come from API in real app
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Classic Oxford Shirt",
    description: "Timeless oxford shirt crafted from premium cotton. Features a button-down collar, regular fit, and made from breathable, long-lasting fabric. Perfect for both casual and semi-formal occasions. This versatile piece can be dressed up with a blazer or worn casually with jeans.",
    price: 89.99,
    category: "men",
    subcategory: "shirts",
    images: [
      "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/6774442/pexels-photo-6774442.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    inventory: 25,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Blue", "Gray"],
    featured: true,
    rating: 4.8,
    reviews: 124,
    isNewProduct: false,
    isSale: false
  },
  {
    id: "2",
    name: "Slim Fit Chinos",
    description: "Modern slim fit chinos perfect for any occasion",
    price: 69.99,
    category: "men",
    subcategory: "pants",
    images: ["https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=600"],
    inventory: 18,
    sizes: ["30", "32", "34", "36"],
    colors: ["Khaki", "Navy", "Olive"],
    featured: true,
    rating: 4.6,
    reviews: 98,
    isNewProduct: true,
    isSale: false
  },
  {
    id: "3",
    name: "Relaxed Linen Dress",
    description: "Elegant and comfortable linen dress for summer days",
    price: 129.99,
    originalPrice: 159.99,
    category: "women",
    subcategory: "dresses",
    images: ["https://images.pexels.com/photos/6192372/pexels-photo-6192372.jpeg?auto=compress&cs=tinysrgb&w=600"],
    inventory: 12,
    sizes: ["XS", "S", "M", "L"],
    colors: ["White", "Beige", "Light Blue"],
    featured: true,
    rating: 4.9,
    reviews: 87,
    isNewProduct: false,
    isSale: true
  },
  {
    id: "4",
    name: "Structured Blazer",
    description: "Tailored blazer with modern silhouette",
    price: 199.99,
    category: "women",
    subcategory: "jackets",
    images: ["https://images.pexels.com/photos/8386654/pexels-photo-8386654.jpeg?auto=compress&cs=tinysrgb&w=600"],
    inventory: 8,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Navy", "Gray"],
    featured: true,
    rating: 4.7,
    reviews: 56,
    isNewProduct: true,
    isSale: false
  }
];

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { addItem } = useCart();

  const productId = params.id as string;
  const product = mockProducts.find(p => p.id === productId);

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
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted/20">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${product.images[selectedImage]})` }}
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
                    style={{ backgroundImage: `url(${image})` }}
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
              <div className="flex items-center space-x-2">
                {product.originalPrice ? (
                  <>
                    <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                    <span className="text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <Badge className="bg-destructive text-destructive-foreground">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  </>
                ) : (
                  <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                )}
              </div>

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
              <h3 className="text-sm font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Size selector */}
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

            {/* Color selector */}
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

            {/* Quantity selector */}
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
              className="flex-1"
              size="lg"
              onClick={handleAddToCart}
              disabled={product.inventory <= 0}
            >
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
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
      <div className="mt-16">
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="p-6 border rounded-b-lg mt-2">
            <div className="space-y-4">
              <h3 className="font-medium">Features</h3>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>High-quality material for durability and comfort</li>
                <li>Carefully crafted with attention to detail</li>
                <li>Versatile design suitable for multiple occasions</li>
                <li>Easy care instructions for long-lasting wear</li>
              </ul>

              <h3 className="font-medium mt-6">Materials & Care</h3>
              <p className="text-muted-foreground">
                100% Premium Cotton. Machine wash cold with similar colors. Tumble dry low. Do not bleach.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="p-6 border rounded-b-lg mt-2">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Shipping</h3>
                <p className="text-muted-foreground mt-2">
                  We offer free standard shipping on all orders over $100. For orders under $100, standard shipping is $5.99.
                  Expedited shipping options are available at checkout.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground mt-2">
                  <li>Standard Shipping: 3-5 business days</li>
                  <li>Express Shipping: 2-3 business days</li>
                  <li>Overnight Shipping: Next business day</li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="font-medium">Returns</h3>
                <p className="text-muted-foreground mt-2">
                  We want you to be completely satisfied with your purchase. If for any reason you are not happy,
                  you can return your order within 30 days of delivery for a full refund or exchange.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground mt-2">
                  <li>Items must be unworn, unwashed, and unaltered</li>
                  <li>Original tags must be attached</li>
                  <li>Include the original packaging if possible</li>
                </ul>
              </div>
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

      {/* Related products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
        <ProductGrid products={relatedProducts} />
      </div>
    </div>
  );
}