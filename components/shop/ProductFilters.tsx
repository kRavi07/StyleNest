"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  filters: Record<string, any>;
  filterAttributes: Record<string, string[]>; // dynamic specifications
  // eslint-disable-next-line no-unused-vars
  onChange: (key: string, value: any) => void;
  onClear: () => void;
  className?: string;
}

export default function ProductFilters({
  filters,
  filterAttributes,
  onChange,
  onClear,
  className,
}: ProductFiltersProps) {
  const [localPriceRange, setLocalPriceRange] = useState(filters.priceRange || [0, 5000]);

  useEffect(() => {
    setLocalPriceRange(filters.priceRange || [0, 5000]);
  }, [filters.priceRange]);

  const applyPriceRange = () => onChange("priceRange", localPriceRange);

  const toggleArrayFilter = (key: string, value: string) => {
    const arr: string[] = Array.isArray(filters[key]) ? filters[key] : [];
    const newArr = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
    onChange(key, newArr);
  };

  const hasActiveFilters = Object.entries(filters).some(([key, val]) => {
    if (["page", "limit"].includes(key)) return false;
    if (Array.isArray(val)) return val.length > 0;
    return val !== "all" && val !== "featured" && val !== false;
  });

  console.log(filterAttributes);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear All <X className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      {/* Category */}
      {filters.categories?.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">Category</h3>
          <RadioGroup value={filters.category} onValueChange={v => onChange("category", v)} className="space-y-2">
            {["all", ...filters.categories].map(c => (
              <div key={c} className="flex items-center space-x-2">
                <RadioGroupItem value={c} id={`category-${c}`} />
                <Label htmlFor={`category-${c}`}>{c}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      <Separator />

      {/* Price */}
      <div>
        <h3 className="text-sm font-medium mb-3">Price Range</h3>
        <Slider
          value={localPriceRange}
          min={0}
          max={5000}
          step={10}
          onValueChange={setLocalPriceRange}
          onValueCommit={applyPriceRange}
        />
        <div className="flex justify-between text-sm">
          <span>${localPriceRange[0]}</span>
          <span>${localPriceRange[1]}</span>
        </div>
      </div>

      <Separator />

      {/* Sort */}
      <div>
        <h3 className="text-sm font-medium mb-3">Sort By</h3>
        <RadioGroup value={filters.sortBy} onValueChange={v => onChange("sortBy", v)} className="space-y-2">
          {["featured", "price-low-high", "price-high-low", "newest", "rating"].map(s => (
            <div key={s} className="flex items-center space-x-2">
              <RadioGroupItem value={s} id={`sort-${s}`} />
              <Label htmlFor={`sort-${s}`}>{s.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      {/* Options */}
      <div className="space-y-2">
        {["onlyInStock", "onlySale", "onlyNew"].map(key => (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox id={key} checked={!!filters[key]} onCheckedChange={checked => onChange(key, !!checked)} />
            <Label htmlFor={key}>
              {key === "onlyInStock" ? "In Stock Only" : key === "onlySale" ? "On Sale" : "New Arrivals"}
            </Label>
          </div>
        ))}
      </div>

      <Separator />



      {/* Dynamic Specifications */}
      {filterAttributes && Object.entries(filterAttributes).map(([key, values]) => (
        values.length > 0 && (<Accordion type="single" key={key}>
          <AccordionItem value={key}>
            <AccordionTrigger className="capitalize">{key}</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2">
                {values.map(value => {
                  const id = `${key}-${value.toLowerCase().replace(/\s+/g, "-")}`;
                  const checked = (filters[key] || []).includes(value);
                  return (
                    <div key={value} className="flex items-center space-x-2">
                      <Checkbox id={id} checked={checked} onCheckedChange={() => toggleArrayFilter(key, value)} />
                      <Label htmlFor={id}>{value}</Label>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        )))}
    </div>
  );
}
