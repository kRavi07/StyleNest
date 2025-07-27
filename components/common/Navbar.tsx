"use client";

import { useState, useEffect, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, User, Search, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/store/auth";
import { useCart } from "@/hooks/context/cart/cart-context";
import CartCountIcon from "./cart-count-icon";

const Navbar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();

  console.log(user, isAuthenticated);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);


  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainNav = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/products" },
    { label: "Men", href: "/products?category=men" },
    { label: "Women", href: "/products?category=women" },
    { label: "Accessories", href: "/products?category=accessories" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-sm border-b shadow-sm"
          : "bg-background"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold tracking-tighter">
              ATTIRE
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Side Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {isMounted && theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <CartCountIcon />
            {isAuthenticated ? (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/account">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center space-x-4">
            <CartCountIcon />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4">
                    <Link href="/" className="text-xl font-bold tracking-tighter">
                      ATTIRE
                    </Link>
                  </div>
                  <nav className="flex flex-col space-y-6 py-6">
                    {mainNav.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "text-base font-medium transition-colors hover:text-primary",
                          pathname === item.href
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto space-y-4">
                    <div className="flex items-center space-x-2">
                      <Input placeholder="Search..." className="flex-1" />
                      <Button size="icon" variant="ghost">
                        <Search className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        className="flex-1"
                        variant="ghost"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      >
                        {isMounted && theme === "dark" ? (
                          <Sun className="h-5 w-5 mr-2" />
                        ) : (
                          <Moon className="h-5 w-5 mr-2" />
                        )}
                        {isMounted && theme === "dark" ? "Light Mode" : "Dark Mode"}
                      </Button>
                    </div>
                    {isAuthenticated ? (
                      <Button className="w-full" asChild>
                        <Link href="/account">My Account</Link>
                      </Button>
                    ) : (
                      <Button className="w-full" asChild>
                        <Link href="/auth/login">Sign In</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Navbar);