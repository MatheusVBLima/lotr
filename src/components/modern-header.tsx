'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Crown, Menu } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslations, useLocale } from 'next-intl'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export function ModernHeader() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('navigation')
  
  console.log(`🔗 [HEADER] Current pathname: ${pathname}, locale: ${locale}`)

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('books'), href: '/books' },
    { name: t('movies'), href: '/movies' },
    { name: t('characters'), href: '/characters' },
    { name: t('quotes'), href: '/quotes' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg shadow-md ring-1 ring-primary/20">
              <Crown className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <Link href="/" className="flex flex-col">
                <span className="font-serif font-bold text-lg leading-none tracking-wide">Middle-earth</span>
                <span className="text-xs text-muted-foreground leading-none font-sans uppercase tracking-wider mt-0.5">Database</span>
              </Link>
            </div>
            <div className="sm:hidden">
              <Link href="/" className="font-serif font-bold text-lg tracking-wide">
                Middle-earth
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Button
                key={item.href}
                asChild
                variant={pathname === item.href ? "default" : "ghost"}
                size="sm"
                className={cn(
                  pathname === item.href && "bg-primary text-primary-foreground"
                )}
              >
                <Link href={item.href}>
                  {item.name}
                </Link>
              </Button>
            ))}
          </nav>

          {/* Right Actions: Lang, Theme, Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Theme Switcher */}
            <ThemeSwitcher />
            
            {/* Mobile Navigation (Only visible on small screens) */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-sm border-border/50">
                  {navigation.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link 
                        href={item.href}
                        className={cn(
                          "w-full cursor-pointer",
                          pathname === item.href && "bg-primary/10 text-primary font-medium"
                        )}
                      >
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}