import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { Metadata } from "next";
import { BrandStory } from "@/components/home/brand-story";
import { Moodboard } from "@/components/home/moodboard";
import { WaitiListForm } from "@/components/common/waitlist-form";
import FeaturesSection from "@/components/common/feature-section";

export const metadata: Metadata = {
  title: "Drimcot Trends | Premium Clothing Store",
  description: "Discover the latest fashion trends and premium clothing at Drimcot Trends. Shop now for exclusive styles and quality apparel.",
};

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      {/*<CategorySection />*/}
      <FeaturesSection />
      <BrandStory />
      <FeaturedProducts />
      <Moodboard />
      <WaitiListForm />
    </div>
  );
}