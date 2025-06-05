import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const TrendingSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Trending Now</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the latest fashion trends curated for the season
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trending Item 1 */}
          <div className="group relative overflow-hidden rounded-lg bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              <div className="p-8 flex flex-col justify-center">
                <div className="text-sm font-medium text-primary mb-2">New Collection</div>
                <h3 className="text-2xl font-bold mb-4">Summer Essentials</h3>
                <p className="text-muted-foreground mb-6">
                  Lightweight fabrics and versatile pieces perfect for warmer days.
                </p>
                <Button className="w-fit" asChild>
                  <Link href="/products?collection=summer">
                    Shop Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="relative aspect-square md:aspect-auto overflow-hidden">
                <div 
                  className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ 
                    backgroundImage: "url(https://images.pexels.com/photos/6347546/pexels-photo-6347546.jpeg?auto=compress&cs=tinysrgb&w=600)" 
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Trending Item 2 */}
          <div className="group relative overflow-hidden rounded-lg bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              <div className="order-2 md:order-1 relative aspect-square md:aspect-auto overflow-hidden">
                <div 
                  className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ 
                    backgroundImage: "url(https://images.pexels.com/photos/2896840/pexels-photo-2896840.jpeg?auto=compress&cs=tinysrgb&w=600)" 
                  }}
                />
              </div>
              <div className="order-1 md:order-2 p-8 flex flex-col justify-center">
                <div className="text-sm font-medium text-primary mb-2">Limited Edition</div>
                <h3 className="text-2xl font-bold mb-4">Sustainable Collection</h3>
                <p className="text-muted-foreground mb-6">
                  Eco-friendly materials with modern designs for conscious fashion.
                </p>
                <Button className="w-fit" asChild>
                  <Link href="/products?collection=sustainable">
                    Explore More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;