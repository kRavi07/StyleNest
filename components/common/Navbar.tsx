"use client";

import { useState, useEffect, memo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, Moon, Sun, UserIcon, LogOut, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/store/auth";
import CartCountIcon from "./cart-count-icon";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Icons } from "../admin/icons";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();


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
    { label: "Men", href: "/products?for=men" },
    { label: "Women", href: "/products?for=women" }
  ];

  const logOut = async () => {

    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    router.push("/auth/login");
  };

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
          <div className="flex items-center space-x-2">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={120} // base width
              height={80} // base height
              className="object-contain w-full h-auto"
              priority // ensures logo loads fast
            />

          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href as any}
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <UserIcon className="h-5 w-5 text-white" />

                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user && user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user && user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link href="/account">

                      <DropdownMenuItem className="cursor-pointer">
                        <Icons.user className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={logOut}>
                    <Icons.logout className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4">
                    <Link href="/" className="text-xl font-bold tracking-tighter">
                      <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={120}
                        height={80}
                        className="object-contain w-full h-auto"
                        priority
                      />
                    </Link>
                  </div>
                  <nav className="flex flex-col space-y-6 py-6">
                    {mainNav.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href as any}
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
                    {isAuthenticated && user != null ? (
                      <NavUser user={user} />
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



export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
  }
}) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className=" flex flex-row gap-2 items-center w-full cursor-pointer"
        >
          <UserIcon className="w-5 h-5 dark:text-white" />

          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 rounded-lg"
        side={"bottom"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <Link href="/account"><DropdownMenuItem>
            <UserIcon />
            Account
          </DropdownMenuItem>
          </Link>

        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}


export default memo(Navbar);