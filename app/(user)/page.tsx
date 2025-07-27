import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategorySection from "@/components/home/CategorySection";
import Newsletter from "@/components/home/Newsletter";
import TrendingSection from "@/components/home/TrendingSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StyleNest | Premium Clothing Store",
  description: "Discover the latest fashion trends and premium clothing at StyleNest. Shop now for exclusive styles and quality apparel.",
};

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <TrendingSection />
      <Newsletter />
    </div>
  );
}