"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { X } from "lucide-react";

type FiltersProps = {
  filters: {
    category: string;
    priceRange: number[];
    sortBy: string;
    onlyInStock: boolean;
    onlySale: boolean;
    onlyNew: boolean;
    colors: string[];
    sizes: string[];
  };
  onChange: (name: string, value: any) => void;
  onClear: () => void;
};

const allColors = [
  "Black", "White", "Gray", "Navy", "Blue", "Green", "Red", "Pink", 
  "Purple", "Yellow", "Orange", "Brown", "Beige", "Khaki", "Olive", 
  "Burgundy", "Tan", "Gold", "Silver"
];

const allSizes = [
  "XS", "S", "M", "L", "XL", "XXL",
  "28", "30", "32", "34", "36", "38", "40", "42",
  "One Size"
];

const ProductFilters = ({ filters, onChange, onClear }: FiltersProps) => {
  const [localPriceRange, setLocalPriceRange] = useState(filters.priceRange);
  
  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange(value);
  };
  
  const applyPriceRange = () => {
    onChange("priceRange", localPriceRange);
  };
  
  const handleColorToggle = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    onChange("colors", newColors);
  };
  
  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    onChange("sizes", newSizes);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Filters</h2>
        {Object.values(filters).some(val => {
          if (Array.isArray(val)) {
            return val.length > 0 || (val.length === 2 && (val[0] > 0 || val[1] < 500));
          }
          return val !== 'all' && val !== 'featured' && val !== false;
        }) && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear All
            <X className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-sm font-medium mb-3">Category</h3>
        <RadioGroup 
          value={filters.category}
          onValueChange={value => onChange("category", value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="category-all" />
            <Label htmlFor="category-all">All Products</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="men" id="category-men" />
            <Label htmlFor="category-men">Men</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="women" id="category-women" />
            <Label htmlFor="category-women">Women</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="accessories" id="category-accessories" />
            <Label htmlFor="category-accessories">Accessories</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-sm font-medium mb-3">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={localPriceRange}
            min={0}
            max={500}
            step={10}
            onValueChange={handlePriceChange}
            onValueCommit={applyPriceRange}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm">${localPriceRange[0]}</span>
            <span className="text-sm">${localPriceRange[1]}</span>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-sm font-medium mb-3">Sort By</h3>
        <RadioGroup 
          value={filters.sortBy}
          onValueChange={value => onChange("sortBy", value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="featured" id="sort-featured" />
            <Label htmlFor="sort-featured">Featured</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price-low-high" id="sort-price-low" />
            <Label htmlFor="sort-price-low">Price: Low to High</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price-high-low" id="sort-price-high" />
            <Label htmlFor="sort-price-high">Price: High to Low</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="newest" id="sort-newest" />
            <Label htmlFor="sort-newest">Newest</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rating" id="sort-rating" />
            <Label htmlFor="sort-rating">Highest Rated</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium mb-1">Options</h3>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="in-stock" 
            checked={filters.onlyInStock}
            onCheckedChange={checked => onChange("onlyInStock", !!checked)}
          />
          <Label htmlFor="in-stock">In Stock Only</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="on-sale" 
            checked={filters.onlySale}
            onCheckedChange={checked => onChange("onlySale", !!checked)}
          />
          <Label htmlFor="on-sale">On Sale</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="new-arrivals" 
            checked={filters.onlyNew}
            onCheckedChange={checked => onChange("onlyNew", !!checked)}
          />
          <Label htmlFor="new-arrivals">New Arrivals</Label>
        </div>
      </div>
      
      <Separator />
      
      <Accordion type="multiple" defaultValue={["colors", "sizes"]}>
        <AccordionItem value="colors">
          <AccordionTrigger>Colors</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              {allColors.map(color => (
                <div key={color} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`color-${color.toLowerCase()}`} 
                    checked={filters.colors.includes(color)}
                    onCheckedChange={() => handleColorToggle(color)}
                  />
                  <Label htmlFor={`color-${color.toLowerCase()}`}>{color}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="sizes">
          <AccordionTrigger>Sizes</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              {allSizes.map(size => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`size-${size.toLowerCase().replace(" ", "-")}`} 
                    checked={filters.sizes.includes(size)}
                    onCheckedChange={() => handleSizeToggle(size)}
                  />
                  <Label htmlFor={`size-${size.toLowerCase().replace(" ", "-")}`}>{size}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductFilters;