"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/context/cart/cart-context";
import { useCartStore } from "@/hooks/store/cart/use-cart";

// Mock data - would come from API in real app
const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Classic Oxford Shirt",
    description: "Timeless oxford shirt crafted from premium cotton",
    price: 89.99,
    category: "men",
    subcategory: "shirts",
    images: ["https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600"],
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
  },
  {
    id: "5",
    name: "Leather Crossbody Bag",
    description: "Handcrafted leather crossbody bag with adjustable strap",
    price: 149.99,
    category: "accessories",
    subcategory: "bags",
    images: ["https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600"],
    inventory: 15,
    sizes: [],
    colors: ["Black", "Brown", "Tan"],
    featured: true,
    rating: 4.8,
    reviews: 112,
    isNewProduct: false,
    isSale: false
  },
  {
    id: "6",
    name: "Knit Beanie",
    description: "Cozy knit beanie made from sustainable materials",
    price: 34.99,
    originalPrice: 45.99,
    category: "accessories",
    subcategory: "hats",
    images: ["https://images.pexels.com/photos/2457278/pexels-photo-2457278.jpeg?auto=compress&cs=tinysrgb&w=600"],
    inventory: 30,
    sizes: ["One Size"],
    colors: ["Black", "Gray", "Navy", "Burgundy"],
    featured: true,
    rating: 4.5,
    reviews: 78,
    isNewProduct: false,
    isSale: true
  }
];

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCartStore((state) => state)
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    addItem(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`
    });
  };

  return (
    <Card className="overflow-hidden group">
      <div
        className="relative aspect-square overflow-hidden bg-secondary/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/products/${product.id}`} className="block h-full">
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${product.images[0]})` }}
          />

          {/* Product badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNewProduct && (
              <Badge className="bg-primary text-primary-foreground">New</Badge>
            )}
            {product.isSale && (
              <Badge className="bg-destructive text-destructive-foreground">Sale</Badge>
            )}
          </div>

          {/* Quick actions */}
          <div
            className={`absolute inset-0 bg-black/30 flex items-center justify-center gap-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <Button size="icon" variant="secondary" className="rounded-full" onClick={(e) => e.preventDefault()}>
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full" asChild>
              <Link href={`/products/${product.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full"
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>
        </Link>
      </div>

      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{product.category}</div>
        <h3 className="font-medium mt-1 line-clamp-1">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            {product.originalPrice ? (
              <>
                <span className="font-medium">${product.price.toFixed(2)}</span>
                <span className="text-muted-foreground line-through text-sm">
                  ${product.originalPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-medium">${product.price.toFixed(2)}</span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            ★ {product.rating} ({product.reviews})
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          variant="outline"
          className="w-full transition-all  hover:bg-gold-accent  hover:text-primary-foreground"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

const FeaturedProducts = () => {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium clothing and accessories
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="men">Men</TabsTrigger>
              <TabsTrigger value="women">Women</TabsTrigger>
              <TabsTrigger value="accessories">Accessories</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="men" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts
                .filter((product) => product.category === "men")
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="women" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts
                .filter((product) => product.category === "women")
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="accessories" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts
                .filter((product) => product.category === "accessories")
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <Button size="lg" className="bg-gold hover:bg-gold-accent text-primary-foreground" asChild>
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;