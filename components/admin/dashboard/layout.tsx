"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Icons } from "../icons"
import { ModeToggle } from "../mode-toggle"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const mainNav = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <Icons.dashboard className="mr-2 h-4 w-4" />,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: <Icons.product className="mr-2 h-4 w-4" />,
    },
    {
      title: "Category",
      href: "/admin/category",
      icon: <Icons.category className="mr-2 h-4 w-4" />,
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: <Icons.orders className="mr-2 h-4 w-4" />,
    },
    {
      title: "Customers",
      href: "/admin/customers",
      icon: <Icons.users className="mr-2 h-4 w-4" />,
    },
    {
      title: "Reviews",
      href: "/admin/reviews",
      icon: <Icons.star className="mr-2 h-4 w-4" />,
    },
  ]

  const secondaryNav = [
    {
      title: "Content",
      href: "/admin/content",
      icon: <Icons.fileText className="mr-2 h-4 w-4" />,
    },
    {
      title: "Marketing",
      href: "/admin/marketing",
      icon: <Icons.marketing className="mr-2 h-4 w-4" />,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: <Icons.chart className="mr-2 h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Icons.settings className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Icons.menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px] pr-0">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Icons.store className="h-6 w-6" />
                  <span className="font-bold">Commerce Hub</span>
                </Link>
                <nav className="flex flex-col gap-2 mt-8">
                  {mainNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1 text-lg font-medium rounded-md hover:bg-accent",
                        pathname === item.href && "bg-accent"
                      )}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  ))}
                  <Separator className="my-2" />
                  {secondaryNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1 text-lg font-medium rounded-md hover:bg-accent",
                        pathname === item.href && "bg-accent"
                      )}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Link
              href="/"
              className="hidden md:flex items-center gap-2 font-bold"
            >
              <Icons.store className="h-6 w-6" />
              <span>Commerce Hub</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin User</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      admin@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Icons.user className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icons.settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/login" className="flex items-center w-full">
                    <Icons.logout className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <div className="flex-1 flex">
        <aside className="hidden w-[240px] flex-col border-r md:flex">
          <nav className="grid items-start gap-2 p-4">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent",
                  pathname === item.href && "bg-accent"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
            <Separator className="my-2" />
            {secondaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent",
                  pathname === item.href && "bg-accent"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}