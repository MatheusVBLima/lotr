import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'pt'],
  
  // Used when no locale matches
  defaultLocale: 'en',
  
  // Disable automatic locale detection - always use defaultLocale
  localeDetection: false,
  
  // Never use locale prefix in URLs
  localePrefix: 'never'
})

console.log('🌐 [ROUTING CONFIG] Loaded with locales:', routing.locales, 'default:', routing.defaultLocale)