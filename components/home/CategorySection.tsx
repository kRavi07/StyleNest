import Link from "next/link";
import { cn } from "@/lib/utils";

const categories = [
  {
    id: "men",
    name: "Men",
    description: "Elevated essentials for the modern man",
    image: "https://images.pexels.com/photos/3206079/pexels-photo-3206079.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/products?category=men"
  },
  {
    id: "women",
    name: "Women",
    description: "Contemporary styles with timeless appeal",
    image: "https://images.pexels.com/photos/7691466/pexels-photo-7691466.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/products?category=women"
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Complete your look with our premium accessories",
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/products?category=accessories"
  }
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collections designed for every occasion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id}
              href={category.href}
              className="group relative rounded-lg overflow-hidden bg-black transition-transform hover:scale-[1.02] duration-300"
            >
              <div className="aspect-[3/4] w-full overflow-hidden">
                <div 
                  className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110 group-hover:opacity-80"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="font-semibold text-2xl">{category.name}</h3>
                <p className="mt-2 text-sm text-white/90">{category.description}</p>
                <span className="mt-4 inline-flex items-center text-sm font-medium">
                  Shop Now
                  <svg
                    className={cn(
                      "ml-1 h-4 w-4 transition-transform duration-300",
                      "group-hover:translate-x-1"
                    )}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;