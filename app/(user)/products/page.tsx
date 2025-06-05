"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/shop/ProductGrid";
import ProductFilters from "@/components/shop/ProductFilters";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Product } from "@/types";

// Mock product data - would come from API in real app
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Classic Oxford Shirt",
    description: "Timeless oxford shirt crafted from premium cotton",
    price: 89.99,
    category: "men",
    subcategory: "shirts",
    images: ["https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600"],
    inventory: 25,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Blue", "Gray"],
    featured: true,
    rating: 4.8,
    reviews: 124,
    isNewProduct: false,
    isSale: false
  },
  {
    id: "2",
    name: "Slim Fit Chinos",
    description: "Modern slim fit chinos perfect for any occasion",
    price: 69.99,
    category: "men",
    subcategory: "pants",
    images: ["https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=600"],
    inventory: 18,
    sizes: ["30", "32", "34", "36"],
    colors: ["Khaki", "Navy", "Olive"],
    featured: true,
    rating: 4.6,
    reviews: 98,
    isNewProduct: true,
    isSale: false
  },
  {
    id: "3",
    name: "Relaxed Linen Dress",
    description: "Elegant and comfortable linen dress for summer days",
    price: 129.99,
    originalPrice: 159.99,
    category: "women",
    subcategory: "dresses",
    images: ["https://images.pexels.com/photos/6192372/pexels-photo-6192372.jpeg?auto=compress&cs=tinysrgb&w=600"],
    inventory: 12,
    sizes: ["XS", "S", "M", "L"],
    colors: ["White", "Beige", "Light Blue"],
    featured: true,
    rating: 4.9,
    reviews: 87,
    isNewProduct: false,
    isSale: true
  },
  {
    id: "4",
    name: "Structured Blazer",
    description: "Tailored blazer with modern silhouette",
    price: 199.99,
    category: "women",
    subcategory: "jackets",
    images: ["https://images.pexels.com/photos/8386654/pexels-photo-8386654.jpeg?auto=compress&cs=tinysrgb&w=600"],
    inventory: 8,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Navy", "Gray"],
    featured: true,
    rating: 4.7,
    reviews: 56,
    isNewProduct: true,
    isSale: false
  },
  {
    id: "5",
    name: "Leather Crossbody Bag",
    description: "Handcrafted leather crossbody bag with adjustable strap",
    price: 149.99,
    category: "accessories",
    subcategory: "bags",
    images: ["https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600"],
    inventory: 15,
    sizes: [],
    colors: ["Black", "Brown", "Tan"],
    featured: true,
    rating: 4.8,
    reviews: 112,
    isNewProduct: false,
    isSale: false
  },
  {
    id: "6",
    name: "Knit Beanie",
    description: "Cozy knit beanie made from sustainable materials",
    price: 34.99,
    originalPrice: 45.99,
    category: "accessories",
    subcategory: "hats",
    images: ["https://images.pexels.com/photos/2457278/pexels-photo-2457278.jpeg?auto=compress&cs=tinysrgb&w=600"],
    inventory: 30,
    sizes: ["One Size"],
    colors: ["Black", "Gray", "Navy", "Burgundy"],
    featured: true,
    rating: 4.5,
    reviews: 78,
    isNewProduct: false,
    isSale: true
  },
  {
    id: "7",
    name: "Premium Denim Jeans",
    description: "Classic denim jeans with perfect fit and comfort",
    price: 129.99,
    category: "men",
    subcategory: "jeans",
    images: ["https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=600"],
    inventory: 22,
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Dark Blue", "Light Wash", "Black"],
    featured: false,
    rating: 4.7,
    reviews: 156,
    isNewProduct: false,
    isSale: false
  },
  {
    id: "8",
    name: "Cotton T-Shirt",
    description: "Essential cotton t-shirt for everyday wear",
    price: 29.99,
    category: "men",
    subcategory: "t-shirts",
    images: ["https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600"],
    inventory: 50,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Gray", "Navy", "Green"],
    featured: false,
    rating: 4.5,
    reviews: 210,
    isNewProduct: false,
    isSale: false
  },
  {
    id: "9",
    name: "Floral Summer Dress",
    description: "Light and breezy floral dress perfect for summer",
    price: 79.99,
    category: "women",
    subcategory: "dresses",
    images: ["https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg?auto=compress&cs=tinysrgb&w=600"],
    inventory: 15,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Floral Print", "Blue Print"],
    featured: false,
    rating: 4.6,
    reviews: 67,
    isNewProduct: true,
    isSale: false
  },
  {
    id: "10",
    name: "High-Waisted Trousers",
    description: "Elegant high-waisted trousers for a sophisticated look",
    price: 89.99,
    category: "women",
    subcategory: "pants",
    images: ["https://images.pexels.com/photos/6346643/pexels-photo-6346643.jpeg?auto=compress&cs=tinysrgb&w=600"],
    inventory: 18,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Camel", "Navy"],
    featured: false,
    rating: 4.7,
    reviews: 42,
    isNewProduct: false,
    isSale: false
  },
  {
    id: "11",
    name: "Leather Wallet",
    description: "Genuine leather wallet with multiple card slots",
    price: 59.99,
    category: "accessories",
    subcategory: "wallets",
    images: ["https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600"],
    inventory: 25,
    sizes: [],
    colors: ["Black", "Brown"],
    featured: false,
    rating: 4.8,
    reviews: 93,
    isNewProduct: false,
    isSale: false
  },
  {
    id: "12",
    name: "Aviator Sunglasses",
    description: "Classic aviator sunglasses with UV protection",
    price: 129.99,
    originalPrice: 149.99,
    category: "accessories",
    subcategory: "sunglasses",
    images: ["https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=600"],
    inventory: 20,
    sizes: [],
    colors: ["Gold/Green", "Silver/Blue", "Black/Gray"],
    featured: false,
    rating: 4.9,
    reviews: 138,
    isNewProduct: false,
    isSale: true
  }
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [filters, setFilters] = useState({
    category: categoryParam || 'all',
    priceRange: [0, 500],
    sortBy: 'featured',
    onlyInStock: false,
    onlySale: false,
    onlyNew: false,
    colors: [] as string[],
    sizes: [] as string[]
  });

  // Apply filters when they change
  useEffect(() => {
    let result = [...mockProducts];

    // Filter by category
    if (filters.category !== 'all') {
      result = result.filter(product => product.category === filters.category);
    }

    // Filter by price range
    result = result.filter(
      product => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Filter by availability
    if (filters.onlyInStock) {
      result = result.filter(product => product.inventory > 0);
    }

    // Filter by sale items
    if (filters.onlySale) {
      result = result.filter(product => product.isSale);
    }

    // Filter by new items
    if (filters.onlyNew) {
      result = result.filter(product => product.isNewProduct);
    }

    // Filter by colors
    if (filters.colors.length > 0) {
      result = result.filter(product =>
        product.colors.some(color => filters.colors.includes(color))
      );
    }

    // Filter by sizes
    if (filters.sizes.length > 0) {
      result = result.filter(product =>
        product.sizes.some(size => filters.sizes.includes(size))
      );
    }

    // Sort products
    switch (filters.sortBy) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (a.isNewProduct ? -1 : 1) - (b.isNewProduct ? -1 : 1));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (a.featured ? -1 : 1) - (b.featured ? -1 : 1));
        break;
    }

    setFilteredProducts(result);
  }, [filters]);

  // Update category filter when URL param changes
  useEffect(() => {
    if (categoryParam) {
      setFilters(prev => ({ ...prev, category: categoryParam }));
    }
  }, [categoryParam]);

  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 500],
      sortBy: 'featured',
      onlyInStock: false,
      onlySale: false,
      onlyNew: false,
      colors: [],
      sizes: []
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.category !== 'all' ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 500 ||
      filters.onlyInStock ||
      filters.onlySale ||
      filters.onlyNew ||
      filters.colors.length > 0 ||
      filters.sizes.length > 0
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="text-muted-foreground mt-2">
            Browse our collection of premium clothing and accessories
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {hasActiveFilters() && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="mr-2"
              >
                Clear Filters
                <X className="ml-1 h-4 w-4" />
              </Button>
            )}
            <p className="text-muted-foreground text-sm">
              Showing {filteredProducts.length} products
            </p>
          </div>

          {/* Mobile filter button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <ProductFilters
                filters={filters}
                onChange={handleFilterChange}
                onClear={clearFilters}
              />
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop filters */}
          <div className="hidden lg:block">
            <ProductFilters
              filters={filters}
              onChange={handleFilterChange}
              onClear={clearFilters}
            />
          </div>

          {/* Product grid */}
          <div className="lg:col-span-3">
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}