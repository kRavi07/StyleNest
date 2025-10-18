"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types";

type ProductGridProps = {
  products: Product[];
};

const ProductGrid = ({ products }: ProductGridProps) => {


  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground text-center">No products available.</p>
        <Button variant="outline" className="mt-4">
          <Link href="/products">View All Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.length > 0 ? (
        products.map((product) => (
          product != undefined &&
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





export default ProductGrid;