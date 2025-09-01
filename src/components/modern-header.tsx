'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Crown } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslations, useLocale } from 'next-intl'


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
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <Link href="/" className="flex flex-col">
                <span className="font-bold text-lg leading-none">Middle-earth</span>
                <span className="text-xs text-muted-foreground leading-none">Database</span>
              </Link>
            </div>
            <div className="sm:hidden">
              <Link href="/" className="font-bold text-lg">
                Middle-earth
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-2">
            <nav className="flex items-center space-x-1">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  asChild
                  variant={pathname === item.href ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "hidden md:flex",
                    pathname === item.href && "bg-primary text-primary-foreground"
                  )}
                >
                  <Link href={item.href}>
                    {item.name}
                  </Link>
                </Button>
              ))}
              
              {/* Mobile Navigation */}
              <div className="md:hidden">
                <select 
                  value={pathname} 
                  onChange={(e) => window.location.href = e.target.value}
                  className="bg-transparent border border-input rounded-md px-3 py-1 text-sm"
                >
                  {navigation.map((item) => (
                    <option key={item.name} value={item.href}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </nav>
            
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Theme Switcher */}
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}