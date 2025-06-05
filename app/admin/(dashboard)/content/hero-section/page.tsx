"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";

export default function HeroSectionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [heroData, setHeroData] = useState({
    title: "Welcome to Our Store",
    subtitle: "Discover amazing products at great prices",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    backgroundImage: "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  });

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Hero section updated",
        description: "Your changes have been saved successfully.",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Hero Section</h2>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Icons.check className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>
              Edit the hero section content and appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={heroData.title}
                onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                placeholder="Enter hero title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle</label>
              <Textarea
                value={heroData.subtitle}
                onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                placeholder="Enter hero subtitle"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Button Text</label>
              <Input
                value={heroData.buttonText}
                onChange={(e) => setHeroData({ ...heroData, buttonText: e.target.value })}
                placeholder="Enter button text"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Button Link</label>
              <Input
                value={heroData.buttonLink}
                onChange={(e) => setHeroData({ ...heroData, buttonLink: e.target.value })}
                placeholder="Enter button link"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Background Image URL</label>
              <Input
                value={heroData.backgroundImage}
                onChange={(e) => setHeroData({ ...heroData, backgroundImage: e.target.value })}
                placeholder="Enter image URL"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              Live preview of your hero section
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="relative h-[400px] rounded-lg overflow-hidden"
              style={{
                backgroundImage: `url(${heroData.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-6 text-center">
                <h1 className="text-4xl font-bold mb-4">{heroData.title}</h1>
                <p className="text-xl mb-8">{heroData.subtitle}</p>
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                  {heroData.buttonText}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}