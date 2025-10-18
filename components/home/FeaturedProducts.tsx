"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { useGetFeaturedProducts } from "@/lib/react-query/public/query";
import ProductGridSkeleton from "../skeleton/ProductList";
import { ProductCard } from "../shop/ProductCard";



const FeaturedProducts = () => {

  const { isLoading, data: featuredProducts, isError } = useGetFeaturedProducts()

  if (isLoading) {
    return <ProductGridSkeleton />
  }

  if (isError) {
    return null;
  }

  if (!featuredProducts || featuredProducts?.data || featuredProducts?.data === undefined || featuredProducts?.data.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="container md:mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium clothing and accessories
          </p>
        </div>

        <div className="flex justify-center mb-8">

          {/*<Tabs defaultValue="all" className="w-full">
         <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="men">Men</TabsTrigger>
              <TabsTrigger value="women">Women</TabsTrigger>
              <TabsTrigger value="accessories">Accessories</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">

          </TabsContent></Tabs>*/}
          <div className="grid grid-cols-1 min-[410px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts?.data.map((product: Product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>


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