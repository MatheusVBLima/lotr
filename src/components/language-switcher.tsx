'use client'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLocale } from 'next-intl'
import { cn } from "@/lib/utils"
import { Globe, ChevronDown } from "lucide-react"

const locales = [
  { code: 'en', name: 'English', label: 'EN' },
  { code: 'pt', name: 'Português', label: 'PT' }
] as const

export function LanguageSwitcher() {
  const locale = useLocale()

  const handleLocaleChange = (newLocale: string) => {
    console.log(`🌐 [LANGUAGE SWITCHER] Changing locale from ${locale} to ${newLocale}`)
    
    // Set the locale cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000` // 1 year
    
    // Reload the page to ensure the cookie is sent with the request
    // Using window.location.reload() instead of router.refresh() to avoid race conditions
    // where the cookie might not be transmitted before the server processes the request
    window.location.reload()
  }

  const currentLocale = locales.find(l => l.code === locale) || locales[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 gap-2 px-3 border-primary/20 bg-background/50 hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-all shadow-sm group"
        >
          <Globe className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
          <div className="h-4 w-px bg-border mx-1" />
          <span className="font-medium text-sm min-w-[2ch]">{currentLocale.label}</span>
          <ChevronDown className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-sm border-primary/20 min-w-[140px] animate-in fade-in-0 zoom-in-95">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc.code}
            onClick={() => handleLocaleChange(loc.code)}
            className={cn(
              "gap-3 cursor-pointer py-2.5 focus:bg-primary/10 focus:text-primary transition-colors",
              locale === loc.code && "bg-primary/5 text-primary font-medium"
            )}
          >
            <span className="uppercase text-xs font-bold text-muted-foreground w-6 text-center border border-border rounded px-1 py-0.5 bg-muted/50">
              {loc.label}
            </span>
            <span>{loc.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}