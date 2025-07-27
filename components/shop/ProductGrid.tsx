"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/hooks/context/cart/cart-context";
import { useCartStore } from "@/hooks/store/cart/use-cart";

type ProductGridProps = {
  products: Product[];
};

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground text-center">
            No products found matching your criteria.
          </p>
          <Button variant="outline" className="mt-4">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCartStore((state) => state);
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
        <Link href={`/products/${product._id}`} className="block h-full">
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: `url(${"https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"})`
            }}
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
              <Link href={`/products/${product._id}`} as={"button"}>
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
        <div className="text-sm text-muted-foreground">{product.category.name}</div>
        <h3 className="font-medium mt-1 line-clamp-1">
          <Link href={`/products/${product._id}`}>{product.name}</Link>
        </h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            {product.mrp ? (
              <>
                <span className="font-medium">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-muted-foreground line-through text-sm">
                  {formatCurrency(product.mrp)}
                </span>
              </>
            ) : (
              <span className="font-medium">{
                formatCurrency(product.price)
              }</span>
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
          className="w-full transition-all hover:bg-gold-accent hover:text-primary-foreground"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductGrid;