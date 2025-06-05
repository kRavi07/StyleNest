"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const heroSlides = [
  {
    id: 1,
    imageUrl: "https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1800",
    title: "Summer Collection 2025",
    subtitle: "Discover the latest trends in summer fashion",
    cta: "Shop Collection",
    ctaLink: "/products?collection=summer",
    position: "center"
  },
  {
    id: 2,
    imageUrl: "https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=1800",
    title: "Premium Essentials",
    subtitle: "Timeless pieces crafted with quality materials",
    cta: "Explore Now",
    ctaLink: "/products?category=essentials",
    position: "left"
  },
  {
    id: 3,
    imageUrl: "https://images.pexels.com/photos/6774442/pexels-photo-6774442.jpeg?auto=compress&cs=tinysrgb&w=1800",
    title: "Sustainable Fashion",
    subtitle: "Eco-friendly clothing for a better tomorrow",
    cta: "Learn More",
    ctaLink: "/sustainability",
    position: "right"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsTransitioning(false);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] overflow-hidden">
      <div
        className={cn(
          "absolute inset-0 w-full h-full transition-opacity duration-1000",
          isTransitioning ? "opacity-30" : "opacity-100"
        )}
        style={{
          backgroundImage: `url(${slide.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: `center ${slide.position === "center" ? "center" : slide.position}`,
        }}
      />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div
          className={cn(
            "max-w-2xl text-white transition-all duration-700",
            isTransitioning ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0",
            slide.position === "center" ? "mx-auto text-center" : "",
            slide.position === "right" ? "ml-auto text-right" : ""
          )}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            {slide.title}
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            {slide.subtitle}
          </p>
          <Button size="lg" className="bg-gold hover:bg-gold-accent" asChild>
            <Link href={slide.ctaLink}>
              {slide.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentSlide(i);
                setIsTransitioning(false);
              }, 500);
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentSlide === i
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;