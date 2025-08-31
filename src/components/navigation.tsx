'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Books", href: "/books" },
  { name: "Movies", href: "/movies" },
  { name: "Characters", href: "/characters" },
  { name: "Quotes", href: "/quotes" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <NavigationMenu className="mx-auto">
      <NavigationMenuList>
        {navigation.map((item) => (
          <NavigationMenuItem key={item.name}>
            <NavigationMenuLink asChild>
              <Link
                href={item.href}
                className={cn(
                  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                  pathname === item.href && "bg-accent text-accent-foreground"
                )}
              >
                {item.name}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}